import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Info,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ACTIONS,
  FLIGHT_RISK,
  HEALTH_COMPONENTS,
  HEALTH_INSIGHT,
  OPEN_ROLES,
  ORG_HEALTH,
  PAGE_META,
  PEOPLE_KPIS,
  PILLARS,
  PROMO_READY,
  REVENUE,
  REVENUE_INSIGHT,
  SALES_TEAMS,
  type ChipTone,
  type RAG,
  type Severity,
  type TeamStatus,
} from "@/data/strategic";

/* ---------------- helpers ---------------- */

function healthBand(score: number) {
  if (score < 50) return { label: "Critical", color: "#DC2626", bg: "bg-red-100", text: "text-red-700", ring: "stroke-red-500" };
  if (score < 75) return { label: "Needs Attention", color: "#D97706", bg: "bg-amber-100", text: "text-amber-700", ring: "stroke-amber-500" };
  if (score < 90) return { label: "Healthy", color: "#059669", bg: "bg-emerald-100", text: "text-emerald-700", ring: "stroke-emerald-500" };
  return { label: "Excellent", color: "#065F46", bg: "bg-emerald-200", text: "text-emerald-800", ring: "stroke-emerald-700" };
}

function ragChip(rag: RAG, label: string) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  } as const;
  const dot = { green: "🟢", amber: "🟡", red: "🔴" }[rag];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[rag]}`}>
      <span className="text-[10px]">{dot}</span> {label}
    </span>
  );
}

function chip(tone: ChipTone, label: string) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    neutral: "bg-muted text-muted-foreground border-border",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}>
      {label}
    </span>
  );
}

function teamStatusChip(status: TeamStatus, label: string) {
  const tone: ChipTone = status === "outperforming" || status === "on_track" ? "green" : status === "at_risk" ? "amber" : "neutral";
  return chip(tone, label);
}

/* ---------------- Sticky health badge ---------------- */

function OrgHealthBadge() {
  const band = healthBand(ORG_HEALTH.score);
  return (
    <div className={`flex items-center gap-3 rounded-xl border ${band.bg} px-4 py-2.5 shadow-sm`}>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-semibold ${band.text} tabular-nums`}>{ORG_HEALTH.score}</span>
        <span className={`text-sm font-medium ${band.text}/80`}>/ {ORG_HEALTH.max}</span>
      </div>
      <div className="border-l border-current/20 pl-3 leading-tight">
        <div className={`text-[11px] font-semibold uppercase tracking-wider ${band.text}`}>Org Health</div>
        <div className={`text-[10px] ${band.text}/80`}>{band.label}</div>
      </div>
    </div>
  );
}

/* ---------------- Sections ---------------- */

function RevenueCommand() {
  return (
    <section className="rounded-2xl bg-secondary p-8 text-secondary-foreground shadow-lg">
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary-foreground/60">
        <TrendingUp className="h-3.5 w-3.5" />
        Revenue Command
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left — the number */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground/60">
            {REVENUE.projectedLabel}
          </div>
          <div className="mt-2 text-5xl font-semibold tracking-tight">{REVENUE.projectedAnnual}</div>
          <div className="mt-1 text-sm text-emerald-300">{REVENUE.projectedSub}</div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.min(REVENUE.progressPct, 130)}%` }}
              />
              {/* 100% marker */}
              <div
                className="absolute top-[-4px] h-5 w-px bg-white/80"
                style={{ left: `${(100 / 130) * 100}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-secondary-foreground/50">
              <span>0</span>
              <span style={{ marginLeft: `${(100 / 130) * 100 - 10}%` }}>Target · 100%</span>
              <span>130%</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { ...REVENUE.ytdDisbursed, name: "YTD Disbursed", tone: "" },
              { ...REVENUE.monthlyRunRate, name: "Monthly Run Rate", tone: "" },
              { ...REVENUE.aheadOfTarget, name: "Ahead of Target", tone: "text-emerald-300" },
            ].map((s) => (
              <div key={s.name} className="rounded-lg bg-white/5 p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground/60">
                  {s.name}
                </div>
                <div className={`mt-1 text-lg font-semibold ${s.tone || ""}`}>{s.value}</div>
                <div className="text-[10px] text-secondary-foreground/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — team breakdown */}
        <div className="space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-secondary-foreground/60">
            Sales Teams
          </div>
          {SALES_TEAMS.map((t) => (
            <div key={t.name} className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{t.name}</div>
                {teamStatusChip(t.status, `${t.pct}% · ${t.statusLabel}`)}
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-1 text-[11px] text-secondary-foreground/70">
                <div>Run rate: <span className="text-secondary-foreground">{t.runRate}</span></div>
                <div>Target: <span className="text-secondary-foreground">{t.target}</span></div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-secondary-foreground/60">{t.members} members</span>
                <Link to="/org-design?tab=capacity" className="inline-flex items-center gap-1 text-primary hover:underline">
                  View Team <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-6 flex gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
        <p className="text-sm leading-relaxed text-secondary-foreground/85">{REVENUE_INSIGHT}</p>
      </div>
    </section>
  );
}

function PillarHealth() {
  return (
    <section>
      <SectionHeading title="OKR Pillar Health" subtitle="Company-level goal execution across all five strategic pillars" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {PILLARS.map((p) => (
          <Card key={p.pillarId} className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                <div className="text-sm font-semibold text-secondary leading-tight">{p.name}</div>
              </div>
              {ragChip(p.rag, p.ragLabel)}
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-mono-code text-secondary">{p.krOnTrack}</span> of{" "}
              <span className="font-mono-code text-secondary">{p.krTotal}</span> key results on track
            </div>
            <p className="text-xs leading-snug text-secondary/80">{p.summary}</p>
            <Link
              to={`/goals?pillar=${p.pillarId}`}
              className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View OKRs <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Gauge({ score }: { score: number }) {
  const band = healthBand(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const pct = score / 100;
  const offset = circumference * (1 - pct);
  return (
    <div className="relative h-[180px] w-[180px]">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} className="stroke-muted" strokeWidth="14" fill="none" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          className={band.ring}
          strokeWidth="14"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-4xl font-semibold ${band.text} tabular-nums`}>{score}</div>
        <div className="text-xs text-muted-foreground">/ 100</div>
        <div className={`mt-1 text-[10px] font-semibold uppercase tracking-wider ${band.text}`}>{band.label}</div>
      </div>
    </div>
  );
}

function OrgHealthSection() {
  return (
    <section>
      <SectionHeading title="Org Health Index" subtitle="Composite score across four people health dimensions · Q2 2026" />
      <Card className="p-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Left gauge */}
          <div className="flex flex-col items-center">
            <Gauge score={ORG_HEALTH.score} />
            <p className="mt-3 text-center text-xs text-muted-foreground">↑ First baseline — trend available next quarter</p>

            <div className="mt-5 w-full space-y-1.5 text-[11px]">
              {[
                { label: "0–49 Critical", color: "bg-red-500" },
                { label: "50–74 Needs Attention", color: "bg-amber-500" },
                { label: "75–89 Healthy", color: "bg-emerald-500" },
                { label: "90–100 Excellent", color: "bg-emerald-700" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${b.color}`} />
                  <span className="text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right components */}
          <div className="space-y-4">
            {HEALTH_COMPONENTS.map((c) => {
              const band = healthBand(c.score);
              return (
                <div key={c.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                      {c.name}
                      <span className="text-[10px] text-muted-foreground">· {c.weight}% weight</span>
                    </div>
                    <span className={`font-mono-code text-sm font-semibold ${band.text}`}>{c.score}/100</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: band.color }} />
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{c.summary}</span>
                    <Link to={c.link} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      View detail <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}

            <div className="mt-4 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">{HEALTH_INSIGHT}</p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

function PeopleSnapshot() {
  return (
    <section>
      <SectionHeading title="People & Cost Snapshot" subtitle="Headcount, payroll, and efficiency metrics" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {PEOPLE_KPIS.map((k) => {
          const inner = (
            <Card className="flex h-full flex-col gap-2 p-4 transition-shadow hover:shadow-md">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
              <div className="text-2xl font-semibold text-secondary tabular-nums">{k.value}</div>
              <div className="mt-auto flex items-center justify-between gap-2">
                {k.sub ? <div className="text-xs text-muted-foreground">{k.sub}</div> : <span />}
                {k.chip && chip(k.chip.tone, k.chip.label)}
              </div>
            </Card>
          );
          if (k.popover === "open_roles") {
            return (
              <Popover key={k.label}>
                <PopoverTrigger asChild>
                  <button className="text-left">{inner}</button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-80 p-0">
                  <div className="border-b px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Open Roles
                  </div>
                  <div className="divide-y">
                    {OPEN_ROLES.map((r, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                        <div className="min-w-0">
                          <div className="truncate font-medium text-secondary">{r.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.department} · <span className="font-mono-code">{r.level}</span>
                          </div>
                        </div>
                        {chip(r.urgency === "Urgent" ? "red" : "amber", r.urgency)}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
          if (k.link) return <Link key={k.label} to={k.link}>{inner}</Link>;
          return <div key={k.label}>{inner}</div>;
        })}
      </div>
    </section>
  );
}

function TalentRadar() {
  return (
    <section>
      <SectionHeading title="Talent Risk Radar" subtitle="Employees requiring executive attention this quarter" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <h3 className="text-sm font-semibold text-secondary">Flight Risk</h3>
            <span className="text-xs text-muted-foreground">· {FLIGHT_RISK.length} employees</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Risk Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FLIGHT_RISK.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium text-secondary">{r.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.department}</TableCell>
                  <TableCell><span className="font-mono-code text-xs">{r.level}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold text-secondary">Promotion Ready</h3>
            <span className="text-xs text-muted-foreground">· High performers with 12+ months at level</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level → Next</TableHead>
                <TableHead>Track</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROMO_READY.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium text-secondary">{r.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.department}</TableCell>
                  <TableCell>
                    <span className="font-mono-code text-xs">{r.from}</span>{" "}
                    <ArrowRight className="inline h-3 w-3 text-muted-foreground" />{" "}
                    <span className="font-mono-code text-xs text-emerald-700">{r.to}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.track}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <div className="mt-3 text-right">
        <Link to="/org-design?tab=ninebox" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View full talent map <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}

function severityVisual(s: Severity) {
  if (s === "critical") return { icon: "🔴", label: "Critical", chipClass: "bg-red-50 text-red-700 border-red-200", border: "border-l-red-500" };
  if (s === "high") return { icon: "🟡", label: "High", chipClass: "bg-amber-50 text-amber-800 border-amber-200", border: "border-l-amber-500" };
  return { icon: "ℹ️", label: "Monitor", chipClass: "bg-blue-50 text-blue-700 border-blue-200", border: "border-l-blue-500" };
}

function ImmediateActions() {
  return (
    <section>
      <SectionHeading title="Actions Required" subtitle="Prioritised items requiring CEO or executive attention" />
      <div className="space-y-2.5">
        {ACTIONS.map((a, i) => {
          const v = severityVisual(a.severity);
          return (
            <Card key={i} className={`border-l-4 ${v.border} p-4`}>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-secondary">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${v.chipClass}`}>
                      <span className="text-[10px]">{v.icon}</span> {v.label}
                    </span>
                    <h4 className="text-sm font-semibold text-secondary">{a.title}</h4>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                </div>
                <Link
                  to={a.link}
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Go to <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-semibold text-secondary">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function StrategicOverview() {
  return (
    <div className="space-y-8 pb-12">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 -mx-8 flex items-start justify-between gap-4 border-b bg-background/95 px-8 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">{PAGE_META.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{PAGE_META.subtitle}</p>
        </div>
        <OrgHealthBadge />
      </header>

      <RevenueCommand />
      <PillarHealth />
      <OrgHealthSection />
      <PeopleSnapshot />
      <TalentRadar />
      <ImmediateActions />
    </div>
  );
}
