"use client";

import Link from "next/link";
import { useState } from "react";

const TIERS = [
  {
    name: "Starter",
    commission: 20,
    sessions: "0–24 sessions",
    color: "#757575",
    bg: "#F5F5F5",
    perks: [
      "Listed in the StyleUp marketplace",
      "Booking + payment management",
      "Client no-show protection",
      "StyleUp review profile",
    ],
  },
  {
    name: "Silver",
    commission: 17,
    sessions: "25–99 sessions",
    color: "#5C6BC0",
    bg: "#EDE7F6",
    perks: [
      "Everything in Starter",
      "Priority placement in search results",
      "Monthly earnings report",
      "Dedicated support line",
    ],
  },
  {
    name: "Gold",
    commission: 15,
    sessions: "100–299 sessions",
    color: "#C4923A",
    bg: "#FBF4E8",
    perks: [
      "Everything in Silver",
      "Featured on landing page",
      "Early access to new client types",
      "Quarterly business review with team",
      "Marketing profile write-up",
    ],
  },
  {
    name: "Elite",
    commission: 12,
    sessions: "300+ sessions",
    color: "#1A1612",
    bg: "#F5F0EB",
    perks: [
      "Everything in Gold",
      "Lowest commission in the industry",
      "Exclusive client referrals (high-net-worth)",
      "StyleUp Elite badge — instant trust signal",
      "Co-marketing opportunities",
      "Guaranteed minimum monthly earnings",
    ],
    highlight: true,
  },
];

const EARNINGS_EXAMPLES = [
  { sessions: 8, price: 250, commission: 20, label: "New stylist · 8 sessions/month" },
  { sessions: 15, price: 300, commission: 17, label: "Silver stylist · 15 sessions/month" },
  { sessions: 22, price: 350, commission: 15, label: "Gold stylist · 22 sessions/month" },
  { sessions: 30, price: 400, commission: 12, label: "Elite stylist · 30 sessions/month" },
];

export default function ForStylists() {
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", specialty: "", instagram: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) return;
    setApplied(true);
  };

  return (
    <main style={{ minHeight: "100vh" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/explore" style={{ color: "var(--dim)" }}>Find stylists</Link>
          <Link href="/stylist-portal" className="btn-secondary" style={{ padding: "8px 18px", fontSize: 13 }}>
            Stylist login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="grid gap-12 items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <div className="chip mb-5 w-fit">For professional stylists</div>
            <h1 className="serif text-5xl font-bold leading-tight mb-6" style={{ letterSpacing: "-0.03em" }}>
              Build your book.<br />
              <span style={{ color: "var(--accent)" }}>Keep your freedom.</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: "var(--dim)", lineHeight: 1.6 }}>
              StyleUp handles client acquisition, payments, scheduling, and disputes — so you spend your time doing the work you love. We take a commission. You keep everything else, including your independence.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="#apply" className="btn-primary">Apply to join →</a>
              <a href="#tiers" className="btn-secondary">See commission tiers</a>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "15,000+", label: "active clients on the platform" },
              { n: "£250", label: "average booking value" },
              { n: "4.8★", label: "average stylist rating" },
              { n: "£8.2K", label: "top stylist earnings per month" },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <p className="serif text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>{s.n}</p>
                <p className="text-xs" style={{ color: "var(--dim)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we handle */}
      <section style={{ background: "var(--dark)", color: "#fff" }} className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="serif text-2xl font-bold mb-2 text-center">We handle the business. You handle the style.</h2>
          <p className="text-sm text-center mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            The average independent stylist spends 40% of their time on admin. StyleUp takes that to zero.
          </p>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {[
              { icon: "💳", title: "Instant payments", body: "Clients pay at booking. You get paid within 48hrs of session completion. No chasing invoices." },
              { icon: "🛡", title: "No-show protection", body: "Client cancels within 24hrs? You keep 50% of the fee. StyleUp absorbs the cost, not you." },
              { icon: "📅", title: "Smart scheduling", body: "Your availability calendar lives on StyleUp. Clients book into your open slots — no back-and-forth." },
              { icon: "⭐", title: "Review management", body: "Every review is verified — tied to a real booking. No fake reviews, no review bombing." },
              { icon: "📣", title: "Marketing engine", body: "15,000 clients searching for stylists. You get found. We do SEO, content, and paid acquisition." },
              { icon: "⚖️", title: "Dispute resolution", body: "Client unhappy? We investigate and mediate. You don't deal with it alone." },
            ].map((f) => (
              <div key={f.title} className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                <p className="text-2xl mb-3">{f.icon}</p>
                <p className="font-semibold mb-2">{f.title}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings calculator */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">What you could earn</h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--dim)" }}>
          Commission drops as you grow — rewarding loyalty and volume
        </p>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {EARNINGS_EXAMPLES.map((e) => {
            const gross = e.sessions * e.price;
            const net = gross * (1 - e.commission / 100);
            return (
              <div key={e.label} className="card p-5">
                <p className="text-xs mb-3" style={{ color: "var(--faint)" }}>{e.label}</p>
                <p className="text-xs mb-1" style={{ color: "var(--dim)" }}>
                  {e.sessions} sessions × £{e.price} = £{gross.toLocaleString()} gross
                </p>
                <p className="text-xs mb-2" style={{ color: "var(--faint)" }}>
                  {e.commission}% commission = −£{(gross * e.commission / 100).toLocaleString()}
                </p>
                <p className="serif text-2xl font-bold" style={{ color: "var(--accent)" }}>
                  £{net.toLocaleString()}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--dim)" }}>your monthly take-home</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-center mt-4" style={{ color: "var(--faint)" }}>
          Going independent? Factor in: marketing costs (£500–£2K/month), payment processing (2.9%), chasing unpaid invoices, no-shows with no recourse, and zero client acquisition engine.
        </p>
      </section>

      {/* Commission tiers */}
      <section id="tiers" className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">Commission tiers</h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--dim)" }}>
          The more sessions you do through StyleUp, the less you pay. Loyalty is rewarded automatically.
        </p>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {TIERS.map((t) => (
            <div
              key={t.name}
              className="card p-6"
              style={{
                border: t.highlight ? `2px solid ${t.color}` : undefined,
                position: "relative",
              }}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="chip" style={{ background: t.color, color: "#fff" }}>Most rewarding</span>
                </div>
              )}
              <div className="mb-4">
                <p className="text-xs font-semibold mb-1" style={{ color: t.color }}>
                  {t.name.toUpperCase()}
                </p>
                <p className="serif text-4xl font-bold">{t.commission}%</p>
                <p className="text-xs" style={{ color: "var(--faint)" }}>commission · {t.sessions}</p>
              </div>
              <div className="flex flex-col gap-2">
                {t.perks.map((p) => (
                  <div key={p} className="flex items-start gap-2 text-xs" style={{ color: "var(--dim)" }}>
                    <span style={{ color: t.color, flexShrink: 0 }}>✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anti-circumvention — framed as protection for stylists */}
      <section style={{ background: "var(--accent-bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="serif text-2xl font-bold mb-4 text-center">Platform rules that protect you</h2>
          <p className="text-sm text-center mb-8" style={{ color: "var(--dim)", maxWidth: 500, margin: "0 auto 32px" }}>
            Our policies aren&apos;t just about StyleUp&apos;s interests — they protect yours too.
          </p>
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[
              {
                title: "12-month client relationship clause",
                body: "Clients discovered through StyleUp fall under a 12-month non-circumvention window. Why? Because it ensures you keep getting platform protections — payment guarantees, dispute handling — for the lifetime of that relationship, not just the first session.",
              },
              {
                title: "Payments always through the platform",
                body: "No cash, no bank transfers, no awkward conversations. Clients pay at booking, you get paid within 48hrs of completion. StyleUp's payment rail is your invoice system, your accountant, and your collections department.",
              },
              {
                title: "Reviews travel with the booking",
                body: "Your 200-review profile on StyleUp isn't yours to export — it's a record of trust built with our clients. This protects you from fake reviews and protects us all from fraudulent stylists who move platforms when reputations catch up with them.",
              },
              {
                title: "Contact details, on a schedule",
                body: "Clients don't get your personal number until 24hrs before the session. This is as much for your safety as theirs — and means every relationship starts with a booked, paid appointment, not a cold DM.",
              },
            ].map((r) => (
              <div key={r.title} className="card p-5">
                <p className="font-semibold text-sm mb-2">{r.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--dim)" }}>{r.body}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-6" style={{ color: "var(--faint)" }}>
            Stylists who circumvent the platform — taking clients directly after a StyleUp introduction — are suspended and may face a fee equal to 3× the value of sessions conducted off-platform.
          </p>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="max-w-md mx-auto px-6 py-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">Apply to join StyleUp</h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--dim)" }}>
          We onboard 20–30 new stylists per month. Apply now — we&apos;ll review within 3 business days.
        </p>

        {applied ? (
          <div className="card p-8 text-center fade-up">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="serif text-xl font-bold mb-2">Application received</h3>
            <p className="text-sm" style={{ color: "var(--dim)" }}>
              We&apos;ll review your profile and be in touch within 3 business days.
            </p>
            <p className="text-sm mt-3" style={{ color: "var(--faint)" }}>
              In the meantime, explore how clients use the platform →
            </p>
            <Link href="/explore" className="btn-secondary mt-4 block text-center" style={{ padding: "10px 20px", fontSize: 13 }}>
              See the client view
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="card p-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>YOUR NAME</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Amara Okonkwo"
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>YOUR CITY</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="London, UK"
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>SPECIALTY</label>
                <input
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  placeholder="e.g. Minimalist, Streetwear, Luxury, Modest Fashion…"
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>INSTAGRAM (optional)</label>
                <input
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@yourstylehandle"
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <button type="submit" className="btn-accent mt-2">
                Submit application
              </button>
              <p className="text-xs text-center" style={{ color: "var(--faint)" }}>
                By applying you confirm you&apos;ve read and agree to our{" "}
                <span style={{ color: "var(--accent)" }}>Stylist Terms of Service</span>,
                including the non-circumvention clause.
              </p>
            </div>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--faint)" }}>
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/">Client home</Link>
          <Link href="/explore">Browse stylists</Link>
          <Link href="/stylist-portal">Stylist portal</Link>
        </div>
        <p>© 2026 StyleUp · Personal styling, everywhere</p>
      </footer>
    </main>
  );
}
