# HIVEMIND

**Do you know what everyone is thinking?**

One round a day. 5 questions. The whole world plays the same one. You don't win by being right — you win by knowing what everyone else thinks.

## The game

Each question has two steps:

1. **Your answer** — what do *you* think?
2. **Read the hive** — what did *most people* say?

Then the reveal: animated crowd distribution, whether you called the majority, and how mainstream (or alien) your own answer is.

After 5 questions you get:

- **Mind Read** (0–5) — how many majorities you predicted
- **Hive Sync** (0–100%) — what fraction of the crowd shares your answers
- **A persona** — The Oracle, The Insider, The Puppetmaster, The Alien… your daily identity, built from the two scores
- **A share grid** — Wordle-style emoji result for one-tap sharing
- **A streak** — and a countdown to the next round

## Why it hooks

- **Scarcity:** one round a day, hard-locked. You can't binge it, so you come back.
- **Curiosity gap:** "what did everyone else say?" is the most clickable question in existence.
- **Identity:** results tell you *who you are*, not just how you scored. People share identity.
- **Same round for everyone:** day number is global (UTC) — everyone argues about the same 5 questions, every day.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. That's the whole product — the game *is* the homepage.

## Architecture

```
app/page.tsx      the game (intro → answer → predict → reveal → results)
lib/hivemind.ts   question bank, daily selection, scoring, personas, share text
```

- Daily round selection and crowd distributions are deterministic (seeded by day number) so every player on Earth sees the identical round.
- Streaks and history live in `localStorage`.
- Crowd percentages are seeded baselines with daily jitter. The production path replaces them with real aggregated votes behind the same `dist` interface — game logic is unchanged.

## Roadmap to the network effect

1. Real vote aggregation (one API route + a counter table) — crowd data becomes live.
2. Friend leagues — see your friends' personas before they see yours… only after you play.
3. Country vs. country sync scores — "Brazil read the hive better than France today."
4. User-submitted questions voted into future rounds.
