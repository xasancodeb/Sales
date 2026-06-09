"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { ScoredOpportunity, OpportunityCategory } from "@/lib/opportunities";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/opportunities";

type FeedItem = {
  id: number;
  text: string;
  kind: "scan" | "find" | "score" | "write" | "done";
};

const SCAN_STEPS: { text: string; kind: FeedItem["kind"]; delay: number }[] = [
  { text: "Parsing your profile and skills…", kind: "scan", delay: 350 },
  { text: "Scanning 4,192 companies, job boards, and deal sources…", kind: "scan", delay: 900 },
  { text: "Cross-referencing funding events, hiring spikes, and exec signals…", kind: "scan", delay: 1100 },
  { text: "Detecting high-intent buying signals and partnership openings…", kind: "find", delay: 950 },
  { text: "Scoring each opportunity against your exact profile…", kind: "score", delay: 750 },
  { text: "Generating personalized pitches for top matches…", kind: "write", delay: 850 },
];

const kindColor: Record<FeedItem["kind"], string> = {
  scan: "rgba(255,255,255,0.4)",
  find: "#FFB800",
  score: "#00E5FF",
  write: "#A855F7",
  done: "#00D97E",
};

const kindPrefix: Record<FeedItem["kind"], string> = {
  scan: "›",
  find: "◆",
  score: "▸",
  write: "✦",
  done: "✓",
};

const PLACEHOLDERS = [
  "e.g. React and TypeScript developer with 5 years building SaaS products",
  "e.g. Brand designer — logos, design systems, Figma prototypes",
  "e.g. Content writer specializing in B2B finance and fintech",
  "e.g. Python developer, automation and data pipelines",
  "e.g. Performance marketer — Meta, Google, 4+ years managing paid budgets",
];

export default function Demo() {
  const [profile, setProfile] = useState("");
  const [goals, setGoals] = useState("");
  const [running, setRunning] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [opportunities, setOpportunities] = useState<ScoredOpportunity[] | null>(null);
  const [engine, setEngine] = useState<"claude" | "local" | null>(null);
  const [totalScanned, setTotalScanned] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pitch" | "strategy">("pitch");
  const feedId = useRef(0);

  const placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  const pushFeed = useCallback((text: string, kind: FeedItem["kind"]) => {
    feedId.current += 1;
    const id = feedId.current;
    setFeed((f) => [...f, { id, text, kind }]);
  }, []);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setError(null);
    setOpportunities(null);
    setEngine(null);
    setTotalScanned(null);
    setFeed([]);
    setOpenId(null);

    const request = fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, goals }),
    });

    for (const step of SCAN_STEPS) {
      pushFeed(step.text, step.kind);
      await new Promise((r) => setTimeout(r, step.delay));
    }

    try {
      const res = await request;
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setFeed([]);
      } else {
        const { opportunities: opps, engine: eng, totalScanned: ts } = data;
        pushFeed(
          `Done. ${opps.length} high-value opportunities found, pitches written. Engine: ${eng === "claude" ? "Claude (live AI)" : "local model"}.`,
          "done",
        );
        setOpportunities(opps);
        setEngine(eng);
        setTotalScanned(ts);
        setOpenId(opps[0]?.id ?? null);
      }
    } catch {
      setError("Network error — try again.");
      setFeed([]);
    } finally {
      setRunning(false);
    }
  }, [profile, goals, running, pushFeed]);

  const avgScore = opportunities
    ? Math.round(opportunities.reduce((s, o) => s + o.score, 0) / opportunities.length)
    : 0;

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">AURUM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm transition-colors"
              style={{ color: "var(--text-dim)" }}>Pricing</Link>
            <span
              className="font-mono-ui text-xs px-3 py-1 rounded-full"
              style={{ color: "#FFB800", border: "1px solid rgba(255,184,0,0.3)", background: "rgba(255,184,0,0.06)" }}
            >
              LIVE DEMO
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="font-mono-ui text-xs uppercase tracking-widest mb-4"
          style={{ color: "var(--text-faint)" }}>
          Autonomous opportunity scan
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
          Describe yourself. AURUM does the rest.
        </h1>
        <p className="max-w-2xl mb-10 text-base leading-relaxed"
          style={{ color: "var(--text-dim)" }}>
          Tell AURUM your skills and what you&apos;re after. It will scan thousands of
          opportunities, score each one against your profile, and write a personalized
          pitch — all in under 10 seconds.
        </p>

        {/* Input + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
          <div className="space-y-4">
            <div>
              <label className="block font-mono-ui text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--text-faint)" }}>
                Your skills / profile
              </label>
              <textarea
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                rows={4}
                placeholder={placeholder}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  caretColor: "#FFB800",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,184,0,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div>
              <label className="block font-mono-ui text-xs uppercase tracking-widest mb-2"
                style={{ color: "var(--text-faint)" }}>
                Goals (optional)
              </label>
              <input
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="e.g. $10k/mo side income, land a long-term retainer client"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  caretColor: "#FFB800",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,184,0,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <button
              onClick={run}
              disabled={running || profile.trim().length < 10}
              className="w-full font-semibold py-4 rounded-xl transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: running || profile.trim().length < 10 ? "var(--surface)" : "#FFB800",
                color: running || profile.trim().length < 10 ? "var(--text-dim)" : "#06070e",
                border: "1px solid rgba(255,184,0,0.3)",
              }}
            >
              {running ? "Agent running…" : "Deploy AURUM →"}
            </button>
            {error && (
              <p className="text-sm" style={{ color: "#FF6B6B" }}>{error}</p>
            )}
          </div>

          {/* Activity Feed */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              minHeight: "240px",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span
                className={`w-2 h-2 rounded-full ${running ? "pulse-dot" : ""}`}
                style={{ background: running ? "#FFB800" : "rgba(255,255,255,0.2)" }}
              />
              <span className="font-mono-ui text-xs uppercase tracking-widest"
                style={{ color: "var(--text-faint)" }}>
                Agent activity
              </span>
            </div>
            {feed.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-faint)" }}>
                Idle. Waiting for a mission.
              </p>
            ) : (
              <ul className="space-y-3">
                {feed.map((item, idx) => (
                  <li
                    key={item.id}
                    className="feed-in flex gap-3 text-sm"
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    <span
                      className="font-mono-ui text-xs mt-0.5 shrink-0"
                      style={{ color: kindColor[item.kind] }}
                    >
                      {kindPrefix[item.kind]}
                    </span>
                    <span style={{ color: item.kind === "done" ? "#00D97E" : "rgba(255,255,255,0.7)" }}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Results */}
        {opportunities && opportunities.length > 0 && (
          <div className="feed-in">
            {/* Header */}
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold mb-1">
                  Your opportunity queue.
                </h2>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>
                  {totalScanned?.toLocaleString()} sources scanned · {opportunities.length} high-intent matches ·{" "}
                  avg score {avgScore}/100
                </p>
              </div>
              <span
                className="font-mono-ui text-xs px-3 py-1.5 rounded-full hidden md:block"
                style={{
                  color: "#00D97E",
                  background: "rgba(0,217,126,0.08)",
                  border: "1px solid rgba(0,217,126,0.2)",
                }}
              >
                {engine === "claude" ? "Claude — live AI" : "local engine"}
              </span>
            </div>

            <div className="space-y-3">
              {opportunities.map((opp) => {
                const catColor = CATEGORY_COLORS[opp.category as OpportunityCategory];
                const isOpen = openId === opp.id;

                return (
                  <div
                    key={opp.id}
                    className="rounded-2xl overflow-hidden transition-all"
                    style={{
                      background: "var(--surface)",
                      border: `1px solid ${isOpen ? "rgba(255,184,0,0.25)" : "var(--border)"}`,
                    }}
                  >
                    {/* Row header */}
                    <button
                      onClick={() => {
                        setOpenId(isOpen ? null : opp.id);
                        setActiveTab("pitch");
                      }}
                      className="w-full px-5 py-4 flex items-center gap-4 text-left transition-colors"
                      style={{ background: isOpen ? "rgba(255,184,0,0.02)" : "transparent" }}
                    >
                      {/* Score badge */}
                      <div
                        className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-mono-ui text-sm font-bold"
                        style={{
                          background: "rgba(255,184,0,0.08)",
                          border: "1px solid rgba(255,184,0,0.2)",
                          color: "#FFB800",
                        }}
                      >
                        {opp.score}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-sm">{opp.company}</p>
                          <span
                            className="font-mono-ui text-xs px-2 py-0.5 rounded-full"
                            style={{
                              color: catColor,
                              background: `${catColor}14`,
                              border: `1px solid ${catColor}33`,
                            }}
                          >
                            {CATEGORY_LABELS[opp.category as OpportunityCategory]}
                          </span>
                        </div>
                        <p className="text-sm truncate" style={{ color: "var(--text-dim)" }}>
                          {opp.contact !== "Market Signal" && opp.contact !== "Market Intelligence"
                            ? `${opp.contact} · ${opp.title} · `
                            : ""}
                          {opp.description.slice(0, 80)}…
                        </p>
                      </div>

                      {/* Potential */}
                      <div className="shrink-0 text-right hidden sm:block">
                        <p className="font-mono-ui text-sm font-bold" style={{ color: "#00D97E" }}>
                          {opp.potential}
                        </p>
                        <p className="font-mono-ui text-xs" style={{ color: "var(--text-faint)" }}>
                          {opp.effort}
                        </p>
                      </div>

                      <span style={{ color: "var(--text-faint)" }} className="shrink-0 ml-2">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {/* Expanded panel */}
                    {isOpen && (
                      <div
                        className="px-5 pb-6"
                        style={{ borderTop: "1px solid var(--border)" }}
                      >
                        {/* Signals + reasons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 mb-5">
                          <div>
                            <p className="font-mono-ui text-xs uppercase tracking-widest mb-3"
                              style={{ color: "var(--text-faint)" }}>
                              Why AURUM flagged this
                            </p>
                            <ul className="space-y-2">
                              {opp.reasons.map((r, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span style={{ color: "#FFB800" }}>•</span>
                                  <span style={{ color: "var(--text-dim)" }}>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-mono-ui text-xs uppercase tracking-widest mb-3"
                              style={{ color: "var(--text-faint)" }}>
                              Live signals detected
                            </p>
                            <ul className="space-y-2">
                              {opp.signals.map((s, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span style={{ color: "rgba(255,255,255,0.25)" }}>◦</span>
                                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 mb-4">
                          {(["pitch", "strategy"] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className="font-mono-ui text-xs px-4 py-2 rounded-lg transition-all capitalize"
                              style={{
                                background: activeTab === tab ? "rgba(255,184,0,0.1)" : "transparent",
                                color: activeTab === tab ? "#FFB800" : "var(--text-faint)",
                                border: `1px solid ${activeTab === tab ? "rgba(255,184,0,0.3)" : "transparent"}`,
                              }}
                            >
                              {tab === "pitch" ? "Pitch ready to send" : "Action strategy"}
                            </button>
                          ))}
                        </div>

                        {activeTab === "pitch" && (
                          <div
                            className="rounded-xl p-5"
                            style={{
                              background: "#06070e",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {opp.contact !== "Market Signal" && (
                              <p className="font-mono-ui text-xs mb-1"
                                style={{ color: "var(--text-faint)" }}>
                                To: {opp.contact.toLowerCase().replace(/^dr\.\s+/, "").replace(" ", ".")}@{opp.domain}
                              </p>
                            )}
                            <p className="font-mono-ui text-xs mb-4"
                              style={{ color: "#FFB800" }}>
                              Subject: {opp.pitch.subject}
                            </p>
                            <p className="text-sm leading-relaxed whitespace-pre-line"
                              style={{ color: "rgba(255,255,255,0.8)" }}>
                              {opp.pitch.body}
                            </p>
                          </div>
                        )}

                        {activeTab === "strategy" && (
                          <div className="space-y-3">
                            {opp.strategy.map((step, i) => (
                              <div
                                key={i}
                                className="flex gap-4 p-4 rounded-xl"
                                style={{
                                  background: "rgba(255,255,255,0.02)",
                                  border: "1px solid var(--border)",
                                }}
                              >
                                <span
                                  className="font-mono-ui text-xs font-bold shrink-0 mt-0.5"
                                  style={{ color: catColor }}
                                >
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="text-sm leading-relaxed"
                                  style={{ color: "var(--text-dim)" }}>
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Post-results CTA */}
            <div
              className="mt-12 rounded-2xl p-8 text-center"
              style={{
                background: "rgba(255,184,0,0.04)",
                border: "1px solid rgba(255,184,0,0.2)",
              }}
            >
              <h3 className="font-display text-2xl font-bold mb-2">
                AURUM ran this in under 10 seconds.
              </h3>
              <p className="mb-6 text-sm" style={{ color: "var(--text-dim)" }}>
                In production, it runs 24/7 — finding opportunities, executing outreach, booking
                calls, and reporting back while you focus on the work.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-xl text-sm transition-all"
                style={{ background: "#FFB800", color: "#06070e" }}
              >
                Deploy the full engine →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
