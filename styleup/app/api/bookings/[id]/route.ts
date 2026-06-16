import { NextRequest, NextResponse } from "next/server";
import { serverClient, userScopedClient } from "@/lib/supabase";

async function getAuthUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user }, error } = await userScopedClient(token).auth.getUser();
  return error ? null : user;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await serverClient()
    .from("bookings")
    .select("*, stylists(name, flag, city, gradient)")
    .eq("id", id)
    .eq("client_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.status !== "cancelled") {
    return NextResponse.json({ error: "Only cancellation is supported" }, { status: 400 });
  }

  const admin = serverClient();
  const { data: booking } = await admin
    .from("bookings")
    .select("status")
    .eq("id", id)
    .eq("client_id", user.id)
    .single();

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.status === "cancelled") return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
  if (booking.status === "completed") return NextResponse.json({ error: "Cannot cancel completed session" }, { status: 400 });

  const { data, error } = await admin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
