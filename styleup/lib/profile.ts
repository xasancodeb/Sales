// ── Client profile + colour season logic ──────────────────────────────

export interface ClientProfile {
  name: string;
  archetype: string;
  season: ColorSeason | null;
  joinedAt: string;
  quizDone: boolean;
}

export type ColorSeason = "spring" | "summer" | "autumn" | "winter";

const KEY = "styleup_profile";

export function loadProfile(): ClientProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ClientProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: ClientProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function saveSeason(season: ColorSeason) {
  const p = loadProfile();
  if (p) saveProfile({ ...p, season, quizDone: true });
}

// ── Colour season palettes ─────────────────────────────────────────────

export interface SeasonColor {
  hex: string;
  name: string;
}

export interface SeasonPalette {
  name: string;
  tagline: string;
  desc: string;
  colors: SeasonColor[];
  neutrals: SeasonColor[];
  avoid: string[];
}

export const PALETTES: Record<ColorSeason, SeasonPalette> = {
  spring: {
    name: "Spring",
    tagline: "Warm · Light · Clear",
    desc: "You carry warmth in your undertones and clarity in your colouring. Your best colours have warmth and brightness — peachy, golden, coral. Heavy, muted, or icy colours overwhelm you.",
    colors: [
      { hex: "#FF7F7F", name: "Coral" },
      { hex: "#FFDAB9", name: "Peach" },
      { hex: "#FFD700", name: "Golden Yellow" },
      { hex: "#FF9966", name: "Warm Orange" },
      { hex: "#98D8C8", name: "Light Aqua" },
      { hex: "#90EE90", name: "Light Green" },
      { hex: "#FF8C69", name: "Salmon" },
      { hex: "#FFF44F", name: "Buttercup" },
      { hex: "#7EC8A0", name: "Warm Mint" },
      { hex: "#FFCC99", name: "Apricot" },
      { hex: "#B5D5C5", name: "Soft Jade" },
      { hex: "#FFE5B4", name: "Warm Cream" },
    ],
    neutrals: [
      { hex: "#F5ECD7", name: "Warm White" },
      { hex: "#C4A882", name: "Camel" },
      { hex: "#D2B48C", name: "Tan" },
      { hex: "#8B7355", name: "Warm Brown" },
    ],
    avoid: ["Black", "Pure white", "Cool greys", "Icy blues"],
  },
  summer: {
    name: "Summer",
    tagline: "Cool · Light · Muted",
    desc: "Soft, cool, and delicate — your colouring harmonises with dusty, muted tones and cool hues. Too much contrast or warmth overwhelms your natural softness.",
    colors: [
      { hex: "#E6E6FA", name: "Lavender" },
      { hex: "#B0D4F1", name: "Powder Blue" },
      { hex: "#FFB6C1", name: "Soft Rose" },
      { hex: "#DDA0DD", name: "Plum Blossom" },
      { hex: "#AFEEEE", name: "Pale Turquoise" },
      { hex: "#C8A2C8", name: "Lilac" },
      { hex: "#ADD8E6", name: "Light Blue" },
      { hex: "#FFD1DC", name: "Pale Pink" },
      { hex: "#B0E0E6", name: "Powder Blue" },
      { hex: "#D8B4D8", name: "Soft Violet" },
      { hex: "#98B4B4", name: "Dusty Teal" },
      { hex: "#F5C6D0", name: "Blush" },
    ],
    neutrals: [
      { hex: "#F0F0F0", name: "Cool White" },
      { hex: "#C0C0C0", name: "Silver" },
      { hex: "#A0A0A8", name: "Cool Grey" },
      { hex: "#8B8BAA", name: "Blue-Grey" },
    ],
    avoid: ["Orange", "Warm yellows", "Earth tones", "Very dark or high-contrast looks"],
  },
  autumn: {
    name: "Autumn",
    tagline: "Warm · Deep · Muted",
    desc: "Rich earth tones, spice, and warmth define your palette. You're at your best in the colours of a forest in October — muted, deep, and complex.",
    colors: [
      { hex: "#B7410E", name: "Rust" },
      { hex: "#6B8E23", name: "Olive" },
      { hex: "#CC5500", name: "Burnt Orange" },
      { hex: "#E2725B", name: "Terracotta" },
      { hex: "#C19A6B", name: "Camel" },
      { hex: "#8B6914", name: "Dark Gold" },
      { hex: "#FFDB58", name: "Mustard" },
      { hex: "#7B3F00", name: "Chocolate" },
      { hex: "#8B0000", name: "Dark Red" },
      { hex: "#B87333", name: "Copper" },
      { hex: "#556B2F", name: "Dark Olive" },
      { hex: "#CD7F32", name: "Bronze" },
    ],
    neutrals: [
      { hex: "#F5ECD7", name: "Warm Ivory" },
      { hex: "#D2B48C", name: "Warm Tan" },
      { hex: "#8B7355", name: "Brown" },
      { hex: "#5C4033", name: "Dark Brown" },
    ],
    avoid: ["Black alone", "Cool pastels", "Icy tones", "Bright neon"],
  },
  winter: {
    name: "Winter",
    tagline: "Cool · Deep · Clear",
    desc: "High contrast, cool clarity, and depth define your best looks. You're built for bold: pure white, true black, and saturated jewel tones all amplify your striking colouring.",
    colors: [
      { hex: "#000080", name: "Navy" },
      { hex: "#50C878", name: "Emerald" },
      { hex: "#800020", name: "Burgundy" },
      { hex: "#4169E1", name: "Royal Blue" },
      { hex: "#DC143C", name: "Crimson" },
      { hex: "#0F52BA", name: "Sapphire" },
      { hex: "#228B22", name: "Forest Green" },
      { hex: "#4B0082", name: "Deep Purple" },
      { hex: "#008B8B", name: "Dark Teal" },
      { hex: "#C0392B", name: "True Red" },
      { hex: "#1B4F72", name: "Deep Blue" },
      { hex: "#27AE60", name: "Kelly Green" },
    ],
    neutrals: [
      { hex: "#FFFFFF", name: "Pure White" },
      { hex: "#F0F8FF", name: "Icy White" },
      { hex: "#1A1A1A", name: "True Black" },
      { hex: "#808080", name: "Cool Grey" },
    ],
    avoid: ["Orange", "Warm brown", "Olive", "Earth tones — they dull your clarity"],
  },
};

// Season quiz questions
export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; hint: string }[];
}

export const SEASON_QUIZ: QuizQuestion[] = [
  {
    id: "skin",
    question: "Your skin undertone is…",
    options: [
      { label: "Warm / golden", value: "warm", hint: "Gold jewellery always looks better than silver" },
      { label: "Cool / pink or blue", value: "cool", hint: "Silver jewellery suits me more than gold" },
      { label: "Neutral", value: "neutral", hint: "Both gold and silver work equally well" },
      { label: "Olive / mixed", value: "olive", hint: "I have a greenish or earthy undertone" },
    ],
  },
  {
    id: "depth",
    question: "Your natural colouring (hair, skin, eyes together) is…",
    options: [
      { label: "Light / delicate", value: "light", hint: "Blonde, light brown hair; pale skin; light eyes" },
      { label: "Medium", value: "medium", hint: "Medium brown hair; medium skin; hazel or brown eyes" },
      { label: "Deep / rich", value: "deep", hint: "Dark or black hair; deep skin; dark brown eyes" },
      { label: "High contrast", value: "high", hint: "Very light skin with very dark hair or vice versa" },
    ],
  },
  {
    id: "colours",
    question: "Which colour family makes you look most alive?",
    options: [
      { label: "Warm & bright", value: "warm-bright", hint: "Coral, peach, warm yellow, golden orange" },
      { label: "Cool & soft", value: "cool-soft", hint: "Lavender, powder blue, rose, dusty rose" },
      { label: "Warm & muted", value: "warm-muted", hint: "Rust, olive, terracotta, mustard, camel" },
      { label: "Cool & bold", value: "cool-bold", hint: "Navy, emerald, burgundy, icy white, black" },
    ],
  },
];

export function determineSeason(answers: Record<string, string>): ColorSeason {
  const skin = answers.skin;
  const depth = answers.depth;
  const colours = answers.colours;

  if (colours === "warm-bright") return "spring";
  if (colours === "cool-soft") return "summer";
  if (colours === "warm-muted") return "autumn";
  if (colours === "cool-bold") return "winter";

  if (skin === "warm" || skin === "olive") {
    return depth === "light" || depth === "medium" ? "spring" : "autumn";
  }
  if (skin === "cool") {
    return depth === "light" || depth === "medium" ? "summer" : "winter";
  }
  return depth === "deep" || depth === "high" ? "winter" : "summer";
}
