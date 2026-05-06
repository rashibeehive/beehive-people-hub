import { useEffect, useState } from "react";
import { ArrowRight, Briefcase } from "lucide-react";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { supabase } from "@/integrations/supabase/client";
import { initials, formatTenure } from "@/lib/format";

interface Promotion {
  id: string;
  effective_date: string;
  previous_level: string | null;
  new_level: string;
  previous_title: string | null;
  new_title: string;
  scope_note: string | null;
}

const PAST_REVIEWS = [
  { quarter: "Q1", year: 2026, rating: "Exceeds" },
  { quarter: "Q4", year: 2025, rating: "Meets" },
  { quarter: "Q3", year: 2025, rating: "Meets" },
];

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "navy" | "mono" }) {
  const styles = {
    default: "bg-muted text-secondary",
    navy: "bg-secondary text-secondary-foreground",
    mono: "bg-secondary/10 text-secondary font-mono-code",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[tone]}`}>{children}</span>;
}

export default function Profile() {
  const { employee } = useCurrentUser();
  const [promos, setPromos] = useState<Promotion[]>([]);

  useEffect(() => {
    if (!employee) return;
    supabase
      .from("promotion_history")
      .select("*")
      .eq("employee_id", employee.id)
      .order("effective_date", { ascending: false })
      .then(({ data }) => setPromos((data as Promotion[]) ?? []));
  }, [employee]);

  if (!employee) return null;

  return (
    <div>
      {/* Header */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {initials(employee.full_name)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-secondary">{employee.full_name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{employee.job_title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="navy">{employee.department}</Badge>
              <Badge tone="mono">{employee.level_code}</Badge>
              <Badge>{employee.location}</Badge>
              <Badge>{employee.employment_type}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-4">
          <Detail label="Start date" value={new Date(employee.start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
          <Detail label="Tenure" value={formatTenure(employee.start_date)} />
          <Detail label="Employee ID" value={<span className="font-mono-code">{employee.employee_id}</span>} />
          <Detail label="Manager" value={employee.manager_email ?? "—"} />
        </div>
      </div>

      {/* Promotion timeline */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Promotion timeline
        </h2>
        {promos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            <Briefcase className="mx-auto mb-2 h-5 w-5" />
            No promotions recorded yet — your first will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {promos.map((p) => (
              <div key={p.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {new Date(p.effective_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono-code text-muted-foreground">{p.previous_level ?? "—"}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono-code text-secondary">{p.new_level}</span>
                  </div>
                </div>
                <div className="mt-1.5 text-sm text-secondary">
                  {p.previous_title ?? "—"} → <span className="font-medium">{p.new_title}</span>
                </div>
                {p.scope_note && <div className="mt-1 text-xs text-muted-foreground">{p.scope_note}</div>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review history */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Review history
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAST_REVIEWS.map((r) => (
            <div key={`${r.year}-${r.quarter}`} className="rounded-xl border bg-card p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {r.quarter} {r.year}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-secondary">Overall</span>
                <Badge tone={r.rating === "Exceeds" ? "navy" : "default"}>{r.rating}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-secondary">{value}</div>
    </div>
  );
}