"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Booking, cancelBooking, formatDate, getBookings } from "@/lib/booking";
import { ColorSeason, PALETTES, loadProfile } from "@/lib/profile";
import { ARCHETYPES, getStylist, SESSION_TYPES } from "@/lib/data";

// ── Milestones ─────────────────────────────────────────────────────────
const MILESTONES = [
  { count: 1,  label: "First session!",   desc: "You started your style journey" },
  { count: 3,  label: "Getting stylish",  desc: "Three sessions in — you mean business" },
  { count: 5,  label: "Style devotee",    desc: "Five sessions — style is your language" },
  { count: 10, label: "Style guru",       desc: "Ten sessions — you inspire others" },
];

// ── Season recommendations ──────────────────────────────────────────────
const SEASON_RECOMMENDS: Record<ColorSeason, { item: string; desc: string }[]> = {
  spring: [
    { item: "Coral wrap dress",     desc: "Flatters your warm, bright undertones" },
    { item: "Golden jewellery",     desc: "Amplifies your natural warmth" },
    { item: "Warm-toned blazer",    desc: "Peach or apricot keeps your glow" },
  ],
  summer: [
    { item: "Lavender midi skirt",  desc: "Cool hues that harmonise with your softness" },
    { item: "Silver accessories",   desc: "Cool metals suit your palette perfectly" },
    { item: "Dusty blue coat",      desc: "Muted tones elevate your delicate colouring" },
  ],
  autumn: [
    { item: "Rust-toned knitwear",  desc: "Earth tones that match your rich palette" },
    { item: "Camel trench coat",    desc: "A classic that sings in your warm range" },
    { item: "Olive tailored trousers", desc: "Muted greens that bring depth and warmth" },
  ],
  winter: [
    { item: "Navy power suit",      desc: "High contrast that matches your bold colouring" },
    { item: "Emerald statement piece", desc: "Jewel tones amplify your cool clarity" },
    { item: "Classic black coat",   desc: "The ultimate winter signature — pure and striking" },
  ],
};

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
  const [archetype, setArchetype] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const reload = () => setBookings(getBookings());

  useEffect(() => {
    setMounted(true);
    reload();
    const p = loadProfile();
    if (p?.season) setSeason(p.season);
    if (p?.archetype) setArchetype(p.archetype);
    // Also check standalone archetype key
    const rawArchetype = typeof window !== "undefined"
      ? localStorage.getItem("styleup_archetype")
      : null;
    if (rawArchetype && !p?.archetype) setArchetype(rawArchetype);
  }, []);

  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter((b) => b.status === "completed");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const totalSpend = [...upcoming, ...past].reduce((s, b) => s + b.price, 0);
  const uniqueStylists = new Set([...upcoming, ...past].map((b) => b.stylistId)).size;

  // Milestones
  const sessionCount = upcoming.length + past.length;
  const achievedMilestone = [...MILESTONES].reverse().find((m) => sessionCount >= m.count) ?? null;
  const nextMilestone = MILESTONES.find((m) => sessionCount < m.count) ?? null;
  const milestoneProgress = nextMilestone
    ? Math.round(((sessionCount - (achievedMilestone?.count ?? 0)) / (nextMilestone.count - (achievedMilestone?.count ?? 0))) * 100)
    : 100;

  // Archetype data
  const archetypeData = archetype
    ? ARCHETYPES.find((a) => a.id === archetype.toLowerCase() || a.name.toLowerCase() === archetype.toLowerCase())
    : null;

  // Share season text
  const handleShareSeason = () => {
    if (!season) return;
    const pal = PALETTES[season];
    const top3 = pal.colors.slice(0, 3).map((c) => c.name).join(", ");
    const text = `I just discovered I'm a ${pal.name} — ${pal.tagline}. My best colours are ${top3}. Found out on StyleUp's colour fitting room 🎨`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    });
  };

  // Referral
  const referralCode = "STYLE10";
  const referralLink = `https://styleup.app/invite?ref=${referralCode}`;
  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralLink).then(() => {
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2500);
    });
  };

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

      {/* Style profile — archetype + colour season combined */}
      {(archetypeData || season) && (
        <div className="card p-5 mb-6">
          <p className="text-xs font-semibold mb-4" style={{ color: "var(--faint)" }}>YOUR STYLE PROFILE</p>
          <div className="flex gap-4 items-start">
            {archetypeData && (
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: "var(--dim)" }}>Archetype</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{archetypeData.icon}</span>
                  <p className="font-bold text-base">{archetypeData.name}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--dim)" }}>{archetypeData.desc.slice(0, 80)}…</p>
              </div>
            )}
            {archetypeData && season && (
              <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)", flexShrink: 0 }} />
            )}
            {season && (
              <div className="flex-1">
                <p className="text-xs mb-1" style={{ color: "var(--dim)" }}>Colour season</p>
                <p className="font-bold text-base mb-0.5">{PALETTES[season].name}</p>
                <p className="text-xs mb-3" style={{ color: "var(--accent)" }}>{PALETTES[season].tagline}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {PALETTES[season].colors.slice(0, 5).map((c) => (
                    <div
                      key={c.hex}
                      className="rounded-full"
                      title={c.name}
                      style={{ width: 22, height: 22, background: c.hex, border: "1px solid rgba(0,0,0,0.08)" }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            {!archetypeData && (
              <Link href="/quiz" className="text-xs" style={{ color: "var(--accent)" }}>
                Take style quiz →
              </Link>
            )}
            <Link href="/fitting" className="text-xs" style={{ color: "var(--accent)" }}>
              Open fitting room →
            </Link>
          </div>
        </div>
      )}

      {/* Loyalty milestones — Your style journey */}
      <div className="card p-5 mb-6">
        <p className="text-xs font-semibold mb-4" style={{ color: "var(--faint)" }}>YOUR STYLE JOURNEY</p>
        <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
          {MILESTONES.map((m) => {
            const achieved = sessionCount >= m.count;
            return (
              <div
                key={m.count}
                className="flex-shrink-0 text-center px-3 py-2 rounded-xl"
                style={{
                  background: achieved ? "var(--accent-bg)" : "var(--surface)",
                  border: `1px solid ${achieved ? "var(--accent)" : "var(--border)"}`,
                  minWidth: 100,
                }}
              >
                <p className="text-lg mb-1">{achieved ? "✦" : "○"}</p>
                <p className="text-xs font-semibold" style={{ color: achieved ? "var(--accent)" : "var(--dim)" }}>
                  {m.count} {m.count === 1 ? "session" : "sessions"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: achieved ? "var(--accent)" : "var(--faint)" }}>
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>
        {nextMilestone ? (
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--dim)" }}>
              <span>{sessionCount} session{sessionCount !== 1 ? "s" : ""}</span>
              <span>Next: {nextMilestone.label} ({nextMilestone.count})</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${milestoneProgress}%`, background: "var(--accent)" }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--faint)" }}>
              {nextMilestone.count - sessionCount} more session{nextMilestone.count - sessionCount !== 1 ? "s" : ""} until &ldquo;{nextMilestone.label}&rdquo;
            </p>
          </div>
        ) : achievedMilestone ? (
          <div className="text-center py-2">
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              ✦ {achievedMilestone.label} — {achievedMilestone.desc}
            </p>
          </div>
        ) : (
          <p className="text-xs" style={{ color: "var(--dim)" }}>
            Book your first session to start your journey.
          </p>
        )}
      </div>

      {/* Stylist recommends — based on colour season */}
      {season && (
        <div className="card p-5 mb-6">
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--faint)" }}>YOUR STYLIST RECOMMENDS</p>
          <p className="text-sm mb-4" style={{ color: "var(--dim)" }}>
            Because you&apos;re a <strong>{PALETTES[season].name}</strong>, your stylist recommends:
          </p>
          <div className="flex flex-col gap-3">
            {SEASON_RECOMMENDS[season].map((rec) => (
              <div key={rec.item} className="flex items-start gap-3">
                <div
                  className="rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{
                    width: 36,
                    height: 36,
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                  }}
                >
                  ✦
                </div>
                <div>
                  <p className="text-sm font-semibold">{rec.item}</p>
                  <p className="text-xs" style={{ color: "var(--dim)" }}>{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <Link href="/explore" className="text-xs" style={{ color: "var(--accent)" }}>
              Find a stylist who knows your season →
            </Link>
          </div>
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

      {/* Share your colour season */}
      {season && (
        <div className="card p-5 mb-6">
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--faint)" }}>SHARE YOUR COLOUR SEASON</p>
          <p className="text-sm mb-3" style={{ color: "var(--dim)" }}>
            Let friends know you&apos;re a <strong>{PALETTES[season].name}</strong>.
          </p>
          <div
            className="rounded-xl p-4 mb-4 text-sm leading-relaxed"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--dim)" }}
          >
            I just discovered I&apos;m a {PALETTES[season].name} — {PALETTES[season].tagline}.
            My best colours are {PALETTES[season].colors.slice(0, 3).map((c) => c.name).join(", ")}.
            Found out on StyleUp&apos;s colour fitting room 🎨
          </div>
          <button
            onClick={handleShareSeason}
            className="text-sm font-semibold px-4 py-2 rounded-lg w-full transition-colors"
            style={{
              background: copiedShare ? "#E8F5E9" : "var(--accent-bg)",
              color: copiedShare ? "#2D7A4F" : "var(--accent)",
              border: "1px solid transparent",
            }}
          >
            {copiedShare ? "Copied to clipboard ✓" : "Copy share text"}
          </button>
        </div>
      )}

      {/* Refer a friend */}
      <div className="card p-5 mb-8">
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--faint)" }}>REFER A FRIEND</p>
        <p className="text-sm mb-3" style={{ color: "var(--dim)" }}>
          Share StyleUp with a friend and help them find their style.
        </p>
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3 mb-4"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <div>
            <p className="text-xs mb-0.5" style={{ color: "var(--faint)" }}>YOUR REFERRAL CODE</p>
            <p className="font-bold mono text-base">{referralCode}</p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--faint)" }}>REFERRAL LINK</p>
            <p className="text-xs" style={{ color: "var(--dim)" }}>{referralLink}</p>
          </div>
        </div>
        <button
          onClick={handleCopyReferral}
          className="text-sm font-semibold px-4 py-2 rounded-lg w-full transition-colors"
          style={{
            background: copiedReferral ? "#E8F5E9" : "var(--surface)",
            color: copiedReferral ? "#2D7A4F" : "var(--ink)",
            border: "1px solid var(--border)",
          }}
        >
          {copiedReferral ? "Link copied ✓" : "Copy referral link"}
        </button>
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
      {bookings.length === 0 && !season && !archetypeData && (
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
