"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: string;
  service_name: string;
  session_type: string;
  date: string;
  time: string;
  price: number;
  platform_fee: number;
  currency: string;
  status: string;
  stylists: { name: string; flag: string; city: string } | null;
}

function fmt(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function BookingSuccess() {
  const params = useSearchParams();
  const bookingId = params.get("booking_id");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`/api/bookings/${bookingId}`, {
        headers: { authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) setBooking(await res.json());
    };
    load();
  }, [bookingId]);

  const copyRef = () => {
    navigator.clipboard.writeText(bookingId ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="card p-8 text-center fade-up">
            <div className="text-5xl mb-5">🎉</div>
            <h1 className="serif text-2xl font-bold mb-2">You&apos;re booked!</h1>
            <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
              Your session is confirmed and paid. Your stylist will be in touch soon.
            </p>

            {booking && (
              <div className="text-left mb-6" style={{ background: "var(--accent-bg)", borderRadius: 16, padding: "20px" }}>
                <p className="font-semibold mb-3">
                  {booking.stylists?.flag} {booking.stylists?.name}
                </p>
                <div className="flex flex-col gap-1.5 text-sm" style={{ color: "var(--dim)" }}>
                  <p>📋 {booking.service_name}</p>
                  <p>📅 {new Date(booking.date + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {booking.time}</p>
                  <p>📍 {booking.stylists?.city}</p>
                </div>
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "var(--faint)" }}>
                    <span>Session fee</span><span>{fmt(booking.price)}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: "var(--faint)" }}>
                    <span>Platform fee</span><span>{fmt(booking.platform_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total paid</span><span style={{ color: "var(--accent)" }}>{fmt(booking.price + booking.platform_fee)}</span>
                  </div>
                </div>
              </div>
            )}

            <div
              className="flex items-center justify-between px-3 py-2 rounded-xl mb-6 text-xs font-mono"
              style={{ background: "var(--accent-bg)", cursor: "pointer" }}
              onClick={copyRef}
            >
              <span style={{ color: "var(--dim)" }}>Booking ref: {bookingId}</span>
              <span style={{ color: "var(--accent)" }}>{copied ? "Copied!" : "Copy"}</span>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/dashboard" className="btn-primary">
                View my bookings
              </Link>
              <Link href="/explore" className="btn-secondary">
                Browse more stylists
              </Link>
            </div>

            <p className="text-xs mt-5" style={{ color: "var(--faint)" }}>
              A confirmation email has been sent. Contact details are released 24hrs before your session.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
