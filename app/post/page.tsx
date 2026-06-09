"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { dayNumber, loadUserPost, saveUserPost, msUntilReset } from "@/lib/one";

const MAX = 300;

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

export default function PostPage() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [day, setDay] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    const existing = loadUserPost(d);
    if (existing) {
      setText(existing.text);
      setDone(true);
    } else {
      setTimeout(() => ref.current?.focus(), 150);
    }
  }, []);

  const submit = () => {
    const t = text.trim();
    if (t.length < 2 || t.length > MAX || done) return;
    saveUserPost(day, { text: t, postedAt: new Date().toISOString(), votes: 1 });
    setDone(true);
  };

  if (done) {
    return (
      <main className="min-h-screen max-w-md mx-auto px-6 flex flex-col justify-center">
        <div
          className="rounded-2xl px-6 py-5 mb-6"
          style={{ background: "#fff", border: "1px solid var(--border)" }}
        >
          <p className="text-lg leading-relaxed mb-2 font-serif">{text}</p>
          <p className="text-xs" style={{ color: "var(--accent)" }}>
            your voice is on the world&apos;s page now
          </p>
        </div>
        <p className="text-xs mb-10" style={{ color: "var(--faint)" }}>
          everyone gets one — yours renews in <Countdown />
        </p>
        <Link href="/" className="text-sm" style={{ color: "var(--accent)" }}>
          ← read today&apos;s page
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-md mx-auto px-6 flex flex-col justify-center">
      <p className="font-serif text-3xl font-bold mb-2">Your one post today.</p>
      <p className="text-sm mb-10" style={{ color: "var(--dim)" }}>
        Same as every person on Earth — one voice, one shot, all equal.
      </p>

      <div
        className="rounded-2xl px-5 py-4 mb-6"
        style={{ background: "#fff", border: "1px solid var(--border)" }}
      >
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you want the world to read?"
          rows={4}
          maxLength={MAX}
          className="w-full bg-transparent text-lg leading-relaxed resize-none focus:outline-none"
          style={{ color: "var(--ink)", caretColor: "var(--accent)" }}
        />
        <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="text-xs" style={{ color: "var(--faint)" }}>
            {MAX - text.length} characters left
          </span>
          <span className="text-xs" style={{ color: "var(--faint)" }}>
            no edits · no deletes
          </span>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={text.trim().length < 2}
        className="w-full py-3.5 rounded-2xl text-base font-semibold transition-opacity disabled:opacity-30"
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Add my voice
      </button>
    </main>
  );
}
