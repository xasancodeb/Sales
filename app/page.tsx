"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LIVE_FEED = [
  { text: "Scanning 4,192 companies for active buying signals…", kind: "scan" },
  { text: "High-intent signal: Meridian Labs posted a React contractor role 3 days ago", kind: "find" },
  { text: "Generating pitch for Sasha Romero, Head of Product — $9,600 opportunity", kind: "write" },
  { text: "$9,600 project locked. Pitch delivered in 7 seconds.", kind: "done" },
  { text: "Analyzing partnership landscape for B2B SaaS founders…", kind: "scan" },
  { text: "Summit Accounting — 240 SMB clients, no referral partner. High leverage.", kind: "find" },
  { text: "Revenue-share proposal drafted for Ben Hartley, Managing Director", kind: "write" },
  { text: "Content play found: Growth Engine Podcast — $4,500/episode sponsorship open", kind: "find" },
  { text: "Automation opportunity at Prescott Law — $18k, budget approved", kind: "find" },
  { text: "Drafting pitch for Catherine Fox, Managing Partner…", kind: "write" },
  { text: "3 high-intent signals detected in fintech sector this hour", kind: "scan" },
  { text: "$28,000 branding project at Crestline Health — RFP posted 2 days ago", kind: "find" },
];

const PILLARS = [
  {
    tag: "01 / SCAN",
    title: "Never miss a signal.",
    body: "AURUM monitors millions of job posts, funding announcements, exec statements, and forum threads every day — surfacing the exact moment a company is ready to spend.",
    color: "#FFB800",
  },
  {
    tag: "02 / SCORE",
    title: "Every opportunity ranked.",
    body: "Each signal is scored against your skills, goals, and track record. Only the highest-probability matches reach your queue.",
    color: "#00E5FF",
  },
  {
    tag: "03 / CREATE",
    title: "The pitch is already written.",
    body: "AURUM generates personalized pitches, proposals, and strategies anchored to the specific signal at each company. No templates. No filler.",
    color: "#A855F7",
  },
  {
    tag: "04 / ACT",
    title: "It moves without you.",
    body: "Outreach sent. Follow-ups scheduled. Meetings booked. AURUM executes the full loop while you focus on delivery — or sleep.",
    color: "#00D97E",
  },
  {
    tag: "05 / COMPOUND",
    title: "Gets smarter every day.",
    body: "Every reply, every conversion, every outcome feeds back into your personal model. AURUM learns exactly what creates income for you and doubles down.",
    color: "#FF6B35",
  },
];

const COMPARISON = [
  { label: "Opportunities scanned / day", old: "3–5 (manual)", aurum: "2,800+" },
  { label: "Time to write a pitch", old: "35–60 minutes", aurum: "9 seconds" },
  { label: "Follow-up consistency", old: "Often forgotten", aurum: "Never missed" },
  { label: "Active income streams", old: "1–2 at most", aurum: "Unlimited" },
  { label: "Works while you sleep", old: "No", aurum: "Always" },
  { label: "Monthly cost", old: "$0 but your time", aurum: "$97" },
];

const INCOME_TYPES = [
  { label: "Freelance projects", color: "#FFB800", ex: "$9,600 dev contract" },
  { label: "Business deals", color: "#00E5FF", ex: "$3,200/mo referral stream" },
  { label: "Content monetization", color: "#A855F7", ex: "$4,500/episode podcast" },
  { label: "Automation builds", color: "#00D97E", ex: "$35,000 integration project" },
  { label: "Market signals", color: "#FF6B35", ex: "$8,000/mo SaaS acquisition" },
];

function useAnimatedCounter(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef<number>(0);

  useEffect(() => {
    start.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return value;
}

function LiveFeed() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % LIVE_FEED.length);
        setVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const item = LIVE_FEED[index];

  const kindColor: Record<string, string> = {
    scan: "rgba(255,255,255,0.35)",
    find: "#FFB800",
    write: "#00E5FF",
    done: "#00D97E",
  };

  const kindPrefix: Record<string, string> = {
    scan: "›",
    find: "◆",
    write: "✦",
    done: "✓",
  };

  return (
    <div
      className="font-mono-ui text-xs flex items-start gap-2.5 transition-all duration-300"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(6px)" }}
    >
      <span style={{ color: kindColor[item.kind] }} className="shrink-0 mt-0.5">
        {kindPrefix[item.kind]}
      </span>
      <span style={{ color: item.kind === "done" ? "#00D97E" : "rgba(255,255,255,0.65)" }}>
        {item.text}
      </span>
    </div>
  );
}

export default function Home() {
  const oppCount = useAnimatedCounter(2_847_193, 2200);
  const incomeUnlocked = useAnimatedCounter(4_200_000, 2400);
  const agentsActive = useAnimatedCounter(2847, 1600);

  return (
    <main className="min-h-screen hero-glow">
      {/* ── Nav ── */}
      <nav
        style={{ borderBottom: "1px solid var(--border)" }}
        className="sticky top-0 z-50 backdrop-blur-md"
        // eslint-disable-next-line react/no-unknown-property
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight">AURUM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] pulse-dot" />
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm" style={{ color: "var(--text-dim)" }}>
            <a href="#pillars" className="hover:text-white transition-colors">How it works</a>
            <Link href="/demo" className="hover:text-white transition-colors">Live demo</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <Link
            href="/demo"
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: "#FFB800",
              color: "#06070e",
            }}
          >
            Deploy free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,184,0,0.08)", border: "1px solid rgba(255,184,0,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] pulse-dot" />
            <span className="font-mono-ui text-xs" style={{ color: "#FFB800" }}>
              AUTONOMOUS WEALTH ENGINE
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.0] mb-8 max-w-5xl">
            While you sleep,{" "}
            <span className="shimmer-gold">AURUM hunts.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
            style={{ color: "var(--text-dim)" }}>
            The first AI that autonomously scans the entire digital economy, finds income
            opportunities tailored to your exact skills, writes the pitch, and executes — without
            you lifting a finger. Set it up in 4 minutes. Collect opportunities forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all text-sm"
              style={{ background: "#FFB800", color: "#06070e" }}
            >
              See it work — live demo
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl transition-all text-sm"
              style={{ border: "1px solid var(--border)", color: "rgba(255,255,255,0.7)" }}
            >
              View pricing
            </Link>
          </div>

          {/* Live terminal */}
          <div
            className="rounded-2xl p-5 max-w-2xl gold-border-glow"
            style={{ background: "var(--surface)", border: "1px solid rgba(255,184,0,0.2)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFB800] pulse-dot" />
                <span className="font-mono-ui text-xs" style={{ color: "#FFB800" }}>
                  LIVE — {agentsActive.toLocaleString()} agents running
                </span>
              </div>
              <span className="font-mono-ui text-xs" style={{ color: "var(--text-faint)" }}>
                {oppCount.toLocaleString()} opportunities scanned today
              </span>
            </div>
            <div className="min-h-[28px]">
              <LiveFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section
        className="px-6 py-10"
        style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: `${(oppCount / 1_000_000).toFixed(1)}M`, label: "Opportunities found / month" },
            { value: `$${(incomeUnlocked / 1_000_000).toFixed(1)}M`, label: "Income unlocked / month" },
            { value: "94%", label: "Profile match accuracy" },
            { value: "4 min", label: "Average setup time" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-bold mb-1" style={{ color: "#FFB800" }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Income types ── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono-ui text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--text-faint)" }}>
            Not just sales. Every path to income.
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 max-w-3xl">
            One engine. Five income streams.
          </h2>
          <p className="max-w-xl mb-12 text-base leading-relaxed" style={{ color: "var(--text-dim)" }}>
            AURUM hunts across every category where your skills can create income —
            simultaneously, automatically, always.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INCOME_TYPES.map((t) => (
              <div
                key={t.label}
                className="rounded-2xl p-5 card-surface"
                style={{ borderLeft: `3px solid ${t.color}` }}
              >
                <p className="font-semibold text-sm mb-2">{t.label}</p>
                <p className="font-mono-ui text-xs" style={{ color: t.color }}>
                  e.g. {t.ex}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section
        id="pillars"
        className="px-6 py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="font-mono-ui text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--text-faint)" }}>
            How it works
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-16 max-w-2xl">
            Five loops. Running in parallel. Always.
          </h2>
          <div className="space-y-px">
            {PILLARS.map((p) => (
              <div
                key={p.tag}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div>
                  <p className="font-mono-ui text-xs font-bold" style={{ color: p.color }}>
                    {p.tag}
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">{p.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section
        className="px-6 py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            The old way costs you{" "}
            <span className="shimmer-gold">everything.</span>
          </h2>
          <p className="mb-12 max-w-xl text-base" style={{ color: "var(--text-dim)" }}>
            Every day without AURUM is a day spent not finding the deals that could change your year.
          </p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <div
              className="grid grid-cols-3 px-6 py-4 font-mono-ui text-xs uppercase tracking-widest"
              style={{
                background: "var(--surface)",
                color: "var(--text-faint)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span />
              <span>Without AURUM</span>
              <span style={{ color: "#FFB800" }}>With AURUM</span>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-3 px-6 py-4 text-sm"
                style={{ background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}
              >
                <span style={{ color: "var(--text-dim)" }}>{row.label}</span>
                <span style={{ color: "rgba(255,255,255,0.45)" }}>{row.old}</span>
                <span className="font-semibold" style={{ color: "#FFB800" }}>{row.aurum}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo CTA ── */}
      <section
        className="px-6 py-20"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-16 text-center"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255,184,0,0.1) 0%, rgba(255,184,0,0.02) 60%), var(--surface)",
              border: "1px solid rgba(255,184,0,0.2)",
            }}
          >
            <p className="font-mono-ui text-xs uppercase tracking-widest mb-6"
              style={{ color: "#FFB800" }}>
              Live demo — no signup required
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto">
              Tell it what you&apos;re good at. Watch it hunt.
            </h2>
            <p className="mb-10 max-w-xl mx-auto text-lg" style={{ color: "var(--text-dim)" }}>
              Enter your skills and AURUM will scan for real opportunities, score them by
              conversion probability, and write a personalized pitch — right in front of you.
              Takes 10 seconds.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 font-semibold px-10 py-5 rounded-xl text-lg transition-all"
              style={{ background: "#FFB800", color: "#06070e" }}
            >
              Deploy AURUM →
            </Link>
            <p className="mt-5 font-mono-ui text-xs" style={{ color: "var(--text-faint)" }}>
              First 14 days free. No credit card.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-10"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold">AURUM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
          </div>
          <p className="font-mono-ui text-xs" style={{ color: "var(--text-faint)" }}>
            The agent is always running. © 2026 AURUM.
          </p>
          <div className="flex gap-6 font-mono-ui text-xs" style={{ color: "var(--text-faint)" }}>
            <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
