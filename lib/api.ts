// ── Backend client ────────────────────────────────────────────────────
// When NEXT_PUBLIC_API_URL points at a running ONE server (see server/),
// posts and votes are real and shared between everyone. When it is unset
// or unreachable, every call resolves to null and the app falls back to
// the deterministic simulation — the page never breaks.

import { Post } from "./one";

export type LivePost = Post & { votes: number; lang: string; createdAt: string };

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!API) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(API + path, { ...init, signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function fetchLiveFeed(day: number): Promise<LivePost[] | null> {
  return call<LivePost[]>(`/feed?day=${day}`);
}

export function submitLivePost(
  day: number,
  uid: string,
  text: string,
  lang: string,
): Promise<{ ok: boolean } | null> {
  return call(`/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ day, uid, text, lang }),
  });
}

export function registerProfile(
  uid: string,
  name: string,
  country: string,
  flag: string,
): Promise<{ ok: boolean } | null> {
  return call(`/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, name, country, flag }),
  });
}

export function sendLiveVote(
  day: number,
  uid: string,
  postId: string,
  dir: 1 | -1,
): Promise<{ ok: boolean } | null> {
  return call(`/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ day, uid, postId, dir }),
  });
}
