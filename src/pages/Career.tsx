import { useMemo, useState } from "react";
import {
  LEVELS,
  TRACK_META,
  COMPETENCY_CATEGORIES,
  COMPETENCY_DEFINITIONS,
  COMPETENCY_DESCRIPTORS,
  progressionFor,
  DEPARTMENTS,
  headcountFor,
  type Department,
  type Track,
} from "@/data/career";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSalesFramework } from "@/data/salesFramework";
import { BenefitsMatrix } from "@/components/SalesFramework";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, GitFork } from "lucide-react";

type View = "level" | "competency";

function BdForkDiagram() {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-blue-50/40 via-card to-purple-50/40 p-6">
      <div className="mb-4 flex items-center gap-2">
        <GitFork className="h-4 w-4 text-primary" />
        <h3 className="text-base font-semibold text-secondary">
          Career Path Decision Point — IC4
        </h3>
        <TooltipProvider>
          <UiTooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-secondary" aria-label="More info">
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              At this stage, employees may progress as a senior individual contributor or move into people management. Progression is based on performance, business need, and employee preference.
            </TooltipContent>
          </UiTooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left branch — IC */}
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">
            IC Track — Specialist Path
          </div>
          <div className="mt-2 flex items-center gap-2 font-mono text-sm font-semibold text-secondary">
            <span className="rounded bg-blue-500/10 px-2 py-0.5">IC5</span>
            <span className="text-blue-500">→</span>
            <span className="rounded bg-blue-500/10 px-2 py-0.5">IC6</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Associate Director, BD → Director, BD
          </p>
        </div>

        {/* Fork node */}
        <div className="flex flex-col items-center">
          <div className="rounded-full border-2 border-primary bg-background px-3 py-1 font-mono text-sm font-semibold text-primary">
            IC4
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Fork</div>
        </div>

        {/* Right branch — MG */}
        <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-purple-700">
            MG Track — People Manager Path
          </div>
          <div className="mt-2 flex items-center gap-2 font-mono text-sm font-semibold text-secondary">
            <span className="rounded bg-purple-500/10 px-2 py-0.5">MG1</span>
            <span className="text-purple-500">→</span>
            <span className="rounded bg-purple-500/10 px-2 py-0.5">MG2</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Team Lead → Manager
          </p>
        </div>
      </div>
    </div>
  );
}

function aed(n: number) {
  return `AED ${n.toLocaleString()}`;
}

function TrackChip({ track }: { track: Track }) {
  const meta = TRACK_META[track];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function HeaderChips() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-700">
        <span className="h-2 w-2 rounded-full bg-blue-500" /> Individual Contributor — IC1 to IC6
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-700">
        <span className="h-2 w-2 rounded-full bg-purple-500" /> Manager — MG1 to MG4
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700">
        <span className="h-2 w-2 rounded-full bg-amber-500" /> Executive — EX1 to EX3
      </span>
    </div>
  );
}

function ByLevel({
  selected,
  setSelected,
  department,
}: {
  selected: string;
  setSelected: (c: string) => void;
  department: Department | "all";
}) {
  const isBD = department === "Business Development";
  const { levels: bdLevels } = useSalesFramework();
  // Build the active level list — BD overrides the global LEVELS for sidebar/details.
  const activeLevels = isBD
    ? bdLevels.map((l) => ({
        code: l.code,
        track: l.track,
        title: l.title,
        salaryMin: l.salaryMin,
        salaryMax: l.salaryMax,
        headcount: 0,
      }))
    : LEVELS;
  const level = activeLevels.find((l) => l.code === selected) ?? activeLevels[0];
  const meta = TRACK_META[level.track];
  const prog = progressionFor(level.code);
  const headcount = headcountFor(level.code, department);

  const grouped: Record<Track, typeof activeLevels> = { IC: [], MG: [], EX: [] };
  activeLevels.forEach((l) => grouped[l.track].push(l));

  return (
    <div className="grid grid-cols-[260px_1fr] gap-6">
      <aside className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-xl border bg-card p-3">
        {(["IC", "MG", "EX"] as Track[]).map((t) => (
          <div key={t} className="mb-4">
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className={`h-3 w-1 rounded ${TRACK_META[t].colorBar}`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {TRACK_META[t].label}
              </span>
            </div>
            <div className="space-y-1">
              {grouped[t].map((l) => {
                const active = l.code === selected;
                return (
                  <button
                    key={l.code}
                    onClick={() => setSelected(l.code)}
                    className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary/5 text-secondary"
                        : "border-transparent hover:bg-muted/60"
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold">{l.code}</span>
                    <span className="ml-2 truncate text-xs text-muted-foreground">{l.title}</span>
                  </button>
                );
              })}
          </div>
          </div>
        ))}
      </aside>

      <div className="space-y-6">
        {/* Overview */}
        <div className="rounded-xl border bg-card p-6">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Level</div>
              <div className="mt-1 font-mono text-2xl font-semibold text-secondary">{level.code}</div>
              <div className="text-sm text-muted-foreground">{level.title}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Track</div>
              <div className="mt-2"><TrackChip track={level.track} /></div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Salary band</div>
              <div className="mt-1 text-base font-semibold text-secondary">
                {aed(level.salaryMin)} – {aed(level.salaryMax)}
              </div>
              <div className="text-xs text-muted-foreground">monthly</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Headcount</div>
              <div
                className={`mt-1 text-2xl font-semibold ${
                  headcount === 0 && department !== "all" ? "text-muted-foreground/50" : "text-secondary"
                }`}
              >
                {headcount}
              </div>
              <div className="text-xs text-muted-foreground">
                {department === "all"
                  ? "employees at this level"
                  : `in ${department} at this level`}
              </div>
            </div>
          </div>
        </div>

        {isBD && <BdForkDiagram />}

        {/* Competencies */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-base font-semibold text-secondary">
            What good looks like at <span className="font-mono">{level.code}</span>
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {COMPETENCY_CATEGORIES.map((cat) => (
              <div key={cat.name} className="rounded-lg border bg-background p-4">
                <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.chip}`}>
                  {cat.name}
                </div>
                <div className="space-y-3">
                  {cat.competencies.map((comp) => (
                    <div key={comp}>
                      <div className="text-sm font-semibold text-secondary">{comp}</div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {COMPETENCY_DESCRIPTORS[comp][level.code]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progression */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-base font-semibold text-secondary">Path to next level</h2>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {prog.prev ? `Coming from ${prog.prev.code}` : "Entry point"}
              </div>
              {prog.prev ? (
                <ul className="mt-3 space-y-2">
                  {prog.demonstrates.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Entry point into the Beehive career framework.
                </p>
              )}
            </div>
            <div className="rounded-lg border bg-primary/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                {prog.next ? `To reach ${prog.next.code}` : "Top of framework"}
              </div>
              {prog.next ? (
                <ul className="mt-3 space-y-2">
                  {prog.develops.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  This is the top of the framework.
                </p>
              )}
            </div>
          </div>
        </div>

        {isBD && (
          <BenefitsMatrix
            title="Benefits Matrix · Business Development"
            description="Per-level entitlements. Editable by the designated admin only. Synced with Org Design → Sales Framework."
          />
        )}
      </div>
    </div>
  );
}

function ByCompetency({ selected, setSelected }: { selected: string; setSelected: (c: string) => void }) {
  const category = useMemo(
    () => COMPETENCY_CATEGORIES.find((c) => c.competencies.includes(selected as never))!,
    [selected],
  );

  return (
    <div className="grid grid-cols-[260px_1fr] gap-6">
      <aside className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-xl border bg-card p-3">
        {COMPETENCY_CATEGORIES.map((cat) => (
          <div key={cat.name} className="mb-4">
            <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.name}
            </div>
            <div className="space-y-1">
              {cat.competencies.map((comp) => {
                const active = comp === selected;
                return (
                  <button
                    key={comp}
                    onClick={() => setSelected(comp)}
                    className={`block w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary/5 text-secondary"
                        : "border-transparent hover:bg-muted/60"
                    }`}
                  >
                    {comp}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </aside>

      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-secondary">{selected}</h2>
            <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {category.name}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {COMPETENCY_DEFINITIONS[selected]}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-base font-semibold text-secondary">Progression across all 13 levels</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Level</th>
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Track</th>
                  <th className="px-4 py-2 font-medium">Descriptor</th>
                </tr>
              </thead>
              <tbody>
                {LEVELS.map((l) => (
                  <tr key={l.code} className={`border-t ${TRACK_META[l.track].rowTint}`}>
                    <td className="px-4 py-3 align-top font-mono text-xs font-semibold text-secondary">{l.code}</td>
                    <td className="px-4 py-3 align-top text-sm text-secondary">{l.title}</td>
                    <td className="px-4 py-3 align-top">
                      <TrackChip track={l.track} />
                    </td>
                    <td className="px-4 py-3 align-top text-xs leading-relaxed text-muted-foreground">
                      {COMPETENCY_DESCRIPTORS[selected][l.code]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Progression bar */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Foundational</span>
              <span>Advanced</span>
            </div>
            <div className="relative h-2 rounded-full bg-gradient-to-r from-blue-200 via-purple-200 to-amber-300">
              <div className="absolute inset-0 flex items-center justify-between px-1">
                {LEVELS.map((l) => (
                  <div
                    key={l.code}
                    title={`${l.code} · ${l.title}`}
                    className={`h-3 w-3 rounded-full border-2 border-background ${TRACK_META[l.track].dot}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-between px-0.5 font-mono text-[10px] text-muted-foreground">
              {LEVELS.map((l) => (
                <span key={l.code}>{l.code}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Career() {
  const [view, setView] = useState<View>("level");
  const [selectedLevel, setSelectedLevel] = useState("IC3");
  const [selectedComp, setSelectedComp] = useState("Problem Solving");
  const [department, setDepartment] = useState<Department | "all">("all");

  return (
    <div>
      <header className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Career Framework</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Beehive's three tracks, thirteen levels, and sixteen competencies that define how we grow.
          </p>
          <HeaderChips />
          <p className="mt-3 text-xs text-muted-foreground">
            Track fork occurs at IC4 — employees choose between continuing the IC track or moving into people management (MG1).
          </p>
          {view === "level" && (
            <div className="mt-4 flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Department</label>
              <Select value={department} onValueChange={(v) => setDepartment(v as Department | "all")}>
                <SelectTrigger className="h-9 w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="inline-flex shrink-0 rounded-md border bg-card p-1">
          {(["level", "competency"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                view === v
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-secondary"
              }`}
            >
              {v === "level" ? "By Level" : "By Competency"}
            </button>
          ))}
        </div>
      </header>

      {view === "level" ? (
        <ByLevel selected={selectedLevel} setSelected={setSelectedLevel} department={department} />
      ) : (
        <ByCompetency selected={selectedComp} setSelected={setSelectedComp} />
      )}
    </div>
  );
}