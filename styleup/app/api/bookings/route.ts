import { NextRequest, NextResponse } from "next/server";
import { serverClient, userScopedClient } from "@/lib/supabase";

async function getAuthUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const client = userScopedClient(token);
  const { data: { user }, error } = await client.auth.getUser();
  return error ? null : user;
}

// GET /api/bookings
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await serverClient()
    .from("bookings")
    .select("*, stylists(name, flag, city)")
    .eq("client_id", user.id)
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/bookings
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { stylistId, serviceName, sessionType, date, time, price, currency, notes } = body;

  if (!stylistId || !serviceName || !date || !time || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const platformFee = Math.round(price * 0.05);
  const id = `b_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const { data, error } = await serverClient()
    .from("bookings")
    .insert({
      id,
      client_id: user.id,
      stylist_id: stylistId,
      service_name: serviceName,
      session_type: sessionType,
      date,
      time,
      price,
      platform_fee: platformFee,
      currency: currency ?? "GBP",
      notes: notes ?? null,
      status: "pending_payment",
      payment_status: "unpaid",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
