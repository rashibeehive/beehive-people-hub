import { useMemo } from "react";
import {
  Users,
  Wallet,
  MapPin,
  Clock,
  Scale,
  TrendingUp,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ---------------- Section 1: KPI cards ---------------- */

type TrendTone = "positive" | "negative" | "neutral";

interface Kpi {
  icon: LucideIcon;
  label: string;
  value: string;
  tag: string;
  tone: TrendTone;
}

const KPIS: Kpi[] = [
  { icon: Users, label: "Headcount", value: "50", tag: "5 new this quarter", tone: "positive" },
  { icon: Wallet, label: "Monthly Payroll", value: "AED 2,135,000", tag: "across all levels", tone: "neutral" },
  { icon: MapPin, label: "Locations", value: "3", tag: "UAE · KSA · Oman", tone: "neutral" },
  { icon: Clock, label: "Avg Tenure", value: "3.1 yrs", tag: "range: 1mo – 7.3yr", tone: "neutral" },
  { icon: Scale, label: "IC : Manager Ratio", value: "2 : 1", tag: "company-wide", tone: "neutral" },
  { icon: TrendingUp, label: "Promotions YTD", value: "5", tag: "14 in full year 2024", tone: "positive" },
];

function toneClasses(tone: TrendTone) {
  switch (tone) {
    case "positive":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "negative":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/10 text-secondary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {kpi.label}
        </div>
        <div className="mt-1 text-xl font-semibold text-secondary">{kpi.value}</div>
      </div>
      <span
        className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${toneClasses(
          kpi.tone,
        )}`}
      >
        {kpi.tag}
      </span>
    </Card>
  );
}

/* ---------------- Section 2: Talent risk ---------------- */

type RiskFlag =
  | "Overdue — Senior leadership"
  | "Stagnant — Promo ready"
  | "Stagnant — Senior IC/MG";

interface RiskRow {
  name: string;
  department: string;
  level: string;
  track: "IC" | "MG" | "EX";
  months: number;
  flag: RiskFlag;
}

const RISK_ROWS: RiskRow[] = [
  { name: "Nadia Farouk", department: "Executive", level: "EX2", track: "EX", months: 48, flag: "Overdue — Senior leadership" },
  { name: "James Thornton", department: "Technology", level: "EX2", track: "EX", months: 41, flag: "Overdue — Senior leadership" },
  { name: "Layla Hassan", department: "Finance", level: "EX2", track: "EX", months: 36, flag: "Overdue — Senior leadership" },
  { name: "Khalid Bin Yousef", department: "Operations", level: "MG4", track: "MG", months: 31, flag: "Stagnant — Promo ready" },
  { name: "Rashed Al Blooshi", department: "Business Development", level: "MG4", track: "MG", months: 29, flag: "Stagnant — Promo ready" },
  { name: "Omar Siddiqui", department: "HR", level: "EX1", track: "EX", months: 27, flag: "Overdue — Senior leadership" },
  { name: "Priya Menon", department: "Technology", level: "MG3", track: "MG", months: 24, flag: "Stagnant — Senior IC/MG" },
  { name: "Maryam Khalil", department: "Investor Relations", level: "MG3", track: "MG", months: 23, flag: "Stagnant — Senior IC/MG" },
  { name: "Fatima Al Zaabi", department: "Compliance", level: "MG3", track: "MG", months: 21, flag: "Stagnant — Senior IC/MG" },
  { name: "Sara Al Mansoori", department: "Credit", level: "MG3", track: "MG", months: 20, flag: "Stagnant — Senior IC/MG" },
];

function flagClasses(flag: RiskFlag) {
  if (flag === "Overdue — Senior leadership") return "bg-red-100 text-red-800 border-red-200";
  if (flag === "Stagnant — Promo ready") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

/* ---------------- Section 3: Department health ---------------- */

interface DeptRow {
  department: string;
  headcount: number;
  payroll: number;
  ics: number;
  mgrs: number;
  ratio: string;
  locations: string;
  signal: "balanced" | "lean" | "top_heavy" | "manager_heavy" | "leadership";
  signalLabel: string;
}

const DEPT_ROWS: DeptRow[] = [
  { department: "Technology", headcount: 9, payroll: 414000, ics: 5, mgrs: 4, ratio: "1.2x", locations: "UAE", signal: "top_heavy", signalLabel: "Top-heavy" },
  { department: "Executive", headcount: 2, payroll: 350000, ics: 0, mgrs: 2, ratio: "—", locations: "UAE", signal: "leadership", signalLabel: "Leadership only" },
  { department: "HR", headcount: 6, payroll: 232000, ics: 4, mgrs: 2, ratio: "2.0x", locations: "UAE", signal: "balanced", signalLabel: "Balanced" },
  { department: "Finance", headcount: 5, payroll: 229000, ics: 3, mgrs: 2, ratio: "1.5x", locations: "UAE", signal: "balanced", signalLabel: "Balanced" },
  { department: "Operations", headcount: 6, payroll: 194000, ics: 4, mgrs: 2, ratio: "2.0x", locations: "UAE", signal: "balanced", signalLabel: "Balanced" },
  { department: "Credit", headcount: 6, payroll: 187000, ics: 4, mgrs: 2, ratio: "2.0x", locations: "UAE", signal: "balanced", signalLabel: "Balanced" },
  { department: "Business Development", headcount: 5, payroll: 178000, ics: 3, mgrs: 2, ratio: "1.5x", locations: "UAE+KSA+Oman", signal: "balanced", signalLabel: "Balanced" },
  { department: "Compliance", headcount: 4, payroll: 136000, ics: 2, mgrs: 2, ratio: "1.0x", locations: "UAE", signal: "manager_heavy", signalLabel: "Manager-heavy" },
  { department: "Marketing", headcount: 4, payroll: 114000, ics: 3, mgrs: 1, ratio: "3.0x", locations: "UAE", signal: "lean", signalLabel: "Lean" },
  { department: "Investor Relations", headcount: 3, payroll: 101000, ics: 2, mgrs: 1, ratio: "2.0x", locations: "UAE", signal: "balanced", signalLabel: "Balanced" },
];

function signalChip(row: DeptRow) {
  const map = {
    balanced: { icon: "✅", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    lean: { icon: "✅", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    top_heavy: { icon: "⚠️", classes: "bg-amber-50 text-amber-800 border-amber-200" },
    manager_heavy: { icon: "⚠️", classes: "bg-amber-50 text-amber-800 border-amber-200" },
    leadership: { icon: "ℹ️", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  } as const;
  const c = map[row.signal];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${c.classes}`}
    >
      <span>{c.icon}</span>
      {row.signalLabel}
    </span>
  );
}

/* ---------------- Section 4: Promotion velocity ---------------- */

const PROMO_DATA = [
  { year: "2020", promotions: 1, ytd: false },
  { year: "2021", promotions: 5, ytd: false },
  { year: "2022", promotions: 4, ytd: false },
  { year: "2023", promotions: 6, ytd: false },
  { year: "2024", promotions: 14, ytd: false },
  { year: "2025", promotions: 5, ytd: true },
];

/* ---------------- Section 5: Location & level ---------------- */

const LOCATIONS = [
  { name: "UAE", value: 46, pct: 92 },
  { name: "KSA", value: 3, pct: 6 },
  { name: "Oman", value: 1, pct: 2 },
];

const LOCATION_COLORS = ["hsl(var(--secondary))", "hsl(var(--primary))", "#D4A437"];

const LEVELS = [
  { level: "IC1", count: 5, track: "IC" },
  { level: "IC2", count: 9, track: "IC" },
  { level: "IC3", count: 10, track: "IC" },
  { level: "IC4", count: 5, track: "IC" },
  { level: "IC5", count: 1, track: "IC" },
  { level: "MG1", count: 5, track: "MG" },
  { level: "MG2", count: 4, track: "MG" },
  { level: "MG3", count: 4, track: "MG" },
  { level: "MG4", count: 2, track: "MG" },
  { level: "EX1", count: 1, track: "EX" },
  { level: "EX2", count: 3, track: "EX" },
  { level: "EX3", count: 1, track: "EX" },
];

const TRACK_COLORS: Record<string, string> = {
  IC: "#2563EB", // blue
  MG: "#7C3AED", // purple
  EX: "#D4A437", // gold
};

/* ---------------- Section 6: New hires ---------------- */

const NEW_HIRES = [
  { name: "Shamma Al Mazrouei", department: "Technology", level: "IC1", start: "6 Jan 2025", tenure: "4 months" },
  { name: "Rashid Al Hosani", department: "Credit", level: "IC1", start: "10 Feb 2025", tenure: "3 months" },
  { name: "Nada Khalifa", department: "Operations", level: "IC1", start: "1 Mar 2025", tenure: "2 months" },
  { name: "Ali Hassan", department: "HR", level: "IC1", start: "1 Apr 2025", tenure: "1 month" },
  { name: "Mona Al Balooshi", department: "Finance", level: "IC1", start: "1 Apr 2025", tenure: "1 month" },
];

/* ---------------- Reusable section heading ---------------- */

function SectionHeading({
  title,
  subtitle,
  dot,
}: {
  title: string;
  subtitle: string;
  dot?: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        {dot && <span className="inline-block h-2 w-2 rounded-full bg-primary" />}
        <h2 className="text-base font-semibold text-secondary">{title}</h2>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function Overview() {
  const totalLocation = useMemo(() => LOCATIONS.reduce((s, l) => s + l.value, 0), []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-secondary">People Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Q2 2025 · Last updated today</p>
      </header>

      {/* Section 1 — KPI cards */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {KPIS.map((k) => (
          <KpiCard key={k.label} kpi={k} />
        ))}
      </section>

      {/* Section 2 — Talent risk */}
      <section>
        <div className="flex items-center gap-2">
          <AlertCircle className="hidden" />
          <SectionHeading
            title="Talent Risk Signals"
            subtitle="Employees flagged for immediate HR attention this quarter."
            dot
          />
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Months Since Promotion</TableHead>
                <TableHead>Risk Flag</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RISK_ROWS.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium text-secondary">{r.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.department}</TableCell>
                  <TableCell>
                    <span className="font-mono-code text-xs">{r.level}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.track}</TableCell>
                  <TableCell className="text-sm tabular-nums">{r.months}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${flagClasses(
                        r.flag,
                      )}`}
                    >
                      {r.flag}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Section 3 — Department health */}
      <section>
        <SectionHeading
          title="Department Health"
          subtitle="Headcount, payroll, and structural balance by department."
        />
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Headcount</TableHead>
                <TableHead className="text-right">Monthly Payroll (AED)</TableHead>
                <TableHead className="text-right">IC Count</TableHead>
                <TableHead className="text-right">Manager Count</TableHead>
                <TableHead className="text-right">IC:Mgr Ratio</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Health Signal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEPT_ROWS.map((r) => (
                <TableRow key={r.department}>
                  <TableCell className="font-medium text-secondary">{r.department}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.headcount}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.payroll.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{r.ics}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.mgrs}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.ratio}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.locations}</TableCell>
                  <TableCell>{signalChip(r)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Section 4 — Promotion velocity */}
      <section>
        <SectionHeading
          title="Promotion Velocity"
          subtitle="Annual promotion count — reflects org growth and review cycle maturity."
        />
        <Card className="p-5">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROMO_DATA} margin={{ top: 24, right: 16, left: 0, bottom: 8 }}>
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="promotions" radius={[4, 4, 0, 0]}>
                  {PROMO_DATA.map((d) => (
                    <Cell
                      key={d.year}
                      fill={d.ytd ? "transparent" : "hsl(var(--primary))"}
                      stroke="hsl(var(--primary))"
                      strokeWidth={d.ytd ? 1.5 : 0}
                      strokeDasharray={d.ytd ? "4 3" : undefined}
                    />
                  ))}
                  <LabelList
                    dataKey="promotions"
                    position="top"
                    formatter={(value: number) => {
                      const item = PROMO_DATA.find((p) => p.promotions === value);
                      return item?.ytd ? `${value} YTD` : `${value}`;
                    }}
                    style={{ fill: "hsl(var(--secondary))", fontSize: 12, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Promotion rate has grown 14x since 2020, reflecting rapid scaling and maturing review
            cycles.
          </p>
        </Card>
      </section>

      {/* Section 5 — Location & Level */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Location */}
        <Card className="p-5">
          <SectionHeading title="Headcount by Location" subtitle="Where the team sits today." />
          <div className="flex items-center gap-6">
            <div className="h-[180px] w-[180px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LOCATIONS}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {LOCATIONS.map((_, i) => (
                      <Cell key={i} fill={LOCATION_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {LOCATIONS.map((l, i) => (
                <div key={l.name} className="flex items-center gap-3 text-sm">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: LOCATION_COLORS[i] }}
                  />
                  <span className="flex-1 font-medium text-secondary">{l.name}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {l.value} ({l.pct}%)
                  </span>
                </div>
              ))}
              <div className="pt-2 text-xs text-muted-foreground">
                Total: <span className="tabular-nums">{totalLocation}</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            KSA and Oman presence currently concentrated in Business Development.
          </p>
        </Card>

        {/* Level distribution */}
        <Card className="p-5">
          <SectionHeading title="Headcount by Level" subtitle="IC1 → EX3, coloured by track." />
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={LEVELS}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="level"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  width={36}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {LEVELS.map((l) => (
                    <Cell key={l.level} fill={TRACK_COLORS[l.track]} />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="right"
                    style={{ fill: "hsl(var(--secondary))", fontSize: 11, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            {(["IC", "MG", "EX"] as const).map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: TRACK_COLORS[t] }}
                />
                {t}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Section 6 — Recent joiners */}
      <section>
        <SectionHeading
          title="Recent Joiners"
          subtitle="Employees who joined in the last 6 months."
        />
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Tenure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NEW_HIRES.map((h) => (
                <TableRow key={h.name}>
                  <TableCell className="font-medium text-secondary">{h.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.department}</TableCell>
                  <TableCell>
                    <span className="font-mono-code text-xs">{h.level}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.start}</TableCell>
                  <TableCell className="text-sm">{h.tenure}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>
    </div>
  );
}