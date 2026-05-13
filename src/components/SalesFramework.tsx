import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Lock } from "lucide-react";
import {
  useSalesFramework, salesFrameworkStore, IS_ADMIN, fmtAED, fmtAEDmo,
  TARGET_NOTES, BENEFITS_NOTES, TENURE_OVERRIDES,
  type BdLevel, type BenefitRow, type DisbursementTarget, type RampRow,
} from "@/data/salesFramework";

const TRACK_TINT: Record<string, string> = {
  IC: "bg-blue-50/60",
  MG: "bg-purple-50/60",
  EX: "bg-amber-50/60",
};
const TRACK_CHIP: Record<string, string> = {
  IC: "bg-blue-100 text-blue-800 border-blue-200",
  MG: "bg-purple-100 text-purple-800 border-purple-200",
  EX: "bg-amber-100 text-amber-900 border-amber-200",
};

function EditableCell({
  value, onChange, type = "number", disabled, className = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: "number" | "text";
  disabled?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  if (disabled || !IS_ADMIN) {
    return <span className={className}>{type === "number" && typeof value === "number" ? value.toLocaleString() : value}</span>;
  }
  if (editing) {
    return (
      <Input
        autoFocus type={type} value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false); }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          if (e.key === "Escape") { setDraft(String(value)); setEditing(false); }
        }}
        className={"h-7 w-28 px-2 text-sm " + className}
      />
    );
  }
  return (
    <button
      onClick={() => { setDraft(String(value)); setEditing(true); }}
      className={"rounded px-1.5 py-0.5 hover:bg-muted/60 " + className}
    >
      {type === "number" && typeof value === "number" ? value.toLocaleString() : value}
    </button>
  );
}

function ReadOnlyBanner() {
  if (IS_ADMIN) return null;
  return (
    <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
      <Lock className="h-3.5 w-3.5" />
      Read-only view — only the designated admin can edit Sales Framework data.
    </div>
  );
}

// ============== SECTION 1: Levels & Salary ==============
function SectionLevels() {
  const { levels } = useSalesFramework();
  const update = (i: number, patch: Partial<BdLevel>) => {
    const next = levels.map((l, idx) => (idx === i ? { ...l, ...patch } : l));
    salesFrameworkStore.set({ levels: next });
  };
  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-secondary">Level &amp; Salary Bands</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Synced with Career Path · Business Development department.
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Level</th>
              <th className="px-3 py-2 font-medium">Track</th>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Salary Min (AED/mo)</th>
              <th className="px-3 py-2 font-medium">Salary Max (AED/mo)</th>
              <th className="px-3 py-2 font-medium">Policy Level</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l, i) => (
              <tr key={l.code} className={"border-t " + TRACK_TINT[l.track]}>
                <td className="px-3 py-2 font-mono text-xs font-semibold">{l.code}</td>
                <td className="px-3 py-2">
                  <span className={"inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium " + TRACK_CHIP[l.track]}>
                    {l.track}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <EditableCell type="text" value={l.title} onChange={(v) => update(i, { title: v })} />
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={l.salaryMin} onChange={(v) => update(i, { salaryMin: Number(v) || 0 })} />
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={l.salaryMax} onChange={(v) => update(i, { salaryMax: Number(v) || 0 })} />
                </td>
                <td className="px-3 py-2">
                  <EditableCell type="text" value={l.policyLevel} onChange={(v) => update(i, { policyLevel: v })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============== SECTION 2: Disbursement Targets ==============
function SectionTargets() {
  const { targets } = useSalesFramework();
  const update = (i: number, patch: Partial<DisbursementTarget>) => {
    const next = targets.map((t, idx) => (idx === i ? { ...t, ...patch } : t));
    salesFrameworkStore.set({ targets: next });
  };
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-secondary">Disbursement Targets — TF (Trade Finance)</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Personal targets feed into Sales Performance and Capacity Planner via the Sales Framework store.
          </p>
        </div>
        <Button size="sm" variant="outline" disabled title="Future product columns (e.g. WCF)">
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Level</th>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Personal Target (AED/mo)</th>
              <th className="px-3 py-2 font-medium">Minimum Threshold (AED/mo)</th>
              <th className="px-3 py-2 font-medium">Has Personal Target</th>
            </tr>
          </thead>
          <tbody>
            {targets.map((t, i) => {
              const teamOnly = t.hasPersonalTarget !== "Yes";
              return (
                <tr key={t.code} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs font-semibold">{t.code}</td>
                  <td className="px-3 py-2">{t.title}</td>
                  <td className="px-3 py-2">
                    {teamOnly ? <span className="text-muted-foreground">—</span> : (
                      <EditableCell
                        value={t.personalTarget ?? 0}
                        onChange={(v) => update(i, { personalTarget: Number(v) || 0 })}
                      />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {teamOnly ? <span className="text-muted-foreground">—</span> : (
                      <EditableCell
                        value={t.minimumThreshold ?? 0}
                        onChange={(v) => update(i, { minimumThreshold: Number(v) || 0 })}
                      />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={"inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium " +
                      (t.hasPersonalTarget === "Yes" ? "bg-green-100 text-green-800 border-green-200"
                       : t.hasPersonalTarget === "Team only" ? "bg-purple-100 text-purple-800 border-purple-200"
                       : "bg-gray-100 text-gray-700 border-gray-200")}>
                      {t.hasPersonalTarget}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        {TARGET_NOTES.map((n) => <li key={n}>• {n}</li>)}
      </ul>
    </Card>
  );
}

// ============== SECTION 3: Ramp Schedule ==============
function SectionRamp() {
  const { ramp } = useSalesFramework();
  const update = (i: number, patch: Partial<RampRow>) => {
    const next = ramp.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    salesFrameworkStore.set({ ramp: next });
  };
  const chartData = ramp.map((r) => ({
    month: `M${r.month}`,
    "IC2–IC3": r.ic2ic3,
    "IC4+":    r.ic4plus,
  }));
  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-secondary">Ramp Schedule</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Ramp % is applied to the personal target for that level. Charts update live.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Month</th>
                <th className="px-3 py-2 font-medium">IC2–IC3 Ramp</th>
                <th className="px-3 py-2 font-medium">IC4+ Ramp</th>
              </tr>
            </thead>
            <tbody>
              {ramp.map((r, i) => (
                <tr key={r.month} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">M{r.month}</td>
                  <td className="px-3 py-2">
                    <EditableCell value={r.ic2ic3} onChange={(v) => update(i, { ic2ic3: Number(v) || 0 })} />
                    <span className="ml-1 text-muted-foreground">%</span>
                  </td>
                  <td className="px-3 py-2">
                    <EditableCell value={r.ic4plus} onChange={(v) => update(i, { ic4plus: Number(v) || 0 })} />
                    <span className="ml-1 text-muted-foreground">%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-[280px] rounded-md border p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 16, right: 16, bottom: 16, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} domain={[0, 110]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="IC2–IC3" stroke="#3b82f6" strokeWidth={2} dot />
              <Line type="monotone" dataKey="IC4+"    stroke="#f97316" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

// ============== SECTION 4: Benefits ==============
export function BenefitsMatrix({ title = "Benefits Summary", description }: { title?: string; description?: string }) {
  const { benefits } = useSalesFramework();
  const update = (i: number, patch: Partial<BenefitRow>) => {
    const next = benefits.map((b, idx) => (idx === i ? { ...b, ...patch } : b));
    salesFrameworkStore.set({ benefits: next });
  };
  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-secondary">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Level</th>
              <th className="px-3 py-2 font-medium">Policy</th>
              <th className="px-3 py-2 font-medium">Insurance</th>
              <th className="px-3 py-2 font-medium">Dependents</th>
              <th className="px-3 py-2 font-medium">Flight Allowance</th>
              <th className="px-3 py-2 font-medium">Education Allowance</th>
              <th className="px-3 py-2 font-medium">Annual Bonus</th>
              <th className="px-3 py-2 font-medium">Notice Period</th>
              <th className="px-3 py-2 font-medium">DEWS</th>
            </tr>
          </thead>
          <tbody>
            {benefits.map((b, i) => (
              <tr key={b.code} className="border-t">
                <td className="px-3 py-2 font-mono text-xs font-semibold">{b.code}</td>
                <td className="px-3 py-2">{b.policyLevel}</td>
                <td className="px-3 py-2">
                  {IS_ADMIN ? (
                    <select
                      value={b.insurance}
                      onChange={(e) => update(i, { insurance: e.target.value as BenefitRow["insurance"] })}
                      className="h-7 rounded border bg-background px-2 text-sm"
                    >
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                    </select>
                  ) : b.insurance}
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={b.dependents} onChange={(v) => update(i, { dependents: Number(v) || 0 })} />
                </td>
                <td className="px-3 py-2">
                  {IS_ADMIN ? (
                    <button
                      onClick={() => update(i, { flightAllowance: !b.flightAllowance })}
                      className={"rounded px-2 py-0.5 text-xs " + (b.flightAllowance ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground")}
                    >
                      {b.flightAllowance ? "Yes" : "No"}
                    </button>
                  ) : (b.flightAllowance ? "Yes" : "No")}
                </td>
                <td className="px-3 py-2">
                  {b.educationAllowance > 0 ? (
                    <span>
                      AED <EditableCell value={b.educationAllowance} onChange={(v) => update(i, { educationAllowance: Number(v) || 0 })} />/mo
                    </span>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-3 py-2">
                  {IS_ADMIN ? (
                    <button
                      onClick={() => update(i, { annualBonus: !b.annualBonus })}
                      className={"rounded px-2 py-0.5 text-xs " + (b.annualBonus ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground")}
                    >
                      {b.annualBonus ? "Yes*" : "No"}
                    </button>
                  ) : (b.annualBonus ? "Yes*" : "No")}
                </td>
                <td className="px-3 py-2">
                  <EditableCell type="text" value={b.noticePeriod} onChange={(v) => update(i, { noticePeriod: v })} />
                </td>
                <td className="px-3 py-2">
                  <EditableCell value={b.dews} onChange={(v) => update(i, { dews: Number(v) || 0 })} />%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        {BENEFITS_NOTES.map((n) => <li key={n}>• {n}</li>)}
        <li className="pt-1 italic">
          Tenure logic (future): 3+ yrs unlocks flight allowance and min 2 dependents · 5+ yrs raises dependents to min 3, DEWS to {TENURE_OVERRIDES.fiveYears.dews}%, notice period to 3 months. {TENURE_OVERRIDES.rule}
        </li>
      </ul>
    </Card>
  );
}

// ============== ROOT ==============
export default function SalesFramework() {
  return (
    <div className="space-y-4">
      <ReadOnlyBanner />
      <Tabs defaultValue="levels">
        <TabsList>
          <TabsTrigger value="levels">Level &amp; Salary Bands</TabsTrigger>
          <TabsTrigger value="targets">Disbursement Targets</TabsTrigger>
          <TabsTrigger value="ramp">Ramp Schedule</TabsTrigger>
          <TabsTrigger value="benefits">Benefits Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="levels"  className="mt-4"><SectionLevels /></TabsContent>
        <TabsContent value="targets" className="mt-4"><SectionTargets /></TabsContent>
        <TabsContent value="ramp"    className="mt-4"><SectionRamp /></TabsContent>
        <TabsContent value="benefits" className="mt-4">
          <BenefitsMatrix
            description="Same matrix as Career Path. Edits here sync back automatically."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
