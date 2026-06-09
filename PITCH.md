# Quota — The Autonomous Revenue Agent

**One-liner:** Quota is an AI agent that does the full job of an outbound sales rep — research, targeting, personalized outreach, follow-up, and meeting booking — for 7% of the cost of hiring one.

---

## The problem

- There are ~700,000 SDR/BDR jobs in the US alone. Fully loaded cost: **$80–120k per rep per year**.
- The job is 80% mechanical: find companies, find the right person, find a reason to reach out, write the email, follow up five times.
- It's also a job humans are bad at retaining: average SDR tenure is **under 15 months**, and ramp time is 3–6 months — companies pay for a year and get six productive months.
- Meanwhile reply rates on template-blast outreach have collapsed below 1%. The only thing that still works is **genuinely personalized, signal-timed outreach** — which humans can't do at volume.

## The product

Quota is deployed, not hired. Onboarding is one sentence: *what do you sell, and who buys it.* From there the agent:

1. **Hunts** — continuously scans companies for live buying signals: hiring spikes, funding events, exec statements, tech-stack changes, product gaps.
2. **Scores** — ranks every prospect by intent, so outreach lands when the prospect is actually in motion.
3. **Writes** — every email is anchored to a concrete, verifiable signal at that company. Under 110 words. One ask. It reads like your best rep on their best day.
4. **Closes the loop** — sends, follows up, handles replies, books the meeting on your calendar.

A working demo is live in this repo (`/demo`): the agent runs in front of you — scanning, scoring, and writing — in under ten seconds. It runs on Claude when an API key is present and on a deterministic local engine otherwise, so the demo never fails on stage.

## Why now

- Frontier models crossed the quality bar for *unsupervised* customer-facing writing in the last 18 months.
- The category is being validated with capital at extraordinary pace: AI-SDR companies (Artisan, 11x, Clay-adjacent tooling) have raised hundreds of millions on revenue curves that look like consumer apps.
- Buyers have already absorbed the mental model. "AI employee" is no longer a pitch you have to explain — it's a budget line item.

## Business model

| Tier | Price | Replaces |
|---|---|---|
| Hunter | $199/mo | Founder's own prospecting time |
| Closer | $499/mo | First SDR hire ($80k+/yr) |
| Rainmaker | $1,499/mo | An outbound team |

- **Gross margin:** inference + enrichment data cost per customer is a small fraction of subscription price and falls every quarter as model prices drop.
- **Expansion built in:** customers add sending identities, prospect volume, and per-segment agents as they grow — usage-based upsell on top of seats.
- **The wedge → platform path:** outbound is the entry point. The same agent infrastructure (signal detection + personalized action) extends to renewals, win-backs, and account expansion — the entire revenue lifecycle.

## Market

- Bottom-up: 700k US SDR seats × $6k/yr (Closer tier) = **$4.2B serviceable** in the US replacing the function alone; global outbound spend (salaries + tools + data) is conservatively **$50B+**.
- The real prize is bigger: companies that could never afford an SDR (the long tail of SMBs, agencies, solo founders) become customers at $199/mo. The agent doesn't just replace the market — it expands it.

## Moat

1. **Signal graph** — every agent run enriches a proprietary dataset of which signals convert, per industry. That feedback loop compounds and is not reproducible by a new entrant with the same base model.
2. **Outcome data** — reply/meeting outcomes train targeting and copy selection. The product gets measurably better with every customer.
3. **Trust surface** — sending on a customer's domain is a high-switching-cost position; once deliverability, tone, and CRM history live in Quota, churn drops.

## Status & honest framing

This repository contains the working product prototype: live agent demo, scoring engine, Claude-powered outreach generation with graceful fallback, landing page, and pricing. Prospect data in the demo is simulated; the production path swaps in live enrichment APIs behind the same interface (`lib/leads.ts`). Numbers above are market estimates, not company traction — this is a pre-revenue prototype built to raise on.

## The ask

Pre-seed to take the prototype to first revenue: live data integrations, sending infrastructure with deliverability protection, and 20 design partners at the Closer tier. Target: **$20k MRR within two quarters** of funding — the milestone at which this category has historically commanded step-function markups.
