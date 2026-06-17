import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { serverClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook signature missing" }, { status: 400 });
  }

  const body = await req.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = serverClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) return NextResponse.json({ received: true });

    const { error } = await admin
      .from("bookings")
      .update({
        status: "confirmed",
        payment_status: "paid",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("id", bookingId);

    if (error) {
      console.error("Webhook: DB update failed", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    // Increment stylist session count via RPC
    const { data: booking } = await admin
      .from("bookings")
      .select("stylist_id")
      .eq("id", bookingId)
      .single();

    if (booking?.stylist_id) {
      // This RPC function increments sessions_completed by 1
      await admin.rpc("increment_stylist_sessions", { p_stylist_id: booking.stylist_id });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    await admin
      .from("bookings")
      .update({ status: "cancelled", payment_status: "refunded" })
      .eq("stripe_payment_intent_id", charge.payment_intent as string);
  }

  return NextResponse.json({ received: true });
}
