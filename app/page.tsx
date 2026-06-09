"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  RankedPost, UserPost, VoteMap,
  castVote, dateDisplay, dayNumber,
  feedForDay, loadUserPost, loadVotes,
  msUntilReset, simulatedPostersToday,
} from "@/lib/one";

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "k";
  return String(n);
}

function Countdown() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    setMs(msUntilReset());
    const t = setInterval(() => setMs(msUntilReset()), 1000);
    return () => clearInterval(t);
  }, []);
  if (ms === null) return <span className="font-mono">--:--:--</span>;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return <span className="font-mono tabular-nums">{pad(h)}:{pad(m)}:{pad(s)}</span>;
}

export default function Feed() {
  const [ready, setReady] = useState(false);
  const [day, setDay] = useState(0);
  const [date, setDate] = useState("");
  const [feed, setFeed] = useState<RankedPost[]>([]);
  const [userPost, setUserPost] = useState<UserPost | null>(null);
  const [votes, setVotes] = useState<VoteMap>({});
  const [postersToday, setPostersToday] = useState("");

  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    setDate(dateDisplay());
    setFeed(feedForDay(d));
    setUserPost(loadUserPost(d));
    setVotes(loadVotes(d));
    setPostersToday(simulatedPostersToday(d));
    setReady(true);
  }, []);

  const vote = (postId: string, dir: 1 | -1) => {
    const updated = castVote(day, postId, dir);
    setVotes({ ...updated });
  };

  const effectiveVotes = (p: RankedPost) => {
    const v = votes[p.id];
    return p.votes + (v === 1 ? 1 : v === -1 ? -1 : 0);
  };

  if (!ready) return <main className="min-h-screen" />;

  const userRank = userPost
    ? feed.filter((p) => effectiveVotes(p) > (userPost.votes ?? 1)).length + 1
    : null;

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 pb-24">

      {/* ── Masthead ── */}
      <header className="pt-10 pb-6" style={{ borderBottom: "1px solid var(--border-bright)" }}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-serif text-5xl font-black tracking-tighter leading-none mb-1">ONE</h1>
            <p className="font-mono text-xs" style={{ color: "var(--dim)" }}>{date}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ccff] pulse-live" />
              <span className="font-mono text-xs" style={{ color: "#00ccff" }}>LIVE</span>
            </div>
            <p className="font-mono text-xs" style={{ color: "var(--faint)" }}>
              Round #{day} · resets in <Countdown />
            </p>
          </div>
        </div>
        <p className="font-mono text-xs mt-4" style={{ color: "var(--faint)" }}>
          {postersToday} people posted today
        </p>
      </header>

      {/* ── Post CTA ── */}
      {!userPost ? (
        <div className="py-5 fade-up" style={{ borderBottom: "1px solid var(--border)" }}>
          <Link
            href="/post"
            className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all text-sm"
            style={{ background: "var(--surface)", border: "1px solid rgba(0,204,255,0.25)", color: "rgba(255,255,255,0.5)" }}
          >
            <span>What's on your mind today? You have one shot.</span>
            <span style={{ color: "#00ccff", fontSize: "1.1rem" }}>→</span>
          </Link>
        </div>
      ) : (
        <div className="py-5 fade-up" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="font-mono text-xs mb-3" style={{ color: "#00ccff" }}>
            YOUR POST TODAY · #{userRank} of {postersToday}
          </p>
          <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(0,204,255,0.05)", border: "1px solid rgba(0,204,255,0.2)", color: "rgba(255,255,255,0.8)" }}>
            {userPost.text}
          </div>
          <p className="font-mono text-xs mt-2" style={{ color: "var(--faint)" }}>
            Posted · Come back tomorrow for another shot.
          </p>
        </div>
      )}

      {/* ── Feed header ── */}
      <div className="py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--faint)" }}>
          Today's front page
        </span>
        <span className="font-mono text-xs" style={{ color: "var(--faint)" }}>
          votes
        </span>
      </div>

      {/* ── Posts ── */}
      <div>
        {feed.map((post, i) => {
          const voteDir = votes[post.id];
          const ev = effectiveVotes(post);
          const isFirst = i === 0;

          return (
            <article
              key={post.id}
              className="py-6 fade-up"
              style={{
                borderBottom: "1px solid var(--border)",
                animationDelay: `${i * 0.03}s`,
              }}
            >
              <div className="flex gap-4">
                {/* Rank */}
                <div className="shrink-0 w-7 text-right pt-0.5">
                  <span
                    className="font-mono text-sm"
                    style={{ color: isFirst ? "var(--gold)" : "var(--faint)", fontWeight: isFirst ? 700 : 400 }}
                  >
                    {post.rank}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="text-base">{post.flag}</span>
                    <span className="text-sm font-semibold">{post.author}</span>
                    <span className="font-mono text-xs" style={{ color: "var(--faint)" }}>
                      @{post.handle}
                    </span>
                    <span className="font-mono text-xs" style={{ color: "var(--faint)" }}>
                      · {post.country}
                    </span>
                    {isFirst && (
                      <span
                        className="font-mono text-xs px-2 py-0.5 rounded-full"
                        style={{ color: "var(--gold)", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)" }}
                      >
                        #1 TODAY
                      </span>
                    )}
                  </div>

                  <p
                    className="leading-relaxed"
                    style={{
                      fontSize: isFirst ? "1.15rem" : "0.95rem",
                      color: isFirst ? "#fff" : "rgba(255,255,255,0.85)",
                      fontFamily: isFirst ? "Georgia, serif" : "inherit",
                    }}
                  >
                    {post.text}
                  </p>
                </div>

                {/* Vote column */}
                <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                  <button
                    onClick={() => vote(post.id, 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                    style={{
                      background: voteDir === 1 ? "rgba(0,204,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${voteDir === 1 ? "rgba(0,204,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: voteDir === 1 ? "#00ccff" : "var(--faint)",
                    }}
                  >
                    ▲
                  </button>
                  <span className="font-mono text-xs" style={{ color: voteDir === 1 ? "#00ccff" : voteDir === -1 ? "rgba(255,80,80,0.8)" : "var(--dim)" }}>
                    {fmt(ev)}
                  </span>
                  <button
                    onClick={() => vote(post.id, -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all"
                    style={{
                      background: voteDir === -1 ? "rgba(255,80,80,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${voteDir === -1 ? "rgba(255,80,80,0.3)" : "rgba(255,255,255,0.08)"}`,
                      color: voteDir === -1 ? "rgba(255,80,80,0.9)" : "var(--faint)",
                    }}
                  >
                    ▼
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div className="pt-8 text-center">
        <p className="font-mono text-xs" style={{ color: "var(--faint)" }}>
          Feed resets in <Countdown /> — come back with something worth saying
        </p>
      </div>
    </main>
  );
}
