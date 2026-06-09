"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";

type ScoredLead = {
  id: string;
  company: string;
  domain: string;
  contact: string;
  title: string;
  industry: string;
  employees: number;
  signals: string[];
  score: number;
  reasons: string[];
  email: { subject: string; body: string };
};

type FeedItem = { id: number; text: string; kind: "scan" | "find" | "write" | "done" };

const SCAN_STEPS: { text: string; kind: FeedItem["kind"]; delay: number }[] = [
  { text: "Parsing your offer and ideal customer profile…", kind: "scan", delay: 400 },
  { text: "Scanning 2,847 companies across 12 industries…", kind: "scan", delay: 900 },
  { text: "Cross-referencing hiring data, funding events, and tech-stack changes…", kind: "scan", delay: 1100 },
  { text: "Detecting buying signals: job posts, exec statements, product gaps…", kind: "find", delay: 1000 },
  { text: "Ranking prospects by intent score…", kind: "find", delay: 800 },
  { text: "Writing personalized outreach for top prospects…", kind: "write", delay: 700 },
];

export default function Demo() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [running, setRunning] = useState(false);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [leads, setLeads] = useState<ScoredLead[] | null>(null);
  const [engine, setEngine] = useState<"claude" | "local" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openLead, setOpenLead] = useState<string | null>(null);
  const feedId = useRef(0);

  const pushFeed = useCallback((text: string, kind: FeedItem["kind"]) => {
    feedId.current += 1;
    setFeed((f) => [...f, { id: feedId.current, text, kind }]);
  }, []);

  const run = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setError(null);
    setLeads(null);
    setEngine(null);
    setFeed([]);
    setOpenLead(null);

    const request = fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, audience }),
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
        pushFeed(
          `Done. ${data.leads.length} high-intent prospects identified, outreach drafted.`,
          "done",
        );
        setLeads(data.leads);
        setEngine(data.engine);
        setOpenLead(data.leads[0]?.id ?? null);
      }
    } catch {
      setError("Network error — try again.");
      setFeed([]);
    } finally {
      setRunning(false);
    }
  }, [product, audience, running, pushFeed]);

  return (
    <main className="min-h-screen">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold">
            Quota<span className="text-[#b8f53d]">.</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <span className="font-mono-ui text-xs text-[#b8f53d] border border-[#b8f53d]/30 px-3 py-1 rounded-full">
              LIVE DEMO
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold mb-2">Put the agent to work.</h1>
        <p className="text-white/50 mb-10 max-w-2xl">
          Tell Quota what you sell and who buys it. It will hunt the prospect
          universe, score intent, and write the outreach — in front of you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="space-y-4">
            <div>
              <label className="block font-mono-ui text-xs text-white/40 uppercase tracking-widest mb-2">
                What do you sell?
              </label>
              <textarea
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                rows={3}
                placeholder="e.g. An AI scheduling assistant that answers patient calls and books appointments 24/7"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none focus:border-[#b8f53d]/60 resize-none"
              />
            </div>
            <div>
              <label className="block font-mono-ui text-xs text-white/40 uppercase tracking-widest mb-2">
                Who buys it?
              </label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Clinics and healthcare practices with 50–500 staff"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:outline-none focus:border-[#b8f53d]/60"
              />
            </div>
            <button
              onClick={run}
              disabled={running || product.trim().length < 10}
              className="w-full bg-[#b8f53d] text-[#0b0f0e] font-semibold py-3.5 rounded-xl hover:bg-[#cdff66] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {running ? "Agent running…" : "Deploy the agent"}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {engine && (
              <p className="font-mono-ui text-xs text-white/30">
                engine: {engine === "claude" ? "Claude (live model)" : "local simulation — set ANTHROPIC_API_KEY for live AI writing"}
              </p>
            )}
          </div>

          {/* Activity feed */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 min-h-[260px]">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`w-2 h-2 rounded-full ${running ? "bg-[#b8f53d] pulse-dot" : "bg-white/20"}`}
              />
              <span className="font-mono-ui text-xs text-white/40 uppercase tracking-widest">
                Agent activity
              </span>
            </div>
            {feed.length === 0 ? (
              <p className="text-white/25 text-sm">Idle. Waiting for a mission.</p>
            ) : (
              <ul className="space-y-2.5">
                {feed.map((item) => (
                  <li key={item.id} className="feed-in flex gap-3 text-sm">
                    <span className="font-mono-ui text-xs mt-0.5 shrink-0 text-[#b8f53d]">
                      {item.kind === "done" ? "✓" : "›"}
                    </span>
                    <span className={item.kind === "done" ? "text-[#b8f53d]" : "text-white/70"}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Results */}
        {leads && (
          <div className="feed-in">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Pipeline, delivered.</h2>
              <span className="font-mono-ui text-xs text-white/40">
                {leads.length} prospects · avg intent {Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)}/100
              </span>
            </div>
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenLead(openLead === lead.id ? null : lead.id)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-[#b8f53d]/10 border border-[#b8f53d]/20 flex items-center justify-center font-mono-ui text-sm font-bold text-[#b8f53d]">
                        {lead.score}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {lead.company}{" "}
                          <span className="text-white/30 font-normal font-mono-ui text-xs">
                            {lead.domain}
                          </span>
                        </p>
                        <p className="text-sm text-white/50 truncate">
                          {lead.contact} · {lead.title} · {lead.industry} · {lead.employees} employees
                        </p>
                      </div>
                    </div>
                    <span className="text-white/30 shrink-0">{openLead === lead.id ? "−" : "+"}</span>
                  </button>

                  {openLead === lead.id && (
                    <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-4">
                      <div>
                        <p className="font-mono-ui text-xs text-white/40 uppercase tracking-widest mb-2">
                          Why the agent picked them
                        </p>
                        <ul className="space-y-1.5">
                          {lead.reasons.map((r, i) => (
                            <li key={i} className="text-sm text-white/70 flex gap-2">
                              <span className="text-[#b8f53d]">•</span> {r}
                            </li>
                          ))}
                        </ul>
                        <p className="font-mono-ui text-xs text-white/40 uppercase tracking-widest mt-4 mb-2">
                          Detected signals
                        </p>
                        <ul className="space-y-1.5">
                          {lead.signals.map((s, i) => (
                            <li key={i} className="text-sm text-white/50 flex gap-2">
                              <span className="text-white/25">◦</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-[#0b0f0e] border border-white/10 rounded-xl p-4">
                        <p className="font-mono-ui text-xs text-white/40 mb-1">
                          To: {lead.contact.toLowerCase().replace(/^dr\.\s+/, "").replace(" ", ".")}@{lead.domain}
                        </p>
                        <p className="font-mono-ui text-xs text-[#b8f53d] mb-3">
                          Subject: {lead.email.subject}
                        </p>
                        <p className="text-sm text-white/80 whitespace-pre-line leading-relaxed">
                          {lead.email.body}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 bg-[#b8f53d]/5 border border-[#b8f53d]/20 rounded-2xl p-6 text-center">
              <p className="font-display text-xl font-bold mb-1">
                This took the agent {engine === "claude" ? "one run" : "5 seconds"}. A human SDR takes a week.
              </p>
              <p className="text-white/50 text-sm mb-4">
                In production, Quota sends, follows up, handles replies, and books the meeting.
              </p>
              <Link
                href="/pricing"
                className="inline-block bg-[#b8f53d] text-[#0b0f0e] font-semibold px-8 py-3 rounded-xl hover:bg-[#cdff66] transition-colors"
              >
                Hire Quota →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
