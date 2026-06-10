"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Post, RankedPost, UserPost, VoteMap,
  castVote, dateDisplay, dayNumber, deliveredTo, deviceId,
  feedForDay, heardStats, loadProfile, loadUserPost, loadVotes,
  msUntilReset, simulatedPostersToday, surpriseRank,
  touchStreak, voiceForYou, winnerForDay,
} from "@/lib/one";
import { LANGS, getLang, setLang, translate } from "@/lib/lang";
import { fetchLiveFeed, sendLiveVote } from "@/lib/api";

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
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [day, setDay] = useState(0);
  const [date, setDate] = useState("");
  const [feed, setFeed] = useState<RankedPost[]>([]);
  const [userPost, setUserPost] = useState<UserPost | null>(null);
  const [votes, setVotes] = useState<VoteMap>({});
  const [postersToday, setPostersToday] = useState("");
  const [yesterday, setYesterday] = useState<RankedPost | null>(null);
  const [copied, setCopied] = useState(false);

  // reward layer
  const [streak, setStreak] = useState(0);
  const [heard, setHeard] = useState<{ readers: number; countries: number } | null>(null);
  const [receiver, setReceiver] = useState<Post | null>(null);
  const [forYou, setForYou] = useState<Post | null>(null);
  const [surprise, setSurprise] = useState<number | null>(null);

  // translation
  const [lang, setLangState] = useState("en");
  const [trans, setTrans] = useState<Record<string, string>>({});
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (!loadProfile()) {
      router.replace("/welcome");
      return;
    }
    const d = dayNumber();
    setDay(d);
    setDate(dateDisplay());
    setFeed(feedForDay(d));
    setUserPost(loadUserPost(d));
    setVotes(loadVotes(d));
    setPostersToday(simulatedPostersToday(d));
    if (d > 1) setYesterday(winnerForDay(d - 1));
    setStreak(touchStreak(d).count);
    setReceiver(deliveredTo(d));
    setForYou(voiceForYou(d));
    setSurprise(surpriseRank(d));
    setLangState(getLang());
    setReady(true);

    // live backend: merge real voices into today's page when available
    fetchLiveFeed(d).then((live) => {
      if (!live || live.length === 0) return;
      setFeed((sim) => {
        const merged = [...sim, ...live.map((p) => ({ ...p, rank: 0 }))]
          .sort((a, b) => b.votes - a.votes)
          .map((p, i) => ({ ...p, rank: i + 1 }));
        return merged;
      });
    });
  }, [router]);

  // "your voice was heard" — recompute every 2.5s so the number visibly
  // climbs while the page is open
  useEffect(() => {
    if (!userPost) { setHeard(null); return; }
    const update = () => setHeard(heardStats(day, userPost.postedAt));
    update();
    const t = setInterval(update, 2500);
    return () => clearInterval(t);
  }, [userPost, day]);

  // translate the page into the reader's language, post by post
  useEffect(() => {
    if (lang === "en") { setTrans({}); return; }
    const targets: { key: string; text: string; from: string }[] = [
      ...feed.map((p) => ({ key: p.id, text: p.text, from: "en" })),
      ...(yesterday ? [{ key: "y_" + yesterday.id, text: yesterday.text, from: "en" }] : []),
      ...(forYou ? [{ key: "fy_" + forYou.id, text: forYou.text, from: "en" }] : []),
    ];
    if (targets.length === 0) return;
    let alive = true;
    (async () => {
      const out: Record<string, string> = {};
      for (const t of targets) {
        const translated = await translate(t.text, t.from, lang);
        if (!alive) return;
        if (translated !== t.text) {
          out[t.key] = translated;
          setTrans({ ...out });
        }
      }
    })();
    return () => { alive = false; };
  }, [lang, feed, yesterday, forYou]);

  const txt = (key: string, original: string) =>
    (!showOriginal && trans[key]) || original;

  const pickLang = (code: string) => {
    setLang(code);
    setLangState(code);
    setShowOriginal(false);
  };

  const vote = (postId: string, dir: 1 | -1) => {
    setVotes({ ...castVote(day, postId, dir) });
    sendLiveVote(day, deviceId(), postId, dir); // fire-and-forget when live
  };

  const effectiveVotes = (p: RankedPost) => {
    const v = votes[p.id];
    return p.votes + (v === 1 ? 1 : v === -1 ? -1 : 0);
  };

  const translatedCount = useMemo(() => Object.keys(trans).length, [trans]);

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
        <p className="text-xs mb-1" style={{ color: "var(--faint)" }}>
          {postersToday} voices today · new page in <Countdown />
        </p>
        {streak > 1 && (
          <p className="text-xs mb-2" style={{ color: "var(--gold)" }}>
            you&apos;ve opened the world&apos;s page {streak} days in a row
          </p>
        )}
        <nav className="flex justify-center items-center gap-5 text-xs mt-2">
          <Link href="/days" style={{ color: "var(--accent)" }}>Book of Days</Link>
          <Link href="/me" style={{ color: "var(--dim)" }}>you</Link>
          <Link href="/about" style={{ color: "var(--dim)" }}>What is this?</Link>
          <select
            value={lang}
            onChange={(e) => pickLang(e.target.value)}
            className="bg-transparent text-xs cursor-pointer focus:outline-none"
            style={{ color: "var(--dim)", border: "1px solid var(--border)", borderRadius: 8, padding: "2px 6px" }}
            aria-label="Read in your language"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </nav>
        {lang !== "en" && translatedCount > 0 && (
          <button
            onClick={() => setShowOriginal((s) => !s)}
            className="text-xs mt-2"
            style={{ color: "var(--faint)" }}
          >
            {showOriginal ? "show translation" : "page translated · show original"}
          </button>
        )}
      </header>

      {/* Yesterday's page */}
      {yesterday && (
        <Link
          href="/days"
          className="block mt-6 rounded-2xl px-5 py-4 transition-shadow hover:shadow-sm"
          style={{ background: "#fff", border: "1px solid var(--border)" }}
        >
          <p className="text-xs mb-2" style={{ color: "var(--gold)" }}>
            ★ Yesterday, the world chose this
          </p>
          <p className="font-serif text-base leading-relaxed mb-1.5">
            {txt("y_" + yesterday.id, yesterday.text)}
          </p>
          <p className="text-xs" style={{ color: "var(--faint)" }}>
            {yesterday.flag} {yesterday.author} · {yesterday.country} · now page {day - 1} of the Book of Days
          </p>
        </Link>
      )}

      {/* Your post / write */}
      <div className="py-8" style={{ borderBottom: "1px solid var(--border)" }}>
        {userPost ? (
          <div
            className="rounded-2xl px-5 py-4"
            style={{ background: "#fff", border: "1px solid var(--border)" }}
          >
            <p className="text-base leading-relaxed mb-2">{userPost.text}</p>
            {heard && (
              <p className="text-xs mb-1.5" style={{ color: "var(--ink)" }}>
                heard by{" "}
                <span className="font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
                  {heard.readers.toLocaleString()}
                </span>{" "}
                people in{" "}
                <span className="font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
                  {heard.countries}
                </span>{" "}
                countries so far
              </p>
            )}
            {surprise !== null && (
              <p className="text-xs mb-1.5" style={{ color: "var(--gold)" }}>
                ★ your voice is in the top {surprise}% today
              </p>
            )}
            {receiver && (
              <p className="text-xs mb-1.5" style={{ color: "var(--dim)" }}>
                it reached {receiver.author} in {receiver.country} {receiver.flag} — a stranger
                you&apos;ll never meet read your words today
              </p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "var(--accent)" }}>
                your voice today · #{userRank} of {postersToday}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    `"${userPost.text}"\n\n— my one post today, on the world's shared page · one.earth day ${day}`,
                  ).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }).catch(() => {});
                }}
                className="text-xs"
                style={{ color: copied ? "var(--gold)" : "var(--faint)" }}
              >
                {copied ? "copied ✓" : "share"}
              </button>
            </div>
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

      {/* Delivered only to you */}
      {forYou && (
        <div className="py-7" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="text-xs mb-2.5" style={{ color: "var(--accent)" }}>
            ✉ delivered only to you today — no one else on Earth received this voice
          </p>
          <p className="font-serif text-base leading-relaxed mb-2">
            {txt("fy_" + forYou.id, forYou.text)}
          </p>
          <p className="text-xs" style={{ color: "var(--faint)" }}>
            {forYou.flag} {forYou.author} · {forYou.country}
          </p>
        </div>
      )}

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
                {txt(post.id, post.text)}
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
