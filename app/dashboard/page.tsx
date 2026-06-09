"use client";

import Link from "next/link";
import { useState } from "react";

const STATS = [
  { label: "Active streams", value: "7", delta: "+2 this week", up: true },
  { label: "Pipeline value", value: "$84,200", delta: "+$12k today", up: true },
  { label: "Actions taken today", value: "34", delta: "all autonomous", up: null },
  { label: "Avg match score", value: "82/100", delta: "↑ 4 pts vs last week", up: true },
];

const QUEUE = [
  {
    id: 1,
    company: "Meridian Labs",
    category: "Freelance",
    catColor: "#FFB800",
    contact: "Sasha Romero",
    potential: "$9,600",
    score: 91,
    signal: "Posted contract React dev role 3 days ago",
    status: "Pitch ready",
    statusColor: "#FFB800",
  },
  {
    id: 2,
    company: "Prescott Law Partners",
    category: "Automate",
    catColor: "#00D97E",
    contact: "Catherine Fox",
    potential: "$18,000",
    score: 88,
    signal: "Approved $60k budget for process automation",
    status: "Awaiting approval",
    statusColor: "#00E5FF",
  },
  {
    id: 3,
    company: "Crestline Health",
    category: "Freelance",
    catColor: "#FFB800",
    contact: "Dr. Nadia Vasek",
    potential: "$28,000",
    score: 85,
    signal: "RFP for rebrand posted to procurement portal",
    status: "Pitch sent",
    statusColor: "#A855F7",
  },
  {
    id: 4,
    company: "Summit Accounting",
    category: "Deal",
    catColor: "#00E5FF",
    contact: "Ben Hartley",
    potential: "$3,200/mo",
    score: 79,
    signal: "No referral partner. 240 SMB clients asking for software tools.",
    status: "Follow-up due",
    statusColor: "#FF6B35",
  },
  {
    id: 5,
    company: "Growth Engine Podcast",
    category: "Content",
    catColor: "#A855F7",
    contact: "David Carr",
    potential: "$4,500/ep",
    score: 74,
    signal: "6 Q3 sponsor slots open — 3 remain",
    status: "Research phase",
    statusColor: "rgba(255,255,255,0.3)",
  },
];

const ACTIVITY = [
  { time: "2 min ago", text: "Pitch sent to Sasha Romero at Meridian Labs", kind: "send" },
  { time: "18 min ago", text: "New signal: Drift Apparel — Meta ROAS collapsed, looking for expert", kind: "find" },
  { time: "1 hr ago", text: "Follow-up #2 sent to Catherine Fox at Prescott Law", kind: "send" },
  { time: "2 hr ago", text: "Meeting booked: Jordan Reyes, Cobalt Peak Software — Wed 2pm", kind: "win" },
  { time: "3 hr ago", text: "Scanned 2,847 new opportunities across 5 categories", kind: "scan" },
  { time: "5 hr ago", text: "Summit Accounting: new signal — partner confirmed referral program budget", kind: "find" },
  { time: "8 hr ago", text: "New deal: Bluebird Financial integration partnership queued", kind: "find" },
];

const STREAMS = [
  { name: "React freelance", category: "Freelance", color: "#FFB800", value: "$24,600", trend: "+18%", active: true },
  { name: "Process automation", category: "Automate", color: "#00D97E", value: "$18,000", trend: "+42%", active: true },
  { name: "B2B partnerships", category: "Deal", color: "#00E5FF", value: "$9,600/mo", trend: "+7%", active: true },
  { name: "Newsletter content", category: "Content", color: "#A855F7", value: "$8,400/mo", trend: "—", active: false },
  { name: "Podcast sponsorship", category: "Content", color: "#A855F7", value: "$4,500/ep", trend: "new", active: false },
];

const activityColor: Record<string, string> = {
  send: "#00E5FF",
  find: "#FFB800",
  win: "#00D97E",
  scan: "rgba(255,255,255,0.3)",
};

const activityIcon: Record<string, string> = {
  send: "→",
  find: "◆",
  win: "✓",
  scan: "›",
};

export default function Dashboard() {
  const [agentPaused, setAgentPaused] = useState(false);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-lg font-bold">AURUM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
            </Link>
            <div
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{
                background: agentPaused ? "rgba(255,255,255,0.05)" : "rgba(0,217,126,0.08)",
                border: `1px solid ${agentPaused ? "rgba(255,255,255,0.1)" : "rgba(0,217,126,0.2)"}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: agentPaused ? "rgba(255,255,255,0.3)" : "#00D97E" }}
              />
              <span className="font-mono-ui text-xs" style={{ color: agentPaused ? "var(--text-faint)" : "#00D97E" }}>
                {agentPaused ? "Agent paused" : "Agent running"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAgentPaused((p) => !p)}
              className="font-mono-ui text-xs px-4 py-2 rounded-lg transition-all"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-dim)",
                background: "transparent",
              }}
            >
              {agentPaused ? "Resume" : "Pause"} agent
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm"
              style={{ background: "#FFB800", color: "#06070e" }}
            >
              X
            </div>
          </div>
        </div>
      </header>

      {/* Demo banner */}
      <div
        className="px-6 py-2.5 text-center font-mono-ui text-xs"
        style={{ background: "rgba(255,184,0,0.06)", borderBottom: "1px solid rgba(255,184,0,0.15)", color: "#FFB800" }}
      >
        This is a preview dashboard. To run AURUM for real, <Link href="/demo" className="underline">try the live demo</Link> or <Link href="/pricing" className="underline">deploy your agent</Link>.
      </div>

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-56 shrink-0 py-6 px-3"
          style={{ borderRight: "1px solid var(--border)" }}
        >
          {[
            { label: "Dashboard", icon: "⬡", active: true },
            { label: "Opportunities", icon: "◆", active: false },
            { label: "Outreach", icon: "→", active: false },
            { label: "Streams", icon: "↗", active: false },
            { label: "Analytics", icon: "▲", active: false },
            { label: "Settings", icon: "⚙", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all mb-1"
              style={{
                background: item.active ? "rgba(255,184,0,0.08)" : "transparent",
                color: item.active ? "#FFB800" : "var(--text-dim)",
                border: item.active ? "1px solid rgba(255,184,0,0.2)" : "1px solid transparent",
              }}
            >
              <span className="font-mono-ui text-xs w-4">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <p className="text-xs mb-3" style={{ color: "var(--text-faint)" }}>
                  {stat.label}
                </p>
                <p className="font-display text-3xl font-bold mb-1">{stat.value}</p>
                <p
                  className="font-mono-ui text-xs"
                  style={{
                    color: stat.up === true ? "#00D97E" : stat.up === false ? "#FF6B6B" : "var(--text-faint)",
                  }}
                >
                  {stat.delta}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Opportunity queue */}
            <div
              className="xl:col-span-2 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <h2 className="font-semibold text-sm">Opportunity queue</h2>
                <span className="font-mono-ui text-xs"
                  style={{ color: "#FFB800" }}>
                  {QUEUE.length} active
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {QUEUE.map((opp) => (
                  <div key={opp.id} className="flex items-center gap-4 px-5 py-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-mono-ui text-xs font-bold"
                      style={{
                        background: "rgba(255,184,0,0.06)",
                        border: "1px solid rgba(255,184,0,0.15)",
                        color: "#FFB800",
                      }}
                    >
                      {opp.score}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm truncate">{opp.company}</p>
                        <span
                          className="font-mono-ui text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            color: opp.catColor,
                            background: `${opp.catColor}12`,
                            border: `1px solid ${opp.catColor}28`,
                          }}
                        >
                          {opp.category}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>
                        {opp.signal}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono-ui text-sm font-bold" style={{ color: "#00D97E" }}>
                        {opp.potential}
                      </p>
                      <p
                        className="font-mono-ui text-xs"
                        style={{ color: opp.statusColor }}
                      >
                        {opp.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {/* Active streams */}
              <div
                className="rounded-2xl"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <h2 className="font-semibold text-sm">Income streams</h2>
                </div>
                <div className="p-3 space-y-1">
                  {STREAMS.map((stream) => (
                    <div
                      key={stream.name}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{ background: stream.active ? "rgba(255,255,255,0.02)" : "transparent" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ background: stream.active ? stream.color : "rgba(255,255,255,0.15)" }}
                        />
                        <span className="text-xs" style={{ color: stream.active ? "var(--text)" : "var(--text-faint)" }}>
                          {stream.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono-ui text-xs font-bold"
                          style={{ color: stream.active ? "#FFB800" : "var(--text-faint)" }}>
                          {stream.value}
                        </span>
                        {stream.trend !== "—" && (
                          <span className="font-mono-ui text-xs ml-1.5"
                            style={{ color: stream.trend === "new" ? "#A855F7" : "#00D97E" }}>
                            {stream.trend}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div
                className="rounded-2xl flex-1"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div
                  className="flex items-center gap-2 px-5 py-4"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D97E] pulse-dot" />
                  <h2 className="font-semibold text-sm">Live agent log</h2>
                </div>
                <div className="p-4 space-y-4">
                  {ACTIVITY.map((item, i) => (
                    <div key={i} className="flex gap-3 text-xs">
                      <span
                        className="font-mono-ui shrink-0 mt-0.5"
                        style={{ color: activityColor[item.kind] }}
                      >
                        {activityIcon[item.kind]}
                      </span>
                      <div>
                        <p style={{ color: "rgba(255,255,255,0.75)" }}>{item.text}</p>
                        <p className="font-mono-ui mt-0.5" style={{ color: "var(--text-faint)" }}>
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
