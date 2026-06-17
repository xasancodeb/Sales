"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PACKAGES = [
  {
    name: "Team Starter",
    price: "£5,000",
    period: "/year",
    sessions: "10 styling sessions",
    tagline: "Perfect for teams of 5–15",
    features: [
      "10 individual styling sessions",
      "Shared team colour analysis",
      "StyleUp team dashboard",
      "Dedicated account contact",
      "Session scheduling support",
    ],
    highlight: false,
    badge: null,
  },
  {
    name: "Company",
    price: "£20,000",
    period: "/year",
    sessions: "50 sessions",
    tagline: "For growing organisations of 15–50",
    features: [
      "50 individual styling sessions",
      "Team colour and archetype workshops",
      "Priority booking across all cities",
      "Monthly impact report",
      "Dedicated account manager",
      "On-site or virtual delivery",
    ],
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    price: "£50,000",
    period: "/year",
    sessions: "Unlimited sessions",
    tagline: "Bespoke for 50+ teams",
    features: [
      "Unlimited styling sessions",
      "Custom programme design",
      "Executive one-to-one coaching",
      "Global delivery in 27 cities",
      "Branded team style guide",
      "Quarterly business review",
      "White-glove concierge service",
    ],
    highlight: false,
    badge: null,
  },
];

const USE_CASES = [
  {
    icon: "🎓",
    title: "Onboarding programmes",
    description:
      "Make a great first impression stick. New joiners who feel confident in how they present themselves integrate faster and feel more connected to company culture from day one.",
  },
  {
    icon: "👔",
    title: "Executive coaching",
    description:
      "Your leaders represent your brand every time they step into a room. One-to-one styling sessions help senior teams project authority, approachability, and alignment with company values.",
  },
  {
    icon: "🌍",
    title: "Team away-days",
    description:
      "Give your team something memorable. Group styling workshops and colour sessions are a high-retention, high-energy alternative to the usual away-day agenda — people actually talk about them afterwards.",
  },
];

export default function Corporate() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    teamSize: "",
    message: "",
  });

  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "Corporate Styling · StyleUp";
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.name.trim() || !form.email.trim()) return;
    setSubmitted(true);
  };

  return (
    <main style={{ minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <div className="hidden-mobile flex items-center gap-4 text-sm">
          <Link href="/" style={{ color: "var(--dim)" }}>Home</Link>
          <Link href="/explore" style={{ color: "var(--dim)" }}>Explore</Link>
          <Link href="/for-stylists" style={{ color: "var(--dim)" }}>For Stylists</Link>
          <Link
            href="/corporate"
            className="font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Corporate
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="chip mb-6 mx-auto w-fit">For business &amp; HR teams</div>
        <h1 className="serif text-5xl font-bold leading-tight mb-6" style={{ letterSpacing: "-0.03em" }}>
          Style your<br />
          <span style={{ color: "var(--accent)" }}>whole team.</span>
        </h1>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "var(--dim)", lineHeight: 1.6 }}>
          Teams that dress intentionally show 34% higher engagement and 28% stronger retention. StyleUp brings professional styling to your entire organisation — from first-day onboarding to executive coaching.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={scrollToForm} className="btn-primary">
            Request a demo
          </button>
          <a href="#packages" className="btn-secondary">
            See packages
          </a>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section style={{ background: "var(--faint)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }} className="py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 text-center">
            {[
              { value: "2,400+", label: "sessions delivered for teams" },
              { value: "89%", label: "team satisfaction score" },
              { value: "27", label: "cities covered" },
            ].map((s) => (
              <div key={s.label}>
                <p className="serif text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>{s.value}</p>
                <p className="text-sm" style={{ color: "var(--dim)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">Corporate packages</h2>
        <p className="text-sm text-center mb-10" style={{ color: "var(--dim)" }}>
          All packages include a dedicated account manager, scheduling support, and a post-programme impact report.
        </p>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className="card p-6"
              style={{
                border: pkg.highlight ? "2px solid var(--accent)" : undefined,
                position: "relative",
              }}
            >
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className="chip"
                    style={{ background: "var(--accent)", color: "#fff", whiteSpace: "nowrap" }}
                  >
                    {pkg.badge}
                  </span>
                </div>
              )}
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: pkg.highlight ? "var(--accent)" : "var(--faint)" }}
              >
                {pkg.name.toUpperCase()}
              </p>
              <div className="flex items-end gap-1 mb-1">
                <p className="serif text-4xl font-bold">{pkg.price}</p>
                <p className="text-sm mb-1" style={{ color: "var(--faint)" }}>{pkg.period}</p>
              </div>
              <p className="text-sm font-semibold mb-1">{pkg.sessions}</p>
              <p className="text-xs mb-5" style={{ color: "var(--dim)" }}>{pkg.tagline}</p>
              <div className="flex flex-col gap-2 mb-6">
                {pkg.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--dim)" }}>
                    <span style={{ color: "var(--accent)", flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToForm}
                className={pkg.highlight ? "btn-primary w-full" : "btn-secondary w-full"}
                style={{ width: "100%" }}
              >
                Request a demo
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-center mt-6" style={{ color: "var(--faint)" }}>
          Need something different? Enterprise packages are fully bespoke — tell us your team size and goals and we&apos;ll build a programme around you.
        </p>
      </section>

      {/* ── Use cases ── */}
      <section style={{ background: "var(--dark)", color: "#fff" }} className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="serif text-2xl font-bold mb-2 text-center">Where corporate styling makes an impact</h2>
          <p className="text-sm text-center mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
            The moments that matter most for how your people present themselves
          </p>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {USE_CASES.map((uc) => (
              <div key={uc.title} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                <p className="text-3xl mb-4">{uc.icon}</p>
                <p className="font-semibold text-lg mb-3">{uc.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo form ── */}
      <section ref={formRef} id="demo" className="max-w-xl mx-auto px-6 py-20">
        <h2 className="serif text-2xl font-bold mb-2 text-center">Request a demo</h2>
        <p className="text-sm text-center mb-8" style={{ color: "var(--dim)" }}>
          Tell us about your team and we&apos;ll set up a 30-minute call to walk you through the options.
        </p>

        {submitted ? (
          <div className="card p-8 text-center fade-up">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="serif text-xl font-bold mb-2">Request received</h3>
            <p className="text-sm mb-1" style={{ color: "var(--dim)" }}>
              Thank you, {form.name}. We&apos;ll be in touch with {form.company} within one business day.
            </p>
            <p className="text-sm mt-3" style={{ color: "var(--faint)" }}>
              In the meantime, explore how our individual sessions work →
            </p>
            <Link
              href="/explore"
              className="btn-secondary mt-4 block text-center"
              style={{ padding: "10px 20px", fontSize: 13 }}
            >
              Browse stylists
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>
                  COMPANY NAME
                </label>
                <input
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Acme Ltd"
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>
                  YOUR NAME
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>
                  EMAIL
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@acme.com"
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>
                  TEAM SIZE
                </label>
                <select
                  value={form.teamSize}
                  onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
                >
                  <option value="">Select team size</option>
                  <option value="5-15">5–15 people</option>
                  <option value="15-50">15–50 people</option>
                  <option value="50-200">50–200 people</option>
                  <option value="200+">200+ people</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--faint)" }}>
                  MESSAGE (optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you're hoping to achieve — onboarding support, executive coaching, a team event, something else entirely…"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
                  style={{ border: "1px solid var(--border)" }}
                />
              </div>
              <button type="submit" className="btn-primary mt-2">
                Send request
              </button>
              <p className="text-xs text-center" style={{ color: "var(--faint)" }}>
                We respond within one business day. No commitment required.
              </p>
            </div>
          </form>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-8 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--faint)" }}>
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/">Home</Link>
          <Link href="/explore">Browse stylists</Link>
          <Link href="/for-stylists">For stylists</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <p>© 2026 StyleUp · Personal styling, everywhere</p>
      </footer>
    </main>
  );
}
