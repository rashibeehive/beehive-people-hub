import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
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
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import SalesFramework from "@/components/SalesFramework";

// =================== shared helpers ===================
const fmtAED = (n: number) =>
  "AED " + Math.round(n).toLocaleString("en-US");

function rampMultiplier(monthsInRole: number) {
  if (monthsInRole >= 7) return 1;
  if (monthsInRole >= 5) return 0.75;
  if (monthsInRole >= 3) return 0.5;
  return 0.2;
}

/** EditableNumber: click to edit inline */
function EditableNumber({
  value,
  onChange,
  format = (v: number) => v.toLocaleString(),
  className = "",
  prefix = "",
}: {
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  className?: string;
  prefix?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  if (editing) {
    return (
      <Input
        autoFocus
        type="number"
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
        className={"h-7 px-2 text-sm w-32 " + className}
      />
    );
  }
  return (
    <button
      onClick={() => {
        setDraft(String(value));
        setEditing(true);
      }}
      className={
        "rounded px-1.5 py-0.5 text-left hover:bg-muted/60 " + className
      }
    >
      {prefix}
      {format(value)}
    </button>
  );
}

function EditableText({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          onChange(draft);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className={"h-7 px-2 text-sm " + className}
      />
    );
  }
  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={"rounded px-1.5 py-0.5 text-left hover:bg-muted/60 " + className}
    >
      {value || <span className="text-muted-foreground italic">empty</span>}
    </button>
  );
}

// =================== Tab 1: Capacity Planner ===================

const LEVEL_OPTIONS = ["IC2", "IC3", "IC4", "MG1", "MG2", "MG3", "MG4"];

type Member = {
  id: string;
  name: string;
  level: string;
  monthsInRole: number;
  monthlyAED: number;
  isNew?: boolean;
  joinMonth?: number;
};

type Team = {
  id: string;
  name: string;
  target: number;
  members: Member[];
  includeNewHires: boolean;
};

const initialTeams: Team[] = [
  {
    id: "direct",
    name: "Direct Sales",
    target: 450_000_000,
    includeNewHires: true,
    members: [
      { id: "d1", name: "Rashed Al Blooshi", level: "MG4", monthsInRole: 28, monthlyAED: 35_000_000 },
      { id: "d2", name: "Zayed Al Falasi", level: "IC3", monthsInRole: 18, monthlyAED: 5_500_000 },
      { id: "d3", name: "Leila Chebli", level: "IC3", monthsInRole: 14, monthlyAED: 4_800_000 },
      { id: "d4", name: "Patrick Nwosu", level: "IC2", monthsInRole: 9, monthlyAED: 2_800_000 },
      { id: "d5", name: "Hind Al Qubaisi", level: "IC2", monthsInRole: 6, monthlyAED: 2_200_000 },
    ],
  },
  {
    id: "channel",
    name: "Channel Sales",
    target: 350_000_000,
    includeNewHires: true,
    members: [
      { id: "c1", name: "Jassim Al Kuwari", level: "IC4", monthsInRole: 36, monthlyAED: 11_000_000 },
      { id: "c2", name: "Meera Nambiar", level: "IC3", monthsInRole: 24, monthlyAED: 6_200_000 },
      { id: "c3", name: "Tariq Al Dosari", level: "IC3", monthsInRole: 18, monthlyAED: 5_000_000 },
      { id: "c4", name: "Hana Saleh", level: "IC2", monthsInRole: 8, monthlyAED: 2_500_000 },
    ],
  },
  {
    id: "wcf",
    name: "WCF",
    target: 200_000_000,
    includeNewHires: true,
    members: [
      { id: "w1", name: "Saeed Al Hamdan", level: "IC4", monthsInRole: 30, monthlyAED: 12_000_000 },
      { id: "w2", name: "Divya Krishnan", level: "IC3", monthsInRole: 20, monthlyAED: 5_800_000 },
      { id: "w3", name: "Marco Vitale", level: "IC2", monthsInRole: 6, monthlyAED: 2_000_000 },
    ],
  },
];

function annualisedFor(m: Member) {
  if (m.isNew) {
    const join = m.joinMonth ?? 1;
    const remaining = Math.max(0, 13 - join); // months they will be present this year, e.g. join=1 -> 12
    let total = 0;
    for (let i = 1; i <= remaining; i++) {
      total += m.monthlyAED * rampMultiplier(i);
    }
    return total;
  }
  // existing employees: project remaining 12 months at ramp-adjusted rate (their current ramp evolves)
  let total = 0;
  for (let i = 1; i <= 12; i++) {
    const mInRole = m.monthsInRole + i;
    total += m.monthlyAED * rampMultiplier(mInRole);
  }
  return total;
}

function memberStatus(m: Member) {
  return m.monthsInRole >= 7 ? "Ramped" : "Ramping";
}

function CapacityPlanner() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [overallTarget, setOverallTarget] = useState(1_000_000_000);

  const projection = (t: Team) => {
    const ms = t.includeNewHires ? t.members : t.members.filter((m) => !m.isNew);
    return ms.reduce((s, m) => s + annualisedFor(m), 0);
  };
  const runRate = (t: Team) =>
    t.members.filter((m) => !m.isNew).reduce((s, m) => s + annualisedFor(m), 0);

  const totalProjected = teams.reduce((s, t) => s + projection(t), 0);
  const gap = overallTarget - totalProjected;

  const updateTeam = (id: string, fn: (t: Team) => Team) =>
    setTeams((prev) => prev.map((t) => (t.id === id ? fn(t) : t)));

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Overall Target
          </div>
          <div className="mt-1 text-xl font-semibold text-secondary">
            <EditableNumber
              value={overallTarget}
              onChange={setOverallTarget}
              format={(v) => fmtAED(v)}
            />
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Current Projected Total
          </div>
          <div className="mt-1 text-xl font-semibold text-secondary">
            {fmtAED(totalProjected)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Gap to Target
          </div>
          <div
            className={
              "mt-1 text-xl font-semibold " +
              (gap <= 0 ? "text-green-600" : "text-primary")
            }
          >
            {fmtAED(gap)}
          </div>
        </Card>
      </div>

      {/* Team panels */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {teams.map((t) => {
          const proj = projection(t);
          const rr = runRate(t);
          const teamGap = t.target - proj;
          return (
            <Card key={t.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-secondary">
                    <EditableText
                      value={t.name}
                      onChange={(v) => updateTeam(t.id, (tt) => ({ ...tt, name: v }))}
                    />
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Target:{" "}
                    <EditableNumber
                      value={t.target}
                      onChange={(v) => updateTeam(t.id, (tt) => ({ ...tt, target: v }))}
                      format={(v) => fmtAED(v)}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-[11px] text-muted-foreground">
                    Include new hires
                  </Label>
                  <Switch
                    checked={t.includeNewHires}
                    onCheckedChange={(v) =>
                      updateTeam(t.id, (tt) => ({ ...tt, includeNewHires: v }))
                    }
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 rounded-md bg-muted/40 p-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Run rate</div>
                  <div className="font-semibold text-secondary">{fmtAED(rr)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Projected</div>
                  <div className="font-semibold text-secondary">{fmtAED(proj)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Gap</div>
                  <div
                    className={
                      "font-semibold " +
                      (teamGap <= 0 ? "text-green-600" : "text-primary")
                    }
                  >
                    {fmtAED(teamGap)}
                  </div>
                </div>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-1 pr-2 font-medium">Name</th>
                      <th className="py-1 pr-2 font-medium">Level</th>
                      <th className="py-1 pr-2 font-medium">{`Mo${""}`}</th>
                      <th className="py-1 pr-2 font-medium">Monthly</th>
                      <th className="py-1 pr-2 font-medium">Annualised</th>
                      <th className="py-1 pr-2 font-medium">Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {t.members.map((m) => {
                      const status = m.isNew
                        ? "New hire"
                        : memberStatus(m);
                      const ann = annualisedFor(m);
                      return (
                        <tr key={m.id} className="border-t">
                          <td className="py-1 pr-2">
                            <EditableText
                              value={m.name}
                              onChange={(v) =>
                                updateTeam(t.id, (tt) => ({
                                  ...tt,
                                  members: tt.members.map((x) =>
                                    x.id === m.id ? { ...x, name: v } : x
                                  ),
                                }))
                              }
                            />
                          </td>
                          <td className="py-1 pr-2">
                            <Select
                              value={m.level}
                              onValueChange={(v) =>
                                updateTeam(t.id, (tt) => ({
                                  ...tt,
                                  members: tt.members.map((x) =>
                                    x.id === m.id ? { ...x, level: v } : x
                                  ),
                                }))
                              }
                            >
                              <SelectTrigger className="h-7 w-[72px] px-2 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {LEVEL_OPTIONS.map((l) => (
                                  <SelectItem key={l} value={l}>
                                    {l}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-1 pr-2">
                            {m.isNew ? (
                              <Select
                                value={String(m.joinMonth ?? 1)}
                                onValueChange={(v) =>
                                  updateTeam(t.id, (tt) => ({
                                    ...tt,
                                    members: tt.members.map((x) =>
                                      x.id === m.id
                                        ? { ...x, joinMonth: Number(v) }
                                        : x
                                    ),
                                  }))
                                }
                              >
                                <SelectTrigger className="h-7 w-[80px] px-2 text-xs">
                                  <SelectValue placeholder="Join" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                    (mo) => (
                                      <SelectItem key={mo} value={String(mo)}>
                                        Joins M{mo}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <EditableNumber
                                value={m.monthsInRole}
                                onChange={(v) =>
                                  updateTeam(t.id, (tt) => ({
                                    ...tt,
                                    members: tt.members.map((x) =>
                                      x.id === m.id ? { ...x, monthsInRole: v } : x
                                    ),
                                  }))
                                }
                                format={(v) => `${v}m`}
                              />
                            )}
                          </td>
                          <td className="py-1 pr-2">
                            <EditableNumber
                              value={m.monthlyAED}
                              onChange={(v) =>
                                updateTeam(t.id, (tt) => ({
                                  ...tt,
                                  members: tt.members.map((x) =>
                                    x.id === m.id ? { ...x, monthlyAED: v } : x
                                  ),
                                }))
                              }
                              format={(v) => v.toLocaleString()}
                            />
                          </td>
                          <td className="py-1 pr-2 font-mono-code text-[11px]">
                            {Math.round(ann).toLocaleString()}
                          </td>
                          <td className="py-1 pr-2">
                            <span
                              className={
                                "rounded-full px-2 py-0.5 text-[10px] font-medium " +
                                (status === "Ramped"
                                  ? "bg-green-100 text-green-700"
                                  : status === "Ramping"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700")
                              }
                            >
                              {status}
                            </span>
                          </td>
                          <td className="py-1">
                            <button
                              onClick={() =>
                                updateTeam(t.id, (tt) => ({
                                  ...tt,
                                  members: tt.members.filter((x) => x.id !== m.id),
                                }))
                              }
                              className="text-muted-foreground hover:text-primary"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() =>
                  updateTeam(t.id, (tt) => ({
                    ...tt,
                    members: [
                      ...tt.members,
                      {
                        id: crypto.randomUUID(),
                        name: "New hire",
                        level: "IC3",
                        monthsInRole: 0,
                        monthlyAED: 3_000_000,
                        isNew: true,
                        joinMonth: 1,
                      },
                    ],
                  }))
                }
              >
                <Plus className="h-3.5 w-3.5" /> Add team member
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// =================== Tab 2: 9-Box ===================

type BoxEmp = {
  id: string;
  fullName: string;
  department: string;
  level: string;
  track: "IC" | "MG" | "EX";
  performance: 1 | 2 | 3;
  potential: 1 | 2 | 3;
};

function mkEmp(
  fullName: string,
  performance: 1 | 2 | 3,
  potential: 1 | 2 | 3,
  department: string = "Business Development",
  level: string = "IC3",
  track: BoxEmp["track"] = "IC"
): BoxEmp {
  return {
    id: fullName.toLowerCase().replace(/\s+/g, "-"),
    fullName,
    department,
    level,
    track,
    performance,
    potential,
  };
}

const initialBoxEmps: BoxEmp[] = [
  // Star (3,3)
  ...["Priya Menon", "Daniel Osei", "Shaikha Al Maktoum", "Rohan Verma", "Sophie Laurent"].map(
    (n) => mkEmp(n, 3, 3)
  ),
  // Rising Star (2,3)
  ...[
    "Majid Al Khaili",
    "Dana Al Mansoori",
    "Amira Saleh",
    "Zayed Al Falasi",
    "Shamma Al Mazrouei",
    "Rashid Al Hosani",
    "Ali Hassan",
    "Mona Al Balooshi",
    "Nada Khalifa",
  ].map((n) => mkEmp(n, 2, 3)),
  // Rough Diamond (1,3)
  ...["Bilal Akhtar", "Yousef Al Marzooqi", "Leila Chebli", "Patrick Nwosu"].map((n) =>
    mkEmp(n, 1, 3)
  ),
  // High Performer (3,2)
  ...[
    "Rashed Al Blooshi",
    "Sara Al Mansoori",
    "Fatima Al Zaabi",
    "Tariq Mahmoud",
    "Ivan Petrov",
    "Maryam Khalil",
  ].map((n) => mkEmp(n, 3, 2)),
  // Core Player (2,2)
  ...[
    "Reem Jassim",
    "Ben Carter",
    "Noura Al Dhaheri",
    "Hamad Al Farsi",
    "Lina Aziz",
    "Yusuf Al Hammadi",
    "Aisha Noor",
    "Tom Reeves",
    "Kevin Obi",
    "Mariam Al Rashdi",
    "Abdulla Al Zarouni",
    "Saif Al Shamsi",
    "Ines Moreau",
    "Nour Badawi",
    "Rashi Agarwal",
    "Carlos Mendez",
    "Maitha Al Suwaidi",
  ].map((n) => mkEmp(n, 2, 2, "HR")),
  // Specialist (3,1)
  ...[
    "James Thornton",
    "Layla Hassan",
    "Omar Siddiqui",
    "Khalid Bin Yousef",
    "Hessa Al Nuaimi",
  ].map((n) => mkEmp(n, 3, 1)),
  // Solid Contributor (2,1)
  ...["Nadia Farouk", "Ahmed Al Rashidi", "Faisal Al Otaibi", "Hind Al Qubaisi"].map((n) =>
    mkEmp(n, 2, 1)
  ),
];

const BOX_LABELS: Record<string, { label: string; bg: string; ring: string }> = {
  "1-3": { label: "Rough Diamond", bg: "bg-blue-50", ring: "ring-blue-200" },
  "2-3": { label: "Rising Star", bg: "bg-teal-50", ring: "ring-teal-200" },
  "3-3": { label: "Star / HiPo", bg: "bg-green-50", ring: "ring-green-200" },
  "1-2": { label: "Underperformer", bg: "bg-red-50", ring: "ring-red-200" },
  "2-2": { label: "Core Player", bg: "bg-gray-50", ring: "ring-gray-200" },
  "3-2": { label: "High Performer", bg: "bg-teal-50", ring: "ring-teal-200" },
  "1-1": { label: "Risk", bg: "bg-red-50", ring: "ring-red-200" },
  "2-1": { label: "Solid Contributor", bg: "bg-gray-50", ring: "ring-gray-200" },
  "3-1": { label: "Specialist", bg: "bg-blue-50", ring: "ring-blue-200" },
};

const DEPARTMENTS = [
  "All",
  "Business Development",
  "Finance",
  "HR",
  "Marketing",
  "Credit",
  "Compliance",
  "Operations",
  "Executive",
  "Technology",
  "Investor Relations",
];

function chipName(fullName: string, level: string) {
  const parts = fullName.split(" ");
  const first = parts[0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] + "." : "";
  return `${first} ${lastInitial} · ${level}`;
}

function NineBox() {
  const [emps, setEmps] = useState<BoxEmp[]>(initialBoxEmps);
  const [filterDept, setFilterDept] = useState("All");
  const [filterTrack, setFilterTrack] = useState<"All" | "IC" | "MG" | "EX">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const matches = (e: BoxEmp) =>
    (filterDept === "All" || e.department === filterDept) &&
    (filterTrack === "All" || e.track === filterTrack);

  const open = emps.find((e) => e.id === openId) ?? null;

  const update = (id: string, patch: Partial<BoxEmp>) =>
    setEmps((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const cellEmps = (perf: number, pot: number) =>
    emps.filter((e) => e.performance === perf && e.potential === pot);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Department</Label>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="h-8 w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Track</Label>
          <Select value={filterTrack} onValueChange={(v) => setFilterTrack(v as any)}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["All", "IC", "MG", "EX"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Y axis labels */}
        <div className="flex w-8 flex-col justify-around py-8 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="-rotate-90 whitespace-nowrap">High Potential</div>
          <div className="-rotate-90 whitespace-nowrap">Growth</div>
          <div className="-rotate-90 whitespace-nowrap">Limited</div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-2">
            {([3, 2, 1] as const).flatMap((pot) =>
              ([1, 2, 3] as const).map((perf) => {
                const key = `${perf}-${pot}`;
                const meta = BOX_LABELS[key];
                const list = cellEmps(perf, pot);
                return (
                  <div
                    key={key}
                    className={`min-h-[160px] rounded-lg p-3 ring-1 ${meta.bg} ${meta.ring}`}
                  >
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                      {meta.label}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {list.map((e) => {
                        const dim = !matches(e);
                        return (
                          <button
                            key={e.id}
                            onClick={() => setOpenId(e.id)}
                            className={`rounded-full border bg-card px-2 py-0.5 text-[10px] font-medium transition ${
                              dim
                                ? "opacity-30"
                                : "hover:border-primary hover:text-primary"
                            }`}
                          >
                            {chipName(e.fullName, e.level)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-2 grid grid-cols-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div>Developing</div>
            <div>Meeting</div>
            <div>Exceeding</div>
          </div>
        </div>
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent>
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.fullName}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <Field label="Department">
                  <EditableText
                    value={open.department}
                    onChange={(v) => update(open.id, { department: v })}
                  />
                </Field>
                <Field label="Level">
                  <EditableText
                    value={open.level}
                    onChange={(v) => update(open.id, { level: v })}
                  />
                </Field>
                <Field label="Track">
                  <Select
                    value={open.track}
                    onValueChange={(v) => update(open.id, { track: v as any })}
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["IC", "MG", "EX"].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Performance (1–3)">
                  <Select
                    value={String(open.performance)}
                    onValueChange={(v) =>
                      update(open.id, { performance: Number(v) as 1 | 2 | 3 })
                    }
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Potential (1–3)">
                  <Select
                    value={String(open.potential)}
                    onValueChange={(v) =>
                      update(open.id, { potential: Number(v) as 1 | 2 | 3 })
                    }
                  >
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

// =================== Tab 3: Sales Performance Matrix ===================

type SalesRow = {
  id: string;
  name: string;
  team: "Direct Sales" | "Channel Sales" | "WCF";
  monthly: number;
  consistency: number;
};

const initialSales: SalesRow[] = [
  { id: "s1", name: "Rashed Al Blooshi", team: "Direct Sales", monthly: 35_000_000, consistency: 8 },
  { id: "s2", name: "Zayed Al Falasi", team: "Direct Sales", monthly: 5_500_000, consistency: 7 },
  { id: "s3", name: "Leila Chebli", team: "Direct Sales", monthly: 4_800_000, consistency: 6 },
  { id: "s4", name: "Patrick Nwosu", team: "Direct Sales", monthly: 2_800_000, consistency: 5 },
  { id: "s5", name: "Hind Al Qubaisi", team: "Direct Sales", monthly: 2_200_000, consistency: 4 },
  { id: "s6", name: "Jassim Al Kuwari", team: "Channel Sales", monthly: 11_000_000, consistency: 9 },
  { id: "s7", name: "Meera Nambiar", team: "Channel Sales", monthly: 6_200_000, consistency: 8 },
  { id: "s8", name: "Tariq Al Dosari", team: "Channel Sales", monthly: 5_000_000, consistency: 6 },
  { id: "s9", name: "Hana Saleh", team: "Channel Sales", monthly: 2_500_000, consistency: 3 },
  { id: "s10", name: "Saeed Al Hamdan", team: "WCF", monthly: 12_000_000, consistency: 9 },
  { id: "s11", name: "Divya Krishnan", team: "WCF", monthly: 5_800_000, consistency: 7 },
  { id: "s12", name: "Marco Vitale", team: "WCF", monthly: 2_000_000, consistency: 4 },
];

const TEAM_COLOR: Record<SalesRow["team"], string> = {
  "Direct Sales": "#3b82f6",
  "Channel Sales": "#8b5cf6",
  WCF: "#f97316",
};

function SalesMatrix() {
  const [rows, setRows] = useState<SalesRow[]>(initialSales);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  const totalMonthly = rows.reduce((s, r) => s + r.monthly, 0);
  const totalAnnual = totalMonthly * 12;

  const update = (id: string, patch: Partial<SalesRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const open = rows.find((r) => r.id === openId) ?? null;

  const maxMonthly = Math.max(...rows.map((r) => r.monthly));

  const grouped = (Object.keys(TEAM_COLOR) as SalesRow["team"][]).map((team) => ({
    team,
    data: rows
      .filter((r) => r.team === team)
      .map((r) => ({ x: r.monthly, y: r.consistency, ...r })),
  }));

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {rows.length} sales team members ·{" "}
        <span className="font-semibold text-secondary">{fmtAED(totalMonthly)}</span>{" "}
        total monthly disbursement ·{" "}
        <span className="font-semibold text-secondary">{fmtAED(totalAnnual)}</span>{" "}
        annualised
      </div>

      <Card className="relative p-4">
        {/* Quadrant tints */}
        <div className="pointer-events-none absolute inset-4 grid grid-cols-2 grid-rows-2 overflow-hidden rounded">
          <div className="bg-blue-50/60" />
          <div className="bg-green-50/60" />
          <div className="bg-red-50/60" />
          <div className="bg-amber-50/60" />
        </div>
        <div className="pointer-events-none absolute inset-4 grid grid-cols-2 grid-rows-2 p-3 text-[11px] font-semibold uppercase tracking-wide text-secondary/70">
          <div className="self-start">Steady Contributor</div>
          <div className="self-start justify-self-end">Star</div>
          <div className="self-end">At Risk</div>
          <div className="self-end justify-self-end">Volatile Performer</div>
        </div>

        <div className="relative h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 16, right: 16, bottom: 32, left: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                dataKey="x"
                name="Monthly"
                domain={[0, Math.ceil(maxMonthly * 1.1)]}
                tickFormatter={(v) => (v >= 1_000_000 ? `${v / 1_000_000}M` : String(v))}
                label={{ value: "Volume (AED monthly)", position: "insideBottom", offset: -16, fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Consistency"
                domain={[0, 10]}
                label={{ value: "Consistency", angle: -90, position: "insideLeft", fontSize: 11 }}
              />
              <ZAxis range={[100, 100]} />
              <ReferenceLine x={maxMonthly / 2} stroke="hsl(var(--border))" />
              <ReferenceLine y={5} stroke="hsl(var(--border))" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as SalesRow;
                  return (
                    <div className="rounded-md border bg-card p-2 text-xs shadow-md">
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-muted-foreground">{d.team}</div>
                      <div>{fmtAED(d.monthly)}/mo</div>
                      <div>Consistency: {d.consistency}/10</div>
                    </div>
                  );
                }}
              />
              {grouped.map((g) => (
                <Scatter
                  key={g.team}
                  name={g.team}
                  data={g.data}
                  fill={TEAM_COLOR[g.team]}
                  onClick={(p: any) => setOpenId(p.id)}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex gap-4 text-xs">
          {(Object.keys(TEAM_COLOR) as SalesRow["team"][]).map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: TEAM_COLOR[t] }}
              />
              {t}
            </div>
          ))}
        </div>
      </Card>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent>
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => setEditMode((v) => !v)}>
                  {editMode ? "Done" : "Edit"}
                </Button>
              </div>
              <div className="mt-4 space-y-4 text-sm">
                <Field label="Name">
                  {editMode ? (
                    <EditableText
                      value={open.name}
                      onChange={(v) => update(open.id, { name: v })}
                    />
                  ) : (
                    <span>{open.name}</span>
                  )}
                </Field>
                <Field label="Team">
                  {editMode ? (
                    <Select
                      value={open.team}
                      onValueChange={(v) => update(open.id, { team: v as any })}
                    >
                      <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(TEAM_COLOR) as SalesRow["team"][]).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{open.team}</span>
                  )}
                </Field>
                <Field label="Monthly Disbursement">
                  {editMode ? (
                    <EditableNumber
                      value={open.monthly}
                      onChange={(v) => update(open.id, { monthly: v })}
                      format={(v) => fmtAED(v)}
                    />
                  ) : (
                    <span>{fmtAED(open.monthly)}</span>
                  )}
                </Field>
                <Field label="Consistency (1–10)">
                  {editMode ? (
                    <EditableNumber
                      value={open.consistency}
                      onChange={(v) =>
                        update(open.id, { consistency: Math.max(0, Math.min(10, v)) })
                      }
                    />
                  ) : (
                    <span>{open.consistency}/10</span>
                  )}
                </Field>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// =================== Page ===================

export default function OrgDesign() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">Org Design</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan capacity, calibrate talent, and review sales performance.
        </p>
      </div>

      <Tabs defaultValue="capacity">
        <TabsList>
          <TabsTrigger value="capacity">Capacity Planner</TabsTrigger>
          <TabsTrigger value="ninebox">9-Box Matrix</TabsTrigger>
          <TabsTrigger value="sales">Sales Performance Matrix</TabsTrigger>
          <TabsTrigger value="framework">Sales Framework</TabsTrigger>
        </TabsList>
        <TabsContent value="capacity" className="mt-6">
          <CapacityPlanner />
        </TabsContent>
        <TabsContent value="ninebox" className="mt-6">
          <NineBox />
        </TabsContent>
        <TabsContent value="sales" className="mt-6">
          <SalesMatrix />
        </TabsContent>
        <TabsContent value="framework" className="mt-6">
          <SalesFramework />
        </TabsContent>
      </Tabs>
    </div>
  );
}