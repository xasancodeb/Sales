"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Simulated stylist portal — in production this would be a real auth'd session
// The data here shows what a Gold-tier stylist sees on their dashboard

const SIMULATED_STYLIST = {
  name: "Amara Okonkwo",
  flag: "🇬🇧",
  city: "London",
  tier: "Gold",
  tierColor: "#C4923A",
  commission: 15,
  totalSessions: 214,
  sessionsToElite: 86, // 300 - 214
  rating: 4.97,
  reviews: 214,
  gradient: ["#1A1612", "#4A3728"] as [string, string],
};

const UPCOMING_BOOKINGS = [
  {
    id: "b1",
    client: "James W.",
    clientFlag: "🇺🇸",
    service: "Shop Together",
    date: "Tomorrow",
    time: "10:00",
    price: 380,
    currency: "£",
    notes: "Wants to rebuild workwear — just promoted to partner at a law firm. Size 38R suit. Prefers Reiss, Hugo Boss, COS.",
    contactReleased: false,
  },
  {
    id: "b2",
    client: "Priya T.",
    clientFlag: "🇮🇳",
    service: "Wardrobe Edit",
    date: "Thu 19 Jun",
    time: "14:00",
    price: 285,
    currency: "£",
    notes: "Transitioning from corporate law to startup — wants to keep looking polished but more creative.",
    contactReleased: true,
  },
  {
    id: "b3",
    client: "David K.",
    clientFlag: "🇳🇴",
    service: "Virtual Style Consult",
    date: "Fri 20 Jun",
    time: "11:30",
    price: 95,
    currency: "£",
    notes: "Moving to London from Oslo. Wants to understand how to dress for the British climate and culture.",
    contactReleased: true,
  },
];

const RECENT_SESSIONS = [
  { client: "Céline M. 🇫🇷", service: "Virtual Style Consult", date: "12 Jun", earned: 80.75, rating: 5 },
  { client: "Tom F. 🇬🇧", service: "Shop Together", earned: 323, date: "10 Jun", rating: 5 },
  { client: "Sarah K. 🇬🇧", service: "Wardrobe Edit", earned: 242.25, date: "5 Jun", rating: 5 },
  { client: "Ravi P. 🇮🇳", service: "Online Capsule Build", earned: 102, date: "2 Jun", rating: 4 },
];

const MONTHLY_EARNINGS = [
  { month: "Jan", net: 3240 },
  { month: "Feb", net: 3890 },
  { month: "Mar", net: 4100 },
  { month: "Apr", net: 3750 },
  { month: "May", net: 4620 },
  { month: "Jun", net: 2180 }, // partial month
];

const AVAILABILITY = [
  { day: "Mon", slots: ["09:00", "11:00", "14:00"] },
  { day: "Tue", slots: ["10:00", "15:00"] },
  { day: "Wed", slots: [] },
  { day: "Thu", slots: ["09:00", "13:00", "16:00"] },
  { day: "Fri", slots: ["10:00", "14:00"] },
  { day: "Sat", slots: ["11:00"] },
];

type Tab = "overview" | "bookings" | "earnings" | "availability" | "settings";

export default function StylistPortal() {
  const [tab, setTab] = useState<Tab>("overview");
  const [mounted, setMounted] = useState(false);
  const [contactReleased, setContactReleased] = useState<Record<string, boolean>>(
    Object.fromEntries(UPCOMING_BOOKINGS.map((b) => [b.id, b.contactReleased])),
  );

  useEffect(() => { setMounted(true); }, []);

  const thisMonthGross = UPCOMING_BOOKINGS.reduce((s, b) => s + b.price, 0) +
    RECENT_SESSIONS.slice(0, 3).reduce((s, r) => s + r.earned / (1 - SIMULATED_STYLIST.commission / 100), 0);
  const thisMonthNet = UPCOMING_BOOKINGS.reduce((s, b) => s + b.price * (1 - SIMULATED_STYLIST.commission / 100), 0) +
    RECENT_SESSIONS.slice(0, 3).reduce((s, r) => s + r.earned, 0);

  if (!mounted) return <main className="min-h-screen" />;

  const maxEarning = Math.max(...MONTHLY_EARNINGS.map((m) => m.net));

  return (
    <main className="min-h-screen">
      {/* Sidebar layout */}
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="flex flex-col px-4 py-6" style={{ width: 220, background: "var(--dark)", color: "#fff", flexShrink: 0, minHeight: "100vh" }}>
          <Link href="/" className="serif font-bold text-lg tracking-tight mb-8 block" style={{ color: "#fff" }}>
            StyleUp
          </Link>

          {/* Stylist identity */}
          <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div
              className="rounded-xl h-10 w-10 flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${SIMULATED_STYLIST.gradient[0]}, ${SIMULATED_STYLIST.gradient[1]})` }}
            >
              {SIMULATED_STYLIST.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{SIMULATED_STYLIST.flag} {SIMULATED_STYLIST.name}</p>
              <p className="text-xs" style={{ color: SIMULATED_STYLIST.tierColor }}>
                {SIMULATED_STYLIST.tier} · {SIMULATED_STYLIST.commission}% commission
              </p>
            </div>
          </div>

          {/* Nav */}
          {(["overview", "bookings", "earnings", "availability", "settings"] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = {
              overview: "Overview",
              bookings: "Bookings",
              earnings: "Earnings",
              availability: "Availability",
              settings: "Profile settings",
            };
            const icons: Record<Tab, string> = {
              overview: "◈",
              bookings: "📅",
              earnings: "£",
              availability: "🗓",
              settings: "⚙",
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left mb-1 transition-all"
                style={{
                  background: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
                  color: tab === t ? "#fff" : "rgba(255,255,255,0.55)",
                  fontWeight: tab === t ? 600 : 400,
                }}
              >
                <span>{icons[t]}</span> {labels[t]}
              </button>
            );
          })}

          <div className="mt-auto pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <Link
              href="/for-stylists"
              className="text-xs block mb-2"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Stylist programme →
            </Link>
            <Link
              href="/"
              className="text-xs block"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Client view →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 px-8 py-6 overflow-auto">

          {/* ── Overview ── */}
          {tab === "overview" && (
            <div className="fade-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="serif text-2xl font-bold">Good morning, {SIMULATED_STYLIST.name.split(" ")[0]}</h1>
                  <p className="text-sm" style={{ color: "var(--dim)" }}>
                    You have {UPCOMING_BOOKINGS.length} upcoming sessions this week
                  </p>
                </div>
                <div
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: SIMULATED_STYLIST.tierColor + "20", color: SIMULATED_STYLIST.tierColor }}
                >
                  {SIMULATED_STYLIST.tier} Stylist · {SIMULATED_STYLIST.sessionsToElite} sessions to Elite
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[
                  { label: "This month (net)", value: `£${Math.round(thisMonthNet).toLocaleString()}`, sub: `${SIMULATED_STYLIST.commission}% commission deducted` },
                  { label: "Sessions this month", value: UPCOMING_BOOKINGS.length + RECENT_SESSIONS.length, sub: "3 upcoming · 4 completed" },
                  { label: "Rating", value: `${SIMULATED_STYLIST.rating}★`, sub: `${SIMULATED_STYLIST.reviews} verified reviews` },
                  { label: "Sessions to Elite", value: SIMULATED_STYLIST.sessionsToElite, sub: "Unlocks 12% commission" },
                ].map((k) => (
                  <div key={k.label} className="card p-4">
                    <p className="text-xs mb-1" style={{ color: "var(--faint)" }}>{k.label}</p>
                    <p className="serif text-2xl font-bold" style={{ color: "var(--accent)" }}>{k.value}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>{k.sub}</p>
                  </div>
                ))}
              </div>

              {/* Tier progress */}
              <div className="card p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm">Progress to Elite</p>
                  <p className="text-xs" style={{ color: "var(--faint)" }}>
                    {SIMULATED_STYLIST.totalSessions} / 300 sessions
                  </p>
                </div>
                <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(SIMULATED_STYLIST.totalSessions / 300) * 100}%`,
                      background: SIMULATED_STYLIST.tierColor,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--faint)" }}>
                  <span>Gold (15%)</span>
                  <span style={{ color: "#1A1612", fontWeight: 600 }}>Elite: 12% commission · {SIMULATED_STYLIST.sessionsToElite} sessions away</span>
                </div>
              </div>

              {/* Next session */}
              <div className="card p-5 mb-6">
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>NEXT SESSION</p>
                {(() => {
                  const next = UPCOMING_BOOKINGS[0];
                  return (
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{next.clientFlag} {next.client}</p>
                          <p className="text-sm" style={{ color: "var(--dim)" }}>{next.service} · {next.date} at {next.time}</p>
                        </div>
                        <p className="font-bold" style={{ color: "var(--accent)" }}>{next.currency}{next.price}</p>
                      </div>
                      {next.notes && (
                        <div className="p-3 rounded-xl text-sm" style={{ background: "var(--accent-bg)", color: "var(--dim)" }}>
                          <span className="font-semibold text-xs" style={{ color: "var(--faint)" }}>CLIENT NOTES: </span>
                          {next.notes}
                        </div>
                      )}
                      <div className="flex gap-3 mt-3">
                        {contactReleased[next.id] ? (
                          <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "#E8F5E9", color: "#2D7A4F" }}>
                            ✓ Contact details released
                          </div>
                        ) : (
                          <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "#FFF3E0", color: "#E65100" }}>
                            Contact released 24hrs before session (tomorrow morning)
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Recent earnings */}
              <div className="card p-5">
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>RECENT SESSIONS</p>
                {RECENT_SESSIONS.map((s) => (
                  <div key={s.client} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p className="text-sm font-semibold">{s.client}</p>
                      <p className="text-xs" style={{ color: "var(--faint)" }}>{s.service} · {s.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">+£{s.earned.toFixed(0)}</p>
                      <p className="text-xs star">{"★".repeat(s.rating)}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setTab("earnings")} className="text-xs mt-3" style={{ color: "var(--accent)" }}>
                  View full earnings →
                </button>
              </div>
            </div>
          )}

          {/* ── Bookings ── */}
          {tab === "bookings" && (
            <div className="fade-up">
              <h1 className="serif text-2xl font-bold mb-6">Your bookings</h1>
              <div className="flex flex-col gap-4">
                {UPCOMING_BOOKINGS.map((b) => (
                  <div key={b.id} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{b.clientFlag} {b.client}</p>
                        <p className="text-sm" style={{ color: "var(--dim)" }}>{b.service} · {b.date} at {b.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{b.currency}{b.price}</p>
                        <p className="text-xs" style={{ color: "var(--dim)" }}>
                          You keep: {b.currency}{(b.price * (1 - SIMULATED_STYLIST.commission / 100)).toFixed(0)}
                        </p>
                      </div>
                    </div>
                    {b.notes && (
                      <div className="p-3 rounded-xl text-sm mb-3" style={{ background: "var(--accent-bg)", color: "var(--dim)", lineHeight: 1.5 }}>
                        <span className="font-semibold text-xs block mb-1" style={{ color: "var(--faint)" }}>CLIENT NOTES</span>
                        {b.notes}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      {contactReleased[b.id] ? (
                        <div className="text-xs px-3 py-1.5 rounded-lg font-medium"
                          style={{ background: "#E8F5E9", color: "#2D7A4F" }}>
                          ✓ Contact details available
                        </div>
                      ) : (
                        <div className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: "#FFF3E0", color: "#E65100" }}>
                          Contact released 24hrs before — {b.date}
                        </div>
                      )}
                      <button
                        onClick={() => setContactReleased((prev) => ({ ...prev, [b.id]: true }))}
                        className="text-xs"
                        style={{ color: "var(--faint)" }}
                      >
                        Message via StyleUp →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Earnings ── */}
          {tab === "earnings" && (
            <div className="fade-up">
              <div className="flex items-center justify-between mb-6">
                <h1 className="serif text-2xl font-bold">Earnings</h1>
                <div className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--accent-bg)", color: "var(--accent)", fontWeight: 600 }}>
                  {SIMULATED_STYLIST.commission}% commission · {SIMULATED_STYLIST.tier} tier
                </div>
              </div>

              {/* Mini bar chart */}
              <div className="card p-5 mb-6">
                <p className="text-xs font-semibold mb-4" style={{ color: "var(--faint)" }}>NET EARNINGS — LAST 6 MONTHS</p>
                <div className="flex items-end gap-3" style={{ height: 120 }}>
                  {MONTHLY_EARNINGS.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>£{(m.net / 1000).toFixed(1)}k</p>
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${(m.net / maxEarning) * 80}px`,
                          background: m.month === "Jun" ? "var(--border)" : "var(--accent)",
                          opacity: m.month === "Jun" ? 1 : 0.8,
                        }}
                      />
                      <p className="text-xs" style={{ color: "var(--faint)" }}>{m.month}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: "var(--faint)" }}>
                  June is partial. All figures are net after {SIMULATED_STYLIST.commission}% StyleUp commission.
                </p>
              </div>

              {/* Session breakdown */}
              <div className="card p-5 mb-6">
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>RECENT SESSION BREAKDOWN</p>
                {RECENT_SESSIONS.map((s) => {
                  const gross = s.earned / (1 - SIMULATED_STYLIST.commission / 100);
                  const fee = gross - s.earned;
                  return (
                    <div key={s.client} className="flex items-center py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{s.client}</p>
                        <p className="text-xs" style={{ color: "var(--faint)" }}>{s.service} · {s.date}</p>
                      </div>
                      <div className="text-right text-xs" style={{ color: "var(--faint)" }}>
                        <p>Gross: £{gross.toFixed(0)}</p>
                        <p>StyleUp fee: −£{fee.toFixed(0)}</p>
                      </div>
                      <div className="text-right ml-4 w-16">
                        <p className="font-bold text-sm">£{s.earned.toFixed(0)}</p>
                        <p className="text-xs" style={{ color: "var(--dim)" }}>you earned</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Commission comparison */}
              <div className="card p-5" style={{ background: "var(--accent-bg)" }}>
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>IF YOU WERE ELITE (12%)</p>
                <p className="text-sm" style={{ color: "var(--dim)" }}>
                  Based on your last 4 sessions, Elite commission would have earned you an extra{" "}
                  <span className="font-bold" style={{ color: "var(--accent)" }}>
                    £{(RECENT_SESSIONS.reduce((s, r) => {
                      const gross = r.earned / (1 - SIMULATED_STYLIST.commission / 100);
                      return s + (gross * 0.03); // 15% → 12% = 3pp more
                    }, 0)).toFixed(0)}
                  </span>{" "}
                  on these sessions alone.
                </p>
                <p className="text-xs mt-2" style={{ color: "var(--accent)" }}>
                  {SIMULATED_STYLIST.sessionsToElite} more sessions to reach Elite →
                </p>
              </div>
            </div>
          )}

          {/* ── Availability ── */}
          {tab === "availability" && (
            <div className="fade-up">
              <h1 className="serif text-2xl font-bold mb-2">Availability</h1>
              <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
                Clients book directly into your open slots. Update any time.
              </p>
              <div className="card p-5">
                <p className="text-xs font-semibold mb-4" style={{ color: "var(--faint)" }}>WEEKLY AVAILABILITY</p>
                <div className="grid gap-3">
                  {AVAILABILITY.map((day) => (
                    <div key={day.day} className="flex items-center gap-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p className="text-sm font-semibold w-10">{day.day}</p>
                      {day.slots.length === 0 ? (
                        <p className="text-sm" style={{ color: "var(--faint)" }}>Day off</p>
                      ) : (
                        <div className="flex gap-2 flex-wrap">
                          {day.slots.map((slot) => (
                            <span
                              key={slot}
                              className="text-xs px-2.5 py-1 rounded-lg mono"
                              style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: "var(--faint)" }}>
                  Clients can book up to 21 days in advance. Cancellations within 24hrs trigger the no-show protection policy.
                </p>
              </div>
            </div>
          )}

          {/* ── Settings ── */}
          {tab === "settings" && (
            <div className="fade-up">
              <h1 className="serif text-2xl font-bold mb-6">Profile settings</h1>
              <div className="card p-5 mb-4">
                <p className="text-xs font-semibold mb-4" style={{ color: "var(--faint)" }}>PLATFORM STATUS</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--faint)" }}>TIER</p>
                    <p className="font-bold" style={{ color: SIMULATED_STYLIST.tierColor }}>{SIMULATED_STYLIST.tier}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--faint)" }}>COMMISSION RATE</p>
                    <p className="font-bold">{SIMULATED_STYLIST.commission}%</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--faint)" }}>TOTAL SESSIONS</p>
                    <p className="font-bold">{SIMULATED_STYLIST.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--faint)" }}>RATING</p>
                    <p className="font-bold">{SIMULATED_STYLIST.rating} ★</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <p className="text-xs font-semibold mb-4" style={{ color: "var(--faint)" }}>PLATFORM AGREEMENT</p>
                <div className="flex flex-col gap-3 text-sm" style={{ color: "var(--dim)" }}>
                  {[
                    "Non-circumvention clause (12 months from client introduction)",
                    "All bookings and payments via StyleUp platform",
                    "No direct solicitation of StyleUp clients for off-platform work",
                    "Client contact details released only through platform, 24hrs before sessions",
                    "Reviews are platform-verified — tied to completed bookings only",
                  ].map((term) => (
                    <div key={term} className="flex items-start gap-2">
                      <span className="flex-shrink-0" style={{ color: "#2D7A4F" }}>✓</span>
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: "var(--faint)" }}>
                  Agreed on joining StyleUp. For questions about these terms, contact{" "}
                  <span style={{ color: "var(--accent)" }}>stylists@styleup.com</span>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
