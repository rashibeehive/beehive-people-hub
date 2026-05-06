import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Competency {
  id: string;
  name: string;
  group_name: string;
  sort_order: number;
}

const STAGES = [
  { key: "self", label: "Self review" },
  { key: "manager", label: "Manager review" },
  { key: "calibration", label: "HR calibration" },
  { key: "published", label: "Published" },
];

const QUESTIONS = [
  "What was your biggest achievement this quarter?",
  "What is one area you want to develop next quarter?",
  "If you could do one thing differently this quarter, what would it be?",
];

function ProgressBar({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="flex items-center gap-2">
      {STAGES.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={s.key} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-secondary text-secondary-foreground"
                    : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <div className="min-w-0">
                <div className={`text-xs font-medium ${active ? "text-primary" : done ? "text-secondary" : "text-muted-foreground"}`}>
                  {s.label}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {done ? "Done" : active ? "Active" : "Pending"}
                </div>
              </div>
            </div>
            {i < STAGES.length - 1 && <div className={`h-0.5 flex-1 ${done ? "bg-secondary" : "bg-muted"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function RatingButtons({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-9 w-9 rounded-md border text-sm font-medium transition-colors ${
            value === n
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-secondary hover:border-primary/40"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [comps, setComps] = useState<Competency[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    supabase
      .from("competencies")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setComps((data as Competency[]) ?? []));
  }, []);

  const grouped = comps.reduce<Record<string, Competency[]>>((acc, c) => {
    (acc[c.group_name] ??= []).push(c);
    return acc;
  }, {});
  const groupOrder = ["Decision & Action", "Ownership", "Communication", "Performance"];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missingRatings = comps.filter((c) => !ratings[c.id]).length;
    const missingAnswers = answers.filter((a) => !a.trim()).length;
    if (missingRatings || missingAnswers) {
      toast.error(`Please complete all fields (${missingRatings} ratings, ${missingAnswers} answers missing).`);
      return;
    }
    toast.success("Self review submitted. Your manager will be notified.");
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary">Q2 2026 review</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your self review by 30 June 2026.
        </p>
      </header>

      <div className="rounded-xl border bg-card p-5">
        <ProgressBar activeIdx={0} />
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Competency ratings */}
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-base font-semibold text-secondary">Competency ratings</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Rate yourself 1 (developing) to 5 (role-model). Add a short note where it helps.
          </p>

          <div className="mt-5 space-y-6">
            {groupOrder.map((g) => (
              <div key={g}>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {g}
                </div>
                <div className="space-y-4">
                  {(grouped[g] ?? []).map((c) => (
                    <div key={c.id} className="grid gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0 md:grid-cols-[1fr_auto]">
                      <div>
                        <div className="text-sm font-medium text-secondary">{c.name}</div>
                        <Textarea
                          placeholder="Optional note..."
                          value={notes[c.id] ?? ""}
                          onChange={(e) => setNotes((n) => ({ ...n, [c.id]: e.target.value }))}
                          className="mt-2 min-h-[60px] resize-y text-sm"
                        />
                      </div>
                      <div className="md:pt-1">
                        <RatingButtons
                          value={ratings[c.id]}
                          onChange={(v) => setRatings((r) => ({ ...r, [c.id]: v }))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open questions */}
        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-base font-semibold text-secondary">Open questions</h2>
          <p className="mt-1 text-xs text-muted-foreground">All three are required.</p>
          <div className="mt-5 space-y-5">
            {QUESTIONS.map((q, i) => (
              <div key={i}>
                <label className="text-sm font-medium text-secondary">{q}</label>
                <Textarea
                  value={answers[i]}
                  onChange={(e) => setAnswers((a) => a.map((v, idx) => (idx === i ? e.target.value : v)))}
                  className="mt-2 min-h-[100px]"
                  required
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Save draft
          </Button>
          <Button type="submit">Submit self review</Button>
        </div>
      </form>
    </div>
  );
}