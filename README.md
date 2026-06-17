# ONE — The world's shared page

**Eight billion people. One page.**

Every person on Earth gets one post a day — no followers, no badges, no algorithm. The world votes, the best voice rises, and at midnight everyone starts equal again.

## The idea

Social media rewards the loudest, the most frequent, the already-famous. ONE inverts all of it:

- **One post per person, per day.** Scarcity forces you to make it count.
- **No followers, no profiles to farm.** You don't accumulate an audience — you earn a single day.
- **The whole world shares one feed.** The day number is global (UTC), so everyone on Earth is reading and ranking the same page at the same time.
- **The crowd ranks the voices.** Votes decide whose post rises to the top of the day.
- **Midnight resets everyone to equal.** Yesterday's winner is honoured in the Book of Days — then the page is blank again for all eight billion of us.

## What's in the app

```
app/page.tsx        the daily feed — read, vote, and see today's rising voices
app/post/           write your one post for the day
app/days/           the Book of Days — past winners, one per day
app/me/             your streak, your delivered posts, your history
app/welcome/        first-run onboarding
app/about/          the manifesto
lib/one.ts          core: day number, feed ranking, voting, streaks, personas
lib/lang.ts         translation layer (multi-language UI)
lib/api.ts          live backend integration (feed + votes)
server/index.mjs    optional Node backend for real cross-device aggregation
```

## Run it

```bash
npm install
npm run dev          # the app at http://localhost:3000
npm run server       # optional: the live backend (server/index.mjs)
```

Without the backend running, the app works fully on seeded/simulated data in `localStorage`. With it, posts and votes aggregate live across devices behind the same interface — the UI is unchanged.

## Why it hooks

- **Scarcity:** one post a day, hard-locked to the UTC clock. You can't binge it, so you come back.
- **Equality ritual:** the midnight reset is a daily fresh start nobody can buy their way past.
- **Curiosity gap:** "what is the whole world saying today?" is a question with a new answer every morning.
- **Identity:** streaks, delivered posts, and the Book of Days give you a quiet record of showing up — without turning it into a follower race.

## Roadmap

1. Real vote aggregation at planet scale (the `lib/api.ts` interface already abstracts it).
2. Language-native feeds — read the world in your language, vote across all of them.
3. Country and city sync — "what is São Paulo saying today vs. Tokyo?"
4. The permanent Book of Days — one winning voice per day, forever.

---

This repository also contains **StyleUp** (in `styleup/`) — an Uber-for-stylists marketplace with a virtual colour fitting room. See `styleup/BUSINESS_PLAN.md`.
