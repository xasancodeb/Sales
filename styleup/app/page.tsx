"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STYLISTS, SESSION_TYPES } from "@/lib/data";
import { getUpcoming } from "@/lib/booking";

const FEATURED_IDS = ["amara-okonkwo", "lea-fontaine", "marcus-reeves"];

const FAQS = [
  {
    q: "How much does a session cost?",
    a: "Sessions range from £75 for an online consultation to £840+ for a luxury in-store experience. Each stylist sets their own prices — you see the full cost before booking. No hidden fees.",
  },
  {
    q: "Can I get a refund if I cancel?",
    a: "You can cancel up to 24 hours before your session for a full refund. Cancellations within 24 hours may be subject to a 50% cancellation fee — your stylist has prepared specifically for you.",
  },
  {
    q: "How are stylists verified?",
    a: "Every stylist goes through our application and portfolio review. We verify credentials, check references, and do a test client call. Only 1 in 4 applicants are accepted.",
  },
  {
    q: "What if I don't click with my stylist?",
    a: "It's rare, but it happens. Contact us within 24 hours of your first session and we'll find you another stylist or issue a full refund — no questions asked.",
  },
  {
    q: "Is the colour fitting room free?",
    a: "Yes, completely free. No account needed. The colour analysis quiz, outfit builder, and full palette are yours to use as many times as you like.",
  },
  {
    q: "Can I book a stylist in my city if they're not listed?",
    a: "We add new stylists every month. Use the 'Find stylists' page to see who's near you, or tell us your city and we'll notify you when someone joins your area.",
  },
];

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasBooking(getUpcoming().length > 0);
  }, []);

  return (
    <main className="page-enter" style={{ minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto relative">
        <p className="serif font-bold text-xl tracking-tight">StyleUp</p>
        {/* Desktop nav */}
        <div className="hidden-mobile flex items-center gap-4 text-sm">
          <Link href="/explore" style={{ color: "var(--dim)" }}>Find stylists</Link>
          <Link href="/fitting" style={{ color: "var(--dim)" }}>Fitting room</Link>
          <Link href="/for-stylists" style={{ color: "var(--dim)" }}>For stylists</Link>
          {mounted && hasBooking ? (
            <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>My bookings</Link>
          ) : (
            <Link href="/quiz" className="btn-accent" style={{ padding: "8px 18px", fontSize: 13 }}>Find my style</Link>
          )}
        </div>
        {/* Mobile menu button */}
        <button
          className="show-mobile"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
          style={{ fontSize: 22, background: "none", border: "none", color: "var(--ink)" }}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="show-mobile absolute top-full left-0 right-0 z-50 px-4 pb-4 shadow-lg" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
            <div className="flex flex-col gap-1 pt-2">
              {[
                { href: "/explore", label: "Find stylists" },
                { href: "/fitting", label: "Fitting room" },
                { href: "/for-stylists", label: "For stylists" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-sm font-medium"
                  style={{ color: "var(--ink)" }}>
                  {l.label}
                </Link>
              ))}
              <Link href="/quiz" onClick={() => setMobileMenuOpen(false)} className="btn-accent text-center mt-2">
                Find my style
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-16 text-center" style={{ paddingTop: "clamp(2rem, 5vw, 4rem)" }}>
        <div className="chip chip-pulse mb-6 mx-auto w-fit">Personal styling · reinvented</div>
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

      {/* ── Fitting room demo ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">How the colour fitting room works</h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--dim)" }}>Three steps to discovering your best palette</p>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {[
            { n: "01", title: "Find your season", body: "Answer 3 questions about your skin tone and natural colouring. We pinpoint your Spring, Summer, Autumn, or Winter season.", icon: "🌸❄️🍂☀️" },
            { n: "02", title: "Try your palette", body: "See your personalised colour palette. Use the outfit builder to try different combinations on a virtual avatar — no dressing room required.", icon: "🎨" },
            { n: "03", title: "Share with your stylist", body: "Copy your palette summary to your clipboard or share it directly with your stylist at booking so they arrive prepared.", icon: "📋" },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <p className="mono text-xs mb-2" style={{ color: "var(--accent)" }}>{s.n}</p>
              <p className="text-2xl mb-3">{s.icon}</p>
              <p className="font-semibold mb-2">{s.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--dim)", lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/fitting" className="btn-accent">Try the fitting room free →</Link>
        </div>
      </section>

      {/* ── Featured stylists ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="serif text-2xl font-bold mb-2">Top stylists this month</h2>
        <p className="text-sm mb-8" style={{ color: "var(--dim)" }}>Verified professionals with hundreds of completed sessions</p>

        {/* ── Trust signals ── */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 mt-4">
          {[
            { value: "10", label: "cities covered" },
            { value: STYLISTS.length.toString(), label: "verified stylists" },
            { value: "< 48hrs", label: "avg. booking to session" },
            { value: "4.93★", label: "average stylist rating" },
          ].map((t) => (
            <div key={t.label} className="text-center">
              <p className="serif text-2xl font-bold" style={{ color: "var(--accent)" }}>{t.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>{t.label}</p>
            </div>
          ))}
        </div>

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

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">Frequently asked questions</h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--dim)" }}>Everything you need to know before booking</p>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between"
              >
                <span className="font-semibold text-sm">{faq.q}</span>
                <span className="text-lg" style={{ color: "var(--faint)", transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed fade-up" style={{ color: "var(--dim)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
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
      <footer className="border-t px-6 py-12" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <div>
              <p className="serif font-bold text-lg mb-3">StyleUp</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--faint)" }}>Personal styling, everywhere. Trusted by 15,000+ clients across 10 cities.</p>
            </div>
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>FOR CLIENTS</p>
              <div className="flex flex-col gap-2 text-xs" style={{ color: "var(--dim)" }}>
                <Link href="/explore">Find a stylist</Link>
                <Link href="/fitting">Colour fitting room</Link>
                <Link href="/quiz">Style quiz</Link>
                <Link href="/dashboard">My dashboard</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>FOR STYLISTS</p>
              <div className="flex flex-col gap-2 text-xs" style={{ color: "var(--dim)" }}>
                <Link href="/for-stylists">Join StyleUp</Link>
                <Link href="/for-stylists#tiers">Commission tiers</Link>
                <Link href="/stylist-portal">Stylist portal</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>SUPPORT</p>
              <div className="flex flex-col gap-2 text-xs" style={{ color: "var(--dim)" }}>
                <Link href="/">How it works</Link>
                <Link href="/#faq">FAQ</Link>
                <span style={{ color: "var(--faint)" }}>hello@styleup.com</span>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--faint)" }}>
            <p>© 2026 StyleUp · Personal styling, everywhere</p>
            <div className="flex gap-4">
              <Link href="/privacy">Privacy policy</Link>
              <Link href="/terms">Terms of service</Link>
              <Link href="/terms#stylist-terms">Stylist terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
