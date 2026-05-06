import { useCurrentUser } from "@/context/CurrentUserContext";
import { firstName, formatTenure, gulfGreeting, currentQuarter } from "@/lib/format";
import { ArrowRight, AlertTriangle } from "lucide-react";

function MetricCard({
  label,
  value,
  sub,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold text-secondary ${mono ? "font-mono-code" : ""}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

const competencies = [
  { name: "Ownership & delivery", score: 4.2 },
  { name: "Communication", score: 3.8 },
  { name: "Collaboration", score: 4.0 },
  { name: "Strategic thinking", score: 2.9, gap: true },
  { name: "Growth mindset", score: 3.6 },
];

const actions = [
  "Lead one cross-team initiative this quarter to practise framing trade-offs.",
  "Pair with Aisha on the Q3 workforce plan to learn long-term planning lenses.",
  "Read 'Good Strategy / Bad Strategy' and share two takeaways with your manager.",
];

export default function Dashboard() {
  const { employee } = useCurrentUser();
  if (!employee) return null;
  const { q, year } = currentQuarter();

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary">
          {gulfGreeting()} {firstName(employee.full_name)}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Q{q} {year} · {employee.job_title} · {employee.department}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Current level" value={`${employee.level_code}/L${employee.level_code.replace(/\D/g, "")}`} mono sub={employee.track === "IC" ? "Individual contributor" : employee.track === "MG" ? "Management" : "Executive"} />
        <MetricCard label="Tenure" value={formatTenure(employee.start_date)} sub={`Started ${new Date(employee.start_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`} />
        <MetricCard label="Last review" value="Q1 2026" sub="Exceeds expectations" />
        <MetricCard label="Active goals" value="3" sub="Q2 2026" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Competency snapshot */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Competency snapshot
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Latest manager calibration</p>
          </div>
          <div className="space-y-4">
            {competencies.map((c) => (
              <div key={c.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-secondary">{c.name}</span>
                  <span className={`font-mono-code text-xs ${c.gap ? "text-primary" : "text-muted-foreground"}`}>
                    {c.score.toFixed(1)}/5
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${c.gap ? "bg-primary" : "bg-secondary"}`}
                    style={{ width: `${(c.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Next steps to <span className="font-mono-code text-secondary">IC4/L4</span>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on your last calibration
            </p>
          </div>

          <div className="mb-4 flex gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="text-xs">
              <div className="font-semibold text-secondary">Strategic thinking is your primary gap</div>
              <div className="mt-0.5 text-muted-foreground">
                Score 2.9 — needs to reach 3.5+ to unblock IC4 promotion.
              </div>
            </div>
          </div>

          <ol className="space-y-3">
            {actions.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                  {i + 1}
                </span>
                <span className="text-secondary/90">{a}</span>
              </li>
            ))}
          </ol>

          <button className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
            View full development plan <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}