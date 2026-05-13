// Incentives Calculator — constants & rules
// All values editable via Policy Settings UI; treat these as defaults.

export type Team = "Direct Sales" | "Channel Sales" | "WCF" | "BSS";
export type DealType =
  | "Self-sourced"
  | "Channel Partner"
  | "Top-up"
  | "BSS-generated";
export type Product = "TF" | "WCF";

export interface DealRow {
  bdName: string;
  team: Team;
  dealDate: string; // ISO
  disbursalDate: string; // ISO
  loanAmount: number; // AED, principal
  feePct: number; // e.g. 3.5
  dealType: DealType;
  product: Product;
  disbursed: boolean;
}

export const EXPECTED_CSV_COLUMNS = [
  "BD Name",
  "Team",
  "Deal Date",
  "Disbursal Date",
  "Loan Amount",
  "Fee % Charged",
  "Deal Type",
  "Product",
  "Disbursed",
] as const;

export interface SlabRow {
  fromAED: number;
  toAED: number | null; // null = open-ended
  pct: number; // 0.0045 = 0.45%
}

export interface FixedGridRow {
  fromAED: number;
  toAED: number | null;
  payoutAED: number;
}

export interface TeamLeadTier {
  fromPct: number;
  toPct: number | null;
  bonusAED: number;
}

export const DEFAULT_PERIOD = {
  startDay: 16, // of previous month
  endDay: 15, // of current month
  payoutDay: 16,
};

export const MIN_THRESHOLD_AED = 3_000_000;

export const BD_SLABS: SlabRow[] = [
  { fromAED: 0, toAED: 3_000_000, pct: 0 },
  { fromAED: 3_000_000, toAED: 3_500_000, pct: 0.0045 },
  { fromAED: 3_510_000, toAED: 5_000_000, pct: 0.005 },
  { fromAED: 5_010_000, toAED: 6_000_000, pct: 0.006 },
  { fromAED: 6_010_000, toAED: null, pct: 0.0065 },
];

export const CHANNEL_PARTNER_GRID: FixedGridRow[] = [
  { fromAED: 0, toAED: 500_000, payoutAED: 1500 },
  { fromAED: 500_000, toAED: 990_000, payoutAED: 2500 },
  { fromAED: 1_000_000, toAED: null, payoutAED: 3000 },
];

export const TOPUP_GRID: FixedGridRow[] = [
  { fromAED: 0, toAED: 500_000, payoutAED: 1500 },
  { fromAED: 500_000, toAED: 750_000, payoutAED: 2500 },
  { fromAED: 750_000, toAED: null, payoutAED: 3000 },
];

export const BSS_INCENTIVES = {
  leadToBdClosedAED: 300,
  bssDirectClosePct: 0.004,
};

export const WCF_INCENTIVES = {
  onboardingPct: 0.004,
  onboardingMinCreditLineAED: 2_500_000,
  utilisationWindowDays: 30,
  quarterlyUtilisationPct: 0.001,
};

export const TEAM_LEAD_TIERS: TeamLeadTier[] = [
  { fromPct: 75, toPct: 89, bonusAED: 5_000 },
  { fromPct: 90, toPct: 99, bonusAED: 10_000 },
  { fromPct: 100, toPct: 109, bonusAED: 15_000 },
  { fromPct: 110, toPct: null, bonusAED: 20_000 },
];

export const QUARTERLY_REWARDS = {
  highestDisbursedAED: 10_000,
  noDropoffsAED: 2_000,
  earlyStarterPerDealAED: 2_000,
  crmHygieneAED: 2_500,
};

export const POLICY = {
  clawbackMonths: 6,
  standardFeePct: 3.5,
  maxDiscountPct: 3.0,
};

// ===== Helpers =====
export const fmtAED = (n: number) =>
  "AED " + Math.round(n).toLocaleString("en-US");

export function currentPeriodWindow(today = new Date()) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  // If today is on/after end-day +1, window is current cycle: 16th prev → 15th curr
  const start =
    d > DEFAULT_PERIOD.endDay
      ? new Date(y, m, DEFAULT_PERIOD.startDay)
      : new Date(y, m - 1, DEFAULT_PERIOD.startDay);
  const end =
    d > DEFAULT_PERIOD.endDay
      ? new Date(y, m + 1, DEFAULT_PERIOD.endDay)
      : new Date(y, m, DEFAULT_PERIOD.endDay);
  return { start, end };
}

export function slabFor(totalDisbursed: number, slabs = BD_SLABS): SlabRow {
  for (const s of slabs) {
    if (
      totalDisbursed >= s.fromAED &&
      (s.toAED === null || totalDisbursed <= s.toAED)
    )
      return s;
  }
  return slabs[0];
}

export function fixedGridPayout(amount: number, grid: FixedGridRow[]): number {
  for (const r of grid) {
    if (amount >= r.fromAED && (r.toAED === null || amount <= r.toAED))
      return r.payoutAED;
  }
  return 0;
}

export interface BDSummary {
  bdName: string;
  team: Team;
  totalDisbursed: number;
  selfDisbursed: number;
  channelDeals: number;
  topupDeals: number;
  slabReachedPct: number;
  slabPayout: number;
  fixedPayout: number;
  totalIncentive: number;
  met: boolean;
  deals: DealRow[];
}

export function calcIncentives(rows: DealRow[]): BDSummary[] {
  const byBd = new Map<string, DealRow[]>();
  for (const r of rows) {
    if (!r.disbursed) continue;
    const arr = byBd.get(r.bdName) ?? [];
    arr.push(r);
    byBd.set(r.bdName, arr);
  }
  const out: BDSummary[] = [];
  for (const [bdName, deals] of byBd) {
    const team = deals[0].team;
    const totalDisbursed = deals.reduce((s, d) => s + d.loanAmount, 0);
    const selfDeals = deals.filter((d) => d.dealType === "Self-sourced");
    const selfDisbursed = selfDeals.reduce((s, d) => s + d.loanAmount, 0);
    const channelDeals = deals.filter((d) => d.dealType === "Channel Partner");
    const topupDeals = deals.filter((d) => d.dealType === "Top-up");
    const met = totalDisbursed >= MIN_THRESHOLD_AED;
    const slab = slabFor(totalDisbursed);
    const slabPayout = met ? selfDisbursed * slab.pct : 0;
    const fixedPayout =
      channelDeals.reduce(
        (s, d) => s + fixedGridPayout(d.loanAmount, CHANNEL_PARTNER_GRID),
        0,
      ) +
      topupDeals.reduce(
        (s, d) => s + fixedGridPayout(d.loanAmount, TOPUP_GRID),
        0,
      );
    out.push({
      bdName,
      team,
      totalDisbursed,
      selfDisbursed,
      channelDeals: channelDeals.length,
      topupDeals: topupDeals.length,
      slabReachedPct: slab.pct * 100,
      slabPayout,
      fixedPayout,
      totalIncentive: slabPayout + fixedPayout,
      met,
      deals,
    });
  }
  return out.sort((a, b) => b.totalIncentive - a.totalIncentive);
}

export function nextSlabGap(totalDisbursed: number): {
  next: SlabRow | null;
  gap: number;
} {
  for (const s of BD_SLABS) {
    if (totalDisbursed < s.fromAED) {
      return { next: s, gap: s.fromAED - totalDisbursed };
    }
  }
  return { next: null, gap: 0 };
}