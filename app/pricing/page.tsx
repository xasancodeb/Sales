import Link from "next/link";

const TIERS = [
  {
    name: "Hunter",
    price: "$199",
    blurb: "For founders doing their own sales.",
    features: [
      "300 researched prospects / month",
      "Signal-anchored outreach drafts",
      "Intent scoring on every lead",
      "1 sending identity",
    ],
    cta: "Start hunting",
    featured: false,
  },
  {
    name: "Closer",
    price: "$499",
    blurb: "Replaces your first SDR hire.",
    features: [
      "2,000 researched prospects / month",
      "Autonomous sending + follow-up sequences",
      "Reply handling & meeting booking",
      "CRM sync (Salesforce, HubSpot)",
      "3 sending identities",
    ],
    cta: "Hire your agent",
    featured: true,
  },
  {
    name: "Rainmaker",
    price: "$1,499",
    blurb: "An outbound department in a box.",
    features: [
      "10,000 researched prospects / month",
      "Multi-agent campaigns per segment",
      "Custom signal sources & integrations",
      "Dedicated success engineer",
      "Unlimited sending identities",
    ],
    cta: "Make it rain",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold">
            Quota<span className="text-[#b8f53d]">.</span>
          </Link>
          <Link
            href="/demo"
            className="bg-[#b8f53d] text-[#0b0f0e] font-semibold px-5 py-2 rounded-xl text-sm hover:bg-[#cdff66] transition-colors"
          >
            Try the live demo
          </Link>
        </div>
      </nav>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h1 className="font-display text-5xl font-bold mb-4">
          Cheaper than a hire. <span className="text-white/35">Harder working, too.</span>
        </h1>
        <p className="text-white/50 max-w-2xl mb-14">
          A junior SDR costs $80k a year before commission, tools, and three
          months of ramp. Every Quota plan costs less per year than one month
          of that.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-7 border ${
                tier.featured
                  ? "border-[#b8f53d]/50 bg-[#b8f53d]/5"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {tier.featured && (
                <p className="font-mono-ui text-xs text-[#b8f53d] uppercase tracking-widest mb-3">
                  Most deployed
                </p>
              )}
              <h2 className="font-display text-2xl font-bold mb-1">{tier.name}</h2>
              <p className="text-white/40 text-sm mb-5">{tier.blurb}</p>
              <p className="mb-6">
                <span className="font-display text-4xl font-bold">{tier.price}</span>
                <span className="text-white/40 text-sm"> /month</span>
              </p>
              <ul className="space-y-2.5 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="text-sm text-white/70 flex gap-2">
                    <span className="text-[#b8f53d]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/demo"
                className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                  tier.featured
                    ? "bg-[#b8f53d] text-[#0b0f0e] hover:bg-[#cdff66]"
                    : "border border-white/20 text-white/80 hover:bg-white/5"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center font-mono-ui text-xs text-white/25 mt-12">
          Every plan: cancel anytime. The agent doesn&apos;t take it personally.
        </p>
      </section>
    </main>
  );
}
