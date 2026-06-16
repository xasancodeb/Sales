"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Booking, cancelBooking, formatDate, getBookings } from "@/lib/booking";
import { ColorSeason, PALETTES, loadProfile } from "@/lib/profile";
import { getStylist, SESSION_TYPES } from "@/lib/data";

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const ti = SESSION_TYPES.find((t) => t.value === booking.sessionType) ?? { icon: "✦", label: booking.sessionType };
  const stylist = getStylist(booking.stylistId);

  return (
    <div className="card p-5">
      {/* Stylist */}
      <div className="flex items-center gap-3 mb-4">
        {stylist && (
          <div
            className="rounded-xl h-11 w-11 flex items-center justify-center text-base font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${stylist.gradient[0]}, ${stylist.gradient[1]})` }}
          >
            {booking.stylistFlag}
          </div>
        )}
        <div>
          <p className="font-semibold text-sm">{booking.stylistFlag} {booking.stylistName}</p>
          <p className="text-xs" style={{ color: "var(--dim)" }}>{booking.serviceName}</p>
        </div>
        {booking.status === "upcoming" && (
          <span className="text-xs ml-auto px-2 py-0.5 rounded-full font-medium"
            style={{ background: "#E8F5E9", color: "#2D7A4F" }}>
            Upcoming
          </span>
        )}
        {booking.status === "completed" && (
          <span className="text-xs ml-auto px-2 py-0.5 rounded-full"
            style={{ background: "#F5F5F5", color: "#757575" }}>
            Completed
          </span>
        )}
        {booking.status === "cancelled" && (
          <span className="text-xs ml-auto px-2 py-0.5 rounded-full"
            style={{ background: "#FDEDEC", color: "#7B241C" }}>
            Cancelled
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-xs" style={{ color: "var(--dim)" }}>
        <div>
          <p className="font-semibold" style={{ color: "var(--faint)", marginBottom: 2 }}>DATE</p>
          <p>{formatDate(booking.date)}</p>
        </div>
        <div>
          <p className="font-semibold" style={{ color: "var(--faint)", marginBottom: 2 }}>TIME</p>
          <p>{booking.time}</p>
        </div>
        <div>
          <p className="font-semibold" style={{ color: "var(--faint)", marginBottom: 2 }}>FORMAT</p>
          <p>{ti.icon} {ti.label}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-sm font-bold">
          {booking.currency}{booking.price.toLocaleString()}
        </p>
        <div className="flex gap-3">
          {booking.status === "upcoming" && (
            confirming ? (
              <div className="flex gap-2">
                <button className="text-xs" style={{ color: "var(--faint)" }} onClick={() => setConfirming(false)}>
                  Keep it
                </button>
                <button
                  className="text-xs"
                  style={{ color: "#7B241C" }}
                  onClick={() => { cancelBooking(booking.id); onCancel(); }}
                >
                  Yes, cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="text-xs"
                style={{ color: "var(--faint)" }}
              >
                Cancel booking
              </button>
            )
          )}
          {booking.status === "completed" && (
            <Link
              href={`/stylist/${booking.stylistId}`}
              className="text-xs"
              style={{ color: "var(--accent)" }}
            >
              Book again →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [season, setSeason] = useState<ColorSeason | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = () => setBookings(getBookings());

  useEffect(() => {
    setMounted(true);
    reload();
    const p = loadProfile();
    if (p?.season) setSeason(p.season);
  }, []);

  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const totalSpend = [...upcoming, ...past].reduce((s, b) => s + b.price, 0);
  const uniqueStylists = new Set([...upcoming, ...past].map((b) => b.stylistId)).size;

  if (!mounted) return <main className="min-h-screen" />;

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 pb-20">
      {/* Header */}
      <header className="pt-10 pb-6 flex items-center justify-between">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <Link href="/explore" className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }}>
          Book a session
        </Link>
      </header>

      <h1 className="serif text-3xl font-bold mb-1">My dashboard</h1>
      <p className="text-sm mb-8" style={{ color: "var(--dim)" }}>Your style journey, tracked.</p>

      {/* Stats */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="card p-4 text-center">
            <p className="serif text-2xl font-bold" style={{ color: "var(--accent)" }}>
              {upcoming.length + past.length}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>sessions booked</p>
          </div>
          <div className="card p-4 text-center">
            <p className="serif text-2xl font-bold" style={{ color: "var(--accent)" }}>
              {uniqueStylists}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>stylists tried</p>
          </div>
          <div className="card p-4 text-center">
            <p className="serif text-2xl font-bold">{past.length}</p>
            <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>sessions completed</p>
          </div>
        </div>
      )}

      {/* Colour season */}
      {season && (
        <div className="card p-4 mb-8 flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--faint)" }}>YOUR COLOUR SEASON</p>
            <p className="font-bold">{PALETTES[season].name}</p>
            <p className="text-xs" style={{ color: "var(--dim)" }}>{PALETTES[season].tagline}</p>
          </div>
          <div className="flex gap-1.5 ml-auto flex-shrink-0">
            {PALETTES[season].colors.slice(0, 5).map((c) => (
              <div
                key={c.hex}
                className="rounded-full"
                style={{ width: 24, height: 24, background: c.hex, border: "1px solid rgba(0,0,0,0.08)" }}
              />
            ))}
          </div>
          <Link href="/fitting" className="text-xs flex-shrink-0" style={{ color: "var(--accent)" }}>
            Open fitting room →
          </Link>
        </div>
      )}

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="serif text-xl font-bold mb-4">
          Upcoming {upcoming.length > 0 && <span style={{ color: "var(--accent)" }}>({upcoming.length})</span>}
        </h2>
        {upcoming.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-sm mb-3" style={{ color: "var(--dim)" }}>No upcoming sessions yet.</p>
            <Link href="/explore" className="btn-accent" style={{ padding: "10px 20px", fontSize: 13 }}>
              Browse stylists →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={reload} />
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/fitting" className="card p-4 block hover:shadow-sm transition-shadow">
          <p className="text-xl mb-2">🎨</p>
          <p className="font-semibold text-sm">Colour fitting room</p>
          <p className="text-xs" style={{ color: "var(--dim)" }}>Try colours before you buy</p>
        </Link>
        <Link href="/quiz" className="card p-4 block hover:shadow-sm transition-shadow">
          <p className="text-xl mb-2">◈</p>
          <p className="font-semibold text-sm">Style quiz</p>
          <p className="text-xs" style={{ color: "var(--dim)" }}>Find your archetype</p>
        </Link>
      </div>

      {/* Past sessions */}
      {past.length > 0 && (
        <section className="mb-8">
          <h2 className="serif text-xl font-bold mb-4">Past sessions</h2>
          <div className="flex flex-col gap-3">
            {past.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={reload} />
            ))}
          </div>
        </section>
      )}

      {/* Cancelled */}
      {cancelled.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--faint)" }}>CANCELLED</h2>
          <div className="flex flex-col gap-3">
            {cancelled.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={reload} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {bookings.length === 0 && !season && (
        <div className="text-center py-10">
          <p className="serif text-xl font-bold mb-2">Welcome to StyleUp</p>
          <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
            Start by finding your style archetype or browsing our stylists.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/quiz" className="btn-primary">Take the style quiz</Link>
            <Link href="/explore" className="btn-secondary">Browse stylists</Link>
          </div>
        </div>
      )}
    </main>
  );
}
