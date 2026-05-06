import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/context/CurrentUserContext";

interface Level {
  level_code: string;
  track: "IC" | "MG" | "EX";
  l_number: number;
  title: string;
  sort_order: number;
}

function nextLevelCode(track: string, current: string): string | null {
  const n = parseInt(current.replace(/\D/g, ""), 10);
  if (track === "IC" && n < 6) return `IC${n + 1}`;
  if (track === "MG" && n < 4) return `MG${n + 1}`;
  if (track === "EX" && n < 3) return `EX${n + 1}`;
  return null;
}

function LevelRow({
  level,
  state,
}: {
  level: Level;
  state: "current" | "next" | "future" | "past" | "muted";
}) {
  const base = "rounded-lg border px-4 py-3 transition-colors";
  const styles: Record<string, string> = {
    current: "border-primary border-2 bg-primary/5",
    next: "border-secondary border-2 bg-secondary/5",
    future: "border-border bg-card",
    past: "border-border bg-muted/40 text-muted-foreground",
    muted: "border-dashed border-border bg-muted/30 text-muted-foreground",
  };
  return (
    <div className={`${base} ${styles[state]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`font-mono-code text-sm font-medium ${state === "current" ? "text-primary" : state === "next" ? "text-secondary" : ""}`}>
          {level.level_code}/L{level.l_number}
        </span>
        {state === "current" && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            You are here
          </span>
        )}
        {state === "next" && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
            Next
          </span>
        )}
      </div>
      <div className={`mt-1 text-sm ${state === "past" || state === "muted" ? "" : "text-secondary"}`}>
        {level.title}
      </div>
    </div>
  );
}

function Track({
  title,
  subtitle,
  levels,
  currentCode,
  nextCode,
  greyed,
}: {
  title: string;
  subtitle: string;
  levels: Level[];
  currentCode: string | null;
  nextCode: string | null;
  greyed?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-secondary">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="space-y-2">
        {[...levels].reverse().map((lv) => {
          let state: "current" | "next" | "future" | "past" | "muted" = "future";
          if (greyed) state = "muted";
          else if (lv.level_code === currentCode) state = "current";
          else if (lv.level_code === nextCode) state = "next";
          else if (currentCode && lv.l_number < (levels.find((l) => l.level_code === currentCode)?.l_number ?? 0)) state = "past";
          return <LevelRow key={lv.level_code} level={lv} state={state} />;
        })}
      </div>
      {greyed && (
        <p className="mt-4 text-xs text-muted-foreground">
          Filled through executive process.
        </p>
      )}
    </div>
  );
}

export default function Career() {
  const { employee } = useCurrentUser();
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    supabase
      .from("career_levels")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setLevels((data as Level[]) ?? []));
  }, []);

  if (!employee || !levels.length) return null;

  const ic = levels.filter((l) => l.track === "IC");
  const mg = levels.filter((l) => l.track === "MG");
  const ex = levels.filter((l) => l.track === "EX");

  const onIc = employee.track === "IC";
  const onMg = employee.track === "MG";
  const isExEmployee = employee.track === "EX";

  const next = nextLevelCode(employee.track, employee.level_code);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary">Career path</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Three tracks at Beehive. You can move sideways or up — both count as growth.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Track
          title="Individual contributor"
          subtitle="IC1 → IC6"
          levels={ic}
          currentCode={onIc ? employee.level_code : null}
          nextCode={onIc ? next : null}
        />
        <Track
          title="Management"
          subtitle="MG1 → MG4"
          levels={mg}
          currentCode={onMg ? employee.level_code : null}
          nextCode={onMg ? next : null}
        />
        <Track
          title="Executive"
          subtitle="EX1 → EX3"
          levels={ex}
          currentCode={isExEmployee ? employee.level_code : null}
          nextCode={isExEmployee ? next : null}
          greyed={!isExEmployee}
        />
      </div>

      <div className="mt-6 rounded-xl border border-secondary/30 bg-secondary/5 p-4 text-sm text-secondary">
        <span className="font-semibold">Fork at L4: </span>
        At L4 you can continue on the IC track or move into management — both are equivalent seniority.
      </div>
    </div>
  );
}