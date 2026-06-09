# Quota — The Autonomous Revenue Agent

An AI sales agent that researches prospects, detects buying signals, scores intent, and writes personalized outreach — built with Next.js, Tailwind, and the Claude API.

**Investor memo:** see [PITCH.md](./PITCH.md).

## Run it

```bash
cd quota
npm install
npm run dev
```

Open http://localhost:3000 — landing page, `/demo` for the live agent run, `/pricing` for plans.

### Live AI writing (optional)

The demo works out of the box with a deterministic local engine. To have Claude write the outreach for real:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

The API route (`app/api/agent/route.ts`) automatically uses Claude (`claude-opus-4-8`) when the key is present and falls back to the local engine otherwise — the demo never breaks.

## Architecture

```
app/page.tsx           landing page
app/demo/page.tsx      live agent dashboard (activity feed + results)
app/pricing/page.tsx   pricing tiers
app/api/agent/route.ts agent endpoint
lib/leads.ts           prospect universe + intent-scoring engine
lib/agent.ts           outreach writer (Claude + local fallback)
```

The prospect universe in `lib/leads.ts` is simulated demo data. In production it's replaced by live enrichment providers behind the same interface — scoring and writing logic are unchanged.
