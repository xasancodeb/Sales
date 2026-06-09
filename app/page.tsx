"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DayResult,
  QuestionResult,
  dayNumber,
  dateKey,
  msUntilNextRound,
  questionsForDay,
  scoreDay,
  shareText,
} from "@/lib/hivemind";

type Phase = "intro" | "self" | "predict" | "reveal" | "results";

const STORAGE_KEY = "hivemind_history_v1";

type History = Record<string, DayResult>;

function loadHistory(): History {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveHistory(h: History) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
}

function computeStreak(history: History, today: string): number {
  let streak = 0;
  const d = new Date(today + "T00:00:00Z");
  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (history[key]) {
      streak++;
      d.setUTCDate(d.getUTCDate() - 1);
    } else break;
  }
  return streak;
}

function Countdown() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    setMs(msUntilNextRound());
    const t = setInterval(() => setMs(msUntilNextRound()), 1000);
    return () => clearInterval(t);
  }, []);
  if (ms === null) return <span className="font-mono-ui">--:--:--</span>;
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="font-mono-ui tabular-nums">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

function Bar({
  label,
  pct,
  isMajority,
  isSelf,
  isPrediction,
  delay,
}: {
  label: string;
  pct: number;
  isMajority: boolean;
  isSelf: boolean;
  isPrediction: boolean;
  delay: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold">{label}</span>
          {isMajority && (
            <span className="tag" style={{ color: "#FFE600", borderColor: "rgba(255,230,0,0.4)", background: "rgba(255,230,0,0.08)" }}>
              THE HIVE
            </span>
          )}
          {isSelf && (
            <span className="tag" style={{ color: "#7DF9FF", borderColor: "rgba(125,249,255,0.4)", background: "rgba(125,249,255,0.07)" }}>
              YOU
            </span>
          )}
          {isPrediction && (
            <span className="tag" style={{ color: "#FF6EC7", borderColor: "rgba(255,110,199,0.4)", background: "rgba(255,110,199,0.07)" }}>
              YOUR CALL
            </span>
          )}
        </div>
        <span className="font-mono-ui text-sm font-bold tabular-nums" style={{ color: isMajority ? "#FFE600" : "rgba(255,255,255,0.5)" }}>
          {pct}%
        </span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${width}%`,
            background: isMajority
              ? "linear-gradient(90deg, #FFE600, #FFB800)"
              : "rgba(255,255,255,0.22)",
          }}
        />
      </div>
    </div>
  );
}

export default function Hivemind() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [selfAnswers, setSelfAnswers] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [result, setResult] = useState<DayResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  const day = useMemo(() => dayNumber(), []);
  const today = useMemo(() => dateKey(), []);
  const round = useMemo(() => questionsForDay(day), [day]);

  // On load: if already played today, jump straight to results.
  useEffect(() => {
    const history = loadHistory();
    setStreak(computeStreak(history, today));
    if (history[today]) {
      setResult(history[today]);
      setPhase("results");
    }
    setReady(true);
  }, [today]);

  const finishRound = useCallback(
    (selves: number[], preds: number[]) => {
      const results: QuestionResult[] = round.map((r, i) => {
        const majority = r.dist.indexOf(Math.max(...r.dist));
        return {
          questionId: r.question.id,
          self: selves[i],
          prediction: preds[i],
          dist: r.dist,
          majority,
          correct: preds[i] === majority,
        };
      });
      const dayResult = scoreDay(day, today, results);
      const history = loadHistory();
      history[today] = dayResult;
      saveHistory(history);
      setResult(dayResult);
      setStreak(computeStreak(history, today));
      setPhase("results");
    },
    [round, day, today],
  );

  const pickSelf = (i: number) => {
    setSelfAnswers((a) => [...a, i]);
    setPhase("predict");
  };

  const pickPrediction = (i: number) => {
    setPredictions((p) => [...p, i]);
    setPhase("reveal");
  };

  const nextQuestion = () => {
    if (qIndex + 1 >= round.length) {
      finishRound(selfAnswers, predictions);
    } else {
      setQIndex((i) => i + 1);
      setPhase("self");
    }
  };

  const copyShare = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(shareText(result) + "\nhivemind.game");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  const current = round[qIndex];
  const currentResult =
    phase === "reveal"
      ? {
          self: selfAnswers[qIndex],
          prediction: predictions[qIndex],
          majority: current.dist.indexOf(Math.max(...current.dist)),
        }
      : null;

  if (!ready) return <main className="min-h-screen" />;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="px-5 py-4 flex items-center justify-between max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-black tracking-tight">
            HIVE<span style={{ color: "#FFE600" }}>MIND</span>
          </span>
          <span className="font-mono-ui text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            #{day}
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono-ui text-xs">
          {streak > 0 && (
            <span style={{ color: "#FF6B35" }}>🔥 {streak}</span>
          )}
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            <Countdown />
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-5 pb-16">
        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div className="fade-up text-center">
            <p className="font-mono-ui text-xs tracking-[0.3em] mb-6" style={{ color: "#FFE600" }}>
              ONE ROUND A DAY · THE WHOLE WORLD PLAYS THE SAME ONE
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-black leading-[0.95] mb-6">
              Do you know what{" "}
              <span style={{ color: "#FFE600" }}>everyone</span> is thinking?
            </h1>
            <p className="text-base leading-relaxed mb-10 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              5 questions. First you answer for yourself. Then you predict what
              most people said. You don&apos;t win by being right —{" "}
              <span style={{ color: "#fff" }}>you win by reading the hive.</span>
            </p>
            <button onClick={() => setPhase("self")} className="btn-primary">
              Enter the hive →
            </button>
            <p className="font-mono-ui text-xs mt-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              Round #{day} closes in <Countdown />
            </p>
          </div>
        )}

        {/* ── PROGRESS DOTS ── */}
        {(phase === "self" || phase === "predict" || phase === "reveal") && (
          <div className="flex justify-center gap-2 mb-8">
            {round.map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background:
                    i < qIndex
                      ? "#FFE600"
                      : i === qIndex
                        ? "rgba(255,230,0,0.9)"
                        : "rgba(255,255,255,0.12)",
                  transform: i === qIndex ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>
        )}

        {/* ── SELF ── */}
        {phase === "self" && (
          <div key={`self-${qIndex}`} className="fade-up">
            <p className="font-mono-ui text-xs tracking-[0.25em] mb-4 text-center" style={{ color: "#7DF9FF" }}>
              STEP 1 — YOUR ANSWER
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-center leading-tight mb-10">
              {current.question.text}
            </h2>
            <div className="space-y-3">
              {current.question.options.map((opt, i) => (
                <button key={i} onClick={() => pickSelf(i)} className="btn-option">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PREDICT ── */}
        {phase === "predict" && (
          <div key={`predict-${qIndex}`} className="fade-up">
            <p className="font-mono-ui text-xs tracking-[0.25em] mb-4 text-center" style={{ color: "#FF6EC7" }}>
              STEP 2 — READ THE HIVE
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-center leading-tight mb-3">
              What did <span style={{ color: "#FFE600" }}>most people</span> say?
            </h2>
            <p className="text-center text-sm mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
              &ldquo;{current.question.text}&rdquo;
            </p>
            <div className="space-y-3">
              {current.question.options.map((opt, i) => (
                <button key={i} onClick={() => pickPrediction(i)} className="btn-option btn-option-pink">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── REVEAL ── */}
        {phase === "reveal" && currentResult && (
          <div key={`reveal-${qIndex}`} className="fade-up">
            <p
              className="font-display text-4xl font-black text-center mb-2"
              style={{ color: currentResult.prediction === currentResult.majority ? "#FFE600" : "rgba(255,255,255,0.4)" }}
            >
              {currentResult.prediction === currentResult.majority ? "YOU READ THE HIVE" : "THE HIVE WENT ELSEWHERE"}
            </p>
            <p className="text-center text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
              &ldquo;{current.question.text}&rdquo;
            </p>
            <div className="card p-5 mb-4">
              {current.question.options.map((opt, i) => (
                <Bar
                  key={i}
                  label={opt}
                  pct={current.dist[i]}
                  isMajority={i === currentResult.majority}
                  isSelf={i === currentResult.self}
                  isPrediction={i === currentResult.prediction}
                  delay={i * 150}
                />
              ))}
            </div>
            <p className="text-center text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              {current.dist[currentResult.self] >= 50
                ? `${current.dist[currentResult.self]}% of the hive thinks like you.`
                : `Only ${current.dist[currentResult.self]}% of the hive agrees with you. Interesting.`}
            </p>
            <button onClick={nextQuestion} className="btn-primary w-full">
              {qIndex + 1 >= round.length ? "See who you are →" : "Next →"}
            </button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase === "results" && result && (
          <div className="fade-up text-center">
            <p className="font-mono-ui text-xs tracking-[0.3em] mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
              HIVEMIND #{result.day} — YOUR READING
            </p>
            <div className="text-6xl mb-3">{result.persona.emoji}</div>
            <h2 className="font-display text-4xl sm:text-5xl font-black mb-3" style={{ color: "#FFE600" }}>
              {result.persona.name}
            </h2>
            <p className="text-base max-w-md mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {result.persona.line}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="card p-5">
                <p className="font-display text-4xl font-black mb-1">🧠 {result.read}/5</p>
                <p className="font-mono-ui text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  MIND READ
                </p>
              </div>
              <div className="card p-5">
                <p className="font-display text-4xl font-black mb-1">⚡ {result.sync}%</p>
                <p className="font-mono-ui text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  HIVE SYNC
                </p>
              </div>
            </div>

            <div className="card p-5 mb-8 text-left">
              <p className="font-mono-ui text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                YOUR ROUND
              </p>
              {result.results.map((r, i) => {
                const q = round.find((x) => x.question.id === r.questionId)?.question;
                return (
                  <div key={i} className="flex items-center gap-3 py-2 text-sm" style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <span>{r.correct ? "🟡" : "⚫"}</span>
                    <span className="flex-1 truncate" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {q?.text}
                    </span>
                    <span className="font-mono-ui text-xs shrink-0" style={{ color: r.correct ? "#FFE600" : "rgba(255,255,255,0.3)" }}>
                      {r.correct ? "read" : "missed"}
                    </span>
                  </div>
                );
              })}
            </div>

            <button onClick={copyShare} className="btn-primary w-full mb-3">
              {copied ? "Copied ✓" : "Share your reading"}
            </button>

            <div className="flex items-center justify-center gap-4 font-mono-ui text-xs mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              {streak > 0 && <span style={{ color: "#FF6B35" }}>🔥 {streak} day streak</span>}
              <span>
                Next round in <Countdown />
              </span>
            </div>
            <p className="font-mono-ui text-xs mt-8" style={{ color: "rgba(255,255,255,0.25)" }}>
              One round a day. Come back tomorrow. The hive will be waiting.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
