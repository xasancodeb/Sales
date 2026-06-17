// ── Languages & translation ──────────────────────────────────────────
// One book, readable in every tongue. Posts are written in the author's
// language and translated into the reader's. Translations are fetched
// from the free MyMemory API and cached in localStorage forever, so each
// device translates each sentence at most once.

export type Lang = { code: string; label: string };

export const LANGS: Lang[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh-CN", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "tr", label: "Türkçe" },
  { code: "uz", label: "O'zbekcha" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "sw", label: "Kiswahili" },
];

const KEY_LANG = "one_lang";

export function getLang(): string {
  try {
    return localStorage.getItem(KEY_LANG) ?? "en";
  } catch { return "en"; }
}

export function setLang(code: string): void {
  try { localStorage.setItem(KEY_LANG, code); } catch {}
}

function cacheKey(from: string, to: string, text: string): string {
  // djb2 — short stable key so localStorage doesn't bloat
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return `one_tr_${from}|${to}|${h.toString(36)}`;
}

// Translate text; returns the original on any failure so the page never
// breaks when the network or the free API is unavailable.
export async function translate(text: string, from: string, to: string): Promise<string> {
  if (from === to || !text.trim()) return text;
  const key = cacheKey(from, to, text);
  try {
    const cached = localStorage.getItem(key);
    if (cached) return cached;
  } catch {}
  try {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      "&langpair=" + encodeURIComponent(from) + "|" + encodeURIComponent(to);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return text;
    const json = await res.json();
    const out: string | undefined = json?.responseData?.translatedText;
    if (!out || /MYMEMORY WARNING/i.test(out)) return text;
    try { localStorage.setItem(key, out); } catch {}
    return out;
  } catch {
    return text;
  }
}
