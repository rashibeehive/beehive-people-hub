// =====================================================
// Sales Performance dummy data — edit numbers here, not in JSX.
// All finance amounts are AED Millions (AEDMn) unless noted.
// =====================================================

export type Geography = "UAE" | "Oman" | "KSA";

export const GEOGRAPHIES: Geography[] = ["UAE", "Oman", "KSA"];

/** Tailwind tint classes per geography (for header/product rows). */
export const GEO_TINTS: Record<
  Geography,
  { headerBg: string; rowBg: string; pill: string; dot: string; label: string }
> = {
  UAE: {
    headerBg: "bg-amber-200/80",
    rowBg: "bg-amber-50",
    pill: "bg-amber-100 text-amber-900 border-amber-300",
    dot: "bg-amber-400",
    label: "UAE",
  },
  Oman: {
    headerBg: "bg-orange-200/80",
    rowBg: "bg-orange-50",
    pill: "bg-orange-100 text-orange-900 border-orange-300",
    dot: "bg-orange-400",
    label: "Oman",
  },
  KSA: {
    headerBg: "bg-sky-200/80",
    rowBg: "bg-sky-50",
    pill: "bg-sky-100 text-sky-900 border-sky-300",
    dot: "bg-sky-400",
    label: "KSA",
  },
};

export const PRODUCTS_BY_GEO: Record<Geography, string[]> = {
  UAE: ["TF", "EDB TF", "WCF Utilisation", "WCF Activation"],
  Oman: ["TF"],
  KSA: ["GIB TF", "GIB WCF", "Themar-TF"],
};

export const ALL_PRODUCTS: { geo: Geography; product: string }[] = GEOGRAPHIES.flatMap(
  (g) => PRODUCTS_BY_GEO[g].map((p) => ({ geo: g, product: p })),
);

export const BD_REPS: { id: string; name: string; geo: Geography }[] = [
  { id: "ahmed",  name: "Ahmed Al Marri",     geo: "UAE" },
  { id: "noura",  name: "Noura Al Hashimi",   geo: "UAE" },
  { id: "yousef", name: "Yousef Bin Saeed",   geo: "UAE" },
  { id: "salim",  name: "Salim Al Hinai",     geo: "Oman" },
  { id: "faisal", name: "Faisal Al Otaibi",   geo: "KSA" },
  { id: "lina",   name: "Lina Al Qahtani",    geo: "KSA" },
];

/** Current period anchor — May 2026. */
export const CURRENT = {
  year: 2026,
  quarter: "Q2",
  monthLabel: "May",
  monthIndex: 5,
  weeks: ["W1", "W2", "W3", "W4", "W5"],
};

export const HISTORICAL_MONTHS = ["Feb", "Mar", "Apr"] as const;

/** Full-year month labels for MoM/QoQ visualisations. */
export const YEAR_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;
export type YearMonth = (typeof YEAR_MONTHS)[number];

export type ProductKey = string; // `${geo}::${product}`
export const pkey = (geo: Geography, product: string): ProductKey => `${geo}::${product}`;

/** Aggregated historical month totals (AEDMn) per product. */
export const HISTORICAL_TOTALS: Record<ProductKey, Record<(typeof HISTORICAL_MONTHS)[number], number>> = {
  [pkey("UAE", "TF")]:               { Feb: 38.2, Mar: 41.7, Apr: 45.3 },
  [pkey("UAE", "EDB TF")]:           { Feb: 12.4, Mar: 14.1, Apr: 15.8 },
  [pkey("UAE", "WCF Utilisation")]:  { Feb: 18.6, Mar: 19.2, Apr: 21.4 },
  [pkey("UAE", "WCF Activation")]:   { Feb:  4.2, Mar:  5.1, Apr:  6.0 },
  [pkey("Oman", "TF")]:              { Feb:  8.4, Mar:  9.1, Apr:  9.8 },
  [pkey("KSA", "GIB TF")]:           { Feb:  6.1, Mar:  7.8, Apr:  9.4 },
  [pkey("KSA", "GIB WCF")]:          { Feb:  3.2, Mar:  4.0, Apr:  5.1 },
  [pkey("KSA", "Themar-TF")]:        { Feb:  2.0, Mar:  2.7, Apr:  3.6 },
};

/** Optional Jan totals per product (AEDMn) — used by MoM/QoQ charts. */
export const JAN_TOTALS: Record<ProductKey, number> = {
  [pkey("UAE", "TF")]:               34.5,
  [pkey("UAE", "EDB TF")]:           10.8,
  [pkey("UAE", "WCF Utilisation")]:  16.4,
  [pkey("UAE", "WCF Activation")]:    3.6,
  [pkey("Oman", "TF")]:               7.6,
  [pkey("KSA", "GIB TF")]:            5.2,
  [pkey("KSA", "GIB WCF")]:           2.7,
  [pkey("KSA", "Themar-TF")]:         1.6,
};

/** Current-month weekly entries: per product per BD rep per week (AEDMn). */
export type WeeklyEntry = {
  product: string;
  geo: Geography;
  repId: string;
  week: (typeof CURRENT.weeks)[number];
  amount: number;
};

// Helper for compact seeding
function W(geo: Geography, product: string, perWeek: Partial<Record<string, Record<string, number>>>): WeeklyEntry[] {
  const out: WeeklyEntry[] = [];
  Object.entries(perWeek).forEach(([repId, weeks]) => {
    Object.entries(weeks ?? {}).forEach(([week, amount]) => {
      out.push({ geo, product, repId, week, amount });
    });
  });
  return out;
}

export const WEEKLY_ENTRIES: WeeklyEntry[] = [
  ...W("UAE", "TF", {
    ahmed:  { W1: 4.2, W2: 5.1, W3: 4.6, W4: 5.5, W5: 0 },
    noura:  { W1: 3.1, W2: 3.4, W3: 4.0, W4: 4.2, W5: 0 },
    yousef: { W1: 2.8, W2: 3.0, W3: 3.5, W4: 3.8, W5: 0 },
  }),
  ...W("UAE", "EDB TF", {
    ahmed:  { W1: 1.8, W2: 2.1, W3: 2.4, W4: 2.6, W5: 0 },
    noura:  { W1: 1.2, W2: 1.5, W3: 1.7, W4: 1.9, W5: 0 },
  }),
  ...W("UAE", "WCF Utilisation", {
    yousef: { W1: 4.5, W2: 5.0, W3: 5.4, W4: 5.8, W5: 0 },
    noura:  { W1: 1.6, W2: 1.8, W3: 2.0, W4: 2.2, W5: 0 },
  }),
  ...W("UAE", "WCF Activation", {
    yousef: { W1: 0.9, W2: 1.1, W3: 1.3, W4: 1.5, W5: 0 },
    ahmed:  { W1: 0.6, W2: 0.7, W3: 0.8, W4: 0.9, W5: 0 },
  }),
  ...W("Oman", "TF", {
    salim:  { W1: 2.3, W2: 2.6, W3: 2.8, W4: 3.0, W5: 0 },
  }),
  ...W("KSA", "GIB TF", {
    faisal: { W1: 1.8, W2: 2.2, W3: 2.5, W4: 2.8, W5: 0 },
    lina:   { W1: 1.0, W2: 1.3, W3: 1.5, W4: 1.7, W5: 0 },
  }),
  ...W("KSA", "GIB WCF", {
    faisal: { W1: 0.9, W2: 1.1, W3: 1.3, W4: 1.5, W5: 0 },
    lina:   { W1: 0.5, W2: 0.6, W3: 0.7, W4: 0.8, W5: 0 },
  }),
  ...W("KSA", "Themar-TF", {
    lina:   { W1: 0.7, W2: 0.9, W3: 1.0, W4: 1.2, W5: 0 },
  }),
];

/** MTD budget per product per month (AEDMn). */
export const MONTHLY_BUDGETS: Record<ProductKey, Record<string, number>> = {
  [pkey("UAE", "TF")]:              { Feb: 40, Mar: 42, Apr: 45, May: 50 },
  [pkey("UAE", "EDB TF")]:          { Feb: 14, Mar: 15, Apr: 16, May: 18 },
  [pkey("UAE", "WCF Utilisation")]: { Feb: 18, Mar: 20, Apr: 22, May: 24 },
  [pkey("UAE", "WCF Activation")]:  { Feb:  5, Mar:  6, Apr:  7, May:  8 },
  [pkey("Oman", "TF")]:             { Feb:  9, Mar: 10, Apr: 11, May: 12 },
  [pkey("KSA", "GIB TF")]:          { Feb:  7, Mar:  8, Apr: 10, May: 12 },
  [pkey("KSA", "GIB WCF")]:         { Feb:  4, Mar:  5, Apr:  6, May:  7 },
  [pkey("KSA", "Themar-TF")]:       { Feb:  2, Mar:  3, Apr:  4, May:  5 },
};

export const ANNUAL_TARGET = 1000; // AEDMn (AED 1B)

/** Disbursement rate target (%). */
export const DISBURSEMENT_RATE_TARGET = 75;

/**
 * Derived "average time to disburse" in days, from the TTR bucket distribution
 * of the most recent month. Each bucket is mapped to a midpoint in days.
 */
export const TTR_BUCKET_MIDPOINTS = {
  "0–7 Days":   3.5,
  "8–14 Days": 11,
  "15–21 Days": 18,
  "22–28 Days": 25,
  "28+ Days":   32,
} as const;

// ===================== Section 2 =====================
// Approved vs Disbursed monthly (AEDMn) — last 6 months.

export type ApprovedDisbursed = {
  month: string; // e.g. "Dec-25"
  approved: number;
  disbursed: number;
  geo: Geography;
  product: string;
};

export const APPROVED_DISBURSED: ApprovedDisbursed[] = [
  // UAE TF
  { month: "Dec-25", geo: "UAE", product: "TF",              approved: 52, disbursed: 41 },
  { month: "Jan-26", geo: "UAE", product: "TF",              approved: 48, disbursed: 39 },
  { month: "Feb-26", geo: "UAE", product: "TF",              approved: 50, disbursed: 38 },
  { month: "Mar-26", geo: "UAE", product: "TF",              approved: 54, disbursed: 42 },
  { month: "Apr-26", geo: "UAE", product: "TF",              approved: 58, disbursed: 45 },
  { month: "May-26", geo: "UAE", product: "TF",              approved: 30, disbursed: 19 },
  // UAE EDB TF
  { month: "Dec-25", geo: "UAE", product: "EDB TF",          approved: 18, disbursed: 12 },
  { month: "Jan-26", geo: "UAE", product: "EDB TF",          approved: 19, disbursed: 13 },
  { month: "Feb-26", geo: "UAE", product: "EDB TF",          approved: 17, disbursed: 12 },
  { month: "Mar-26", geo: "UAE", product: "EDB TF",          approved: 20, disbursed: 14 },
  { month: "Apr-26", geo: "UAE", product: "EDB TF",          approved: 22, disbursed: 16 },
  { month: "May-26", geo: "UAE", product: "EDB TF",          approved: 11, disbursed:  7 },
  // UAE WCF Util
  { month: "Dec-25", geo: "UAE", product: "WCF Utilisation", approved: 24, disbursed: 18 },
  { month: "Jan-26", geo: "UAE", product: "WCF Utilisation", approved: 25, disbursed: 19 },
  { month: "Feb-26", geo: "UAE", product: "WCF Utilisation", approved: 26, disbursed: 19 },
  { month: "Mar-26", geo: "UAE", product: "WCF Utilisation", approved: 27, disbursed: 19 },
  { month: "Apr-26", geo: "UAE", product: "WCF Utilisation", approved: 28, disbursed: 21 },
  { month: "May-26", geo: "UAE", product: "WCF Utilisation", approved: 14, disbursed: 10 },
  // UAE WCF Act
  { month: "Dec-25", geo: "UAE", product: "WCF Activation",  approved:  6, disbursed:  4 },
  { month: "Jan-26", geo: "UAE", product: "WCF Activation",  approved:  6, disbursed:  4 },
  { month: "Feb-26", geo: "UAE", product: "WCF Activation",  approved:  7, disbursed:  4 },
  { month: "Mar-26", geo: "UAE", product: "WCF Activation",  approved:  7, disbursed:  5 },
  { month: "Apr-26", geo: "UAE", product: "WCF Activation",  approved:  8, disbursed:  6 },
  { month: "May-26", geo: "UAE", product: "WCF Activation",  approved:  4, disbursed:  3 },
  // Oman TF
  { month: "Dec-25", geo: "Oman", product: "TF",             approved: 12, disbursed:  8 },
  { month: "Jan-26", geo: "Oman", product: "TF",             approved: 11, disbursed:  8 },
  { month: "Feb-26", geo: "Oman", product: "TF",             approved: 12, disbursed:  8 },
  { month: "Mar-26", geo: "Oman", product: "TF",             approved: 13, disbursed:  9 },
  { month: "Apr-26", geo: "Oman", product: "TF",             approved: 14, disbursed: 10 },
  { month: "May-26", geo: "Oman", product: "TF",             approved:  7, disbursed:  5 },
  // KSA GIB TF
  { month: "Dec-25", geo: "KSA", product: "GIB TF",          approved:  9, disbursed:  6 },
  { month: "Jan-26", geo: "KSA", product: "GIB TF",          approved: 10, disbursed:  6 },
  { month: "Feb-26", geo: "KSA", product: "GIB TF",          approved: 11, disbursed:  6 },
  { month: "Mar-26", geo: "KSA", product: "GIB TF",          approved: 12, disbursed:  8 },
  { month: "Apr-26", geo: "KSA", product: "GIB TF",          approved: 14, disbursed:  9 },
  { month: "May-26", geo: "KSA", product: "GIB TF",          approved:  7, disbursed:  4 },
  // KSA GIB WCF
  { month: "Dec-25", geo: "KSA", product: "GIB WCF",         approved:  5, disbursed:  3 },
  { month: "Jan-26", geo: "KSA", product: "GIB WCF",         approved:  6, disbursed:  3 },
  { month: "Feb-26", geo: "KSA", product: "GIB WCF",         approved:  6, disbursed:  3 },
  { month: "Mar-26", geo: "KSA", product: "GIB WCF",         approved:  7, disbursed:  4 },
  { month: "Apr-26", geo: "KSA", product: "GIB WCF",         approved:  8, disbursed:  5 },
  { month: "May-26", geo: "KSA", product: "GIB WCF",         approved:  4, disbursed:  2 },
  // KSA Themar-TF
  { month: "Dec-25", geo: "KSA", product: "Themar-TF",       approved:  3, disbursed:  2 },
  { month: "Jan-26", geo: "KSA", product: "Themar-TF",       approved:  4, disbursed:  2 },
  { month: "Feb-26", geo: "KSA", product: "Themar-TF",       approved:  4, disbursed:  2 },
  { month: "Mar-26", geo: "KSA", product: "Themar-TF",       approved:  4, disbursed:  3 },
  { month: "Apr-26", geo: "KSA", product: "Themar-TF",       approved:  5, disbursed:  4 },
  { month: "May-26", geo: "KSA", product: "Themar-TF",       approved:  3, disbursed:  2 },
];

export const AD_MONTHS = ["Dec-25", "Jan-26", "Feb-26", "Mar-26", "Apr-26", "May-26"] as const;

// ===================== Section 3 =====================
// Time to Release buckets — actuals (% of releases) per month.

export const TTR_BUCKETS = ["0–7 Days", "8–14 Days", "15–21 Days", "22–28 Days", "28+ Days"] as const;
export type TTRBucket = (typeof TTR_BUCKETS)[number];

export const TTR_TARGETS: Record<TTRBucket, number> = {
  "0–7 Days":   60,
  "8–14 Days":  20,
  "15–21 Days": 15,
  "22–28 Days":  5,
  "28+ Days":    0,
};

export const TTR_MONTHS = ["Dec-25", "Jan-26", "Feb-26", "Mar-26", "Apr-26"] as const;

/** % of releases falling in each bucket per month. Rows = month. */
export const TTR_DATA: Record<(typeof TTR_MONTHS)[number], Record<TTRBucket, number>> = {
  "Dec-25": { "0–7 Days": 45, "8–14 Days": 37, "15–21 Days": 15, "22–28 Days":  0, "28+ Days":  3 },
  "Jan-26": { "0–7 Days": 45, "8–14 Days": 17, "15–21 Days": 19, "22–28 Days": 15, "28+ Days":  4 },
  "Feb-26": { "0–7 Days": 39, "8–14 Days": 34, "15–21 Days": 15, "22–28 Days":  4, "28+ Days":  8 },
  "Mar-26": { "0–7 Days": 15, "8–14 Days": 23, "15–21 Days": 10, "22–28 Days": 22, "28+ Days": 31 },
  "Apr-26": { "0–7 Days": 16, "8–14 Days": 38, "15–21 Days": 22, "22–28 Days":  4, "28+ Days": 20 },
};

/** True if the bucket is "good when ≥ target" (lower buckets) vs "good when ≤ target" (slower buckets). */
export function ttrMeetsTarget(bucket: TTRBucket, actual: number): boolean {
  // Fast buckets (0–7, 8–14): you want ≥ target.
  // Slow buckets (15–21, 22–28, 28+): you want ≤ target.
  if (bucket === "0–7 Days" || bucket === "8–14 Days") return actual >= TTR_TARGETS[bucket];
  return actual <= TTR_TARGETS[bucket];
}