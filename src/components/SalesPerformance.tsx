import { Fragment, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ComposedChart,
  Line,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronRight, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALL_PRODUCTS,
  ANNUAL_TARGET,
  APPROVED_DISBURSED,
  AD_MONTHS,
  BD_REPS,
  CURRENT,
  DISBURSEMENT_RATE_TARGET,
  GEO_TINTS,
  GEOGRAPHIES,
  HISTORICAL_MONTHS,
  HISTORICAL_TOTALS,
  JAN_TOTALS,
  MONTHLY_BUDGETS,
  PRODUCTS_BY_GEO,
  TTR_BUCKETS,
  TTR_BUCKET_MIDPOINTS,
  TTR_DATA,
  TTR_MONTHS,
  TTR_TARGETS,
  WEEKLY_ENTRIES,
  pkey,
  ttrMeetsTarget,
  type Geography,
  type WeeklyEntry,
} from "@/data/salesPerformance";

// ===== Helpers =====
const fmt = (n: number, dp = 1) =>
  n === 0 ? "—" : n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const fmt0 = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const pct = (a: number, b: number) => (b === 0 ? 0 : (a / b) * 100);

function EditableNum({
  value,
  onChange,
  className = "",
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  if (editing) {
    return (
      <Input
        autoFocus
        type="number"
        step="0.1"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const n = Number(draft);
          if (!isNaN(n)) onChange(n);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") {
            setDraft(String(value));
            setEditing(false);
          }
        }}
        className={cn("h-7 w-20 px-2 text-right text-xs", className)}
      />
    );
  }
  return (
    <button
      onClick={() => {
        setDraft(String(value));
        setEditing(true);
      }}
      className={cn(
        "block w-full rounded px-1.5 py-0.5 text-right text-xs tabular-nums hover:bg-foreground/5",
        className,
      )}
    >
      {value === 0 ? <span className="text-muted-foreground">—</span> : fmt(value)}
    </button>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const allSelected = selected.length === 0 || selected.length === options.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
          {label}: {allSelected ? "All" : `${selected.length} selected`}
          <ChevronDown className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="mb-1 flex items-center justify-between px-2 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span>{label}</span>
          <button
            className="text-primary hover:underline"
            onClick={() => onChange([])}
          >
            Clear
          </button>
        </div>
        <div className="max-h-64 space-y-0.5 overflow-y-auto">
          {options.map((opt) => {
            const checked = selected.length === 0 || selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const cur =
                      selected.length === 0 ? options.map((o) => o.value) : [...selected];
                    if (e.target.checked) {
                      if (!cur.includes(opt.value)) cur.push(opt.value);
                    } else {
                      const idx = cur.indexOf(opt.value);
                      if (idx >= 0) cur.splice(idx, 1);
                    }
                    onChange(cur);
                  }}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PillToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            value === o.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// =====================================================================
// SECTION 1 — Finance Written
// =====================================================================
function FinanceWritten() {
  // ---- Editable state ----
  const [historical, setHistorical] = useState(HISTORICAL_TOTALS);
  const [weekly, setWeekly] = useState<WeeklyEntry[]>(WEEKLY_ENTRIES);
  const [budgets, setBudgets] = useState(MONTHLY_BUDGETS);

  // ---- Filters ----
  const [geoFilter, setGeoFilter] = useState<"All" | Geography>("All");
  const [productFilter, setProductFilter] = useState<string[]>([]);
  const [repFilter, setRepFilter] = useState<string[]>([]);
  const [period, setPeriod] = useState<"Week" | "Month" | "Quarter">("Week");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // ---- Filtering ----
  const visibleProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => {
      if (geoFilter !== "All" && p.geo !== geoFilter) return false;
      if (productFilter.length > 0 && !productFilter.includes(p.product)) return false;
      return true;
    });
  }, [geoFilter, productFilter]);

  const repAllowed = (repId: string) =>
    repFilter.length === 0 || repFilter.includes(repId);

  // Sum weekly for a given product+week, respecting rep filter
  const weekSum = (geo: Geography, product: string, week: string) =>
    weekly
      .filter(
        (w) =>
          w.geo === geo &&
          w.product === product &&
          w.week === week &&
          repAllowed(w.repId),
      )
      .reduce((s, w) => s + w.amount, 0);

  const monthSum = (geo: Geography, product: string) =>
    CURRENT.weeks.reduce((s, w) => s + weekSum(geo, product, w), 0);

  // ---- Rollups ----
  const mtdActual = visibleProducts.reduce(
    (s, p) => s + monthSum(p.geo, p.product),
    0,
  );
  const mtdBudget = visibleProducts.reduce(
    (s, p) => s + (budgets[pkey(p.geo, p.product)]?.[CURRENT.monthLabel] ?? 0),
    0,
  );

  const qtdActual =
    mtdActual +
    visibleProducts.reduce(
      (s, p) => s + (historical[pkey(p.geo, p.product)]?.Apr ?? 0),
      0,
    );
  const qtdBudget =
    mtdBudget +
    visibleProducts.reduce(
      (s, p) => s + (budgets[pkey(p.geo, p.product)]?.Apr ?? 0),
      0,
    );

  const ytdActual = visibleProducts.reduce((s, p) => {
    const h = historical[pkey(p.geo, p.product)] ?? { Feb: 0, Mar: 0, Apr: 0 };
    return s + h.Feb + h.Mar + h.Apr + monthSum(p.geo, p.product);
  }, 0);
  const ytdBudget = visibleProducts.reduce((s, p) => {
    const b = budgets[pkey(p.geo, p.product)] ?? {};
    return s + (b.Feb ?? 0) + (b.Mar ?? 0) + (b.Apr ?? 0) + (b.May ?? 0);
  }, 0);

  // Annualised run rate based on YTD / 5 months * 12
  const runRate = (ytdActual / 5) * 12;

  // Group visible products by geo for table
  const grouped = useMemo(() => {
    const out: Record<Geography, { geo: Geography; product: string }[]> = {
      UAE: [],
      Oman: [],
      KSA: [],
    };
    visibleProducts.forEach((p) => out[p.geo].push(p));
    return out;
  }, [visibleProducts]);

  const monthCols = period === "Week" ? CURRENT.weeks : [CURRENT.monthLabel];

  // ---- MoM data (Jan..May actual; Jun..Dec zero), per-geo + budget overlay ----
  const [chartMode, setChartMode] = useState<"grouped" | "stacked">("grouped");

  const monthlyByGeo = useMemo(() => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return labels.map((m) => {
      const row: Record<string, number | string> = { label: m };
      let budget = 0;
      (["UAE", "Oman", "KSA"] as Geography[]).forEach((g) => (row[g] = 0));
      visibleProducts.forEach((p) => {
        const key = pkey(p.geo, p.product);
        let actual = 0;
        if (m === "Jan") actual = JAN_TOTALS[key] ?? 0;
        else if (m === "Feb" || m === "Mar" || m === "Apr") {
          actual = (historical[key]?.[m as "Feb" | "Mar" | "Apr"]) ?? 0;
        } else if (m === CURRENT.monthLabel) {
          actual = monthSum(p.geo, p.product);
        }
        row[p.geo] = (row[p.geo] as number) + actual;
        budget += budgets[key]?.[m] ?? 0;
      });
      row.Budget = budget;
      return row;
    });
  }, [visibleProducts, historical, weekly, budgets, repFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const quarterlyByGeo = useMemo(() => {
    const quarters: Record<string, string[]> = {
      Q1: ["Jan", "Feb", "Mar"],
      Q2: ["Apr", "May", "Jun"],
      Q3: ["Jul", "Aug", "Sep"],
      Q4: ["Oct", "Nov", "Dec"],
    };
    return Object.entries(quarters).map(([q, months]) => {
      const row: Record<string, number | string> = { label: q, UAE: 0, Oman: 0, KSA: 0, Budget: 0 };
      months.forEach((m) => {
        const mr = monthlyByGeo.find((x) => x.label === m);
        if (!mr) return;
        (["UAE", "Oman", "KSA"] as Geography[]).forEach((g) => {
          row[g] = (row[g] as number) + (mr[g] as number);
        });
        row.Budget = (row.Budget as number) + (mr.Budget as number);
      });
      return row;
    });
  }, [monthlyByGeo]);

  return (
    <div className="space-y-6">
      {/* Rollup cards */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <RollupCard label={`MTD · ${CURRENT.monthLabel}`} actual={mtdActual} budget={mtdBudget} />
        <RollupCard label={`QTD · ${CURRENT.quarter}`} actual={qtdActual} budget={qtdBudget} />
        <RollupCard label={`YTD · ${CURRENT.year}`} actual={ytdActual} budget={ytdBudget} />
        <RollupCard label="Annual Run Rate" actual={runRate} budget={ANNUAL_TARGET} runRate />
      </div>

      {/* Filters + Set Budgets */}
      <div className="flex flex-wrap items-center gap-2">
        <PillToggle
          options={[
            { value: "All", label: "All Geos" },
            { value: "UAE", label: "UAE" },
            { value: "Oman", label: "Oman" },
            { value: "KSA", label: "KSA" },
          ]}
          value={geoFilter}
          onChange={(v) => setGeoFilter(v)}
        />
        <MultiSelect
          label="Product"
          options={Array.from(new Set(ALL_PRODUCTS.map((p) => p.product))).map((p) => ({
            value: p,
            label: p,
          }))}
          selected={productFilter}
          onChange={setProductFilter}
        />
        <MultiSelect
          label="BD Rep"
          options={BD_REPS.map((r) => ({ value: r.id, label: r.name }))}
          selected={repFilter}
          onChange={setRepFilter}
        />
        <PillToggle
          options={[
            { value: "Week", label: "Week" },
            { value: "Month", label: "Month" },
            { value: "Quarter", label: "Quarter" },
          ]}
          value={period}
          onChange={(v) => setPeriod(v)}
        />
        <div className="ml-auto">
          <BudgetDrawer budgets={budgets} setBudgets={setBudgets} />
        </div>
      </div>

      {/* MoM + QoQ charts */}
      <div className="flex items-center justify-end gap-2">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Bars:</span>
        <PillToggle
          options={[
            { value: "grouped", label: "Grouped" },
            { value: "stacked", label: "Stacked" },
          ]}
          value={chartMode}
          onChange={(v) => setChartMode(v)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <FinanceTrendChart
          title={`MoM Finance Written · ${CURRENT.year}`}
          data={monthlyByGeo}
          mode={chartMode}
        />
        <FinanceTrendChart
          title={`QoQ Finance Written · ${CURRENT.year}`}
          data={quarterlyByGeo}
          mode={chartMode}
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="sticky left-0 z-10 min-w-[220px] bg-muted/40 px-3 py-2 text-left">
                  Geography / Product
                </th>
                {HISTORICAL_MONTHS.map((m) => (
                  <th key={m} className="px-3 py-2 text-right">
                    {m}
                  </th>
                ))}
                <th className="border-l px-3 py-2 text-center text-foreground" colSpan={monthCols.length}>
                  {CURRENT.monthLabel} {CURRENT.year}
                </th>
                <th className="border-l px-3 py-2 text-right">MTD Actual</th>
                <th className="px-3 py-2 text-right">MTD Budget</th>
                <th className="px-3 py-2 text-right">vs Budget</th>
              </tr>
              <tr className="border-b bg-muted/20 text-[10px] uppercase tracking-wide text-muted-foreground">
                <th className="sticky left-0 z-10 bg-muted/20 px-3 py-1.5"></th>
                {HISTORICAL_MONTHS.map((m) => (
                  <th key={m} className="px-3 py-1.5"></th>
                ))}
                {monthCols.map((w) => (
                  <th key={w} className="border-l px-3 py-1.5 text-right">
                    {w}
                  </th>
                ))}
                <th className="border-l px-3 py-1.5"></th>
                <th className="px-3 py-1.5"></th>
                <th className="px-3 py-1.5"></th>
              </tr>
            </thead>
            <tbody>
              {GEOGRAPHIES.flatMap((geo) => {
                if (grouped[geo].length === 0) return [];
                const tint = GEO_TINTS[geo];
                const rows: JSX.Element[] = [];
                rows.push(
                  <tr key={`${geo}-header`} className={cn("border-b", tint.headerBg)}>
                    <td
                      colSpan={4 + monthCols.length + 3}
                      className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground"
                    >
                      {tint.label}
                    </td>
                  </tr>,
                );
                grouped[geo].forEach(({ product }) => {
                  const key = pkey(geo, product);
                  const hist = historical[key] ?? { Feb: 0, Mar: 0, Apr: 0 };
                  const mtd = monthSum(geo, product);
                  const bud = budgets[key]?.[CURRENT.monthLabel] ?? 0;
                  const variance = pct(mtd, bud) - 100;
                  const isOpen = expanded.has(key);
                  rows.push(
                    <tr key={key} className={cn("border-b", tint.rowBg)}>
                      <td className="sticky left-0 z-10 bg-inherit px-3 py-1.5">
                        <button
                          className="flex items-center gap-1.5 text-left text-xs font-medium text-foreground hover:underline"
                          onClick={() => {
                            const next = new Set(expanded);
                            if (isOpen) next.delete(key);
                            else next.add(key);
                            setExpanded(next);
                          }}
                        >
                          {isOpen ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          {product}
                        </button>
                      </td>
                      {HISTORICAL_MONTHS.map((m) => (
                        <td key={m} className="px-3 py-1.5">
                          <EditableNum
                            value={hist[m]}
                            onChange={(v) =>
                              setHistorical((prev) => ({
                                ...prev,
                                [key]: { ...prev[key], [m]: v },
                              }))
                            }
                          />
                        </td>
                      ))}
                      {period === "Week"
                        ? CURRENT.weeks.map((w, i) => (
                            <td
                              key={w}
                              className={cn("py-1.5", i === 0 && "border-l")}
                            >
                              <EditableNum
                                value={weekSum(geo, product, w)}
                                onChange={() => {
                                  /* read-only aggregate at product level — edits happen in rep rows */
                                }}
                              />
                            </td>
                          ))
                        : (
                          <td className="border-l py-1.5">
                            <EditableNum value={mtd} onChange={() => {}} />
                          </td>
                        )}
                      <td className="border-l py-1.5">
                        <span className="block px-1.5 text-right text-xs font-semibold tabular-nums text-foreground">
                          {fmt(mtd)}
                        </span>
                      </td>
                      <td className="py-1.5">
                        <EditableNum
                          value={bud}
                          onChange={(v) =>
                            setBudgets((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], [CURRENT.monthLabel]: v },
                            }))
                          }
                        />
                      </td>
                      <td className="py-1.5">
                        <span
                          className={cn(
                            "block px-1.5 text-right text-xs font-medium tabular-nums",
                            variance >= 0 ? "text-emerald-600" : "text-red-600",
                          )}
                        >
                          {bud === 0 ? "—" : `${variance >= 0 ? "+" : ""}${variance.toFixed(0)}%`}
                        </span>
                      </td>
                    </tr>,
                  );

                  if (isOpen) {
                    const reps = BD_REPS.filter((r) =>
                      weekly.some(
                        (w) =>
                          w.geo === geo &&
                          w.product === product &&
                          w.repId === r.id,
                      ),
                    );
                    reps.forEach((rep) => {
                      if (!repAllowed(rep.id)) return;
                      const repWeekly = (w: string) =>
                        weekly
                          .filter(
                            (e) =>
                              e.geo === geo &&
                              e.product === product &&
                              e.repId === rep.id &&
                              e.week === w,
                          )
                          .reduce((s, e) => s + e.amount, 0);
                      const repMonth = CURRENT.weeks.reduce((s, w) => s + repWeekly(w), 0);
                      rows.push(
                        <tr key={`${key}-${rep.id}`} className="border-b border-dashed bg-background">
                          <td className="sticky left-0 z-10 bg-background px-3 py-1 pl-9 text-[11px] text-muted-foreground">
                            {rep.name}
                          </td>
                          {HISTORICAL_MONTHS.map((m) => (
                            <td key={m} className="px-3 py-1 text-right text-[11px] text-muted-foreground">
                              —
                            </td>
                          ))}
                          {period === "Week"
                            ? CURRENT.weeks.map((w, i) => (
                                <td key={w} className={cn("py-1", i === 0 && "border-l")}>
                                  <EditableNum
                                    value={repWeekly(w)}
                                    onChange={(v) => {
                                      setWeekly((prev) => {
                                        const next = prev.filter(
                                          (e) =>
                                            !(
                                              e.geo === geo &&
                                              e.product === product &&
                                              e.repId === rep.id &&
                                              e.week === w
                                            ),
                                        );
                                        next.push({
                                          geo,
                                          product,
                                          repId: rep.id,
                                          week: w,
                                          amount: v,
                                        });
                                        return next;
                                      });
                                    }}
                                  />
                                </td>
                              ))
                            : (
                              <td className="border-l py-1">
                                <span className="block px-1.5 text-right text-[11px] tabular-nums text-muted-foreground">
                                  {fmt(repMonth)}
                                </span>
                              </td>
                            )}
                          <td className="border-l py-1 text-right">
                            <span className="block px-1.5 text-[11px] tabular-nums text-muted-foreground">
                              {fmt(repMonth)}
                            </span>
                          </td>
                          <td className="py-1"></td>
                          <td className="py-1"></td>
                        </tr>,
                      );
                    });
                  }
                });
                return rows;
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RollupCard({
  ...args
}: React.ComponentProps<typeof RollupCardImpl>) {
  return <RollupCardImpl {...args} />;
}

const GEO_CHART_COLORS: Record<Geography, string> = {
  UAE: "#F59E0B",
  Oman: "#FB923C",
  KSA: "#0EA5E9",
};

function FinanceTrendChart({
  title,
  data,
  mode,
}: {
  title: string;
  data: Array<Record<string, number | string>>;
  mode: "grouped" | "stacked";
}) {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-sm font-semibold text-secondary">{title}</div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">AEDMn</div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {(["UAE", "Oman", "KSA"] as Geography[]).map((g) => (
              <Bar
                key={g}
                dataKey={g}
                stackId={mode === "stacked" ? "geo" : undefined}
                fill={GEO_CHART_COLORS[g]}
                radius={mode === "stacked" ? 0 : [3, 3, 0, 0]}
              />
            ))}
            <Line
              type="monotone"
              dataKey="Budget"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Budget"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function RollupCardImpl({
  label,
  actual,
  budget,
  runRate,
}: {
  label: string;
  actual: number;
  budget: number;
  runRate?: boolean;
}) {
  const attainment = pct(actual, budget);
  const tone = attainment >= 100 ? "text-emerald-600" : attainment >= 85 ? "text-amber-600" : "text-red-600";
  return (
    <Card className="p-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums text-secondary">
          {fmt(actual)}
        </span>
        <span className="text-xs text-muted-foreground">AEDMn</span>
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">
        {runRate ? "vs " : "Budget "}
        <span className="font-medium text-foreground">{fmt0(budget)} AEDMn</span>
        {budget > 0 && (
          <>
            {" · "}
            <span className={cn("font-semibold", tone)}>
              {attainment.toFixed(0)}% attainment
            </span>
          </>
        )}
      </div>
      {budget > 0 && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full",
              attainment >= 100 ? "bg-emerald-500" : attainment >= 85 ? "bg-amber-500" : "bg-red-500",
            )}
            style={{ width: `${Math.min(120, attainment)}%` }}
          />
        </div>
      )}
    </Card>
  );
}

function BudgetDrawer({
  budgets,
  setBudgets,
}: {
  budgets: Record<string, Record<string, number>>;
  setBudgets: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
}) {
  const months = [...HISTORICAL_MONTHS, CURRENT.monthLabel];
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          Set Budgets
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[560px] overflow-y-auto sm:max-w-[560px]">
        <SheetHeader>
          <SheetTitle>Monthly Budgets</SheetTitle>
          <p className="text-xs text-muted-foreground">
            Quarterly and annual totals are auto-aggregated from monthly entries.
          </p>
        </SheetHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2 text-left">Product</th>
                {months.map((m) => (
                  <th key={m} className="px-2 py-2 text-right">{m}</th>
                ))}
                <th className="border-l px-2 py-2 text-right">{CURRENT.quarter}</th>
                <th className="px-2 py-2 text-right">YTD</th>
              </tr>
            </thead>
            <tbody>
              {GEOGRAPHIES.map((geo) => (
                <Fragment key={geo}>
                  <tr className={cn("border-b", GEO_TINTS[geo].headerBg)}>
                    <td colSpan={months.length + 3} className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide">
                      {geo}
                    </td>
                  </tr>
                  {PRODUCTS_BY_GEO[geo].map((product) => {
                    const key = pkey(geo, product);
                    const b = budgets[key] ?? {};
                    const qtr = (b.Apr ?? 0) + (b[CURRENT.monthLabel] ?? 0);
                    const ytd = (b.Feb ?? 0) + (b.Mar ?? 0) + (b.Apr ?? 0) + (b[CURRENT.monthLabel] ?? 0);
                    return (
                      <tr key={key} className="border-b">
                        <td className="px-2 py-1.5">{product}</td>
                        {months.map((m) => (
                          <td key={m} className="px-1 py-1">
                            <EditableNum
                              value={b[m] ?? 0}
                              onChange={(v) =>
                                setBudgets((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], [m]: v },
                                }))
                              }
                            />
                          </td>
                        ))}
                        <td className="border-l px-2 py-1 text-right text-xs font-medium tabular-nums">{fmt(qtr)}</td>
                        <td className="px-2 py-1 text-right text-xs font-medium tabular-nums">{fmt(ytd)}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// =====================================================================
// SECTION 2 — Approved vs Disbursed
// =====================================================================
function ApprovedVsDisbursed() {
  const [geoFilter, setGeoFilter] = useState<"All" | Geography>("All");
  const [productFilter, setProductFilter] = useState<string[]>([]);
  const [period, setPeriod] = useState<"Monthly" | "Quarterly" | "YTD">("Monthly");
  const [productExpanded, setProductExpanded] = useState<Set<string>>(new Set());

  const filtered = APPROVED_DISBURSED.filter((r) => {
    if (geoFilter !== "All" && r.geo !== geoFilter) return false;
    if (productFilter.length > 0 && !productFilter.includes(r.product)) return false;
    return true;
  });

  // Group by month or quarter
  const buckets =
    period === "Monthly"
      ? AD_MONTHS.map((m) => ({
          label: m,
          rows: filtered.filter((r) => r.month === m),
        }))
      : period === "Quarterly"
      ? (() => {
          const map: Record<string, typeof filtered> = {};
          filtered.forEach((r) => {
            const [mon, yr] = r.month.split("-");
            const monthIdx = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(mon);
            const q = `Q${Math.floor(monthIdx / 3) + 1}-${yr}`;
            (map[q] ||= []).push(r);
          });
          return Object.entries(map).map(([label, rows]) => ({ label, rows }));
        })()
      : [{ label: "YTD", rows: filtered }];

  const chartData = buckets.map((b) => ({
    label: b.label,
    Approved: b.rows.reduce((s, r) => s + r.approved, 0),
    Disbursed: b.rows.reduce((s, r) => s + r.disbursed, 0),
    Rate: (() => {
      const a = b.rows.reduce((s, r) => s + r.approved, 0);
      const d = b.rows.reduce((s, r) => s + r.disbursed, 0);
      return a === 0 ? 0 : Math.round((d / a) * 100);
    })(),
  }));

  const totalApproved = chartData.reduce((s, r) => s + r.Approved, 0);
  const totalDisbursed = chartData.reduce((s, r) => s + r.Disbursed, 0);
  const disbursedPct = pct(totalDisbursed, totalApproved);

  // Avg time to disburse (days), derived from latest TTR month
  const latestTTRMonth = TTR_MONTHS[TTR_MONTHS.length - 1];
  const avgTTRDays = TTR_BUCKETS.reduce(
    (s, b) => s + (TTR_DATA[latestTTRMonth][b] / 100) * TTR_BUCKET_MIDPOINTS[b],
    0,
  );

  // Geo breakdown
  const geoBreakdown = (["UAE", "Oman", "KSA"] as Geography[]).map((g) => {
    const rows = filtered.filter((r) => r.geo === g);
    const a = rows.reduce((s, r) => s + r.approved, 0);
    const d = rows.reduce((s, r) => s + r.disbursed, 0);
    return { geo: g, approved: a, disbursed: d, rate: a === 0 ? 0 : (d / a) * 100 };
  });

  // Product breakdown
  const productBreakdown = ALL_PRODUCTS
    .filter((p) => geoFilter === "All" || p.geo === geoFilter)
    .filter((p) => productFilter.length === 0 || productFilter.includes(p.product))
    .map((p) => {
      const rows = filtered.filter((r) => r.geo === p.geo && r.product === p.product);
      const a = rows.reduce((s, r) => s + r.approved, 0);
      const d = rows.reduce((s, r) => s + r.disbursed, 0);
      return { geo: p.geo, product: p.product, approved: a, disbursed: d, rate: a === 0 ? 0 : (d / a) * 100 };
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <PillToggle
          options={[
            { value: "All", label: "All Geos" },
            { value: "UAE", label: "UAE" },
            { value: "Oman", label: "Oman" },
            { value: "KSA", label: "KSA" },
          ]}
          value={geoFilter}
          onChange={(v) => setGeoFilter(v)}
        />
        <MultiSelect
          label="Product"
          options={Array.from(new Set(ALL_PRODUCTS.map((p) => p.product))).map((p) => ({
            value: p,
            label: p,
          }))}
          selected={productFilter}
          onChange={setProductFilter}
        />
        <PillToggle
          options={[
            { value: "Monthly", label: "Monthly" },
            { value: "Quarterly", label: "Quarterly" },
            { value: "YTD", label: "YTD" },
          ]}
          value={period}
          onChange={(v) => setPeriod(v)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryStat label="YTD Approved" value={`${fmt(totalApproved)}`} suffix="AEDMn" />
        <SummaryStat label="YTD Disbursed" value={`${fmt(totalDisbursed)}`} suffix="AEDMn" />
        <SummaryStat
          label="YTD Disbursement Rate"
          value={`${disbursedPct.toFixed(0)}%`}
          tone={disbursedPct >= DISBURSEMENT_RATE_TARGET ? "green" : "amber"}
          subline={`Target: ${DISBURSEMENT_RATE_TARGET}%`}
        />
        <SummaryStat
          label="Avg Time to Disburse"
          value={`${avgTTRDays.toFixed(1)} days`}
          subline={`From ${latestTTRMonth} release distribution`}
        />
      </div>

      <Card className="p-5">
        <div className="mb-3 text-sm font-semibold text-secondary">
          Approved vs Disbursed
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="Approved" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="Disbursed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="Rate" stroke="#10B981" strokeWidth={2} name="Disbursement %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Geo breakdown table */}
      <Card className="overflow-hidden">
        <div className="border-b px-5 py-3 text-sm font-semibold text-secondary">
          Geography Breakdown · YTD
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 text-left">Geography</th>
              <th className="px-4 py-2 text-right">Approved YTD</th>
              <th className="px-4 py-2 text-right">Disbursed YTD</th>
              <th className="px-4 py-2 text-right">Disbursement Rate</th>
              <th className="px-4 py-2 text-center">vs Target</th>
            </tr>
          </thead>
          <tbody>
            {geoBreakdown.map((row) => (
              <tr key={row.geo} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">
                  <span className={cn("mr-2 inline-block h-2 w-2 rounded-full", GEO_TINTS[row.geo].dot)} />
                  {row.geo}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{fmt(row.approved)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{fmt(row.disbursed)}</td>
                <td className="px-4 py-2 text-right tabular-nums font-semibold">{row.rate.toFixed(0)}%</td>
                <td className="px-4 py-2 text-center">
                  <RAGPill ok={row.rate >= DISBURSEMENT_RATE_TARGET} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Product breakdown table */}
      <Card className="overflow-hidden">
        <div className="border-b px-5 py-3 text-sm font-semibold text-secondary">
          Product Breakdown · YTD
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-right">Approved YTD</th>
              <th className="px-4 py-2 text-right">Disbursed YTD</th>
              <th className="px-4 py-2 text-right">Rate</th>
              <th className="px-4 py-2 text-center">vs Target</th>
            </tr>
          </thead>
          <tbody>
            {productBreakdown.map((row) => {
              const key = `${row.geo}::${row.product}`;
              const open = productExpanded.has(key);
              return (
                <Fragment key={key}>
                  <tr className="border-b">
                    <td className="px-4 py-2">
                      <button
                        className="flex items-center gap-1.5 font-medium hover:underline"
                        onClick={() => {
                          const next = new Set(productExpanded);
                          if (open) next.delete(key); else next.add(key);
                          setProductExpanded(next);
                        }}
                      >
                        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        <span className={cn("inline-block h-2 w-2 rounded-full", GEO_TINTS[row.geo].dot)} />
                        {row.product}
                        <span className="text-[10px] text-muted-foreground">({row.geo})</span>
                      </button>
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">{fmt(row.approved)}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{fmt(row.disbursed)}</td>
                    <td className="px-4 py-2 text-right tabular-nums font-semibold">{row.rate.toFixed(0)}%</td>
                    <td className="px-4 py-2 text-center">
                      <RAGPill ok={row.rate >= DISBURSEMENT_RATE_TARGET} />
                    </td>
                  </tr>
                  {open &&
                    BD_REPS.filter((r) => r.geo === row.geo).map((rep) => {
                      // Approximate per-rep contribution proportional to weekly entries share
                      const repWeekly = WEEKLY_ENTRIES.filter(
                        (w) => w.geo === row.geo && w.product === row.product && w.repId === rep.id,
                      ).reduce((s, w) => s + w.amount, 0);
                      const totalRepWeekly = WEEKLY_ENTRIES.filter(
                        (w) => w.geo === row.geo && w.product === row.product,
                      ).reduce((s, w) => s + w.amount, 0) || 1;
                      const share = repWeekly / totalRepWeekly;
                      if (share === 0) return null;
                      return (
                        <tr key={key + rep.id} className="border-b border-dashed bg-muted/10">
                          <td className="px-4 py-1.5 pl-12 text-[11px] text-muted-foreground">{rep.name}</td>
                          <td className="px-4 py-1.5 text-right text-[11px] tabular-nums">{fmt(row.approved * share)}</td>
                          <td className="px-4 py-1.5 text-right text-[11px] tabular-nums">{fmt(row.disbursed * share)}</td>
                          <td className="px-4 py-1.5 text-right text-[11px] tabular-nums">{row.rate.toFixed(0)}%</td>
                          <td className="px-4 py-1.5"></td>
                        </tr>
                      );
                    })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  suffix,
  subline,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  subline?: string;
  tone?: "green" | "amber" | "red";
}) {
  const toneCls =
    tone === "green" ? "text-emerald-600" :
    tone === "amber" ? "text-amber-600" :
    tone === "red" ? "text-red-600" : "text-secondary";
  return (
    <Card className="p-4">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("mt-1 flex items-baseline gap-2 text-2xl font-semibold tabular-nums", toneCls)}>
        {value}
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
      {subline && <div className="mt-0.5 text-[11px] text-muted-foreground">{subline}</div>}
    </Card>
  );
}

function RAGPill({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
      )}
    >
      {ok ? "On Target" : "Below"}
    </span>
  );
}

// =====================================================================
// SECTION 3 — Time to Release
// =====================================================================
function TimeToRelease() {
  const [period, setPeriod] = useState<"Monthly" | "Quarterly">("Monthly");

  // Build per-month data; quarterly averages months in the same quarter.
  const monthlyData = TTR_MONTHS.map((m) => ({
    label: m,
    ...TTR_DATA[m],
  }));

  const quarterlyData = (() => {
    const map: Record<string, { count: number; sums: Record<string, number> }> = {};
    TTR_MONTHS.forEach((m) => {
      const [mon, yr] = m.split("-");
      const monthIdx = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(mon);
      const q = `Q${Math.floor(monthIdx / 3) + 1}-${yr}`;
      const entry = (map[q] ||= { count: 0, sums: Object.fromEntries(TTR_BUCKETS.map((b) => [b, 0])) });
      entry.count += 1;
      TTR_BUCKETS.forEach((b) => (entry.sums[b] += TTR_DATA[m][b]));
    });
    return Object.entries(map).map(([label, e]) => {
      const obj: Record<string, number | string> = { label };
      TTR_BUCKETS.forEach((b) => (obj[b] = +(e.sums[b] / e.count).toFixed(1)));
      return obj as { label: string } & Record<TTRBucketKey, number>;
    });
  })();

  type TTRBucketKey = (typeof TTR_BUCKETS)[number];

  const data = period === "Monthly" ? monthlyData : quarterlyData;
  const latest = monthlyData[monthlyData.length - 1];

  // Bucket colors (data category, not theme)
  const BUCKET_COLORS: Record<TTRBucketKey, string> = {
    "0–7 Days":   "#10B981",
    "8–14 Days":  "#34D399",
    "15–21 Days": "#FBBF24",
    "22–28 Days": "#F97316",
    "28+ Days":   "#EF4444",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PillToggle
          options={[
            { value: "Monthly", label: "Monthly" },
            { value: "Quarterly", label: "Quarterly" },
          ]}
          value={period}
          onChange={(v) => setPeriod(v)}
        />
      </div>

      <Card className="p-5">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="text-sm font-semibold text-secondary">
            Release Time Distribution by {period === "Monthly" ? "Month" : "Quarter"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            % of releases per bucket · target lines per bucket
          </div>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => `${v}%`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {TTR_BUCKETS.map((b) => (
                <Bar key={b} dataKey={b} fill={BUCKET_COLORS[b]} radius={[3, 3, 0, 0]} />
              ))}
              {TTR_BUCKETS.map((b) => (
                <ReferenceLine
                  key={`t-${b}`}
                  y={TTR_TARGETS[b]}
                  stroke={BUCKET_COLORS[b]}
                  strokeDasharray="4 3"
                  strokeOpacity={0.4}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b px-5 py-3">
          <div className="text-sm font-semibold text-secondary">
            Bucket Scorecard · {latest.label}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Most recent month vs target. Fast buckets (0–14d) want ≥ target; slower buckets want ≤ target.
          </div>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/30 text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 text-left">Bucket</th>
              <th className="px-4 py-2 text-right">Target</th>
              <th className="px-4 py-2 text-right">{latest.label} Actual</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {TTR_BUCKETS.map((b) => {
              const actual = TTR_DATA[TTR_MONTHS[TTR_MONTHS.length - 1]][b];
              const ok = ttrMeetsTarget(b, actual);
              return (
                <tr key={b} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium text-foreground">
                    <span
                      className="mr-2 inline-block h-2 w-2 rounded-full"
                      style={{ background: BUCKET_COLORS[b] }}
                    />
                    {b}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">{TTR_TARGETS[b]}%</td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums">{actual}%</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        ok
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {ok ? "On Target" : "Off Target"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// =====================================================================
// Page export
// =====================================================================
export default function SalesPerformance() {
  return (
    <Tabs defaultValue="finance">
      <TabsList>
        <TabsTrigger value="finance">Finance Written</TabsTrigger>
        <TabsTrigger value="approved">Approved vs Disbursed</TabsTrigger>
        <TabsTrigger value="ttr">Time to Release</TabsTrigger>
      </TabsList>
      <TabsContent value="finance" className="mt-6">
        <FinanceWritten />
      </TabsContent>
      <TabsContent value="approved" className="mt-6">
        <ApprovedVsDisbursed />
      </TabsContent>
      <TabsContent value="ttr" className="mt-6">
        <TimeToRelease />
      </TabsContent>
    </Tabs>
  );
}