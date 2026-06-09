import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Tell it what you sell",
    body: "One sentence about your product and who buys it. That's the entire onboarding.",
  },
  {
    n: "02",
    title: "It hunts",
    body: "Quota scans companies for live buying signals — hiring spikes, funding events, exec statements, product gaps — and scores every prospect for intent.",
  },
  {
    n: "03",
    title: "It writes like a top closer",
    body: "Every email is anchored to a real signal at that company. No templates, no spray-and-pray. Under 110 words, one clear ask.",
  },
  {
    n: "04",
    title: "It never sleeps",
    body: "Follow-ups, reply handling, meeting booking. Your calendar fills while you build the product.",
  },
];

const COMPARISON = [
  { label: "Cost per year", human: "$80,000 + commission", quota: "$5,988" },
  { label: "Prospects researched / day", human: "~25", quota: "2,800+" },
  { label: "Ramp time", human: "3–6 months", quota: "4 minutes" },
  { label: "Works weekends", human: "No", quota: "Always" },
  { label: "Quits after 11 months", human: "Usually", quota: "Never" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-xl font-bold">
            Quota<span className="text-[#b8f53d]">.</span>
          </span>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="/demo"
              className="bg-[#b8f53d] text-[#0b0f0e] font-semibold px-5 py-2 rounded-xl hover:bg-[#cdff66] transition-colors"
            >
              Try the live demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono-ui text-xs text-[#b8f53d] uppercase tracking-[0.25em] mb-6">
            The autonomous revenue agent
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] max-w-4xl mb-8">
            Your next sales hire isn&apos;t a person.{" "}
            <span className="text-white/35">It&apos;s an agent that never misses quota.</span>
          </h1>
          <p className="text-lg text-white/55 max-w-2xl leading-relaxed mb-10">
            Quota researches thousands of prospects a day, detects who&apos;s ready
            to buy, and writes outreach that sounds like your best rep on their
            best day — for 7% of the cost of hiring one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/demo"
              className="bg-[#b8f53d] text-[#0b0f0e] font-semibold px-8 py-4 rounded-xl text-center hover:bg-[#cdff66] transition-colors"
            >
              Watch it work — live demo
            </Link>
            <Link
              href="/pricing"
              className="border border-white/20 text-white/80 px-8 py-4 rounded-xl text-center hover:bg-white/5 transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Terminal strip */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto bg-white/[0.03] border border-white/10 rounded-2xl p-6 font-mono-ui text-sm">
          <p className="text-white/30 mb-3">$ quota run --mission &quot;fill my pipeline&quot;</p>
          <p className="text-white/60">› scanned 2,847 companies in 4.2s</p>
          <p className="text-white/60">› 12 high-intent prospects found</p>
          <p className="text-white/60">› 12 signal-anchored emails drafted</p>
          <p className="text-[#b8f53d]">✓ 3 meetings booked this week. agent still running.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-12">
            Hiring is the old paradigm. <span className="text-white/35">Deploying is the new one.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-mono-ui text-[#b8f53d] text-sm mb-3">{s.n}</p>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-12">
            One agent. <span className="text-white/35">An entire outbound team&apos;s output.</span>
          </h2>
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/[0.04] px-6 py-4 font-mono-ui text-xs uppercase tracking-widest text-white/40">
              <span />
              <span>Human SDR</span>
              <span className="text-[#b8f53d]">Quota</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 ? "bg-white/[0.02]" : ""}`}
              >
                <span className="text-white/50">{row.label}</span>
                <span className="text-white/70">{row.human}</span>
                <span className="text-[#b8f53d] font-semibold">{row.quota}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Stop renting humans for robot work.
          </h2>
          <p className="text-white/50 text-lg mb-10">
            Deploy your revenue agent in the next five minutes. It will be
            prospecting before you finish your coffee.
          </p>
          <Link
            href="/demo"
            className="inline-block bg-[#b8f53d] text-[#0b0f0e] font-semibold px-10 py-4 rounded-xl hover:bg-[#cdff66] transition-colors"
          >
            Deploy Quota →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center font-mono-ui text-xs text-white/25">
        © 2026 Quota. The agent is always running.
      </footer>
    </main>
  );
}
