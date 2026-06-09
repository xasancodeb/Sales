import Link from "next/link";

const TIERS = [
  {
    name: "Solo",
    price: "$97",
    blurb: "For founders and freelancers building their first income streams.",
    features: [
      "500 opportunity scans / month",
      "5 income stream categories",
      "AI pitch generation for every match",
      "Step-by-step action strategies",
      "Weekly opportunity digest",
      "1 active profile",
    ],
    cta: "Start free →",
    featured: false,
    note: "",
  },
  {
    name: "Builder",
    price: "$297",
    blurb: "For serious income builders running multiple streams simultaneously.",
    features: [
      "5,000 opportunity scans / month",
      "All 5 income stream categories",
      "Autonomous outreach & follow-up",
      "CRM + calendar integration",
      "Real-time signal alerts",
      "3 active profiles",
      "Priority AI (fastest model)",
    ],
    cta: "Start free →",
    featured: true,
    note: "Most popular",
  },
  {
    name: "Sovereign",
    price: "$997",
    blurb: "For those building a portfolio of income streams and businesses.",
    features: [
      "Unlimited opportunity scans",
      "Dedicated AI agent per income stream",
      "Full autonomous execution mode",
      "Custom signal sources & integrations",
      "Revenue dashboard and analytics",
      "Unlimited active profiles",
      "White-glove onboarding",
    ],
    cta: "Talk to us →",
    featured: false,
    note: "",
  },
];

const FAQ = [
  {
    q: "What does 'autonomous execution' mean?",
    a: "AURUM doesn't just find opportunities — it acts. It sends the outreach, follows up, handles initial replies, and books the meeting on your calendar. You approve the action once; AURUM carries it through.",
  },
  {
    q: "What types of income does AURUM hunt for?",
    a: "Five categories simultaneously: freelance projects (any skill), business deals (partnerships, referrals, licensing), content opportunities (newsletter sponsors, courses, podcasts), automation builds (building tools for companies), and investment signals (market intelligence).",
  },
  {
    q: "Does it work for my type of skills?",
    a: "Yes. AURUM works for any monetizable skill: development, design, writing, marketing, consulting, finance, research, operations, legal, and more. The demo shows exactly what it finds for your specific profile.",
  },
  {
    q: "How is AURUM different from LinkedIn or Upwork?",
    a: "Those platforms require you to actively search, apply, and manage yourself. AURUM runs in the background 24/7, finds opportunities you'd never stumble on, writes the pitch, and executes the first move — without you logging in.",
  },
  {
    q: "What if I don't want it to send anything automatically?",
    a: "Every plan includes an approval queue. You can review each action before it fires. Autonomous execution is on by default but can be set to 'review mode' where you approve each pitch before it's sent.",
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">AURUM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
          </Link>
          <Link
            href="/demo"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            style={{ background: "#FFB800", color: "#06070e" }}
          >
            Try live demo
          </Link>
        </div>
      </nav>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <p className="font-mono-ui text-xs uppercase tracking-widest mb-5"
          style={{ color: "var(--text-faint)" }}>
          Pricing
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-5 max-w-3xl">
          One month of AURUM pays for itself in the first deal.
        </h1>
        <p className="max-w-xl text-base mb-16 leading-relaxed"
          style={{ color: "var(--text-dim)" }}>
          A single freelance project, partnership, or content deal — the kind AURUM finds weekly —
          is worth 10–100x the monthly subscription. The math is simple.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="rounded-2xl p-7 flex flex-col"
              style={{
                background: tier.featured ? "rgba(255,184,0,0.04)" : "var(--surface)",
                border: tier.featured
                  ? "1px solid rgba(255,184,0,0.35)"
                  : "1px solid var(--border)",
              }}
            >
              {tier.featured && (
                <p className="font-mono-ui text-xs uppercase tracking-widest mb-3"
                  style={{ color: "#FFB800" }}>
                  {tier.note}
                </p>
              )}
              <h2 className="font-display text-2xl font-bold mb-1">{tier.name}</h2>
              <p className="text-sm mb-5" style={{ color: "var(--text-dim)" }}>
                {tier.blurb}
              </p>
              <p className="mb-7">
                <span className="font-display text-5xl font-bold">{tier.price}</span>
                <span className="text-sm ml-1" style={{ color: "var(--text-dim)" }}>/ month</span>
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm flex gap-2.5">
                    <span style={{ color: tier.featured ? "#FFB800" : "#00D97E" }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.75)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/demo"
                className="block text-center font-semibold py-3.5 rounded-xl transition-all text-sm"
                style={{
                  background: tier.featured ? "#FFB800" : "transparent",
                  color: tier.featured ? "#06070e" : "rgba(255,255,255,0.75)",
                  border: tier.featured ? "none" : "1px solid var(--border)",
                }}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Value callout */}
        <div
          className="rounded-2xl p-8 mb-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,184,0,0.08) 0%, transparent 70%), var(--surface)",
            border: "1px solid rgba(255,184,0,0.2)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: "$97/mo", label: "Solo plan", sub: "vs. $80k/yr for a sales hire" },
              { value: "14 days", label: "Free trial", sub: "no credit card required" },
              { value: "4 min", label: "Setup time", sub: "from zero to deployed" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl font-bold mb-1"
                  style={{ color: "#FFB800" }}>
                  {s.value}
                </p>
                <p className="font-semibold mb-1">{s.label}</p>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <h2 className="font-display text-3xl font-bold mb-8">Common questions.</h2>
        <div className="space-y-px">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="py-7"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <p className="font-semibold mb-3">{item.q}</p>
              <p className="text-sm leading-relaxed max-w-2xl"
                style={{ color: "var(--text-dim)" }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center font-mono-ui text-xs mt-16"
          style={{ color: "var(--text-faint)" }}>
          Cancel anytime. The agent doesn&apos;t take it personally.
        </p>
      </section>
    </main>
  );
}
