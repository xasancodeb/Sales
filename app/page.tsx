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
  if (ms === null) return null;
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
    setVotes({ ...castVote(day, postId, dir) });
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
    <main className="min-h-screen max-w-md mx-auto px-6 pb-20">

      {/* Header */}
      <header className="pt-12 pb-2 text-center">
        <h1 className="font-serif text-4xl font-black tracking-tight mb-1">ONE</h1>
        <p className="text-sm mb-1" style={{ color: "var(--dim)" }}>
          The world&apos;s shared page · {date}
        </p>
        <p className="text-xs" style={{ color: "var(--faint)" }}>
          {postersToday} voices today · new page in <Countdown />
        </p>
      </header>

      {/* Your post / write */}
      <div className="py-8" style={{ borderBottom: "1px solid var(--border)" }}>
        {userPost ? (
          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: "#fff", border: "1px solid var(--border)" }}
          >
            <p className="text-base leading-relaxed mb-1.5">{userPost.text}</p>
            <p className="text-xs" style={{ color: "var(--accent)" }}>
              your voice today · #{userRank} of {postersToday}
            </p>
          </div>
        ) : (
          <Link
            href="/post"
            className="block rounded-2xl px-5 py-4 text-base transition-shadow hover:shadow-sm"
            style={{ background: "#fff", border: "1px solid var(--border)", color: "var(--dim)" }}
          >
            Add your voice today — one post, same as everyone{" "}
            <span style={{ color: "var(--accent)" }}>→</span>
          </Link>
        )}
      </div>

      {/* Feed */}
      <div>
        {feed.map((post, i) => {
          const v = votes[post.id];
          const isFirst = i === 0;
          return (
            <article
              key={post.id}
              className="py-7"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <p
                className="leading-relaxed mb-2.5"
                style={{
                  fontSize: isFirst ? "1.25rem" : "1rem",
                  fontFamily: isFirst ? "Georgia, serif" : "inherit",
                }}
              >
                {post.text}
              </p>
              <div className="flex items-center gap-2.5 text-xs" style={{ color: "var(--faint)" }}>
                <span style={{ color: isFirst ? "var(--gold)" : "var(--faint)", fontWeight: isFirst ? 700 : 400 }}>
                  {isFirst ? "★ today's voice" : post.rank}
                </span>
                <span style={{ color: "var(--dim)" }}>
                  {post.flag} {post.author} · {post.country}
                </span>
                <span className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => vote(post.id, 1)}
                    className="px-1.5 py-0.5 rounded-md transition-colors"
                    style={{
                      color: v === 1 ? "#fff" : "var(--faint)",
                      background: v === 1 ? "var(--accent)" : "transparent",
                    }}
                  >
                    ▲
                  </button>
                  <span style={{ color: v === 1 ? "var(--accent)" : v === -1 ? "var(--heart)" : "var(--dim)" }}>
                    {fmt(effectiveVotes(post))}
                  </span>
                  <button
                    onClick={() => vote(post.id, -1)}
                    className="px-1.5 py-0.5 rounded-md transition-colors"
                    style={{
                      color: v === -1 ? "#fff" : "var(--faint)",
                      background: v === -1 ? "var(--heart)" : "transparent",
                    }}
                  >
                    ▼
                  </button>
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-xs text-center pt-12" style={{ color: "var(--faint)" }}>
        Tomorrow the page is blank again. Everyone starts equal. <Countdown />
      </p>
    </main>
  );
}
