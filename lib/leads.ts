export type Lead = {
  id: string;
  company: string;
  domain: string;
  contact: string;
  title: string;
  industry: string;
  employees: number;
  signals: string[]; // buying signals the agent "detected"
  keywords: string[]; // used for ICP matching
};

export type ScoredLead = Lead & {
  score: number;
  reasons: string[];
  email: { subject: string; body: string };
};

// Simulated prospect universe. In production this layer is fed by live
// enrichment providers (Apollo/Clay/Clearbit-style APIs); the agent logic
// downstream is identical either way.
export const leadUniverse: Lead[] = [
  {
    id: "l1",
    company: "Northwind Logistics",
    domain: "northwindlogistics.com",
    contact: "Dana Whitfield",
    title: "VP of Operations",
    industry: "Logistics",
    employees: 340,
    signals: [
      "Posted 4 ops-coordinator roles this month",
      "CTO tweeted about spreadsheet sprawl",
      "Migrated careers page to Greenhouse last week",
    ],
    keywords: ["logistics", "supply", "shipping", "operations", "fleet", "freight", "delivery"],
  },
  {
    id: "l2",
    company: "Brightcove Dental Group",
    domain: "brightcovedental.com",
    contact: "Dr. Amir Patel",
    title: "Managing Partner",
    industry: "Healthcare",
    employees: 85,
    signals: [
      "Opened 2 new clinic locations in Q1",
      "Front-desk job posting mentions 'drowning in phone bookings'",
      "Website still has no online scheduling",
    ],
    keywords: ["health", "clinic", "dental", "patient", "medical", "booking", "appointment", "practice"],
  },
  {
    id: "l3",
    company: "Forge & Field Apparel",
    domain: "forgeandfield.co",
    contact: "Maya Lindqvist",
    title: "Head of E-commerce",
    industry: "E-commerce",
    employees: 52,
    signals: [
      "Cart abandonment flow is a single generic email",
      "Just crossed 100k Instagram followers",
      "Hiring a retention marketer (posted 6 days ago)",
    ],
    keywords: ["ecommerce", "shop", "retail", "brand", "store", "marketing", "dtc", "fashion", "checkout"],
  },
  {
    id: "l4",
    company: "Cobalt Peak Software",
    domain: "cobaltpeak.io",
    contact: "Jordan Reyes",
    title: "VP of Sales",
    industry: "B2B SaaS",
    employees: 210,
    signals: [
      "SDR team shrank from 9 to 4 (LinkedIn headcount data)",
      "CEO's board letter mentions 'pipeline efficiency'",
      "Renewed Salesforce contract in March",
    ],
    keywords: ["saas", "software", "sales", "crm", "b2b", "pipeline", "revenue", "startup", "ai", "agent", "developer", "tool"],
  },
  {
    id: "l5",
    company: "Harborline Property Group",
    domain: "harborlineproperties.com",
    contact: "Sofia Marchetti",
    title: "Director of Leasing",
    industry: "Real Estate",
    employees: 130,
    signals: [
      "Average lead response time of 9 hours (mystery-shop data)",
      "Expanding into 3 new metro markets",
      "Leasing team posts show manual follow-up workflows",
    ],
    keywords: ["real estate", "property", "leasing", "tenant", "housing", "rental", "broker"],
  },
  {
    id: "l6",
    company: "Verdant Labs",
    domain: "verdantlabs.ag",
    contact: "Tomás Oyelaran",
    title: "COO",
    industry: "AgTech",
    employees: 64,
    signals: [
      "Raised $14M Series A in February",
      "Job posts mention 'scaling customer onboarding'",
      "COO spoke on a podcast about ops bottlenecks",
    ],
    keywords: ["agriculture", "agtech", "farm", "food", "climate", "sustainability", "biotech", "science"],
  },
  {
    id: "l7",
    company: "Atlas Financial Partners",
    domain: "atlasfp.com",
    contact: "Rachel Kim",
    title: "Chief Growth Officer",
    industry: "Financial Services",
    employees: 480,
    signals: [
      "Launched a digital advisory product in April",
      "Growth team doubled in 6 months",
      "RFP activity detected for marketing automation",
    ],
    keywords: ["finance", "financial", "fintech", "banking", "wealth", "advisory", "insurance", "payments", "accounting"],
  },
  {
    id: "l8",
    company: "Stonebridge Construction",
    domain: "stonebridgebuild.com",
    contact: "Mike Donahue",
    title: "President",
    industry: "Construction",
    employees: 290,
    signals: [
      "Won 3 municipal contracts this quarter",
      "Estimating team still quotes from Excel",
      "Posted for a 'bid coordinator' role twice in 90 days",
    ],
    keywords: ["construction", "building", "contractor", "engineering", "infrastructure", "architecture", "project"],
  },
  {
    id: "l9",
    company: "Lumen Academy",
    domain: "lumenacademy.org",
    contact: "Priya Raghavan",
    title: "Director of Admissions",
    industry: "Education",
    employees: 150,
    signals: [
      "Application volume up 40% YoY",
      "Admissions inbox autoresponder promises '5 business days'",
      "Budget cycle opens in July",
    ],
    keywords: ["education", "school", "learning", "training", "course", "student", "edtech", "academy"],
  },
  {
    id: "l10",
    company: "Peregrine Travel Collective",
    domain: "peregrinetravel.com",
    contact: "Lucas Ferreira",
    title: "Founder & CEO",
    industry: "Travel",
    employees: 38,
    signals: [
      "Bookings recovered to 120% of 2019 levels",
      "Two agents handle all itinerary requests manually",
      "Founder asked for CRM recommendations on LinkedIn",
    ],
    keywords: ["travel", "tourism", "hospitality", "hotel", "booking", "trip", "airline", "experience"],
  },
  {
    id: "l11",
    company: "Ironvale Manufacturing",
    domain: "ironvale.com",
    contact: "Karen Osei-Bonsu",
    title: "VP of Supply Chain",
    industry: "Manufacturing",
    employees: 720,
    signals: [
      "Announced reshoring of two product lines",
      "ERP migration scheduled for Q3",
      "Procurement team attending 3 trade shows this spring",
    ],
    keywords: ["manufacturing", "industrial", "factory", "production", "hardware", "machinery", "supply"],
  },
  {
    id: "l12",
    company: "Solace Mental Health",
    domain: "solacemh.com",
    contact: "Dr. Elena Vasquez",
    title: "Clinical Director",
    industry: "Healthcare",
    employees: 95,
    signals: [
      "Waitlist publicly listed at 6 weeks",
      "Hiring intake coordinators in 4 cities",
      "Recently switched to a new EHR system",
    ],
    keywords: ["health", "mental", "therapy", "clinic", "wellness", "patient", "care", "telehealth"],
  },
];

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with", "that",
  "we", "our", "your", "is", "are", "it", "this", "who", "help", "helps",
  "make", "makes", "made", "build", "builds", "using", "use", "uses", "into",
  "at", "by", "from", "as", "be", "can", "will", "you", "i", "my", "me",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Score every lead in the universe against the user's product + ICP
 * description. Keyword overlap drives the base score; buying signals and
 * company size add weight. Deterministic, so the demo is reproducible.
 */
export function scoreLeads(product: string, audience: string): (Lead & { score: number; reasons: string[] })[] {
  const tokens = new Set([...tokenize(product), ...tokenize(audience)]);

  const scored = leadUniverse.map((lead) => {
    let score = 35; // base: every lead in the universe passed coarse filters
    const reasons: string[] = [];

    const matched = lead.keywords.filter((k) =>
      k.split(" ").some((part) => tokens.has(part)),
    );
    if (matched.length > 0) {
      score += Math.min(matched.length * 14, 42);
      reasons.push(`ICP match on ${matched.slice(0, 3).join(", ")}`);
    }

    if (tokens.has(lead.industry.toLowerCase().split(" ")[0])) {
      score += 8;
      reasons.push(`Industry match: ${lead.industry}`);
    }

    score += Math.min(lead.signals.length * 4, 12);
    reasons.push(lead.signals[0]);

    if (lead.employees >= 50 && lead.employees <= 500) {
      score += 5;
      reasons.push(`${lead.employees} employees — in the sweet spot for fast deals`);
    }

    return { ...lead, score: Math.min(score, 98), reasons };
  });

  return scored.sort((a, b) => b.score - a.score);
}
