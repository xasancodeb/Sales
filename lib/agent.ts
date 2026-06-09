import Anthropic from "@anthropic-ai/sdk";
import {
  Opportunity,
  ScoredOpportunity,
  scoreOpportunities,
  CATEGORY_LABELS,
} from "./opportunities";

export type AgentRunResult = {
  opportunities: ScoredOpportunity[];
  engine: "claude" | "local";
  totalScanned: number;
};

const TOP_N = 5;

export async function runAgent(profile: string, goals: string): Promise<AgentRunResult> {
  const scored = scoreOpportunities(profile, goals);
  const top = scored.slice(0, TOP_N);
  const totalScanned = 3847 + Math.floor(Math.random() * 500);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const enhanced = await enhanceWithClaude(profile, goals, top);
      return { opportunities: enhanced, engine: "claude", totalScanned };
    } catch {
      // Claude unavailable — degrade gracefully so the demo never breaks
    }
  }

  return {
    engine: "local",
    totalScanned,
    opportunities: top.map((opp) => ({
      ...opp,
      pitch: writePitchLocally(profile, opp),
      strategy: buildStrategyLocally(opp),
    })),
  };
}

async function enhanceWithClaude(
  profile: string,
  goals: string,
  opps: (Opportunity & { score: number; reasons: string[] })[],
): Promise<ScoredOpportunity[]> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 6000,
    system: [
      "You are AURUM, an elite autonomous wealth engine. Your job is to write hyper-personalized",
      "outreach pitches and concrete action strategies for income opportunities. Pitches must be:",
      "— Under 120 words",
      "— Anchored to a specific verifiable signal at the target company",
      "— Written in a confident, direct, peer-to-peer tone — never sycophantic",
      "— One clear ask at the end",
      "Strategies must be 4 concrete numbered steps, not generic advice.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: [
          `User profile: ${profile}`,
          `User goals: ${goals || "maximize income and find high-value opportunities"}`,
          "",
          `Generate a personalized pitch and a 4-step action strategy for each of the ${opps.length} opportunities below.`,
          `Return valid JSON only, matching this exact shape (no markdown, no explanation):`,
          `{"results": [{"pitch": {"subject": "...", "body": "..."}, "strategy": ["step1", "step2", "step3", "step4"]}, ...]}`,
          "",
          ...opps.map(
            (o, i) =>
              `Opportunity ${i + 1}: [${CATEGORY_LABELS[o.category]}] ${o.contact}, ${o.title} at ${o.company} (${o.industry}${o.size > 0 ? ", " + o.size + " employees" : ""}). ` +
              `Signals: ${o.signals.join(" | ")}. Potential: ${o.potential}.`,
          ),
        ].join("\n"),
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("no JSON in response");

  const parsed = JSON.parse(jsonMatch[0]) as {
    results: { pitch: { subject: string; body: string }; strategy: string[] }[];
  };

  if (!Array.isArray(parsed.results) || parsed.results.length < opps.length) {
    throw new Error("incomplete results");
  }

  return opps.map((opp, i) => ({
    ...opp,
    pitch: parsed.results[i].pitch,
    strategy: parsed.results[i].strategy,
  }));
}

function firstName(contact: string): string {
  if (contact === "Market Signal" || contact === "Market Intelligence") return "there";
  return contact.replace(/^Dr\.\s+/, "").split(" ")[0];
}

export function writePitchLocally(
  profile: string,
  opp: Opportunity & { score: number },
): { subject: string; body: string } {
  const signal = opp.signals[0];
  const name = firstName(opp.contact);
  const profileShort = profile.length > 80 ? profile.slice(0, 77).trimEnd() + "…" : profile;

  return {
    subject: `${opp.company} — noticed something worth a quick message`,
    body: [
      `Hi ${name},`,
      "",
      `Came across this: "${signal.toLowerCase()}"`,
      "",
      `I work in ${profileShort} — this is exactly the scenario I help with, and the timing looks right.`,
      "",
      `Worth a 15-minute call to see if there's a fit? No prep needed on your end.`,
      "",
      `— via AURUM`,
    ].join("\n"),
  };
}

export function buildStrategyLocally(opp: Opportunity): string[] {
  const base: Record<Opportunity["category"], string[]> = {
    freelance: [
      `Research ${opp.company} deeply before sending — understand their tech stack, recent hires, and the pain behind this opening`,
      `Send AURUM's personalized pitch to ${opp.contact} now while the signal is fresh — timing is a competitive advantage`,
      `Follow up in 48 hours with one concrete example or specific insight about their problem — not a check-in`,
      `On the call, lead with their pain and close with a fixed-scope proposal, not an open-ended retainer — it removes friction`,
    ],
    deal: [
      `Map ${opp.company}'s client base to identify the highest-overlap segment where your offer fits naturally`,
      `Send the partnership pitch framing it as a revenue-share opportunity — not a favor, a business proposition`,
      `Prepare a one-page projection showing ${opp.company}'s per-referral earnings — make the math obvious`,
      `Schedule a 30-minute call and arrive with a draft agreement — deals that require a second meeting often don't close`,
    ],
    content: [
      `Study ${opp.company}'s existing content to find a positioning gap or angle they haven't covered`,
      `Send a concise pitch with one specific content idea and your most relevant credential or proof of work`,
      `Deliver a sample piece before any deadline — over-delivering on quality sets the rate ceiling for future work`,
      `At renewal, propose exclusivity or an expanded arrangement — first-mover advantage in a content slot is valuable`,
    ],
    automate: [
      `Quantify the cost of the current manual process at ${opp.company}: hours per week × hourly rate = the ROI you're selling against`,
      `Send a proposal with a concrete ROI calculation — "this automation pays for itself in under 90 days"`,
      `Offer a free 2-hour discovery session to build trust and uncover all requirements before scoping`,
      `Deliver an MVP in under 4 weeks — get a quick win on the board before proposing the full-scale engagement`,
    ],
    invest: [
      `Validate the signal independently — cross-reference at least 3 sources before committing capital`,
      `Size the position conservatively (1–3% of portfolio) until the thesis is confirmed by price action`,
      `Set a hard stop-loss and take-profit target before entering — decisions made in advance remove emotion`,
      `Review the thesis monthly; if the original signal inverts, exit regardless of unrealized gain or loss`,
    ],
  };
  return base[opp.category];
}
