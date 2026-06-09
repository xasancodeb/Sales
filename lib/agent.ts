import Anthropic from "@anthropic-ai/sdk";
import { Lead, ScoredLead, scoreLeads } from "./leads";

export type AgentRunResult = {
  leads: ScoredLead[];
  engine: "claude" | "local";
};

const TOP_N = 5;

/**
 * Full agent run: score the universe, take the top prospects, and write a
 * personalized opener for each. Uses Claude when ANTHROPIC_API_KEY is set;
 * otherwise falls back to the deterministic local writer so the demo always
 * works.
 */
export async function runAgent(product: string, audience: string): Promise<AgentRunResult> {
  const top = scoreLeads(product, audience).slice(0, TOP_N);

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const emails = await writeEmailsWithClaude(product, audience, top);
      return {
        engine: "claude",
        leads: top.map((lead, i) => ({ ...lead, email: emails[i] })),
      };
    } catch {
      // Claude unavailable (rate limit, network) — degrade to local writer
      // rather than failing the demo.
    }
  }

  return {
    engine: "local",
    leads: top.map((lead) => ({ ...lead, email: writeEmailLocally(product, lead) })),
  };
}

async function writeEmailsWithClaude(
  product: string,
  audience: string,
  leads: (Lead & { score: number; reasons: string[] })[],
): Promise<{ subject: string; body: string }[]> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4000,
    system: [
      "You are Quota, an elite outbound sales agent. You write cold emails that",
      "get replies: short (under 110 words), specific, zero fluff, no buzzwords,",
      "one clear ask. You always anchor the email on a concrete buying signal",
      "from the prospect's company — never generic flattery.",
    ].join(" "),
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            emails: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  subject: { type: "string" },
                  body: { type: "string" },
                },
                required: ["subject", "body"],
                additionalProperties: false,
              },
            },
          },
          required: ["emails"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: [
          `The sender sells: ${product}`,
          `Their target customer: ${audience}`,
          "",
          `Write one cold email for each of the following ${leads.length} prospects, in order.`,
          "Return JSON: {\"emails\": [{\"subject\", \"body\"}, ...]} with exactly one entry per prospect.",
          "",
          ...leads.map(
            (l, i) =>
              `Prospect ${i + 1}: ${l.contact}, ${l.title} at ${l.company} (${l.industry}, ${l.employees} employees). Buying signals: ${l.signals.join("; ")}.`,
          ),
        ].join("\n"),
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const parsed = JSON.parse(text) as { emails: { subject: string; body: string }[] };
  if (!Array.isArray(parsed.emails) || parsed.emails.length < leads.length) {
    throw new Error("incomplete email batch");
  }
  return parsed.emails.slice(0, leads.length);
}

function firstName(contact: string): string {
  return contact.replace(/^Dr\.\s+/, "").split(" ")[0];
}

/** Deterministic fallback writer — signal-anchored templates. */
export function writeEmailLocally(product: string, lead: Lead & { score: number }): {
  subject: string;
  body: string;
} {
  const signal = lead.signals[0];
  const productShort = product.length > 90 ? product.slice(0, 87).trimEnd() + "…" : product;

  return {
    subject: `${lead.company} — noticed something`,
    body: [
      `Hi ${firstName(lead.contact)},`,
      "",
      `Saw this about ${lead.company}: "${signal.toLowerCase()}". That's usually the moment teams like yours start feeling the ceiling.`,
      "",
      `We built something for exactly this — ${productShort}`,
      "",
      `Worth 15 minutes this week to see if it maps to what you're running into? If not, tell me to get lost and I will.`,
      "",
      `— sent by Quota on behalf of its operator`,
    ].join("\n"),
  };
}
