// Strategic Overview dummy data — edit numbers here, not in JSX.

export const PAGE_META = {
  title: "Strategic Overview",
  subtitle: "Beehive People & Business Intelligence · Q2 2026 · As of May 2026",
};

export const ORG_HEALTH = {
  score: 65,
  max: 100,
  // 0-49 red, 50-74 amber, 75-89 green, 90-100 dark-green
};

export const REVENUE = {
  projectedAnnual: "AED 1.14B",
  projectedLabel: "Projected Annual Disbursement",
  projectedSub: "113.8% of AED 1B target",
  progressPct: 113.8,
  ytdDisbursed: { value: "AED 474M", label: "5 months" },
  monthlyRunRate: { value: "AED 94.8M", label: "current" },
  aheadOfTarget: { value: "+AED 137.6M", label: "annualised" },
};

// NPL ratio (Non-Performing Loans). Update value here only.
export const NPL = {
  label: "NPL Ratio",
  value: 1.5, // percentage
  rangeMax: 3, // 0–3% scale on indicator bar
  threshold: 2.0, // red marker line
  amberMax: 2.5, // 2.0–2.5 amber, >2.5 red
  subLabel: "Target: under 2.0%",
};

export function nplTone(value: number, threshold = NPL.threshold, amberMax = NPL.amberMax): "green" | "amber" | "red" {
  if (value < threshold) return "green";
  if (value <= amberMax) return "amber";
  return "red";
}

export type TeamStatus = "outperforming" | "at_risk" | "on_track";

export const SALES_TEAMS: {
  name: string;
  runRate: string;
  target: string;
  pct: number;
  status: TeamStatus;
  statusLabel: string;
  members: number;
}[] = [
  {
    name: "Direct Sales",
    runRate: "AED 603.6M annualised",
    target: "AED 450M",
    pct: 134,
    status: "outperforming",
    statusLabel: "Outperforming",
    members: 5,
  },
  {
    name: "Channel Sales",
    runRate: "AED 296.4M annualised",
    target: "AED 350M",
    pct: 84.7,
    status: "at_risk",
    statusLabel: "At Risk",
    members: 4,
  },
  {
    name: "WCF",
    runRate: "AED 237.6M annualised",
    target: "AED 200M",
    pct: 118.8,
    status: "on_track",
    statusLabel: "On Track",
    members: 3,
  },
];

export const REVENUE_INSIGHT =
  "Direct Sales is running 34% above target, offsetting Channel Sales which is AED 53.6M behind. If Channel Sales maintains current pace, the company still closes above AED 1B. Closing the Channel Sales gap requires 2 additional ramped IC3s by Q3.";

export type RAG = "green" | "amber" | "red";

export const PILLARS: {
  name: string;
  color: string;
  rag: RAG;
  ragLabel: string;
  krOnTrack: number;
  krTotal: number;
  summary: string;
  pillarId: string;
}[] = [
  {
    name: "Revenue & Loan Book",
    color: "#10B981",
    rag: "amber",
    ragLabel: "At Risk",
    krOnTrack: 3,
    krTotal: 7,
    summary: "Channel partner expansion and WCF SME targets behind pace",
    pillarId: "revenue",
  },
  {
    name: "Operational Excellence",
    color: "#2563EB",
    rag: "amber",
    ragLabel: "At Risk",
    krOnTrack: 3,
    krTotal: 6,
    summary: "Platform uptime strong — ops dashboard and manual intervention targets lagging",
    pillarId: "operational",
  },
  {
    name: "Employee Productivity",
    color: "#7C3AED",
    rag: "green",
    ragLabel: "On Track",
    krOnTrack: 4,
    krTotal: 7,
    summary: "Career framework launched — review cycle and manager training need acceleration",
    pillarId: "employee",
  },
  {
    name: "Governance & Culture",
    color: "#D4A437",
    rag: "green",
    ragLabel: "On Track",
    krOnTrack: 4,
    krTotal: 6,
    summary: "Regulatory compliance solid — ISO 27001 and ESG report in progress",
    pillarId: "governance",
  },
  {
    name: "AI Adoption",
    color: "#0D9488",
    rag: "amber",
    ragLabel: "At Risk",
    krOnTrack: 4,
    krTotal: 7,
    summary: "AI writing assistant live — employee adoption and credit scoring model behind",
    pillarId: "ai",
  },
];

export const HEALTH_COMPONENTS: {
  name: string;
  score: number;
  weight: number;
  summary: string;
  link: string;
}[] = [
  {
    name: "Promotion Health",
    score: 80,
    weight: 25,
    summary: "10 of 50 employees overdue for promotion",
    link: "/overview",
  },
  {
    name: "Talent Retention Risk",
    score: 84,
    weight: 25,
    summary: "8 employees flagged as flight risk",
    link: "/org-design?tab=ninebox",
  },
  {
    name: "Review Coverage",
    score: 35,
    weight: 20,
    summary: "First review cycle not yet complete — Q2 baseline",
    link: "/reviews",
  },
  {
    name: "Goal Execution",
    score: 56,
    weight: 30,
    summary: "24 green · 28 amber · 16 red across all dept KRs",
    link: "/goals",
  },
];

export const HEALTH_INSIGHT =
  "Review Coverage is dragging the index. Once the Q2 review cycle completes, this score is expected to rise to ~55, pushing the overall index to approximately 72/100. The single highest-impact action is completing manager review training.";

export type ChipTone = "green" | "amber" | "red" | "neutral";

export const PEOPLE_KPIS: {
  label: string;
  value: string;
  sub?: string;
  chip?: { label: string; tone: ChipTone };
  link?: string;
  popover?: string; // key for popover content
}[] = [
  { label: "Total Headcount", value: "50", sub: "3 locations", link: "/overview" },
  { label: "Fully Loaded Monthly Payroll", value: "AED 2.78M", sub: "base AED 2.14M + 30% overhead" },
  { label: "Fully Loaded Annual Payroll", value: "AED 33.3M", sub: "across all levels and departments" },
  {
    label: "Payroll as % of Revenue",
    value: "2.9%",
    sub: "industry benchmark ~8–12%",
    chip: { label: "Efficient", tone: "green" },
  },
  { label: "Revenue Per Employee", value: "AED 22.75M", sub: "annualised · all 50 employees" },
  {
    label: "At-Risk Employees",
    value: "8",
    chip: { label: "Needs Action", tone: "red" },
    link: "/org-design?tab=ninebox",
  },
  {
    label: "Overdue for Promotion",
    value: "10",
    chip: { label: "Review Needed", tone: "amber" },
    link: "/overview",
  },
  {
    label: "Open Roles",
    value: "5",
    sub: "across Technology and Credit",
    chip: { label: "Active", tone: "amber" },
    popover: "open_roles",
  },
];

export const OPEN_ROLES = [
  { title: "Senior Engineer", department: "Technology", level: "IC5", urgency: "Urgent" },
  { title: "Senior Engineer", department: "Technology", level: "IC5", urgency: "Urgent" },
  { title: "Credit Analyst", department: "Credit", level: "IC3", urgency: "Active" },
  { title: "WCF Sales Lead", department: "Business Development", level: "IC4", urgency: "Active" },
  { title: "KSA Ops Lead", department: "Operations", level: "MG1", urgency: "Active" },
];

export const FLIGHT_RISK = [
  { name: "Nadia Farouk", department: "Executive", level: "EX2", reason: "48 months no promotion" },
  { name: "James Thornton", department: "Technology", level: "EX2", reason: "41 months no promotion" },
  { name: "Layla Hassan", department: "Finance", level: "EX2", reason: "36 months no promotion" },
  { name: "Omar Siddiqui", department: "HR", level: "EX1", reason: "27 months no promotion" },
  { name: "Khalid Bin Yousef", department: "Operations", level: "MG4", reason: "Stagnant + bottom-half 9-box" },
  { name: "Rashed Al Blooshi", department: "Biz Dev", level: "MG4", reason: "Stagnant + bottom-half 9-box" },
  { name: "Fatima Al Zaabi", department: "Compliance", level: "MG3", reason: "Stagnant + bottom-half 9-box" },
  { name: "Maryam Khalil", department: "Investor Relations", level: "MG3", reason: "Stagnant + bottom-half 9-box" },
];

export const PROMO_READY = [
  { name: "Priya Menon", department: "Technology", from: "MG3", to: "MG4", track: "MG" },
  { name: "Daniel Osei", department: "Finance", from: "MG2", to: "MG3", track: "MG" },
  { name: "Shaikha Al Maktoum", department: "Technology", from: "IC3", to: "IC4", track: "IC" },
  { name: "Rohan Verma", department: "Technology", from: "IC4", to: "IC5", track: "IC" },
  { name: "Sophie Laurent", department: "Technology", from: "IC3", to: "IC4", track: "IC" },
  { name: "Sara Al Mansoori", department: "Credit", from: "MG3", to: "MG4", track: "MG" },
];

export type Severity = "critical" | "high" | "monitor";

export const ACTIONS: {
  severity: Severity;
  title: string;
  detail: string;
  link: string;
}[] = [
  {
    severity: "critical",
    title: "Resolve senior leadership promotion backlog",
    detail: "COO, CTO and CFO are 36–48 months without promotion. Retention risk at the top of the org.",
    link: "/overview",
  },
  {
    severity: "critical",
    title: "Close Channel Sales gap",
    detail: "Channel Sales is AED 53.6M behind annualised target. Review team capacity and consider 2 IC3 hires.",
    link: "/org-design?tab=capacity",
  },
  {
    severity: "critical",
    title: "Unblock 4 red KRs in Revenue pillar",
    detail: "Partner portal not started, WCF KSA approval pending, channel partner acquisition behind.",
    link: "/goals?pillar=revenue",
  },
  {
    severity: "high",
    title: "Complete manager review training",
    detail: "Review coverage score is 35/100 — lowest component dragging Org Health Index. Q2 cycle at risk.",
    link: "/goals?dept=HR",
  },
  {
    severity: "high",
    title: "Fill 2 urgent Technology roles",
    detail: "Two senior engineer roles open and marked urgent. Tech hiring KR is red.",
    link: "/goals?dept=Technology",
  },
  {
    severity: "high",
    title: "Activate promotion pipeline for 6 ready employees",
    detail: "6 high performers identified as promotion-ready. Delaying risks losing them to Flight Risk category.",
    link: "/org-design?tab=ninebox",
  },
  {
    severity: "monitor",
    title: "WCF KSA regulatory approval",
    detail: "KSA expansion blocked on regulatory sign-off. Track weekly — unblocking this opens a new revenue lane.",
    link: "/goals?dept=Credit",
  },
  {
    severity: "monitor",
    title: "NPL ratio tracking",
    detail:
      "Current NPL at 1.5%, within the 2.0% threshold. WCF KSA expansion and new borrower onboarding may apply upward pressure in Q3. Review monthly.",
    link: "/goals?dept=Credit",
  },
];
