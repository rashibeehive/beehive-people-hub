// Career framework data — edit copy here without touching components.

export type Track = "IC" | "MG" | "EX";

export interface LevelInfo {
  code: string;
  track: Track;
  title: string;
  salaryMin: number;
  salaryMax: number;
  headcount: number;
}

export const LEVELS: LevelInfo[] = [
  { code: "IC1", track: "IC", title: "Associate Analyst", salaryMin: 6000, salaryMax: 10000, headcount: 5 },
  { code: "IC2", track: "IC", title: "Analyst", salaryMin: 11000, salaryMax: 18000, headcount: 9 },
  { code: "IC3", track: "IC", title: "Senior Analyst", salaryMin: 18000, salaryMax: 28000, headcount: 10 },
  { code: "IC4", track: "IC", title: "Lead Analyst", salaryMin: 26000, salaryMax: 36000, headcount: 5 },
  { code: "IC5", track: "IC", title: "Principal Analyst", salaryMin: 36000, salaryMax: 50000, headcount: 1 },
  { code: "IC6", track: "IC", title: "Staff Analyst", salaryMin: 48000, salaryMax: 65000, headcount: 0 },
  { code: "MG1", track: "MG", title: "Team Lead", salaryMin: 32000, salaryMax: 40000, headcount: 5 },
  { code: "MG2", track: "MG", title: "Manager", salaryMin: 42000, salaryMax: 56000, headcount: 4 },
  { code: "MG3", track: "MG", title: "Senior Manager", salaryMin: 58000, salaryMax: 75000, headcount: 4 },
  { code: "MG4", track: "MG", title: "Director", salaryMin: 78000, salaryMax: 100000, headcount: 2 },
  { code: "EX1", track: "EX", title: "VP", salaryMin: 100000, salaryMax: 130000, headcount: 1 },
  { code: "EX2", track: "EX", title: "C-Suite", salaryMin: 135000, salaryMax: 165000, headcount: 3 },
  { code: "EX3", track: "EX", title: "CEO", salaryMin: 180000, salaryMax: 220000, headcount: 1 },
];

export const TRACK_META: Record<Track, { label: string; colorBar: string; rowTint: string; chip: string; dot: string }> = {
  IC: {
    label: "Individual Contributor",
    colorBar: "bg-blue-500",
    rowTint: "bg-blue-500/5",
    chip: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    dot: "bg-blue-500",
  },
  MG: {
    label: "Manager",
    colorBar: "bg-purple-500",
    rowTint: "bg-purple-500/5",
    chip: "bg-purple-500/10 text-purple-700 border-purple-500/30",
    dot: "bg-purple-500",
  },
  EX: {
    label: "Executive",
    colorBar: "bg-amber-500",
    rowTint: "bg-amber-500/5",
    chip: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    dot: "bg-amber-500",
  },
};

export const COMPETENCY_CATEGORIES = [
  {
    name: "Decision & Action",
    competencies: [
      "Proactive Decision Making",
      "Problem Solving",
      "Initiative",
      "Bias for Action",
    ],
  },
  {
    name: "Ownership",
    competencies: [
      "Ownership and Accountability",
      "Responsibility",
      "Ethical Conduct",
      "Self-Reflection and Awareness",
    ],
  },
  {
    name: "Communication",
    competencies: [
      "Open Communication",
      "Transparency & Clarity",
      "Active Listening",
      "Feedback Exchange",
    ],
  },
  {
    name: "Performance",
    competencies: [
      "High Performance Orientation",
      "Excellence",
      "Goal-Setting",
      "Resilience",
    ],
  },
] as const;

export const COMPETENCY_DEFINITIONS: Record<string, string> = {
  "Proactive Decision Making":
    "The ability to anticipate decisions before they become urgent and act with appropriate context. At Beehive this means weighing trade-offs against customer impact and long-term strategy.",
  "Problem Solving":
    "Breaking down complex situations into solvable parts and arriving at well-reasoned solutions. At Beehive this means combining structured thinking with pragmatism in a fast-moving fintech environment.",
  "Initiative":
    "Taking action without being asked when an opportunity or risk is visible. At Beehive this means moving the business forward even when ownership is unclear.",
  "Bias for Action":
    "Choosing motion over deliberation when speed creates value. At Beehive this means making reversible decisions quickly and learning from outcomes.",
  "Ownership and Accountability":
    "Treating outcomes as personal regardless of who else is involved. At Beehive this means following through on commitments and owning misses publicly.",
  "Responsibility":
    "Honouring obligations to teammates, customers and the business. At Beehive this means being the person others can rely on.",
  "Ethical Conduct":
    "Making decisions that hold up under scrutiny — legal, regulatory and personal. At Beehive this is non-negotiable given our role in financial services.",
  "Self-Reflection and Awareness":
    "Understanding how one's behaviour lands on others and adjusting accordingly. At Beehive this means actively seeking feedback and acting on it.",
  "Open Communication":
    "Sharing information generously, including the uncomfortable parts. At Beehive this means defaulting to transparency unless confidentiality is required.",
  "Transparency & Clarity":
    "Communicating in a way that leaves no ambiguity about intent or status. At Beehive this means writing and speaking so the audience can act on it.",
  "Active Listening":
    "Hearing what is said and what is meant. At Beehive this means asking the question behind the question before responding.",
  "Feedback Exchange":
    "Giving and receiving feedback as a routine, low-drama part of work. At Beehive this is how we improve faster than competitors.",
  "High Performance Orientation":
    "Setting and meeting a high bar for output and impact. At Beehive this means treating performance as a craft that compounds.",
  "Excellence":
    "Caring about quality in the details others overlook. At Beehive this means our work reflects the standards of a regulated, customer-facing business.",
  "Goal-Setting":
    "Translating ambition into specific, measurable outcomes. At Beehive this means tying personal goals to OKR pillars.",
  "Resilience":
    "Recovering from setbacks without losing momentum. At Beehive this means staying effective during ambiguity, regulatory change and rapid growth.",
};

const ALL_LEVEL_CODES = LEVELS.map((l) => l.code);

function tierFor(code: string): "ic12" | "ic34" | "ic56" | "mg12" | "mg34" | "ex" {
  if (code === "IC1" || code === "IC2") return "ic12";
  if (code === "IC3" || code === "IC4") return "ic34";
  if (code === "IC5" || code === "IC6") return "ic56";
  if (code === "MG1" || code === "MG2") return "mg12";
  if (code === "MG3" || code === "MG4") return "mg34";
  return "ex";
}

const TIER_TEMPLATES: Record<
  ReturnType<typeof tierFor>,
  (competency: string) => string
> = {
  ic12: (c) =>
    `Learns the fundamentals of ${c.toLowerCase()} with active guidance from more senior teammates. Follows established patterns and asks questions to build understanding. Begins to apply ${c.toLowerCase()} to small, well-scoped pieces of work.`,
  ic34: (c) =>
    `Applies ${c.toLowerCase()} independently across day-to-day work in their domain. Makes consistent, sound judgement calls without needing oversight on routine matters. Recognises when a situation exceeds their experience and escalates with context.`,
  ic56: (c) =>
    `Sets the standard for ${c.toLowerCase()} within their domain and is the person peers turn to for guidance. Shapes how the team approaches ${c.toLowerCase()} through patterns, examples and direct coaching. Spots emerging gaps and closes them before they become problems.`,
  mg12: (c) =>
    `Builds ${c.toLowerCase()} capability across their team through coaching, feedback and structured development. Creates the conditions for direct reports to practise ${c.toLowerCase()} safely. Connects team-level execution to broader business context.`,
  mg34: (c) =>
    `Drives organisational capability in ${c.toLowerCase()} across multiple teams or a function. Designs systems, rituals and hiring bars that compound ${c.toLowerCase()} over time. Holds the leadership team accountable to the standard.`,
  ex: (c) =>
    `Sets the company-wide vision for ${c.toLowerCase()} and models it visibly at every interaction. Operates at board and market level, ensuring ${c.toLowerCase()} is embedded in strategy, culture and capital allocation. The bar at the top of the company is the bar for everyone.`,
};

// descriptors[competency][levelCode] = string
export const COMPETENCY_DESCRIPTORS: Record<string, Record<string, string>> = (() => {
  const out: Record<string, Record<string, string>> = {};
  for (const cat of COMPETENCY_CATEGORIES) {
    for (const comp of cat.competencies) {
      out[comp] = {};
      for (const code of ALL_LEVEL_CODES) {
        out[comp][code] = TIER_TEMPLATES[tierFor(code)](comp);
      }
    }
  }
  return out;
})();

// Progression bullets per level.
const TIER_PROGRESSION: Record<
  ReturnType<typeof tierFor>,
  { demonstrates: string[]; develops: string[] }
> = {
  ic12: {
    demonstrates: [
      "Reliable execution on well-scoped tasks with guidance",
      "Strong learning posture and openness to feedback",
      "Basic fluency in the team's tools, language and rituals",
    ],
    develops: [
      "Independent ownership of routine work end-to-end",
      "Confidence to push back with reasoning, not just defer",
      "Broader context on how their work ladders up",
    ],
  },
  ic34: {
    demonstrates: [
      "Independent delivery across most work in their domain",
      "Sound judgement on trade-offs without escalating every call",
      "Recognition as a dependable contributor by peers",
    ],
    develops: [
      "Influence beyond their own work — pulling others up",
      "Setting standards that the team adopts",
      "Spotting and closing gaps before they're flagged",
    ],
  },
  ic56: {
    demonstrates: [
      "Domain leadership and cross-team influence",
      "Standards-setting through patterns and direct coaching",
      "Strategic framing of technical or functional choices",
    ],
    develops: [
      "Multiplier effect through people, not just personal output",
      "Comfort operating at the edge of ambiguity",
      "Choice of track: continued IC depth or transition to MG",
    ],
  },
  mg12: {
    demonstrates: [
      "Effective coaching and feedback to direct reports",
      "Operational excellence in team rituals and delivery",
      "Translation of strategy into team-level outcomes",
    ],
    develops: [
      "Influence across functions, not just within own team",
      "Hiring bar ownership and talent density",
      "Sharper read on business and market context",
    ],
  },
  mg34: {
    demonstrates: [
      "Multi-team or functional leadership at scale",
      "Talent strategy, hiring bar and succession in place",
      "Clear operating model that compounds over time",
    ],
    develops: [
      "Cross-functional and board-level credibility",
      "Long-range strategy framing beyond a single function",
      "Public representation of Beehive externally",
    ],
  },
  ex: {
    demonstrates: [
      "Company-wide vision setting and capital allocation",
      "Visible cultural modelling at every interaction",
      "Board, regulator and market-grade communication",
    ],
    develops: [
      "Step-changes in scale, geography or product line",
      "Industry-shaping voice and influence",
      "Succession depth across the executive team",
    ],
  },
};

export function progressionFor(code: string) {
  const idx = LEVELS.findIndex((l) => l.code === code);
  const prev = idx > 0 ? LEVELS[idx - 1] : null;
  const next = idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  const tier = tierFor(code);
  return {
    prev,
    next,
    demonstrates: TIER_PROGRESSION[tier].demonstrates,
    develops: TIER_PROGRESSION[tier].develops,
  };
}

export const DEPARTMENTS = [
  "Technology",
  "Finance",
  "HR",
  "Credit",
  "Operations",
  "Business Development",
  "Compliance",
  "Marketing",
  "Investor Relations",
  "Executive",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const HEADCOUNT_BY_DEPT_LEVEL: Record<Department, Partial<Record<string, number>>> = {
  Technology: { IC1: 1, IC2: 1, IC3: 2, IC4: 1, MG1: 1, MG2: 1, MG3: 1, MG4: 1, EX2: 1 },
  Finance: { IC1: 1, IC2: 1, IC3: 1, IC4: 1, MG2: 1, EX2: 1 },
  HR: { IC1: 1, IC2: 1, IC3: 1, IC4: 1, MG1: 1, EX1: 1 },
  Credit: { IC2: 2, IC3: 2, IC4: 1, MG1: 1, MG3: 1 },
  Operations: { IC1: 1, IC2: 1, IC3: 2, IC4: 1, MG1: 1, MG3: 1 },
  "Business Development": { IC2: 2, IC3: 1, MG2: 1, MG4: 1 },
  Compliance: { IC3: 1, IC4: 1, MG1: 1, MG3: 1 },
  Marketing: { IC2: 1, IC3: 1, IC4: 1, MG2: 1 },
  "Investor Relations": { IC3: 1, IC4: 1, MG3: 1 },
  Executive: { EX2: 2, EX3: 1 },
};

export function headcountFor(levelCode: string, dept: Department | "all"): number {
  if (dept === "all") {
    return LEVELS.find((l) => l.code === levelCode)?.headcount ?? 0;
  }
  return HEADCOUNT_BY_DEPT_LEVEL[dept]?.[levelCode] ?? 0;
}