"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ColorSeason, PALETTES, SEASON_QUIZ, SeasonColor,
  determineSeason, loadProfile, saveSeason,
} from "@/lib/profile";

type Zone = "top" | "bottom" | "accessory" | "outerwear";
type SkinTone = "light" | "medium" | "dark" | "deep";

const SKIN_TONES: { id: SkinTone; label: string; hex: string }[] = [
  { id: "light",  label: "Fair / Light",  hex: "#FDDBB4" },
  { id: "medium", label: "Medium / Tan",   hex: "#C68642" },
  { id: "dark",   label: "Dark / Brown",   hex: "#8D5524" },
  { id: "deep",   label: "Deep / Ebony",   hex: "#4A2912" },
];

const ZONE_LABELS: { id: Zone; label: string; desc: string }[] = [
  { id: "top",       label: "Top",      desc: "Shirt, blouse, sweater" },
  { id: "outerwear", label: "Jacket",   desc: "Coat, blazer, cardigan" },
  { id: "bottom",    label: "Bottom",   desc: "Trousers, skirt, jeans" },
  { id: "accessory", label: "Accessory",desc: "Scarf, bag, shoes" },
];

// Simple SVG body
function Avatar({
  skin, top, bottom, accessory, outerwear,
}: {
  skin: string; top: string; bottom: string; accessory: string; outerwear: string;
}) {
  return (
    <svg viewBox="0 0 120 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 180 }}>
      {/* Head */}
      <ellipse cx="60" cy="34" rx="20" ry="24" fill={skin} />
      {/* Hair */}
      <ellipse cx="60" cy="16" rx="21" ry="14" fill="#3A2E2A" />
      {/* Neck */}
      <rect x="53" y="55" width="14" height="14" rx="4" fill={skin} />
      {/* Torso - Top garment */}
      <path d="M30 68 L14 86 L20 91 L34 76 L34 150 L86 150 L86 76 L100 91 L106 86 L90 68 L74 72 L60 74 L46 72 Z" fill={top} />
      {/* Collar gap */}
      <path d="M60 68 L52 74 L60 78 L68 74 Z" fill={skin} />
      {/* Outerwear / jacket open */}
      {outerwear !== "#FFFFFF" && (
        <>
          <path d="M34 76 L20 91 L14 86 L30 68 L34 76Z" fill={outerwear} opacity="0.85" />
          <path d="M86 76 L100 91 L106 86 L90 68 L86 76Z" fill={outerwear} opacity="0.85" />
          <path d="M34 76 L34 150 L44 150 L44 80Z" fill={outerwear} opacity="0.85" />
          <path d="M86 76 L86 150 L76 150 L76 80Z" fill={outerwear} opacity="0.85" />
        </>
      )}
      {/* Sleeves */}
      <rect x="12" y="86" width="22" height="58" rx="11" fill={top} />
      <rect x="86" y="86" width="22" height="58" rx="11" fill={top} />
      {/* Outerwear sleeves */}
      {outerwear !== "#FFFFFF" && (
        <>
          <rect x="12" y="86" width="22" height="58" rx="11" fill={outerwear} opacity="0.85" />
          <rect x="86" y="86" width="22" height="58" rx="11" fill={outerwear} opacity="0.85" />
        </>
      )}
      {/* Hands */}
      <ellipse cx="23" cy="148" rx="9" ry="7" fill={skin} />
      <ellipse cx="97" cy="148" rx="9" ry="7" fill={skin} />
      {/* Bottom garment */}
      <path d="M34 148 L34 240 L54 240 L60 200 L66 240 L86 240 L86 148Z" fill={bottom} />
      {/* Waistband detail */}
      <rect x="34" y="148" width="52" height="6" rx="2" fill="rgba(0,0,0,0.12)" />
      {/* Shoes */}
      <ellipse cx="44" cy="248" rx="14" ry="7" fill={accessory} />
      <ellipse cx="76" cy="248" rx="14" ry="7" fill={accessory} />
      {/* Accessory hint on wrist */}
      <rect x="14" y="140" width="18" height="4" rx="2" fill={accessory} opacity="0.8" />
    </svg>
  );
}

function HarmonyBadge({ colors }: { colors: string[] }) {
  // Simple check: are we mixing warm and cool in jarring ways?
  const hexToHue = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    const d = max - min;
    let h = 0;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return (h / 6) * 360;
  };

  const hues = colors.filter((c) => c && c !== "#FFFFFF").map(hexToHue);
  if (hues.length < 2) return null;

  const maxDiff = Math.max(...hues.map((h1) =>
    Math.max(...hues.map((h2) => {
      const d = Math.abs(h1 - h2);
      return Math.min(d, 360 - d);
    })),
  ));

  let label = "Harmonious";
  let color = "#2D7A4F";
  let bg = "#E8F5E9";

  if (maxDiff >= 150 && maxDiff <= 210) { label = "Complementary ✦ bold"; color = "#8B6914"; bg = "#FBF4E8"; }
  else if (maxDiff >= 110 && maxDiff < 150) { label = "Triadic ✦ vibrant"; color = "#1B4F72"; bg = "#E8F4FD"; }
  else if (maxDiff < 50) { label = "Tonal ✦ safe & clean"; color = "#2D7A4F"; bg = "#E8F5E9"; }
  else { label = "Contrasting ✦ bold"; color = "#7B241C"; bg = "#FDEDEC"; }

  return (
    <div className="mt-3 px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: bg, color }}>
      Colour harmony: {label}
    </div>
  );
}

// ── Quiz screen ────────────────────────────────────────────────────────
function SeasonQuiz({ onResult }: { onResult: (s: ColorSeason) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qIndex, setQIndex] = useState(0);

  const q = SEASON_QUIZ[qIndex];
  const progress = (qIndex / SEASON_QUIZ.length) * 100;

  const pick = (val: string) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (qIndex + 1 < SEASON_QUIZ.length) {
      setQIndex(qIndex + 1);
    } else {
      const season = determineSeason(next);
      saveSeason(season);
      onResult(season);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16 fade-up">
      <Link href="/" className="serif font-bold text-xl tracking-tight block mb-10">StyleUp</Link>
      {/* Progress */}
      <div className="h-1 rounded-full mb-8" style={{ background: "var(--border)" }}>
        <div className="h-1 rounded-full transition-all" style={{ width: `${progress}%`, background: "var(--accent)" }} />
      </div>
      <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>
        QUESTION {qIndex + 1} OF {SEASON_QUIZ.length}
      </p>
      <h2 className="serif text-2xl font-bold mb-6">{q.question}</h2>
      <div className="flex flex-col gap-3">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => pick(opt.value)}
            className="text-left p-4 rounded-xl transition-all"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
          >
            <p className="font-semibold text-sm mb-0.5">{opt.label}</p>
            <p className="text-xs" style={{ color: "var(--faint)" }}>{opt.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main fitting room ──────────────────────────────────────────────────
export default function FittingRoom() {
  const [season, setSeason] = useState<ColorSeason | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeTab, setActiveTab] = useState<"builder" | "palette" | "season">("builder");

  const [skinTone, setSkinTone] = useState<SkinTone>("medium");
  const [activeZone, setActiveZone] = useState<Zone>("top");
  const [outfit, setOutfit] = useState<Record<Zone, string>>({
    top: "#F5F0EB",
    outerwear: "#FFFFFF", // white means "off/none"
    bottom: "#2C2C2C",
    accessory: "#8B6914",
  });

  const [shared, setShared] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    if (p?.season) setSeason(p.season);
  }, []);

  if (showQuiz) {
    return (
      <SeasonQuiz
        onResult={(s) => {
          setSeason(s);
          setShowQuiz(false);
        }}
      />
    );
  }

  const palette = season ? PALETTES[season] : null;
  const skinHex = SKIN_TONES.find((s) => s.id === skinTone)?.hex ?? "#C68642";

  const setColor = (color: string) => {
    setOutfit((prev) => ({ ...prev, [activeZone]: color }));
  };

  const shareText = () => {
    const lines = [
      `StyleUp — My colour fitting room summary`,
      season ? `Colour season: ${PALETTES[season].name} (${PALETTES[season].tagline})` : "",
      ``,
      `My outfit palette:`,
      `  Top: ${outfit.top}`,
      outfit.outerwear !== "#FFFFFF" ? `  Jacket: ${outfit.outerwear}` : "",
      `  Bottom: ${outfit.bottom}`,
      `  Accessory / Shoes: ${outfit.accessory}`,
      season ? `\nRecommended palette colours: ${PALETTES[season].colors.slice(0, 6).map((c) => c.name).join(", ")}` : "",
    ].filter(Boolean).join("\n");
    navigator.clipboard?.writeText(lines).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    });
  };

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 pb-20">
      {/* Header */}
      <header className="pt-8 pb-6 flex items-center justify-between">
        <Link href="/" className="serif font-bold text-xl tracking-tight">StyleUp</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/explore" style={{ color: "var(--dim)" }}>Find stylists</Link>
          <Link href="/dashboard" style={{ color: "var(--dim)" }}>Dashboard</Link>
        </nav>
      </header>

      <h1 className="serif text-3xl font-bold mb-1">Colour Fitting Room</h1>
      <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
        Try colour combinations and discover your season — then share your palette with your stylist.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "var(--border)", width: "fit-content" }}>
        {(["builder", "palette", "season"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
            style={{
              background: activeTab === tab ? "var(--surface)" : "transparent",
              color: activeTab === tab ? "var(--ink)" : "var(--dim)",
              boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {tab === "builder" ? "Outfit builder" : tab === "palette" ? "My palette" : "Colour season"}
          </button>
        ))}
      </div>

      {/* ── Outfit Builder ── */}
      {activeTab === "builder" && (
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Avatar */}
          <div className="card p-6 flex flex-col items-center">
            <p className="text-xs font-semibold mb-3 self-start" style={{ color: "var(--faint)" }}>SKIN TONE</p>
            <div className="flex gap-2 mb-6 self-start">
              {SKIN_TONES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSkinTone(st.id)}
                  className="rounded-full transition-all"
                  title={st.label}
                  style={{
                    width: 28,
                    height: 28,
                    background: st.hex,
                    border: skinTone === st.id ? "3px solid var(--accent)" : "2px solid rgba(0,0,0,0.12)",
                  }}
                />
              ))}
            </div>

            <Avatar
              skin={skinHex}
              top={outfit.top}
              bottom={outfit.bottom}
              accessory={outfit.accessory}
              outerwear={outfit.outerwear}
            />

            <HarmonyBadge colors={[outfit.top, outfit.bottom, outfit.accessory]} />

            <button
              onClick={shareText}
              className="mt-4 text-sm font-semibold px-4 py-2 rounded-lg w-full transition-colors"
              style={{
                background: shared ? "#E8F5E9" : "var(--accent-bg)",
                color: shared ? "#2D7A4F" : "var(--accent)",
                border: "1px solid transparent",
              }}
            >
              {shared ? "Copied to clipboard ✓" : "Share palette with stylist"}
            </button>
          </div>

          {/* Controls */}
          <div>
            {/* Zone selector */}
            <div className="card p-4 mb-4">
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>SELECT ZONE TO COLOUR</p>
              <div className="grid grid-cols-2 gap-2">
                {ZONE_LABELS.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setActiveZone(z.id)}
                    className="text-left p-3 rounded-xl transition-all"
                    style={{
                      border: `2px solid ${activeZone === z.id ? "var(--accent)" : "var(--border)"}`,
                      background: activeZone === z.id ? "var(--accent-bg)" : "transparent",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-md mb-2"
                      style={{ background: outfit[z.id], border: "1px solid rgba(0,0,0,0.1)" }}
                    />
                    <p className="text-xs font-semibold">{z.label}</p>
                    <p className="text-xs" style={{ color: "var(--faint)" }}>{z.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker — season palette */}
            {palette ? (
              <div className="card p-4 mb-4">
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--faint)" }}>
                  YOUR {palette.name.toUpperCase()} PALETTE
                </p>
                <p className="text-xs mb-3" style={{ color: "var(--dim)" }}>{palette.tagline}</p>
                <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
                  {[...palette.colors, ...palette.neutrals].map((c: SeasonColor) => (
                    <button
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      title={c.name}
                      className="rounded-lg transition-transform hover:scale-110"
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        background: c.hex,
                        border: outfit[activeZone] === c.hex
                          ? "3px solid var(--accent)"
                          : "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-4 mb-4 text-center">
                <p className="text-sm font-semibold mb-2">Discover your colour season</p>
                <p className="text-xs mb-3" style={{ color: "var(--dim)" }}>
                  Take a 3-question quiz to unlock your personal palette
                </p>
                <button className="btn-accent" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => setShowQuiz(true)}>
                  Find my season →
                </button>
              </div>
            )}

            {/* Universal colour wheel */}
            <div className="card p-4">
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>ALL COLOURS</p>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(8, 1fr)" }}>
                {[
                  "#FFFFFF","#F5F5F5","#E0E0E0","#BDBDBD","#9E9E9E","#757575","#424242","#000000",
                  "#FFEBEE","#FFCDD2","#EF9A9A","#E57373","#EF5350","#F44336","#E53935","#B71C1C",
                  "#FFF3E0","#FFE0B2","#FFCC80","#FFB74D","#FFA726","#FF9800","#FB8C00","#E65100",
                  "#FFFDE7","#FFF9C4","#FFF176","#FFEE58","#FFEB3B","#FDD835","#F9A825","#F57F17",
                  "#E8F5E9","#C8E6C9","#A5D6A7","#81C784","#66BB6A","#4CAF50","#43A047","#1B5E20",
                  "#E3F2FD","#BBDEFB","#90CAF9","#64B5F6","#42A5F5","#2196F3","#1E88E5","#0D47A1",
                  "#EDE7F6","#D1C4E9","#B39DDB","#9575CD","#7E57C2","#673AB7","#5E35B1","#311B92",
                  "#FCE4EC","#F8BBD9","#F48FB1","#F06292","#EC407A","#E91E63","#D81B60","#880E4F",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="rounded transition-transform hover:scale-110"
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      background: c,
                      border: outfit[activeZone] === c
                        ? "2px solid var(--accent)"
                        : "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── My Palette tab ── */}
      {activeTab === "palette" && (
        <div>
          {!season ? (
            <div className="card p-8 text-center max-w-sm mx-auto">
              <p className="text-2xl mb-3">🎨</p>
              <p className="font-semibold text-lg mb-2">Find your colour season first</p>
              <p className="text-sm mb-5" style={{ color: "var(--dim)" }}>
                Take the 3-question quiz to discover which colours will make you look extraordinary.
              </p>
              <button className="btn-accent" onClick={() => setShowQuiz(true)}>Take the quiz →</button>
            </div>
          ) : (
            <div className="fade-up">
              <div className="card p-6 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: "var(--faint)" }}>YOUR COLOUR SEASON</p>
                    <h2 className="serif text-2xl font-bold">{palette!.name}</h2>
                    <p className="text-sm" style={{ color: "var(--accent)" }}>{palette!.tagline}</p>
                  </div>
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="text-xs ml-auto"
                    style={{ color: "var(--faint)" }}
                  >
                    Retake quiz
                  </button>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dim)" }}>{palette!.desc}</p>
              </div>

              <div className="card p-6 mb-4">
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>YOUR COLOURS</p>
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}>
                  {palette!.colors.map((c: SeasonColor) => (
                    <div key={c.hex} className="text-center">
                      <div
                        className="rounded-xl mb-1.5 mx-auto"
                        style={{ width: 64, height: 64, background: c.hex, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                      />
                      <p className="text-xs" style={{ color: "var(--dim)" }}>{c.name}</p>
                      <p className="text-xs mono" style={{ color: "var(--faint)" }}>{c.hex}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 mb-4">
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--faint)" }}>YOUR NEUTRALS</p>
                <div className="flex gap-4 flex-wrap">
                  {palette!.neutrals.map((c: SeasonColor) => (
                    <div key={c.hex} className="text-center">
                      <div
                        className="rounded-xl mb-1.5"
                        style={{ width: 56, height: 56, background: c.hex, border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                      />
                      <p className="text-xs" style={{ color: "var(--dim)" }}>{c.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 mb-6">
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--faint)" }}>COLOURS TO AVOID</p>
                <div className="flex flex-wrap gap-2">
                  {palette!.avoid.map((a) => (
                    <span key={a} className="text-xs px-3 py-1 rounded-full" style={{ background: "#FDEDEC", color: "#7B241C" }}>
                      ✕ {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Link href="/explore" className="btn-primary">
                  Find a stylist who knows my season →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Colour Season info tab ── */}
      {activeTab === "season" && (
        <div>
          <p className="text-sm mb-6" style={{ color: "var(--dim)" }}>
            Colour season theory groups people by their natural colouring — warm vs cool undertones, and light vs deep contrast. Wearing your season&apos;s colours makes your skin glow, your eyes pop, and the whole look feel effortless.
          </p>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
            {(["spring", "summer", "autumn", "winter"] as ColorSeason[]).map((s) => {
              const p = PALETTES[s];
              const isYours = season === s;
              return (
                <div
                  key={s}
                  className="card p-5"
                  style={{ border: isYours ? "2px solid var(--accent)" : undefined }}
                >
                  {isYours && (
                    <span className="chip mb-3 block w-fit">Your season</span>
                  )}
                  <h3 className="serif font-bold text-xl mb-0.5">{p.name}</h3>
                  <p className="text-xs mb-3" style={{ color: "var(--accent)" }}>{p.tagline}</p>
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {p.colors.slice(0, 6).map((c: SeasonColor) => (
                      <div
                        key={c.hex}
                        className="rounded-full"
                        style={{ width: 24, height: 24, background: c.hex, border: "1px solid rgba(0,0,0,0.08)" }}
                      />
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--dim)" }}>{p.desc.slice(0, 120)}…</p>
                  {!isYours && (
                    <button
                      onClick={() => { saveSeason(s); setSeason(s); }}
                      className="text-xs mt-3"
                      style={{ color: "var(--accent)" }}
                    >
                      This is me →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {!season && (
            <div className="text-center mt-8">
              <button className="btn-accent" onClick={() => setShowQuiz(true)}>
                Take the quiz to find my season →
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
