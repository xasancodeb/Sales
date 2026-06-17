import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { serverClient, userScopedClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error: authErr } = await userScopedClient(token).auth.getUser();
  if (authErr || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId } = await req.json();
  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

  const admin = serverClient();
  const { data: booking, error: bookingErr } = await admin
    .from("bookings")
    .select("*, stylists(name, flag)")
    .eq("id", bookingId)
    .eq("client_id", user.id)
    .single();

  if (bookingErr || !booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.payment_status === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });

  const stripe = getStripe();
  const origin = req.headers.get("origin") ?? "http://localhost:3001";
  const stylist = booking.stylists as { name: string; flag: string };
  const dateLabel = new Date(booking.date + "T12:00:00").toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: booking.currency.toLowerCase(),
          unit_amount: booking.price,
          product_data: {
            name: `${booking.service_name} with ${stylist.flag} ${stylist.name}`,
            description: `${dateLabel} at ${booking.time}`,
          },
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: booking.currency.toLowerCase(),
          unit_amount: booking.platform_fee,
          product_data: {
            name: "StyleUp platform fee",
            description: "Payment protection, dispute handling & no-show cover",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id, clientId: user.id },
    success_url: `${origin}/booking/success?booking_id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/stylist/${booking.stylist_id}?booking_cancelled=1`,
  });

  await admin
    .from("bookings")
    .update({ stripe_session_id: session.id })
    .eq("id", booking.id);

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
