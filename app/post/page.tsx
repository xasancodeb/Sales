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
  const [submitted, setSubmitted] = useState(false);
  const [alreadyPosted, setAlreadyPosted] = useState(false);
  const [day, setDay] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    const existing = loadUserPost(d);
    if (existing) {
      setText(existing.text);
      setAlreadyPosted(true);
    } else {
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
  }, []);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX || alreadyPosted) return;
    saveUserPost(day, { text: trimmed, postedAt: new Date().toISOString(), votes: 1 });
    setSubmitted(true);
  };

  const remaining = MAX - text.length;
  const canSubmit = text.trim().length >= 5 && remaining >= 0 && !alreadyPosted && !submitted;

  if (submitted || alreadyPosted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <Link href="/" className="font-serif text-4xl font-black tracking-tighter mb-12 block">ONE</Link>
        <p className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: "#00ccff" }}>
          {submitted ? "Your post is live." : "Already posted today."}
        </p>
        <p
          className="text-xl leading-relaxed max-w-lg mb-10 font-serif"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          &ldquo;{text}&rdquo;
        </p>
        <p className="font-mono text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
          Competing with {alreadyPosted && !submitted ? "the feed now" : "the world now"}.
          Next shot in <Countdown />.
        </p>
        <Link
          href="/"
          className="font-mono text-sm px-6 py-3 rounded-xl transition-all"
          style={{ background: "rgba(0,204,255,0.1)", border: "1px solid rgba(0,204,255,0.3)", color: "#00ccff" }}
        >
          ← See today's front page
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="font-serif text-3xl font-black tracking-tighter">ONE</Link>
          <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Resets in <Countdown />
          </p>
        </div>

        {/* The prompt */}
        <p
          className="font-serif text-3xl font-bold leading-snug mb-2"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          You have one post today.
        </p>
        <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
          It competes against everyone on Earth. Make it worth reading.
        </p>

        {/* Textarea */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ border: `1px solid ${text.length > 0 ? "rgba(0,204,255,0.3)" : "rgba(255,255,255,0.1)"}`, background: "var(--surface)", transition: "border-color 0.2s ease" }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Say something that matters."
            rows={6}
            maxLength={MAX + 10}
            className="w-full px-5 py-5 text-base resize-none focus:outline-none bg-transparent leading-relaxed"
            style={{ color: "#fff", caretColor: "#00ccff" }}
          />
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="font-mono text-xs" style={{ color: remaining < 0 ? "#ff5050" : remaining < 30 ? "rgba(255,184,0,0.8)" : "rgba(255,255,255,0.25)" }}>
              {remaining} left
            </span>
            <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              {MAX} max · no edits after posting
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="w-full py-4 rounded-xl font-bold text-base transition-all"
          style={{
            background: canSubmit ? "#00ccff" : "rgba(255,255,255,0.06)",
            color: canSubmit ? "#070809" : "rgba(255,255,255,0.2)",
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          Post to the world →
        </button>

        <p className="font-mono text-xs text-center mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
          One post. It doesn&apos;t delete. It doesn&apos;t edit. It just competes.
        </p>
      </div>
    </main>
  );
}
