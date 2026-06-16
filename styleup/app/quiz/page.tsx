"use client";

import Link from "next/link";
import { useState } from "react";
import { ARCHETYPES } from "@/lib/data";

const QUESTIONS = [
  {
    id: "vibe",
    question: "When you picture your ideal wardrobe, what's the feeling?",
    options: [
      { label: "Calm and controlled", value: "classic", hint: "Everything has a place and works together" },
      { label: "Clean and quiet", value: "minimalist", hint: "Nothing unnecessary, nothing missing" },
      { label: "Expressive and free", value: "bohemian", hint: "Lots of texture, colour and personal history" },
      { label: "Sharp and intentional", value: "edgy", hint: "People notice. That's the point." },
    ],
  },
  {
    id: "colour",
    question: "Your natural approach to colour is…",
    options: [
      { label: "Neutral palette with one strong piece", value: "classic", hint: "Navy suit, white shirt, interesting tie" },
      { label: "Monochrome or tone-on-tone", value: "minimalist", hint: "Three shades of the same hue" },
      { label: "Bold and maximalist", value: "edgy", hint: "High contrast, unexpected combinations" },
      { label: "Warm, earthy, layered", value: "bohemian", hint: "Rust, camel, ivory, terracotta" },
    ],
  },
  {
    id: "shopping",
    question: "How do you currently feel about shopping for clothes?",
    options: [
      { label: "It stresses me out — nothing feels right", value: "classic", hint: "I need a strategy" },
      { label: "I buy too much and wear too little", value: "minimalist", hint: "I need to buy less, better" },
      { label: "I love it but my wardrobe is chaos", value: "bohemian", hint: "I need curation, not rules" },
      { label: "I know what I want — I just need harder-to-find pieces", value: "edgy", hint: "I need access, not advice" },
    ],
  },
  {
    id: "style",
    question: "Which icon's wardrobe would you most want?",
    options: [
      { label: "Cate Blanchett / Ryan Gosling", value: "classic", hint: "Precise, architectural, timeless" },
      { label: "Jenna Lyons / Pharrell Williams", value: "minimalist", hint: "Understated but distinctive" },
      { label: "Zendaya / Tyler the Creator", value: "edgy", hint: "Boundary-pushing, constantly evolving" },
      { label: "Florence Welch / Lenny Kravitz", value: "bohemian", hint: "Romantic, free, maximally expressive" },
    ],
  },
  {
    id: "budget",
    question: "Your approach to quality vs quantity:",
    options: [
      { label: "Few perfect pieces, cost is secondary", value: "classic", hint: "I'd rather own two great coats than ten average ones" },
      { label: "Everything must be essential and excellent", value: "minimalist", hint: "Quality at any price" },
      { label: "Mix of vintage, handmade, and high street", value: "bohemian", hint: "Story matters more than label" },
      { label: "I hunt for the right piece regardless of tier", value: "edgy", hint: "Sometimes it's thrifted, sometimes it's Balenciaga" },
    ],
  },
  {
    id: "goal",
    question: "What's the one thing you most want from a stylist?",
    options: [
      { label: "A wardrobe that always works", value: "classic", hint: "Zero bad decisions" },
      { label: "Permission to let go of what doesn't serve me", value: "minimalist", hint: "Help editing ruthlessly" },
      { label: "More colour, more personality, more me", value: "bohemian", hint: "Help being bolder" },
      { label: "A completely new direction", value: "edgy", hint: "A total transformation" },
    ],
  },
];

function tally(answers: string[]): string {
  const counts: Record<string, number> = {};
  for (const a of answers) counts[a] = (counts[a] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "classic";
}

export default function StyleQuiz() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");

  const pick = (val: string) => {
    const next = [...answers, val];
    setAnswers(next);
    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex(qIndex + 1);
    } else {
      setResult(tally(next));
      setStep("result");
    }
  };

  const archetype = ARCHETYPES.find((a) => a.id === result);

  if (step === "intro") {
    return (
      <main className="min-h-screen max-w-md mx-auto px-6 flex flex-col justify-center">
        <Link href="/" className="serif font-bold text-xl tracking-tight block mb-10">StyleUp</Link>
        <span className="chip mb-6 w-fit">6 questions · 2 minutes</span>
        <h1 className="serif text-3xl font-bold mb-4">What&apos;s your style archetype?</h1>
        <p className="text-sm leading-relaxed mb-10" style={{ color: "var(--dim)" }}>
          Your style isn&apos;t who you want to be — it&apos;s who you already are, dressed correctly. This quiz helps us match you with the right stylist and point you toward looks that feel like <em>you</em>, not a costume.
        </p>
        <button className="btn-primary" onClick={() => setStep("quiz")}>
          Start the quiz →
        </button>
        <Link href="/explore" className="text-sm text-center mt-4" style={{ color: "var(--faint)" }}>
          Skip — take me to stylists
        </Link>
      </main>
    );
  }

  if (step === "quiz") {
    const q = QUESTIONS[qIndex];
    const progress = ((qIndex) / QUESTIONS.length) * 100;
    return (
      <main className="min-h-screen max-w-md mx-auto px-6 py-16">
        <Link href="/" className="serif font-bold text-xl tracking-tight block mb-8">StyleUp</Link>
        {/* Progress */}
        <div className="h-1 rounded-full mb-8" style={{ background: "var(--border)" }}>
          <div
            className="h-1 rounded-full transition-all"
            style={{ width: `${progress}%`, background: "var(--accent)" }}
          />
        </div>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>
          {qIndex + 1} / {QUESTIONS.length}
        </p>
        <h2 className="serif text-2xl font-bold mb-8 fade-up">{q.question}</h2>
        <div className="flex flex-col gap-3 slide-in">
          {q.options.map((opt) => (
            <button
              key={opt.value + opt.label}
              onClick={() => pick(opt.value)}
              className="text-left p-4 rounded-2xl transition-all hover:shadow-sm"
              style={{
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <p className="font-semibold text-sm mb-0.5">{opt.label}</p>
              <p className="text-xs" style={{ color: "var(--faint)" }}>{opt.hint}</p>
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (step === "result" && archetype) {
    return (
      <main className="min-h-screen max-w-md mx-auto px-6 py-16 fade-up">
        <Link href="/" className="serif font-bold text-xl tracking-tight block mb-10">StyleUp</Link>
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--faint)" }}>YOUR STYLE ARCHETYPE</p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{archetype.icon}</span>
          <h1 className="serif text-3xl font-bold">{archetype.name}</h1>
        </div>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--dim)" }}>{archetype.desc}</p>

        {/* Palette */}
        <div className="card p-4 mb-6">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--faint)" }}>YOUR PALETTE DIRECTION</p>
          <div className="flex gap-2">
            {archetype.palette.map((c) => (
              <div
                key={c}
                className="flex-1 rounded-lg"
                style={{ height: 48, background: c, border: "1px solid rgba(0,0,0,0.06)" }}
              />
            ))}
          </div>
        </div>

        <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
          We&apos;ll match you with stylists who specialise in the {archetype.name} aesthetic.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={`/explore?specialty=${archetype.name}`}
            className="btn-primary text-center"
          >
            Find my {archetype.name} stylist →
          </Link>
          <Link href="/fitting" className="btn-secondary text-center">
            Discover my colour season →
          </Link>
          <button
            onClick={() => { setStep("quiz"); setQIndex(0); setAnswers([]); }}
            className="text-sm text-center"
            style={{ color: "var(--faint)" }}
          >
            Retake the quiz
          </button>
        </div>
      </main>
    );
  }

  return null;
}
