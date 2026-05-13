// =====================================================
// Sales Framework — Business Development specific data.
// All values stored here so Career Path + Org Design read
// from the same source. Tiny pub/sub store enables inline
// edits in one view to reflect in the other.
// =====================================================

import { useSyncExternalStore } from "react";

export type Track = "IC" | "MG" | "EX";

export type BdLevel = {
  code: string;
  track: Track;
  title: string;
  salaryMin: number;
  salaryMax: number;
  policyLevel: string;
};

export type BenefitRow = {
  code: string;
  policyLevel: string;
  insurance: "Silver" | "Gold";
  dependents: number;
  flightAllowance: boolean;
  educationAllowance: number; // AED/mo, 0 = none
  annualBonus: boolean;
  noticePeriod: string;
  dews: number;
};

export type DisbursementTarget = {
  code: string;
  title: string;
  personalTarget: number | null;
  minimumThreshold: number | null;
  hasPersonalTarget: "Yes" | "No" | "Team only";
};

export type RampRow = {
  month: number;
  ic2ic3: number;
  ic4plus: number;
};

// ---------- BD LEVELS ----------
export const BD_LEVELS_INITIAL: BdLevel[] = [
  { code: "IC1", track: "IC", title: "Sales Intern",                 salaryMin:  4_000, salaryMax:  6_000, policyLevel: "L1" },
  { code: "IC2", track: "IC", title: "BD Associate",                 salaryMin:  8_000, salaryMax: 12_000, policyLevel: "L2" },
  { code: "IC3", track: "IC", title: "BD Executive",                 salaryMin: 12_000, salaryMax: 18_000, policyLevel: "L3" },
  { code: "IC4", track: "IC", title: "Senior BD Executive",          salaryMin: 18_000, salaryMax: 25_000, policyLevel: "L4" },
  { code: "IC5", track: "IC", title: "Associate Director, BD",       salaryMin: 25_000, salaryMax: 35_000, policyLevel: "L5" },
  { code: "IC6", track: "IC", title: "Director, BD",                 salaryMin: 35_000, salaryMax: 50_000, policyLevel: "L6" },
  { code: "MG1", track: "MG", title: "Team Lead",                    salaryMin: 22_000, salaryMax: 32_000, policyLevel: "L5" },
  { code: "MG2", track: "MG", title: "Manager",                      salaryMin: 35_000, salaryMax: 45_000, policyLevel: "L6" },
  { code: "MG3", track: "MG", title: "Senior Manager",               salaryMin: 50_000, salaryMax: 65_000, policyLevel: "L7" },
  { code: "MG4", track: "MG", title: "Head of Business Development", salaryMin: 65_000, salaryMax: 80_000, policyLevel: "L8" },
  { code: "EX1", track: "EX", title: "VP Business Development",      salaryMin: 80_000, salaryMax: 95_000, policyLevel: "L9" },
  { code: "EX2", track: "EX", title: "Chief Commercial Officer",     salaryMin:100_000, salaryMax:120_000, policyLevel: "L10" },
];

// ---------- BENEFITS MATRIX ----------
export const BENEFITS_INITIAL: BenefitRow[] = [
  { code: "IC1", policyLevel: "L1", insurance: "Silver", dependents: 0, flightAllowance: false, educationAllowance: 0,      annualBonus: false, noticePeriod: "Per contract", dews: 5.3 },
  { code: "IC2", policyLevel: "L2", insurance: "Silver", dependents: 0, flightAllowance: false, educationAllowance: 0,      annualBonus: false, noticePeriod: "Per contract", dews: 5.3 },
  { code: "IC3", policyLevel: "L3", insurance: "Silver", dependents: 0, flightAllowance: false, educationAllowance: 0,      annualBonus: false, noticePeriod: "Per contract", dews: 5.3 },
  { code: "IC4", policyLevel: "L4", insurance: "Silver", dependents: 1, flightAllowance: false, educationAllowance: 0,      annualBonus: false, noticePeriod: "Per contract", dews: 5.3 },
  { code: "IC5", policyLevel: "L5", insurance: "Silver", dependents: 1, flightAllowance: false, educationAllowance: 0,      annualBonus: false, noticePeriod: "Per contract", dews: 5.3 },
  { code: "MG1", policyLevel: "L5", insurance: "Silver", dependents: 1, flightAllowance: false, educationAllowance: 0,      annualBonus: false, noticePeriod: "Per contract", dews: 5.3 },
  { code: "IC6", policyLevel: "L6", insurance: "Gold",   dependents: 2, flightAllowance: true,  educationAllowance: 0,      annualBonus: true,  noticePeriod: "3 months",     dews: 5.3 },
  { code: "MG2", policyLevel: "L6", insurance: "Gold",   dependents: 2, flightAllowance: true,  educationAllowance: 0,      annualBonus: true,  noticePeriod: "3 months",     dews: 5.3 },
  { code: "MG3", policyLevel: "L7", insurance: "Gold",   dependents: 3, flightAllowance: true,  educationAllowance: 0,      annualBonus: true,  noticePeriod: "3 months",     dews: 5.3 },
  { code: "MG4", policyLevel: "L8", insurance: "Gold",   dependents: 3, flightAllowance: true,  educationAllowance: 0,      annualBonus: true,  noticePeriod: "3 months",     dews: 5.3 },
  { code: "EX1", policyLevel: "L9", insurance: "Gold",   dependents: 3, flightAllowance: true,  educationAllowance: 10_000, annualBonus: true,  noticePeriod: "3 months",     dews: 5.3 },
  { code: "EX2", policyLevel: "L10",insurance: "Gold",   dependents: 3, flightAllowance: true,  educationAllowance: 12_000, annualBonus: true,  noticePeriod: "3 months",     dews: 5.3 },
];

export const BENEFITS_NOTES = [
  "Annual bonus discretionary, subject to company performance and Head of People approval.",
  "DEWS applies to DIFC visa holders only; mainland visa holders receive UAE gratuity per labour law.",
];

// ---------- TENURE OVERRIDES ----------
export const TENURE_OVERRIDES = {
  threeYears: { flightAllowance: true, minDependents: 2 },
  fiveYears:  { minDependents: 3, dews: 8.3, noticePeriod: "3 months" },
  rule: "Higher entitlement always takes precedence over level-based entitlement.",
} as const;

export function effectiveBenefits(base: BenefitRow, tenureYears: number): BenefitRow {
  const out = { ...base };
  if (tenureYears >= 3) {
    out.flightAllowance = out.flightAllowance || TENURE_OVERRIDES.threeYears.flightAllowance;
    out.dependents = Math.max(out.dependents, TENURE_OVERRIDES.threeYears.minDependents);
  }
  if (tenureYears >= 5) {
    out.dependents = Math.max(out.dependents, TENURE_OVERRIDES.fiveYears.minDependents);
    out.dews = Math.max(out.dews, TENURE_OVERRIDES.fiveYears.dews);
    out.noticePeriod = TENURE_OVERRIDES.fiveYears.noticePeriod;
  }
  return out;
}

// ---------- DISBURSEMENT TARGETS (TF) ----------
export const TF_TARGETS_INITIAL: DisbursementTarget[] = [
  { code: "IC1", title: "Sales Intern",            personalTarget: null,       minimumThreshold: null,      hasPersonalTarget: "No" },
  { code: "IC2", title: "BD Associate",            personalTarget:  3_000_000, minimumThreshold: 2_500_000, hasPersonalTarget: "Yes" },
  { code: "IC3", title: "BD Executive",            personalTarget:  4_000_000, minimumThreshold: 3_000_000, hasPersonalTarget: "Yes" },
  { code: "IC4", title: "Senior BD Executive",     personalTarget:  6_000_000, minimumThreshold: 3_000_000, hasPersonalTarget: "Yes" },
  { code: "IC5", title: "Associate Director, BD",  personalTarget:  9_000_000, minimumThreshold: 3_000_000, hasPersonalTarget: "Yes" },
  { code: "IC6", title: "Director, BD",            personalTarget: 12_000_000, minimumThreshold: 3_000_000, hasPersonalTarget: "Yes" },
  { code: "MG1", title: "Team Lead",               personalTarget:  5_000_000, minimumThreshold: 3_000_000, hasPersonalTarget: "Yes" },
  { code: "MG2", title: "Manager",                 personalTarget: null,       minimumThreshold: null,      hasPersonalTarget: "Team only" },
  { code: "MG3", title: "Senior Manager",          personalTarget: null,       minimumThreshold: null,      hasPersonalTarget: "Team only" },
  { code: "MG4", title: "Head of BD",              personalTarget: null,       minimumThreshold: null,      hasPersonalTarget: "Team only" },
  { code: "EX1", title: "VP Business Development", personalTarget: null,       minimumThreshold: null,      hasPersonalTarget: "Team only" },
  { code: "EX2", title: "Chief Commercial Officer",personalTarget: null,       minimumThreshold: null,      hasPersonalTarget: "Team only" },
];

export const TARGET_NOTES = [
  "No cap on monthly incentive payouts.",
  "Incentive eligibility requires meeting minimum threshold.",
  "MG2 and above are measured on team target attainment only.",
];

// ---------- RAMP SCHEDULE ----------
export const RAMP_INITIAL: RampRow[] = [
  { month: 1, ic2ic3:  20, ic4plus:  30 },
  { month: 2, ic2ic3:  20, ic4plus:  30 },
  { month: 3, ic2ic3:  40, ic4plus:  60 },
  { month: 4, ic2ic3:  40, ic4plus: 100 },
  { month: 5, ic2ic3:  70, ic4plus: 100 },
  { month: 6, ic2ic3: 100, ic4plus: 100 },
];

export function rampedTarget(target: number, level: string, monthsInRole: number, ramp = RAMP_INITIAL): number {
  if (monthsInRole >= ramp.length) return target;
  const idx = Math.max(0, Math.min(ramp.length - 1, monthsInRole - 1));
  const isFastTrack = level >= "IC4";
  const pct = isFastTrack ? ramp[idx].ic4plus : ramp[idx].ic2ic3;
  return (target * pct) / 100;
}

// ---------- ACCESS CONTROL ----------
export const ADMIN_USER_ID = "hr-admin";
export const CURRENT_USER_ID = "hr-admin";
export const IS_ADMIN = CURRENT_USER_ID === ADMIN_USER_ID;

// =====================================================
// Pub/sub store
// =====================================================
type State = {
  levels: BdLevel[];
  benefits: BenefitRow[];
  targets: DisbursementTarget[];
  ramp: RampRow[];
};

let state: State = {
  levels: BD_LEVELS_INITIAL,
  benefits: BENEFITS_INITIAL,
  targets: TF_TARGETS_INITIAL,
  ramp: RAMP_INITIAL,
};
const listeners = new Set<() => void>();

export const salesFrameworkStore = {
  get: () => state,
  set: (patch: Partial<State>) => {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useSalesFramework(): State {
  return useSyncExternalStore(
    salesFrameworkStore.subscribe,
    salesFrameworkStore.get,
    salesFrameworkStore.get,
  );
}

export function fmtAED(n: number | null) {
  if (n == null) return "—";
  return "AED " + Math.round(n).toLocaleString("en-US");
}

export function fmtAEDmo(n: number | null) {
  if (n == null) return "—";
  return fmtAED(n) + "/mo";
}
