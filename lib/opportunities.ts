export type OpportunityCategory = "freelance" | "deal" | "content" | "automate" | "invest";

export const CATEGORY_LABELS: Record<OpportunityCategory, string> = {
  freelance: "Freelance Project",
  deal: "Business Deal",
  content: "Content Play",
  automate: "Automation Build",
  invest: "Market Signal",
};

export const CATEGORY_COLORS: Record<OpportunityCategory, string> = {
  freelance: "#FFB800",
  deal: "#00E5FF",
  content: "#A855F7",
  automate: "#00D97E",
  invest: "#FF6B35",
};

export type Opportunity = {
  id: string;
  category: OpportunityCategory;
  company: string;
  domain: string;
  contact: string;
  title: string;
  industry: string;
  size: number;
  description: string;
  signals: string[];
  potential: string;
  effort: string;
  keywords: string[];
};

export type ScoredOpportunity = Opportunity & {
  score: number;
  reasons: string[];
  pitch: { subject: string; body: string };
  strategy: string[];
};

export const opportunityUniverse: Opportunity[] = [
  // ── FREELANCE ────────────────────────────────────────────────────────────
  {
    id: "f1",
    category: "freelance",
    company: "Meridian Labs",
    domain: "meridianlabs.io",
    contact: "Sasha Romero",
    title: "Head of Product",
    industry: "B2B SaaS",
    size: 45,
    description:
      "Early-stage SaaS company needs a React developer to rebuild their onboarding flow. Activation rate dropped 40% after a recent redesign.",
    signals: [
      "Posted 'contract React dev — 6 weeks' on LinkedIn 3 days ago",
      "Founder tweeted: 'Our activation rate is embarrassing — fixing it in Q2'",
      "Onboarding completion fell from 68% to 28% after last release",
    ],
    potential: "$9,600",
    effort: "160 hrs",
    keywords: [
      "developer", "react", "frontend", "javascript", "typescript",
      "nextjs", "vue", "angular", "code", "engineer", "software", "web", "ui", "ux",
    ],
  },
  {
    id: "f2",
    category: "freelance",
    company: "Crestline Health Network",
    domain: "crestlinehealth.com",
    contact: "Dr. Nadia Vasek",
    title: "Chief Marketing Officer",
    industry: "Healthcare",
    size: 320,
    description:
      "Regional hospital network undergoing full rebrand — needs brand identity, design system, and digital assets.",
    signals: [
      "New CEO started 6 weeks ago with an explicit 'modernization mandate'",
      "RFP for branding agency posted to procurement portal last week",
      "Current brand is 14 years old with no documented design system",
    ],
    potential: "$28,000",
    effort: "180 hrs",
    keywords: [
      "design", "brand", "identity", "graphic", "ui", "ux", "figma",
      "creative", "visual", "logo", "branding", "designer", "illustrat",
    ],
  },
  {
    id: "f3",
    category: "freelance",
    company: "Arbor Street Media",
    domain: "arborstreetmedia.com",
    contact: "Charlie Nguyen",
    title: "Publisher",
    industry: "Media",
    size: 28,
    description:
      "Growing newsletter business needs a ghostwriter for their daily finance briefing. Main writer departing.",
    signals: [
      "Main writer announced leaving to launch a solo newsletter",
      "Subscriber count grew 65% YoY — content is the bottleneck",
      "Job post for 'editorial contractor, 5 pieces/week' posted 2 days ago",
    ],
    potential: "$4,000/mo",
    effort: "20 hrs/mo",
    keywords: [
      "write", "writer", "writing", "content", "copywrite", "copy",
      "blog", "newsletter", "editorial", "journalist", "ghostwrite", "author",
    ],
  },
  {
    id: "f4",
    category: "freelance",
    company: "Vertex Capital",
    domain: "vertexcap.vc",
    contact: "Priya Anand",
    title: "Principal",
    industry: "Venture Capital",
    size: 22,
    description:
      "Early-stage VC just launched a $120M AI infrastructure fund and needs research analyst support.",
    signals: [
      "LinkedIn post: 'Looking for research support — DMs open'",
      "Their current research deck is 18 months out of date",
      "Fund mandate specifically targets AI infrastructure — specialist knowledge needed",
    ],
    potential: "$12,000",
    effort: "80 hrs",
    keywords: [
      "research", "analyst", "analysis", "finance", "data", "report",
      "consulting", "strategy", "advisory", "intelligence", "ai", "write",
    ],
  },
  {
    id: "f5",
    category: "freelance",
    company: "Drift Apparel Co.",
    domain: "driftapparel.co",
    contact: "Zara Mills",
    title: "Founder",
    industry: "E-commerce",
    size: 14,
    description:
      "DTC brand scaling past $2M ARR needs a paid media expert. Meta ROAS collapsed and they're bleeding cash.",
    signals: [
      "Meta ad ROAS dropped from 3.2x to 1.8x in Q1",
      "Founder posted: 'We are flying blind on paid — need a serious pro ASAP'",
      "Managing $40k/month in ad spend with no specialist",
    ],
    potential: "$5,000/mo",
    effort: "15 hrs/mo",
    keywords: [
      "marketing", "ads", "paid", "meta", "google", "facebook",
      "performance", "growth", "media", "ppc", "sem", "social", "ecommerce",
    ],
  },
  {
    id: "f6",
    category: "freelance",
    company: "Helix Robotics",
    domain: "helixrobotics.ai",
    contact: "Dr. Marcus Lee",
    title: "CTO",
    industry: "Hardware / AI",
    size: 38,
    description:
      "Computer vision startup needs a Python/PyTorch engineer for their defect detection pipeline.",
    signals: [
      "GitHub repo shows active PRs with 'help wanted' tags on vision modules",
      "Just closed $8M seed — hiring budget unlocked",
      "CTO tweeted: 'shipping in 6 weeks, need ML muscle NOW'",
    ],
    potential: "$18,000",
    effort: "120 hrs",
    keywords: [
      "python", "ml", "machine learning", "ai", "data science", "pytorch",
      "tensorflow", "engineer", "developer", "backend", "api", "model",
    ],
  },

  // ── BUSINESS DEALS ────────────────────────────────────────────────────────
  {
    id: "d1",
    category: "deal",
    company: "Summit Accounting Group",
    domain: "summitaccounting.co",
    contact: "Ben Hartley",
    title: "Managing Director",
    industry: "Professional Services",
    size: 38,
    description:
      "240-client accounting firm with no current software referral relationships — high-value referral partner waiting to be activated.",
    signals: [
      "Partner posted about clients asking for 'better back-office tools' monthly",
      "No current affiliate or referral relationships active",
      "Referral partner network is their stated Q3 growth initiative",
    ],
    potential: "$3,200/mo",
    effort: "6 hrs",
    keywords: [
      "partnership", "referral", "accounting", "finance", "b2b",
      "saas", "software", "business", "small business", "deal",
    ],
  },
  {
    id: "d2",
    category: "deal",
    company: "Clearpath Staffing",
    domain: "clearpathstaffing.com",
    contact: "Monica Sloane",
    title: "VP of Business Development",
    industry: "Staffing",
    size: 180,
    description:
      "Staffing agency building a white-label tech toolkit for enterprise clients. Looking for integration partners.",
    signals: [
      "Just hired a 'Head of Technology Partnerships' role",
      "3 Fortune 500 clients requesting integrated tech in proposals",
      "CEO LinkedIn: 'Differentiation through tech is our 2026 bet'",
    ],
    potential: "$15,000 + rev share",
    effort: "12 hrs",
    keywords: [
      "partnership", "white label", "enterprise", "b2b", "saas",
      "software", "licensing", "deal", "hr", "platform",
    ],
  },
  {
    id: "d3",
    category: "deal",
    company: "Bluebird Financial",
    domain: "bluebirdfi.com",
    contact: "James Okonkwo",
    title: "COO",
    industry: "Fintech",
    size: 95,
    description:
      "Fintech startup with $22M raised seeking integration partners to embed into their SMB banking app.",
    signals: [
      "Published developer docs for partner API last month",
      "Partnership page went live on their website 2 weeks ago",
      "Raised $22M with distribution partnerships as a core pillar",
    ],
    potential: "$8,000/mo",
    effort: "20 hrs",
    keywords: [
      "api", "integration", "fintech", "banking", "payments",
      "finance", "developer", "partnership", "embedded", "deal",
    ],
  },

  // ── CONTENT ───────────────────────────────────────────────────────────────
  {
    id: "c1",
    category: "content",
    company: "Confluent Media",
    domain: "confluentmedia.io",
    contact: "Alex Torres",
    title: "Director of Partnerships",
    industry: "Media",
    size: 55,
    description:
      "B2B media company with 120k newsletter subscribers seeking sponsors. Audience: VPs and C-suite at mid-market SaaS companies.",
    signals: [
      "Sponsorship rate card public — $4,200 per dedicated send",
      "Waitlist forming for Q3 slots",
      "Reply rate on sponsor content averages 4.2% — above industry",
    ],
    potential: "$8,400/mo",
    effort: "4 hrs/mo",
    keywords: [
      "newsletter", "content", "b2b", "marketing", "sponsor",
      "media", "audience", "saas", "advertising",
    ],
  },
  {
    id: "c2",
    category: "content",
    company: "Forge Academy",
    domain: "forgeacademy.io",
    contact: "Stella Park",
    title: "Content Lead",
    industry: "EdTech",
    size: 34,
    description:
      "Online learning platform with 180k learners commissioning expert-led courses on 40/60 revenue share.",
    signals: [
      "Platform has $8M in GMV and growing 80% YoY",
      "Actively recruiting instructors via LinkedIn outreach",
      "Waitlisted categories: AI, finance, no-code, marketing",
    ],
    potential: "$3,500/mo",
    effort: "60 hrs (upfront)",
    keywords: [
      "course", "teach", "education", "training", "expert",
      "instructor", "online", "learning", "knowledge", "content", "write",
    ],
  },
  {
    id: "c3",
    category: "content",
    company: "Growth Engine Podcast",
    domain: "growthengine.fm",
    contact: "David Carr",
    title: "Host",
    industry: "Media",
    size: 8,
    description:
      "Top-20 business podcast with 85k listeners, 22% B2B decision-makers. Sponsorship slots open for Q3.",
    signals: [
      "Host tweeted: '6 sponsor slots for Q3 open — filling fast'",
      "Average sponsor generates 200+ qualified leads per episode",
      "CPM $45 — competitive for audience quality",
    ],
    potential: "$4,500/episode",
    effort: "3 hrs",
    keywords: [
      "podcast", "sponsor", "audio", "marketing", "b2b",
      "content", "brand", "media", "advertising",
    ],
  },

  // ── AUTOMATE ──────────────────────────────────────────────────────────────
  {
    id: "a1",
    category: "automate",
    company: "Prescott Law Partners",
    domain: "prescottlaw.com",
    contact: "Catherine Fox",
    title: "Managing Partner",
    industry: "Legal",
    size: 42,
    description:
      "Law firm spending 60 hours/week on document drafting that can be automated with AI. Billing rate $350/hr.",
    signals: [
      "Associate hours on document prep up 40% with new case volume",
      "Partner mentioned AI in legal at bar association event last month",
      "Approved $60k budget for process automation tools",
    ],
    potential: "$18,000",
    effort: "80 hrs",
    keywords: [
      "automation", "ai", "legal", "document", "workflow",
      "efficiency", "software", "build", "develop", "tool", "python", "engineer",
    ],
  },
  {
    id: "a2",
    category: "automate",
    company: "Rowan Property Group",
    domain: "rowanproperty.com",
    contact: "Tyler Marsh",
    title: "Operations Director",
    industry: "Real Estate",
    size: 65,
    description:
      "200-property management company manually handling all tenant communications. Staff losing 35 hrs/week to repeat questions.",
    signals: [
      "Director posted: 'We need smarter ops — anyone built this?'",
      "Tenant satisfaction scores dropping — slow response times",
      "Budget for tooling confirmed at $25k",
    ],
    potential: "$12,000 + $1,200/mo",
    effort: "100 hrs",
    keywords: [
      "automation", "ai", "chatbot", "property", "real estate",
      "ops", "build", "develop", "workflow", "tenant", "engineer", "python",
    ],
  },
  {
    id: "a3",
    category: "automate",
    company: "GreenCore Logistics",
    domain: "greencorelogistics.com",
    contact: "Amara Obi",
    title: "Head of Operations",
    industry: "Logistics",
    size: 190,
    description:
      "Mid-size logistics company manually reconciling 500+ invoices weekly. CFO presented automation as a Q3 initiative.",
    signals: [
      "Finance team of 4 spending 80% of time on reconciliation",
      "ERP integration budget approved at $50k",
      "CFO presented automation to the board as a cost-reduction priority",
    ],
    potential: "$35,000",
    effort: "120 hrs",
    keywords: [
      "automation", "data", "process", "logistics", "finance",
      "ops", "integration", "build", "develop", "engineer", "python",
    ],
  },

  // ── INVEST ────────────────────────────────────────────────────────────────
  {
    id: "i1",
    category: "invest",
    company: "MicroSaaS Acquisition",
    domain: "microacquire.com",
    contact: "Market Signal",
    title: "—",
    industry: "SaaS",
    size: 0,
    description:
      "Profitable niche SaaS tool listed at 3.2x ARR — market comps are 4–5x. $8k MRR, 2 hrs/week to run.",
    signals: [
      "Listed on MicroAcquire at 3.2x ARR vs 4–5x market comp",
      "90% automated — runs on $200/mo in infrastructure",
      "NPS of 71, churn under 2% monthly",
    ],
    potential: "$8,000/mo",
    effort: "~$310k to acquire",
    keywords: [
      "invest", "saas", "acquire", "acquisition", "passive",
      "income", "software", "business", "buy", "own",
    ],
  },
  {
    id: "i2",
    category: "invest",
    company: "AI Infrastructure Sector Signal",
    domain: "—",
    contact: "Market Intelligence",
    title: "—",
    industry: "Technology",
    size: 0,
    description:
      "Three under-valued AI infrastructure plays showing strong accumulation signals — insider buying 3x above 90-day average.",
    signals: [
      "Insider buying activity 3x above 90-day average across all three",
      "Google Trends: sector search volume up 180% MoM",
      "2 of 3 reported Q1 beats — sector rotation beginning",
    ],
    potential: "Variable",
    effort: "Research + capital",
    keywords: [
      "invest", "stock", "market", "trading", "finance",
      "ai", "tech", "equity", "portfolio", "capital",
    ],
  },
];

// ── Scoring ───────────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with",
  "that", "we", "our", "your", "is", "are", "it", "this", "who", "help",
  "helps", "make", "makes", "made", "build", "builds", "using", "use",
  "uses", "into", "at", "by", "from", "as", "be", "can", "will", "you",
  "i", "my", "me", "have", "been", "good", "great", "best", "better",
  "need", "want", "looking", "seeking", "like", "want", "also", "skills",
  "skill", "work", "working", "years", "experience",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function scoreOpportunities(
  profile: string,
  goals: string,
): (Opportunity & { score: number; reasons: string[] })[] {
  const tokens = new Set([...tokenize(profile), ...tokenize(goals)]);

  const scored = opportunityUniverse.map((opp) => {
    let score = 28;
    const reasons: string[] = [];

    const matched = opp.keywords.filter((k) =>
      k.split(/[\s-]/).some((part) => tokens.has(part)),
    );
    if (matched.length > 0) {
      score += Math.min(matched.length * 11, 50);
      reasons.push(`Strong profile match: ${matched.slice(0, 3).join(", ")}`);
    }

    score += Math.min(opp.signals.length * 4, 12);
    reasons.push(opp.signals[0]);

    if (opp.size > 0 && opp.size >= 20 && opp.size <= 500) {
      score += 5;
      reasons.push(`${opp.size}-person company — fast decisions, real budgets`);
    }

    return { ...opp, score: Math.min(score, 98), reasons };
  });

  return scored.sort((a, b) => b.score - a.score);
}
