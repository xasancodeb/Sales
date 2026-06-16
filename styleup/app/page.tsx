"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STYLISTS, SESSION_TYPES } from "@/lib/data";
import { getUpcoming } from "@/lib/booking";

const FEATURED_IDS = ["amara-okonkwo", "lea-fontaine", "marcus-reeves"];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="star text-sm">
      {"★".repeat(Math.round(rating))}
      <span style={{ color: "var(--faint)" }}>{"★".repeat(5 - Math.round(rating))}</span>
      <span className="ml-1 text-xs" style={{ color: "var(--dim)" }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function StylistCard({ id }: { id: string }) {
  const s = STYLISTS.find((st) => st.id === id);
  if (!s) return null;
  return (
    <Link href={`/stylist/${s.id}`} className="card block p-5 hover:shadow-md transition-shadow">
      <div
        className="rounded-xl h-24 w-24 mb-4 flex items-center justify-center text-3xl text-white font-bold"
        style={{ background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]})` }}
      >
        {s.name[0]}
      </div>
      <p className="font-semibold text-base mb-0.5">{s.flag} {s.name}</p>
      <p className="text-sm mb-1" style={{ color: "var(--dim)" }}>{s.city} · {s.specialty[0]}</p>
      <StarRating rating={s.rating} />
      <p className="text-xs mt-2" style={{ color: "var(--faint)" }}>{s.bookings.toLocaleString()} sessions completed</p>
    </Link>
  );
}

export default function Landing() {
  const [hasBooking, setHasBooking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasBooking(getUpcoming().length > 0);
  }, []);

  return (
    <main style={{ minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <p className="serif font-bold text-xl tracking-tight">StyleUp</p>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/explore" style={{ color: "var(--dim)" }}>Find stylists</Link>
          <Link href="/fitting" style={{ color: "var(--dim)" }}>Fitting room</Link>
          {mounted && hasBooking ? (
            <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
              My bookings
            </Link>
          ) : (
            <Link href="/quiz" className="btn-accent" style={{ padding: "8px 18px", fontSize: 13 }}>
              Find my style
            </Link>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="chip mb-6 mx-auto w-fit">Personal styling · reinvented</div>
        <h1 className="serif text-5xl font-bold leading-tight mb-6" style={{ letterSpacing: "-0.03em" }}>
          Your best look,<br />
          <span style={{ color: "var(--accent)" }}>delivered to you.</span>
        </h1>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "var(--dim)", lineHeight: 1.6 }}>
          Book a personal stylist who meets you where you are — in your favourite shop, at home, or on a video call. Style advice that actually changes how you get dressed.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/explore" className="btn-primary">
            Browse stylists
          </Link>
          <Link href="/fitting" className="btn-secondary">
            Try the colour room →
          </Link>
        </div>
        <p className="text-xs mt-6" style={{ color: "var(--faint)" }}>
          No subscription · Book one session, cancel anytime · Trusted by 15,000+ clients
        </p>
      </section>

      {/* ── Session types ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">Every way to work with a stylist</h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--dim)" }}>You choose the format. They bring the expertise.</p>
        <div className="grid grid-cols-2 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {SESSION_TYPES.filter((t) => t.value !== "all").map((t) => (
            <Link
              key={t.value}
              href={`/explore?type=${t.value}`}
              className="card p-5 hover:shadow-md transition-shadow block"
            >
              <p className="text-2xl mb-3">{t.icon}</p>
              <p className="font-semibold mb-1">{t.label}</p>
              <p className="text-sm" style={{ color: "var(--dim)" }}>{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: "var(--dark)", color: "#fff" }} className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="serif text-2xl font-bold mb-2 text-center">How it works</h2>
          <p className="text-sm text-center mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>From booking to better-dressed in three steps</p>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              { n: "01", title: "Tell us your style", body: "Take a quick quiz to discover your archetype and colour season. Or skip straight to browsing.", link: "/quiz", cta: "Take the quiz" },
              { n: "02", title: "Choose your stylist", body: "Browse profiles, read reviews, and find a stylist whose specialty matches what you need.", link: "/explore", cta: "Browse stylists" },
              { n: "03", title: "Book your session", body: "Pick a session type, a date, and a time. Your stylist prepares specifically for you.", link: "/explore", cta: "Book now" },
            ].map((s) => (
              <div key={s.n} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                <p className="mono text-xs mb-3" style={{ color: "var(--accent)" }}>{s.n}</p>
                <p className="font-semibold text-lg mb-2">{s.title}</p>
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{s.body}</p>
                <Link href={s.link} className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                  {s.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Virtual Fitting Room teaser ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="card p-8 flex flex-wrap gap-8 items-center">
          <div className="flex-1" style={{ minWidth: 240 }}>
            <div className="chip mb-4">Free tool</div>
            <h2 className="serif text-2xl font-bold mb-3">Virtual Colour Fitting Room</h2>
            <p className="text-sm mb-5" style={{ color: "var(--dim)", lineHeight: 1.6 }}>
              Discover your colour season — Spring, Summer, Autumn, or Winter — and see exactly which colours will make you look extraordinary. Then share your palette with your stylist so they can prepare.
            </p>
            <Link href="/fitting" className="btn-primary">
              Open the fitting room
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap" style={{ maxWidth: 280 }}>
            {[
              ["#FF7F7F","#FFDAB9","#FFD700","#98D8C8"],
              ["#E6E6FA","#B0D4F1","#FFB6C1","#AFEEEE"],
              ["#B7410E","#6B8E23","#E2725B","#FFDB58"],
              ["#000080","#50C878","#800020","#4169E1"],
            ].map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((c) => (
                  <div key={c} className="rounded-full" style={{ width: 36, height: 36, background: c, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
                ))}
              </div>
            ))}
            <p className="text-xs w-full mt-2" style={{ color: "var(--faint)" }}>Spring · Summer · Autumn · Winter</p>
          </div>
        </div>
      </section>

      {/* ── Featured stylists ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="serif text-2xl font-bold mb-2">Top stylists this month</h2>
        <p className="text-sm mb-8" style={{ color: "var(--dim)" }}>Verified professionals with hundreds of completed sessions</p>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {FEATURED_IDS.map((id) => <StylistCard key={id} id={id} />)}
        </div>
        <div className="text-center mt-8">
          <Link href="/explore" className="btn-secondary">
            View all {STYLISTS.length} stylists →
          </Link>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section style={{ background: "var(--accent-bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {[
              { text: "\"Amara transformed my wardrobe in three hours. I've worn every single thing she approved. That's never happened before.\"", name: "James W.", flag: "🇺🇸", city: "New York" },
              { text: "\"The virtual colour analysis with Priya was the most useful thing I've done for my appearance in ten years. I'm wearing completely different colours now.\"", name: "Rina K.", flag: "🇬🇧", city: "London" },
              { text: "\"I booked Marcus for a video call expecting generic advice. I got a completely personalised strategy. He watched me try on six outfits and told me exactly what was and wasn't working.\"", name: "Jordan L.", flag: "🇺🇸", city: "Brooklyn" },
            ].map((r, i) => (
              <div key={i} className="card p-5">
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--ink)" }}>{r.text}</p>
                <p className="text-xs" style={{ color: "var(--dim)" }}>{r.flag} {r.name} · {r.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA footer ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="serif text-3xl font-bold mb-4">Ready to look like yourself?</h2>
        <p className="text-base mb-8" style={{ color: "var(--dim)" }}>
          Your best look is not about spending more — it&apos;s about knowing exactly what to buy.
        </p>
        <Link href="/explore" className="btn-accent">
          Find your stylist
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-8 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--faint)" }}>
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/explore">Find a stylist</Link>
          <Link href="/fitting">Colour room</Link>
          <Link href="/quiz">Style quiz</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <p>© 2026 StyleUp · Personal styling, everywhere</p>
      </footer>
    </main>
  );
}
