// ── ONE — the planet's single feed ──────────────────────────────────
// Every person gets one post per day. The world votes what rises.
// All crowd data is deterministic (seeded by UTC day) so every device
// on Earth sees an identical ranked feed for that date.

export type Post = {
  id: string;
  author: string;
  handle: string;
  country: string;
  flag: string;
  text: string;
  baseVotes: number; // baseline vote magnitude
};

export type RankedPost = Post & {
  votes: number; // jittered from baseVotes
  rank: number;
};

export type UserPost = {
  text: string;
  postedAt: string; // ISO string
  votes: number;
  lang?: string; // language the author wrote in
};

export type VoteMap = Record<string, 1 | -1>; // id → direction

const EPOCH_UTC = Date.UTC(2026, 5, 1); // June 1 2026

export function dayNumber(now = new Date()): number {
  const utcToday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((utcToday - EPOCH_UTC) / 86_400_000) + 1;
}

export function dateDisplay(now = new Date()): string {
  return now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function msUntilReset(now = new Date()): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return next - now.getTime();
}

export function dateForDay(day: number): Date {
  return new Date(EPOCH_UTC + (day - 1) * 86_400_000);
}

export function dateDisplayForDay(day: number): string {
  return dateForDay(day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// The winning post of any past day — page N of the Book of Days.
// Never repeats the previous day's winner back to back.
export function winnerForDay(day: number): RankedPost {
  const feed = feedForDay(day);
  if (day > 1 && feed[0].id === feedForDay(day - 1)[0].id) {
    return feed[1];
  }
  return feed[0];
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// Returns 20 posts ranked by today's vote counts. Each day's votes are a
// strong random factor on the baseline, so the day's winner genuinely
// varies — the Book of Days reads like a real diary, not a rerun.
export function feedForDay(day: number): RankedPost[] {
  const rng = seeded(day * 31337 + 7);
  const pool = [...POSTS];
  // Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const ranked = pool
    .slice(0, 20)
    .map((p) => ({
      ...p,
      votes: Math.max(1, Math.round(p.baseVotes * (0.3 + rng() * 1.4))),
    }))
    .sort((a, b) => b.votes - a.votes)
    .map((p, i) => ({ ...p, rank: i + 1 }));
  return ranked;
}

export function simulatedPostersToday(day: number): string {
  const rng = seeded(day * 999);
  const n = 620_000_000 + Math.floor(rng() * 180_000_000);
  return n.toLocaleString("en-US");
}

// localStorage keys
const KEY_POST = (day: number) => `one_post_${day}`;
const KEY_VOTES = (day: number) => `one_votes_${day}`;

export function loadUserPost(day: number): UserPost | null {
  try {
    const raw = localStorage.getItem(KEY_POST(day));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveUserPost(day: number, post: UserPost): void {
  localStorage.setItem(KEY_POST(day), JSON.stringify(post));
}

export function loadVotes(day: number): VoteMap {
  try {
    return JSON.parse(localStorage.getItem(KEY_VOTES(day)) ?? "{}");
  } catch { return {}; }
}

export function castVote(day: number, postId: string, dir: 1 | -1): VoteMap {
  const votes = loadVotes(day);
  if (votes[postId] === dir) {
    delete votes[postId]; // toggle off
  } else {
    votes[postId] = dir;
  }
  localStorage.setItem(KEY_VOTES(day), JSON.stringify(votes));
  return votes;
}

// ── Identity, streaks & the reward loop ──────────────────────────────
// Everything below is the "your voice was heard" layer: each person gets
// a felt response every day even when they don't win — a live count of
// readers, a streak for showing up, one voice delivered only to them,
// and an occasional unannounced surprise. All deterministic per device.

const KEY_UID = "one_uid";
const KEY_STREAK = "one_streak";
const KEY_PROFILE = "one_profile";
const KEY_POSTED_DAYS = "one_posted_days";

// ── Account ───────────────────────────────────────────────────────────
// Everyone creates an identity before using ONE: a name and a country.
// That's the whole account — enough to own your posts, your streak and
// your lifetime stats. No email, no password, no friction.

export type Profile = {
  name: string;
  country: string;
  flag: string;
  joinedDay: number;
};

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveProfile(p: Profile): void {
  try { localStorage.setItem(KEY_PROFILE, JSON.stringify(p)); } catch {}
}

export function postedDays(): number[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_POSTED_DAYS) ?? "[]");
  } catch { return []; }
}

export function recordPostedDay(day: number): void {
  try {
    const days = postedDays();
    if (!days.includes(day)) {
      days.push(day);
      localStorage.setItem(KEY_POSTED_DAYS, JSON.stringify(days));
    }
  } catch {}
}

export type LifetimeStats = {
  posts: number;
  readers: number;
  countries: number;
  joinedDate: string;
  streak: number;
};

// Lifetime numbers that only ever go up — the account's accumulating
// value. Past days count at their full (end-of-day) reach; today counts
// at its current live reach.
export function lifetimeStats(today: number, profile: Profile): LifetimeStats {
  const days = postedDays();
  let readers = 0;
  const countrySet = new Set<number>();
  for (const d of days) {
    const rng = seeded(d * 7919 + (uidSeed() % 65536));
    const targetReaders = 1500 + Math.floor(rng() * 7800);
    const targetCountries = 12 + Math.floor(rng() * 56);
    if (d < today) {
      readers += targetReaders;
      countrySet.add(targetCountries);
    } else {
      const post = loadUserPost(d);
      if (post) {
        const live = heardStats(d, post.postedAt);
        readers += live.readers;
        countrySet.add(live.countries);
      }
    }
  }
  const countries = Math.min(195, countrySet.size === 0 ? 0 : Math.max(...countrySet));
  let streakCount = 0;
  try {
    const raw = localStorage.getItem(KEY_STREAK);
    if (raw) streakCount = JSON.parse(raw).count ?? 0;
  } catch {}
  return {
    posts: days.length,
    readers,
    countries,
    joinedDate: dateDisplayForDay(profile.joinedDay),
    streak: streakCount,
  };
}

// Countries for the account picker.
export const COUNTRIES: { name: string; flag: string }[] = [
  { name: "Afghanistan", flag: "🇦🇫" }, { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" }, { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Brazil", flag: "🇧🇷" }, { name: "Canada", flag: "🇨🇦" },
  { name: "Chile", flag: "🇨🇱" }, { name: "China", flag: "🇨🇳" },
  { name: "Colombia", flag: "🇨🇴" }, { name: "Egypt", flag: "🇪🇬" },
  { name: "Ethiopia", flag: "🇪🇹" }, { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" }, { name: "Ghana", flag: "🇬🇭" },
  { name: "Greece", flag: "🇬🇷" }, { name: "Hungary", flag: "🇭🇺" },
  { name: "India", flag: "🇮🇳" }, { name: "Indonesia", flag: "🇮🇩" },
  { name: "Iran", flag: "🇮🇷" }, { name: "Iraq", flag: "🇮🇶" },
  { name: "Ireland", flag: "🇮🇪" }, { name: "Israel", flag: "🇮🇱" },
  { name: "Italy", flag: "🇮🇹" }, { name: "Japan", flag: "🇯🇵" },
  { name: "Kazakhstan", flag: "🇰🇿" }, { name: "Kenya", flag: "🇰🇪" },
  { name: "Mexico", flag: "🇲🇽" }, { name: "Morocco", flag: "🇲🇦" },
  { name: "Netherlands", flag: "🇳🇱" }, { name: "New Zealand", flag: "🇳🇿" },
  { name: "Nigeria", flag: "🇳🇬" }, { name: "Norway", flag: "🇳🇴" },
  { name: "Pakistan", flag: "🇵🇰" }, { name: "Peru", flag: "🇵🇪" },
  { name: "Philippines", flag: "🇵🇭" }, { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" }, { name: "Romania", flag: "🇷🇴" },
  { name: "Russia", flag: "🇷🇺" }, { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Senegal", flag: "🇸🇳" }, { name: "Singapore", flag: "🇸🇬" },
  { name: "South Africa", flag: "🇿🇦" }, { name: "South Korea", flag: "🇰🇷" },
  { name: "Spain", flag: "🇪🇸" }, { name: "Sweden", flag: "🇸🇪" },
  { name: "Switzerland", flag: "🇨🇭" }, { name: "Thailand", flag: "🇹🇭" },
  { name: "Turkey", flag: "🇹🇷" }, { name: "UAE", flag: "🇦🇪" },
  { name: "UK", flag: "🇬🇧" }, { name: "Ukraine", flag: "🇺🇦" },
  { name: "USA", flag: "🇺🇸" }, { name: "Uzbekistan", flag: "🇺🇿" },
  { name: "Vietnam", flag: "🇻🇳" }, { name: "Other", flag: "🌍" },
];

export function deviceId(): string {
  try {
    let uid = localStorage.getItem(KEY_UID);
    if (!uid) {
      uid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem(KEY_UID, uid);
    }
    return uid;
  } catch { return "anon"; }
}

function uidSeed(): number {
  const uid = deviceId();
  let h = 2166136261;
  for (let i = 0; i < uid.length; i++) {
    h ^= uid.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Streak = { count: number; isNewDay: boolean };

// Call once on page load: extends the streak if yesterday was the last
// visit, resets it after a missed day, and is idempotent within a day.
export function touchStreak(day: number): Streak {
  try {
    const raw = localStorage.getItem(KEY_STREAK);
    const prev: { last: number; count: number } = raw
      ? JSON.parse(raw)
      : { last: 0, count: 0 };
    if (prev.last === day) return { count: prev.count, isNewDay: false };
    const count = prev.last === day - 1 ? prev.count + 1 : 1;
    localStorage.setItem(KEY_STREAK, JSON.stringify({ last: day, count }));
    return { count, isNewDay: true };
  } catch { return { count: 1, isNewDay: true }; }
}

export type HeardStats = { readers: number; countries: number };

// How many people have read your voice so far today. Grows from the
// moment you post, fast at first then slower (sqrt curve), so every
// visit back shows a bigger number — the core "it was worth it" signal.
export function heardStats(day: number, postedAtIso: string, now = new Date()): HeardStats {
  const rng = seeded(day * 7919 + (uidSeed() % 65536));
  const targetReaders = 1500 + Math.floor(rng() * 7800);
  const targetCountries = 12 + Math.floor(rng() * 56);
  const posted = Date.parse(postedAtIso) || now.getTime();
  const elapsed = Math.max(0, now.getTime() - posted);
  const frac = Math.min(1, Math.sqrt(elapsed / 86_400_000));
  return {
    readers: Math.max(1, Math.floor(targetReaders * frac)),
    countries: Math.max(1, Math.floor(targetCountries * frac)),
  };
}

// The named stranger your voice reached — a face for the number.
export function deliveredTo(day: number): Post {
  const rng = seeded(day * 131 + uidSeed());
  return POSTS[Math.floor(rng() * POSTS.length)];
}

// One voice from the pool, delivered only to you today — different for
// every person on Earth. Guarantees no post is ever read by no one, and
// gives every reader something nobody else received.
export function voiceForYou(day: number): Post {
  const feedIds = new Set(feedForDay(day).map((p) => p.id));
  const rest = POSTS.filter((p) => !feedIds.has(p.id));
  const pool = rest.length > 0 ? rest : POSTS;
  const rng = seeded(day * 911 + uidSeed());
  return pool[Math.floor(rng() * pool.length)];
}

// Variable reward: some days your post lands in a notable percentile and
// the page tells you; most days it says nothing. Unpredictable on
// purpose — that's what makes it worth checking.
export function surpriseRank(day: number): number | null {
  const rng = seeded(day * 271 + uidSeed());
  const roll = rng();
  if (roll < 0.3) return Math.max(2, Math.floor(rng() * 14)); // top N%
  return null;
}

// ── Global post pool ──────────────────────────────────────────────────
// 45 diverse posts from real corners of the world.
// Voices: confessional, political, funny, poetic, mundane, profound.

export const POSTS: Post[] = [
  {
    id: "p01", flag: "🇺🇦", country: "Ukraine", author: "Valentyna O.", handle: "valentyna",
    text: "The thing nobody tells you about war is how quiet it gets sometimes.",
    baseVotes: 2_140_000,
  },
  {
    id: "p02", flag: "🇳🇬", country: "Nigeria", author: "Amara K.", handle: "amarak",
    text: "My daughter asked why people fight wars. I said resources, religion, fear. She said 'those sound like problems we could fix.' She is 7.",
    baseVotes: 1_890_000,
  },
  {
    id: "p03", flag: "🇧🇷", country: "Brazil", author: "Lucas F.", handle: "lucasf",
    text: "Today I said goodbye to someone I thought I would grow old with. I don't know what comes after this sentence.",
    baseVotes: 1_640_000,
  },
  {
    id: "p04", flag: "🇯🇵", country: "Japan", author: "Haruto M.", handle: "harutom",
    text: "Worked 14 hours. Ate alone. Took the last train home. Stared at the city lights and thought: I wonder if any of those windows are as lonely as mine.",
    baseVotes: 1_580_000,
  },
  {
    id: "p05", flag: "🇮🇳", country: "India", author: "Priya S.", handle: "priyas",
    text: "My mother learned to read at 47. Today she finished her first novel. She called me to say 'I understand now why you love books.' Best phone call of my life.",
    baseVotes: 1_510_000,
  },
  {
    id: "p06", flag: "🇩🇪", country: "Germany", author: "Felix B.", handle: "felixb",
    text: "We are the only species that destroys its own habitat and calls it growth.",
    baseVotes: 1_420_000,
  },
  {
    id: "p07", flag: "🇺🇸", country: "USA", author: "Jordan T.", handle: "jordant",
    text: "3am. Can't sleep. Wondering if the version of me you miss is someone I'll ever be again.",
    baseVotes: 1_390_000,
  },
  {
    id: "p08", flag: "🇵🇭", country: "Philippines", author: "Maria C.", handle: "mariac",
    text: "Spent the day pulling plastic from the beach. 4 garbage bags. Felt completely useless and completely necessary at the same time.",
    baseVotes: 1_270_000,
  },
  {
    id: "p09", flag: "🇮🇹", country: "Italy", author: "Sofia R.", handle: "sofiar",
    text: "My grandmother made bread this morning. The smell alone made me believe in something.",
    baseVotes: 1_240_000,
  },
  {
    id: "p10", flag: "🇰🇷", country: "South Korea", author: "Jiwoo L.", handle: "jiwool",
    text: "I've been awake 23 hours building something that might matter to no one. But I can't stop.",
    baseVotes: 1_190_000,
  },
  {
    id: "p11", flag: "🇲🇽", country: "Mexico", author: "Isabel V.", handle: "isabelv",
    text: "Today I paid for a stranger's groceries because they were quietly putting things back to stay under budget. They cried. I cried. The cashier cried. We were all a mess.",
    baseVotes: 1_150_000,
  },
  {
    id: "p12", flag: "🇿🇦", country: "South Africa", author: "Thabo N.", handle: "thabon",
    text: "Power cut again. Family ate by candlelight. My kids said it was the best dinner ever. I'm not sure if that's beautiful or tragic.",
    baseVotes: 1_110_000,
  },
  {
    id: "p13", flag: "🇫🇷", country: "France", author: "Claire D.", handle: "clairedup",
    text: "Hot take: the best human invention isn't the internet or antibiotics. It's the nap.",
    baseVotes: 1_080_000,
  },
  {
    id: "p14", flag: "🇦🇺", country: "Australia", author: "James W.", handle: "jamesw",
    text: "Saw a woman on the bus today crying quietly with headphones in. Made eye contact by accident. She gave me the smallest nod. I nodded back. We didn't speak. Sometimes that's enough.",
    baseVotes: 1_050_000,
  },
  {
    id: "p15", flag: "🇨🇳", country: "China", author: "Wei Zhang", handle: "wz",
    text: "My city has 22 million people and sometimes I think about how every single one of them is the main character of a story I'll never hear.",
    baseVotes: 1_020_000,
  },
  {
    id: "p16", flag: "🇬🇧", country: "UK", author: "Sam P.", handle: "samp",
    text: "Reminder that the people who taught you most about life probably never got credit for it.",
    baseVotes: 990_000,
  },
  {
    id: "p17", flag: "🇷🇺", country: "Russia", author: "Mikhail V.", handle: "mik",
    text: "A neighbor I've never spoken to left soup outside my door when I was sick. No note. I've been thinking about it for two weeks.",
    baseVotes: 960_000,
  },
  {
    id: "p18", flag: "🇪🇬", country: "Egypt", author: "Farid H.", handle: "faridh",
    text: "This morning the Nile looked like hammered bronze at sunrise. Three thousand years of sunrises and it still works.",
    baseVotes: 940_000,
  },
  {
    id: "p19", flag: "🇦🇷", country: "Argentina", author: "Valentina M.", handle: "vale",
    text: "Nobody is coming to save you. But also: you don't need saving as much as you think.",
    baseVotes: 910_000,
  },
  {
    id: "p20", flag: "🇳🇱", country: "Netherlands", author: "Daan K.", handle: "daank",
    text: "Free WiFi in every park in this city. This is what taxes are actually for.",
    baseVotes: 880_000,
  },
  {
    id: "p21", flag: "🇨🇦", country: "Canada", author: "Aisha B.", handle: "aishabn",
    text: "Every 'overnight success' story I've ever investigated was actually a 7-year story with a very good PR moment at the end.",
    baseVotes: 850_000,
  },
  {
    id: "p22", flag: "🇸🇪", country: "Sweden", author: "Erik A.", handle: "erika",
    text: "Went outside at midnight because the sky was doing something. A stranger was already there looking at it. We both just stood there in silence. Perfect.",
    baseVotes: 830_000,
  },
  {
    id: "p23", flag: "🇰🇪", country: "Kenya", author: "Nia W.", handle: "niaw",
    text: "My village has no running water but every child in it knows how to code. The future is unevenly distributed in both directions.",
    baseVotes: 810_000,
  },
  {
    id: "p24", flag: "🇵🇰", country: "Pakistan", author: "Zara M.", handle: "zaram",
    text: "I got a scholarship today. First in my family to go to university. I'm terrified. I'm euphoric. I haven't stopped shaking.",
    baseVotes: 790_000,
  },
  {
    id: "p25", flag: "🇹🇷", country: "Turkey", author: "Defne Y.", handle: "defney",
    text: "Istanbul at 5am when nobody is awake yet is a different city. A gentler one.",
    baseVotes: 770_000,
  },
  {
    id: "p26", flag: "🇮🇩", country: "Indonesia", author: "Budi S.", handle: "budis",
    text: "In my language there's a word — 'jayus' — for a joke so bad it becomes funny. English needs this word desperately.",
    baseVotes: 750_000,
  },
  {
    id: "p27", flag: "🇨🇴", country: "Colombia", author: "Camila R.", handle: "camilar",
    text: "My abuela doesn't know what a selfie is but she knows every single person's name who comes to the market. I don't know which skill ages better.",
    baseVotes: 730_000,
  },
  {
    id: "p28", flag: "🇧🇩", country: "Bangladesh", author: "Rahim C.", handle: "rahimc",
    text: "I survived a flood, a pandemic, and a broken heart this year. January was three weeks ago.",
    baseVotes: 710_000,
  },
  {
    id: "p29", flag: "🇳🇴", country: "Norway", author: "Ingrid H.", handle: "ingridh",
    text: "Watched a sunset that lasted 4 hours. Forgot about everything.",
    baseVotes: 690_000,
  },
  {
    id: "p30", flag: "🇮🇱", country: "Israel", author: "Noa B.", handle: "noab",
    text: "Met someone on a bus who was reading the same book. We talked for an hour. Never got each other's names. I keep thinking about that conversation.",
    baseVotes: 670_000,
  },
  {
    id: "p31", flag: "🇵🇪", country: "Peru", author: "Miguel T.", handle: "miguelt",
    text: "Hiked to a place with no signal for 6 days. I missed nothing. I was missed by nothing. It was the first time in years I felt complete.",
    baseVotes: 655_000,
  },
  {
    id: "p32", flag: "🇳🇿", country: "New Zealand", author: "Aroha W.", handle: "aroha",
    text: "My grandfather can name every star. My son can name every Pokemon. Both are just humans trying to map what they love.",
    baseVotes: 640_000,
  },
  {
    id: "p33", flag: "🇨🇱", country: "Chile", author: "Catalina S.", handle: "catalinas",
    text: "Sometimes I think the most radical thing a person can do is rest without guilt.",
    baseVotes: 620_000,
  },
  {
    id: "p34", flag: "🇬🇭", country: "Ghana", author: "Kwame A.", handle: "kwamea",
    text: "Every city I've ever visited felt less foreign than the inside of my own head at 3am.",
    baseVotes: 605_000,
  },
  {
    id: "p35", flag: "🇻🇳", country: "Vietnam", author: "Linh N.", handle: "linhn",
    text: "My grandmother survived war, famine, and rebuilding a country. She cried today because her favorite plant died. We contain multitudes.",
    baseVotes: 590_000,
  },
  {
    id: "p36", flag: "🇵🇱", country: "Poland", author: "Marek W.", handle: "marekw",
    text: "The town I grew up in no longer exists as I remember it. It was demolished, sold, then built into something clean and unrecognizable. Memory is also a kind of country.",
    baseVotes: 578_000,
  },
  {
    id: "p37", flag: "🇷🇴", country: "Romania", author: "Elena P.", handle: "elenap",
    text: "My phone has 11,000 photos and I can't remember most of the days I was trying to save.",
    baseVotes: 562_000,
  },
  {
    id: "p38", flag: "🇮🇪", country: "Ireland", author: "Ciarán M.", handle: "ciaranm",
    text: "Rain for the fourth day straight. Everyone is cheerful about it. This country has no explanation.",
    baseVotes: 545_000,
  },
  {
    id: "p39", flag: "🇸🇳", country: "Senegal", author: "Oumar D.", handle: "oumar",
    text: "I asked my father what he regrets. He thought for a long time and said 'not resting more.' I'm taking that seriously.",
    baseVotes: 530_000,
  },
  {
    id: "p40", flag: "🇭🇺", country: "Hungary", author: "Anna K.", handle: "annak",
    text: "There's a version of you that a stranger will fall in love with one day. They haven't met you yet. Be patient.",
    baseVotes: 515_000,
  },
  {
    id: "p41", flag: "🇸🇬", country: "Singapore", author: "Lin J.", handle: "linj",
    text: "This city has a 97% literacy rate and I still can't read the room.",
    baseVotes: 500_000,
  },
  {
    id: "p42", flag: "🇲🇦", country: "Morocco", author: "Youssef B.", handle: "youssefb",
    text: "Watched a man in the medina weave a carpet for an hour. He didn't look up once. Pure focus is the most beautiful thing a human being can do.",
    baseVotes: 487_000,
  },
  {
    id: "p43", flag: "🇺🇿", country: "Uzbekistan", author: "Nodira R.", handle: "nodira",
    text: "Somewhere between 'I'm fine' and 'I'm not fine' is where most of us actually live.",
    baseVotes: 473_000,
  },
  {
    id: "p44", flag: "🇪🇹", country: "Ethiopia", author: "Tigist A.", handle: "tigist",
    text: "My country is ancient. My city is a startup. I contain this contradiction every day.",
    baseVotes: 460_000,
  },
  {
    id: "p45", flag: "🇵🇹", country: "Portugal", author: "André F.", handle: "andref",
    text: "There is no word in English for the feeling of missing something you still have. Portuguese has 'saudade.' Use it.",
    baseVotes: 446_000,
  },
];
