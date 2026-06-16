import { NextRequest, NextResponse } from "next/server";
import { serverClient, userScopedClient } from "@/lib/supabase";

async function requireAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const { data: { user }, error } = await userScopedClient(token).auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await serverClient()
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = serverClient();

  const [bookings, stylists, applications, paidBookings] = await Promise.all([
    admin.from("bookings").select("id, status, price, platform_fee, payment_status, created_at").order("created_at", { ascending: false }).limit(100),
    admin.from("stylists").select("id, name, status, sessions_completed, rating"),
    admin.from("stylist_applications").select("id, status, created_at").order("created_at", { ascending: false }),
    admin.from("bookings").select("price, platform_fee").eq("payment_status", "paid"),
  ]);

  const paid = paidBookings.data ?? [];
  const totalRevenue = paid.reduce((s: number, b: { platform_fee: number }) => s + b.platform_fee, 0);
  const totalGMV = paid.reduce((s: number, b: { price: number }) => s + b.price, 0);

  return NextResponse.json({
    totalRevenue,
    totalGMV,
    confirmedBookings: paid.length,
    pendingApplications: (applications.data ?? []).filter((a: { status: string }) => a.status === "pending").length,
    activeStylists: (stylists.data ?? []).filter((s: { status: string }) => s.status === "active").length,
    recentBookings: bookings.data ?? [],
    stylists: stylists.data ?? [],
    applications: applications.data ?? [],
  });
}
