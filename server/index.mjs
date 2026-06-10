// ── ONE backend ───────────────────────────────────────────────────────
// Real posts and votes, shared between everyone. Zero dependencies —
// plain Node http and a JSON file on disk. Run with:  npm run server
// Point the site at it by building with NEXT_PUBLIC_API_URL=<this url>.
//
// Rules enforced here mirror the product:
//   · one post per person per day (by uid), max 300 chars, no edits
//   · one vote per person per post, toggle to undo
//   · the feed resets at midnight UTC — each day is its own page

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 8787);
const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), "data.json");
const MAX_LEN = 300;

// posts[day] = [post], votes[day][uid][postId] = 1|-1, users[uid] = profile
let db = { posts: {}, votes: {}, users: {} };
try {
  db = JSON.parse(fs.readFileSync(DATA, "utf8"));
} catch {}

let flushTimer = null;
function flush() {
  clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    fs.writeFile(DATA, JSON.stringify(db), () => {});
  }, 250);
}

function clean(text) {
  return text.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

function voteTotal(day, postId) {
  const dayVotes = db.votes[day] ?? {};
  let total = 0;
  for (const uid of Object.keys(dayVotes)) total += dayVotes[uid][postId] ?? 0;
  return total;
}

function json(res, code, body) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 10_000) reject(new Error("too large"));
    });
    req.on("end", () => {
      try { resolve(JSON.parse(raw)); } catch { reject(new Error("bad json")); }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") return json(res, 204, {});

  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/feed") {
    const day = Number(url.searchParams.get("day"));
    if (!Number.isInteger(day) || day < 1) return json(res, 400, { error: "bad day" });
    const posts = (db.posts[day] ?? [])
      .map((p) => ({ ...p, votes: 1 + voteTotal(day, p.id) }))
      .sort((a, b) => b.votes - a.votes);
    return json(res, 200, posts);
  }

  if (req.method === "POST" && url.pathname === "/register") {
    let body;
    try { body = await readBody(req); } catch { return json(res, 400, { error: "bad body" }); }
    const { uid, name, country, flag } = body;
    if (typeof uid !== "string" || !uid || typeof name !== "string" || !name.trim())
      return json(res, 400, { error: "bad request" });
    db.users ??= {};
    db.users[uid] = {
      name: clean(String(name)).slice(0, 40),
      country: typeof country === "string" ? country.slice(0, 40) : "Earth",
      flag: typeof flag === "string" ? flag.slice(0, 8) : "🌍",
      joinedAt: db.users[uid]?.joinedAt ?? new Date().toISOString(),
    };
    flush();
    return json(res, 200, { ok: true });
  }

  if (req.method === "POST" && url.pathname === "/post") {
    let body;
    try { body = await readBody(req); } catch { return json(res, 400, { error: "bad body" }); }
    const { day, uid, lang } = body;
    const text = clean(String(body.text ?? ""));
    if (!Number.isInteger(day) || day < 1 || typeof uid !== "string" || !uid)
      return json(res, 400, { error: "bad request" });
    if (text.length < 2 || text.length > MAX_LEN)
      return json(res, 400, { error: "bad length" });
    db.posts[day] ??= [];
    if (db.posts[day].some((p) => p.uid === uid))
      return json(res, 409, { error: "one post per day" });
    const user = db.users?.[uid];
    db.posts[day].push({
      id: `u_${uid}_${day}`,
      uid,
      text,
      lang: typeof lang === "string" ? lang.slice(0, 8) : "en",
      author: user?.name ?? "Someone",
      country: user?.country ?? "Earth",
      flag: user?.flag ?? "🌍",
      baseVotes: 1,
      createdAt: new Date().toISOString(),
    });
    flush();
    return json(res, 200, { ok: true });
  }

  if (req.method === "POST" && url.pathname === "/vote") {
    let body;
    try { body = await readBody(req); } catch { return json(res, 400, { error: "bad body" }); }
    const { day, uid, postId, dir } = body;
    if (!Number.isInteger(day) || typeof uid !== "string" || !uid ||
        typeof postId !== "string" || (dir !== 1 && dir !== -1))
      return json(res, 400, { error: "bad request" });
    db.votes[day] ??= {};
    db.votes[day][uid] ??= {};
    if (db.votes[day][uid][postId] === dir) {
      delete db.votes[day][uid][postId]; // toggle off
    } else {
      db.votes[day][uid][postId] = dir;
    }
    flush();
    return json(res, 200, { ok: true });
  }

  json(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(`ONE backend listening on :${PORT} — data at ${DATA}`);
});
