// ── HIVEMIND core engine ─────────────────────────────────────────────
// One daily round. 5 questions. You answer for yourself, then predict
// the crowd. Crowd distributions are seeded baselines with daily jitter
// (deterministic — every player sees the same hive on the same day).

export type Question = {
  id: string;
  text: string;
  options: string[];
  dist: number[]; // baseline % per option, sums to ~100
};

export type QuestionResult = {
  questionId: string;
  self: number; // index the player chose for themselves
  prediction: number; // index the player predicted as majority
  dist: number[]; // the (jittered) distribution shown that day
  majority: number; // argmax of dist
  correct: boolean; // prediction === majority
};

export type DayResult = {
  day: number;
  date: string; // YYYY-MM-DD (UTC)
  results: QuestionResult[];
  read: number; // 0–5 correct predictions
  sync: number; // 0–100, avg % of crowd that shares your self-answers
  persona: Persona;
};

export type Persona = {
  name: string;
  line: string;
  emoji: string;
};

// Day 1 = launch day. Same number for everyone on Earth (UTC).
const EPOCH_UTC = Date.UTC(2026, 5, 1); // June 1, 2026

export function dayNumber(now: Date = new Date()): number {
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((todayUTC - EPOCH_UTC) / 86_400_000) + 1;
}

export function dateKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function msUntilNextRound(now: Date = new Date()): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return next - now.getTime();
}

// Deterministic PRNG so the whole world plays the same round.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function questionsForDay(day: number): { question: Question; dist: number[] }[] {
  const rng = mulberry32(day * 7919 + 13);
  const pool = [...QUESTIONS];
  const picked: Question[] = [];
  for (let i = 0; i < 5 && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  // Daily jitter: the hive drifts a little day to day, but never enough
  // to silently flip a strong majority.
  return picked.map((question) => {
    const jittered = question.dist.map((p) => {
      const j = (rng() - 0.5) * 6; // ±3 points
      return Math.max(2, p + j);
    });
    const total = jittered.reduce((s, x) => s + x, 0);
    const dist = jittered.map((x) => Math.round((x / total) * 100));
    // fix rounding drift
    const drift = 100 - dist.reduce((s, x) => s + x, 0);
    dist[0] += drift;
    return { question, dist };
  });
}

export function scoreDay(
  day: number,
  date: string,
  results: QuestionResult[],
): DayResult {
  const read = results.filter((r) => r.correct).length;
  const sync = Math.round(
    results.reduce((s, r) => s + r.dist[r.self], 0) / results.length,
  );
  return { day, date, results, read, sync, persona: persona(read, sync) };
}

export function persona(read: number, sync: number): Persona {
  if (read === 5 && sync < 45)
    return {
      name: "THE PUPPETMASTER",
      emoji: "🃏",
      line: "You disagree with the crowd on almost everything — and you predicted every move it made. Terrifying.",
    };
  if (read === 5)
    return {
      name: "THE ALL-SEEING",
      emoji: "👁️",
      line: "Five for five. The hive has no secrets from you.",
    };
  if (read >= 4 && sync < 45)
    return {
      name: "THE ORACLE",
      emoji: "🔮",
      line: "You don't think like them. But you know exactly how they think.",
    };
  if (read >= 4 && sync >= 60)
    return {
      name: "THE INSIDER",
      emoji: "🐝",
      line: "You ARE the hivemind. When you speak, you speak for everyone.",
    };
  if (read >= 4)
    return {
      name: "THE PROFILER",
      emoji: "🕵️",
      line: "You read the room like a case file.",
    };
  if (read === 3 && sync >= 60)
    return {
      name: "THE LOCAL",
      emoji: "🏘️",
      line: "Comfortably mainstream, decently perceptive. The hive likes you.",
    };
  if (read === 3 && sync < 45)
    return {
      name: "THE OUTSIDER",
      emoji: "🌒",
      line: "Half in, half out. You see the hive — from a distance.",
    };
  if (read === 3)
    return {
      name: "THE OBSERVER",
      emoji: "🔭",
      line: "You catch more than you miss. Keep watching.",
    };
  if (read <= 1 && sync >= 60)
    return {
      name: "THE SLEEPWALKER",
      emoji: "😴",
      line: "You agree with everyone and predicted no one. You're inside the hive with the lights off.",
    };
  if (read <= 1 && sync < 45)
    return {
      name: "THE ALIEN",
      emoji: "👽",
      line: "Different answers, different predictions, different planet. We mean this with respect.",
    };
  if (read <= 1)
    return {
      name: "THE STATIC",
      emoji: "📺",
      line: "The hive's signal isn't reaching you today. Tune in tomorrow.",
    };
  if (sync >= 60)
    return {
      name: "THE REGULAR",
      emoji: "☕",
      line: "Mostly mainstream, occasionally psychic.",
    };
  return {
    name: "THE WILDCARD",
    emoji: "🎲",
    line: "Nobody can predict you. Including you.",
  };
}

export function shareText(result: DayResult): string {
  const grid = result.results.map((r) => (r.correct ? "🟡" : "⚫")).join("");
  return [
    `HIVEMIND #${result.day}`,
    `${grid}`,
    `🧠 Read ${result.read}/5 · ⚡ Sync ${result.sync}%`,
    `${result.persona.emoji} ${result.persona.name}`,
  ].join("\n");
}

// ── Question bank ────────────────────────────────────────────────────
// Divisive, fast, fun. Strong majorities and nail-biters mixed so
// prediction stays genuinely hard.

export const QUESTIONS: Question[] = [
  { id: "q1", text: "Toilet paper: over or under?", options: ["Over", "Under"], dist: [74, 26] },
  { id: "q2", text: "Is a hotdog a sandwich?", options: ["Yes", "No"], dist: [38, 62] },
  { id: "q3", text: "Pineapple on pizza?", options: ["Yes, delicious", "Crime against pizza"], dist: [47, 53] },
  { id: "q4", text: "Would you rather know HOW you die or WHEN?", options: ["How", "When", "Neither, leave me alone"], dist: [27, 21, 52] },
  { id: "q5", text: "You find $50 on the street. Nobody around.", options: ["Keep it", "Try to find the owner", "Donate it"], dist: [68, 21, 11] },
  { id: "q6", text: "Could you beat a goose in a fight? (No weapons.)", options: ["Easily", "It would be close", "The goose wins"], dist: [55, 30, 15] },
  { id: "q7", text: "Cereal or milk first?", options: ["Cereal first", "Milk first", "I don't eat cereal"], dist: [71, 13, 16] },
  { id: "q8", text: "Press a button: you get $1M, a stranger somewhere dies.", options: ["Press it", "Never"], dist: [31, 69] },
  { id: "q9", text: "Do you sleep with your bedroom door open or closed?", options: ["Open", "Closed"], dist: [41, 59] },
  { id: "q10", text: "Aliens: have they already visited Earth?", options: ["Yes", "No", "We ARE the aliens"], dist: [29, 56, 15] },
  { id: "q11", text: "Would you rather be 10 minutes early forever or 10 minutes late forever?", options: ["Early", "Late"], dist: [83, 17] },
  { id: "q12", text: "Shower: morning or night?", options: ["Morning", "Night", "Both, I'm clean"], dist: [42, 38, 20] },
  { id: "q13", text: "Can money buy happiness?", options: ["Yes, obviously", "No", "It buys the conditions for it"], dist: [24, 18, 58] },
  { id: "q14", text: "Your partner's phone is unlocked next to you. They're asleep.", options: ["I'd look", "Never", "I've already looked"], dist: [22, 64, 14] },
  { id: "q15", text: "Would you take a one-way ticket to Mars?", options: ["Yes", "No"], dist: [18, 82] },
  { id: "q16", text: "Is cheating in a dream cheating?", options: ["Yes", "No", "Depends if you enjoyed it"], dist: [8, 71, 21] },
  { id: "q17", text: "The five-second rule for dropped food:", options: ["I follow it", "I eat it regardless of time", "Floor food is dead to me"], dist: [44, 23, 33] },
  { id: "q18", text: "Would you rather fight 1 horse-sized duck or 100 duck-sized horses?", options: ["1 horse-sized duck", "100 duck-sized horses"], dist: [42, 58] },
  { id: "q19", text: "Do you talk to yourself out loud?", options: ["All the time", "Sometimes", "Never"], dist: [38, 47, 15] },
  { id: "q20", text: "If you could read minds, would you turn it off?", options: ["Never, full access", "I'd want an off switch", "I don't want it at all"], dist: [14, 62, 24] },
  { id: "q21", text: "Pizza crust:", options: ["Eat it", "Leave it", "It's the best part"], dist: [55, 26, 19] },
  { id: "q22", text: "Could you go a full year without your phone for $100k?", options: ["Easily", "I'd struggle but yes", "No chance"], dist: [22, 51, 27] },
  { id: "q23", text: "Window or aisle seat?", options: ["Window", "Aisle", "Middle (psychopath)"], dist: [58, 39, 3] },
  { id: "q24", text: "Do you believe in ghosts?", options: ["Yes", "No", "I've SEEN things"], dist: [28, 57, 15] },
  { id: "q25", text: "You can erase one thing from existence:", options: ["Mosquitoes", "Hangovers", "Traffic", "Small talk"], dist: [41, 16, 33, 10] },
  { id: "q26", text: "Is water wet?", options: ["Yes", "No, it makes things wet"], dist: [61, 39] },
  { id: "q27", text: "Would you rather always say what you think or never speak again?", options: ["Always say it", "Never speak"], dist: [78, 22] },
  { id: "q28", text: "How often do you think about the Roman Empire?", options: ["Weekly or more", "Rarely", "What is wrong with you people"], dist: [24, 49, 27] },
  { id: "q29", text: "GPS voice on or off?", options: ["On", "Off, I read the map"], dist: [66, 34] },
  { id: "q30", text: "You get one do-over in life. Do you use it?", options: ["Yes, instantly", "No, regrets made me", "I'd save it forever and never use it"], dist: [35, 41, 24] },
  { id: "q31", text: "Socks in bed?", options: ["Yes, warm feet", "Absolutely not"], dist: [33, 67] },
  { id: "q32", text: "Would you want to know your IQ?", options: ["I already know it", "Yes", "No, nothing good comes of it"], dist: [18, 39, 43] },
  { id: "q33", text: "Last slice of pizza at a group dinner:", options: ["Take it", "Offer it around first", "Let it die untouched"], dist: [19, 60, 21] },
  { id: "q34", text: "Is it okay to recline your seat on a plane?", options: ["Yes, that's why the button exists", "Only on long flights", "Never, have mercy"], dist: [34, 45, 21] },
  { id: "q35", text: "Could you survive alone in the wild for a month?", options: ["Yes", "No", "Define 'survive'"], dist: [23, 52, 25] },
  { id: "q36", text: "Do you sing in the car alone?", options: ["Full concert", "Quiet humming", "Silence"], dist: [56, 29, 15] },
  { id: "q37", text: "Free will: real or illusion?", options: ["Real", "Illusion", "Real enough"], dist: [38, 23, 39] },
  { id: "q38", text: "Texting back immediately:", options: ["I reply instantly", "I wait so I don't look desperate", "I forget for 3 days"], dist: [42, 19, 39] },
  { id: "q39", text: "Would you eat lab-grown meat?", options: ["Yes", "No", "Only if it's cheaper"], dist: [44, 33, 23] },
  { id: "q40", text: "Hot take: breakfast food is...", options: ["The best meal category", "Overrated", "Acceptable at any hour"], dist: [29, 12, 59] },
  { id: "q41", text: "If your pet could talk, would you want it to?", options: ["Yes, finally", "No, some things are sacred", "It would expose me"], dist: [40, 33, 27] },
  { id: "q42", text: "Do you double-text?", options: ["Yes, shameless", "Never", "Only in emergencies"], dist: [37, 26, 37] },
  { id: "q43", text: "Would you rather be feared or loved?", options: ["Feared", "Loved", "Feared by enemies, loved by everyone else"], dist: [8, 47, 45] },
  { id: "q44", text: "The dishes: wash immediately or 'soak'?", options: ["Immediately", "Soak (lie)", "Dishwasher supremacy"], dist: [31, 36, 33] },
  { id: "q45", text: "Could you give a eulogy without crying?", options: ["Yes", "No", "I'd cry before the first word"], dist: [38, 42, 20] },
  { id: "q46", text: "Movie theater armrest: who gets it?", options: ["Middle seat gets both", "First come first served", "Share it like adults"], dist: [40, 32, 28] },
  { id: "q47", text: "Would you clone yourself if you could?", options: ["Yes", "No", "Only to do my chores"], dist: [16, 54, 30] },
  { id: "q48", text: "Do you wave at boats?", options: ["Always", "Sometimes", "Why would I wave at a boat"], dist: [33, 40, 27] },
  { id: "q49", text: "Time travel: forward or back?", options: ["Forward", "Back"], dist: [44, 56] },
  { id: "q50", text: "Would you rather lose all your memories or never make new ones?", options: ["Lose them all", "Never make new ones"], dist: [63, 37] },
  { id: "q51", text: "How do you eat corn on the cob?", options: ["Typewriter (rows)", "Spiral", "Chaos, no pattern"], dist: [58, 24, 18] },
  { id: "q52", text: "If everyone could hear your thoughts for 1 day:", options: ["I'd survive it", "Social death", "I'd leave the country"], dist: [27, 45, 28] },
  { id: "q53", text: "Pet peeve check — loud chewing:", options: ["Mild annoyance", "Actual rage", "I don't notice it"], dist: [38, 44, 18] },
  { id: "q54", text: "Would you take a pill that means you never need sleep?", options: ["Instantly", "No, I love sleep", "Only if I could still nap by choice"], dist: [25, 41, 34] },
  { id: "q55", text: "Do you read terms & conditions?", options: ["Yes (liar)", "Skim", "Accept blindly"], dist: [5, 26, 69] },
  { id: "q56", text: "Your villain origin story would be:", options: ["Slow wifi", "Betrayal", "Group projects", "Being interrupted"], dist: [18, 33, 28, 21] },
  { id: "q57", text: "Is 7am 'early'?", options: ["Yes", "No, that's normal", "That's mid-morning, peasant"], dist: [44, 41, 15] },
  { id: "q58", text: "Would you rather have unlimited money or unlimited time?", options: ["Money", "Time"], dist: [37, 63] },
  { id: "q59", text: "Phone battery anxiety starts at:", options: ["50%", "20%", "5% — live dangerously"], dist: [27, 51, 22] },
  { id: "q60", text: "Could you be friends with your clone?", options: ["Best friends", "We'd fight constantly", "One of us wouldn't make it"], dist: [38, 36, 26] },
  { id: "q61", text: "Do you trust people who don't like music?", options: ["No", "It's a red flag but fine", "Sure, why not"], dist: [29, 44, 27] },
  { id: "q62", text: "Olives:", options: ["Elite", "Disgusting", "Only in/on things"], dist: [33, 38, 29] },
  { id: "q63", text: "If you could see one statistic above everyone's head:", options: ["How many lies they've told today", "Their actual opinion of you", "Hours of sleep last night"], dist: [29, 52, 19] },
  { id: "q64", text: "Walking pace of the people in front of you:", options: ["Too slow, always", "Fine", "I am the slow walker"], dist: [57, 32, 11] },
];
