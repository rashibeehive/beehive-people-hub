import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  COMPANY_OKRS,
  DEPARTMENT_OKRS,
  DEPARTMENTS,
  EMPLOYEES,
  PILLARS,
  RAG_META,
  nextRag,
  newId,
  rollupRag,
  type CompanyKR,
  type CompanyPillarOKRs,
  type DepartmentName,
  type DepartmentOKRs,
  type DeptKR,
  type DeptObjective,
  type PillarId,
  type RAG,
} from "@/data/goals";

/* ---------- shared editable bits ---------- */

function EditableText({
  value,
  onChange,
  placeholder,
  className,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (editing) {
    const commit = () => {
      onChange(draft);
      setEditing(false);
    };
    return multiline ? (
      <Textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        className={cn("min-h-[60px]", className)}
      />
    ) : (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className={cn("h-8", className)}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        "w-full rounded px-1.5 py-1 text-left hover:bg-muted/60",
        !value && "text-muted-foreground",
        className,
      )}
    >
      {value || placeholder || "—"}
    </button>
  );
}

function PersonSelect({
  value,
  onChange,
  preferDept,
}: {
  value: string;
  onChange: (v: string) => void;
  preferDept?: DepartmentName;
}) {
  const sorted = useMemo(() => {
    const list = [...EMPLOYEES];
    list.sort((a, b) => {
      if (preferDept) {
        const aIn = a.department === preferDept ? 0 : 1;
        const bIn = b.department === preferDept ? 0 : 1;
        if (aIn !== bIn) return aIn - bIn;
      }
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [preferDept]);
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sorted.map((e) => (
          <SelectItem key={e.name} value={e.name} className="text-xs">
            {e.name}{" "}
            <span className="text-muted-foreground">· {e.department}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RagButton({ rag, onChange }: { rag: RAG; onChange: (r: RAG) => void }) {
  const meta = RAG_META[rag];
  return (
    <button
      type="button"
      onClick={() => onChange(nextRag(rag))}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
        meta.chip,
      )}
      title="Click to cycle status"
    >
      <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
      {meta.label}
    </button>
  );
}

/* ---------- Company OKRs ---------- */

function CompanyPillarCard({
  data,
  onChange,
}: {
  data: CompanyPillarOKRs;
  onChange: (next: CompanyPillarOKRs) => void;
}) {
  const [open, setOpen] = useState(true);
  const pillar = PILLARS.find((p) => p.id === data.pillarId)!;
  const rollup = rollupRag(data.krs.map((k) => k.rag));
  const meta = RAG_META[rollup];

  const updateKR = (id: string, patch: Partial<CompanyKR>) =>
    onChange({
      ...data,
      krs: data.krs.map((k) => (k.id === id ? { ...k, ...patch } : k)),
    });
  const removeKR = (id: string) =>
    onChange({ ...data, krs: data.krs.filter((k) => k.id !== id) });
  const addKR = () =>
    onChange({
      ...data,
      krs: [
        ...data.krs,
        { id: newId(), text: "", owner: EMPLOYEES[0].name, rag: "amber" },
      ],
    });

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: pillar.color }}
        />
        <span className="text-base font-semibold text-secondary">{pillar.name}</span>
        <span
          className={cn(
            "ml-2 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
            meta.chip,
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", meta.dot)} /> {meta.label}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {data.krs.length} key results
        </span>
      </button>

      {open && (
        <div className="border-t">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-10 px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Key Result</th>
                <th className="w-56 px-4 py-2 text-left">Responsible</th>
                <th className="w-32 px-4 py-2 text-left">RAG</th>
                <th className="w-24 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.krs.map((kr, i) => (
                <tr key={kr.id} className="border-t">
                  <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-2">
                    <EditableText
                      value={kr.text}
                      onChange={(v) => updateKR(kr.id, { text: v })}
                      placeholder="New key result..."
                    />
                  </td>
                  <td className="px-4 py-2">
                    <PersonSelect
                      value={kr.owner}
                      onChange={(v) => updateKR(kr.id, { owner: v })}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <RagButton rag={kr.rag} onChange={(r) => updateKR(kr.id, { rag: r })} />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                        title="Edit"
                        onClick={() => {
                          // edit acts via inline; no-op
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                        title="Delete"
                        onClick={() => removeKR(kr.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t px-4 py-2">
            <Button variant="ghost" size="sm" onClick={addKR}>
              <Plus className="h-3.5 w-3.5" /> Add Key Result
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Department OKRs ---------- */

function BlockerCell({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const preview = value ? (value.length > 60 ? value.slice(0, 60) + "…" : value) : "";
  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setDraft(value); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full rounded px-1.5 py-1 text-left text-xs hover:bg-muted/60",
            !value && "italic text-muted-foreground",
          )}
        >
          {value ? (
            <span>
              {preview}{" "}
              {value.length > 60 && <span className="text-primary underline">View</span>}
            </span>
          ) : (
            "No blockers"
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Describe blocker..."
          className="min-h-[100px] text-xs"
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DepartmentBlock({
  data,
  onChange,
}: {
  data: DepartmentOKRs;
  onChange: (next: DepartmentOKRs) => void;
}) {
  const [open, setOpen] = useState(true);
  const [editDeptOpen, setEditDeptOpen] = useState(false);
  const [deptDraft, setDeptDraft] = useState({ department: data.department, head: data.head });

  const allKrs = data.objectives.flatMap((o) => o.krs.map((k) => k.rag));
  const rollup = rollupRag(allKrs);
  const meta = RAG_META[rollup];

  const updateObjective = (oid: string, patch: Partial<DeptObjective>) =>
    onChange({
      ...data,
      objectives: data.objectives.map((o) => (o.id === oid ? { ...o, ...patch } : o)),
    });
  const removeObjective = (oid: string) =>
    onChange({ ...data, objectives: data.objectives.filter((o) => o.id !== oid) });
  const addObjective = () =>
    onChange({
      ...data,
      objectives: [...data.objectives, { id: newId(), title: "New objective", krs: [] }],
    });
  const updateKR = (oid: string, kid: string, patch: Partial<DeptKR>) =>
    updateObjective(oid, {
      krs: data.objectives.find((o) => o.id === oid)!.krs.map((k) =>
        k.id === kid ? { ...k, ...patch } : k,
      ),
    });
  const removeKR = (oid: string, kid: string) =>
    updateObjective(oid, {
      krs: data.objectives.find((o) => o.id === oid)!.krs.filter((k) => k.id !== kid),
    });
  const addKR = (oid: string) =>
    updateObjective(oid, {
      krs: [
        ...data.objectives.find((o) => o.id === oid)!.krs,
        {
          id: newId(),
          text: "",
          project: "",
          lead: EMPLOYEES.find((e) => e.department === data.department)?.name ?? EMPLOYEES[0].name,
          rag: "amber",
          blockers: "",
        },
      ],
    });

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-muted-foreground"
        >
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <div className="leading-tight">
          <div className="text-base font-semibold text-secondary">{data.department}</div>
          <div className="text-xs text-muted-foreground">{data.head}</div>
        </div>
        <div className="ml-4 flex items-center gap-1.5">
          {data.pillars.map((pid) => {
            const p = PILLARS.find((x) => x.id === pid)!;
            return (
              <span
                key={pid}
                className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]"
                style={{ borderColor: p.color, color: p.color }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                {p.name}
              </span>
            );
          })}
          <Select
            value=""
            onValueChange={(v) => {
              const id = v as PillarId;
              if (data.pillars.includes(id)) {
                onChange({ ...data, pillars: data.pillars.filter((p) => p !== id) });
              } else {
                onChange({ ...data, pillars: [...data.pillars, id] });
              }
            }}
          >
            <SelectTrigger className="h-7 w-[140px] text-[11px]">
              <SelectValue placeholder="+ pillar" />
            </SelectTrigger>
            <SelectContent>
              {PILLARS.map((p) => (
                <SelectItem key={p.id} value={p.id} className="text-xs">
                  {data.pillars.includes(p.id) ? "✓ " : ""}
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
            meta.chip,
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", meta.dot)} /> {meta.label}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDeptDraft({ department: data.department, head: data.head });
            setEditDeptOpen(true);
          }}
        >
          Edit Department
        </Button>
      </div>

      {open && (
        <div className="space-y-4 border-t bg-muted/20 p-5">
          {data.objectives.map((o) => (
            <div key={o.id} className="rounded-lg border bg-card">
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex-1">
                  <EditableText
                    value={o.title}
                    onChange={(v) => updateObjective(o.id, { title: v })}
                    className="text-sm font-semibold text-secondary"
                  />
                </div>
                <button
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                  onClick={() => removeObjective(o.id)}
                  title="Delete objective"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <table className="w-full border-t text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="w-8 px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Key Result</th>
                    <th className="w-44 px-3 py-2 text-left">Project / Initiative</th>
                    <th className="w-48 px-3 py-2 text-left">Nominated Lead</th>
                    <th className="w-28 px-3 py-2 text-left">RAG</th>
                    <th className="w-56 px-3 py-2 text-left">Blockers</th>
                    <th className="w-20 px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {o.krs.map((kr, i) => (
                    <tr key={kr.id} className="border-t align-top">
                      <td className="px-3 py-2 text-xs text-muted-foreground">{i + 1}</td>
                      <td className="px-3 py-2">
                        <EditableText
                          value={kr.text}
                          onChange={(v) => updateKR(o.id, kr.id, { text: v })}
                          placeholder="New key result..."
                          className="text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <EditableText
                          value={kr.project}
                          onChange={(v) => updateKR(o.id, kr.id, { project: v })}
                          placeholder="Project..."
                          className="text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <PersonSelect
                          value={kr.lead}
                          onChange={(v) => updateKR(o.id, kr.id, { lead: v })}
                          preferDept={data.department}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <RagButton
                          rag={kr.rag}
                          onChange={(r) => updateKR(o.id, kr.id, { rag: r })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <BlockerCell
                          value={kr.blockers}
                          onChange={(v) => updateKR(o.id, kr.id, { blockers: v })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <button className="rounded p-1 text-muted-foreground hover:bg-muted">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                            onClick={() => removeKR(o.id, kr.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t px-3 py-2">
                <Button variant="ghost" size="sm" onClick={() => addKR(o.id)}>
                  <Plus className="h-3.5 w-3.5" /> Add Key Result
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addObjective}>
            <Plus className="h-3.5 w-3.5" /> Add Objective
          </Button>
        </div>
      )}

      <Dialog open={editDeptOpen} onOpenChange={setEditDeptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Department name</label>
              <Input
                value={deptDraft.department}
                onChange={(e) =>
                  setDeptDraft((d) => ({ ...d, department: e.target.value as DepartmentName }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Department head</label>
              <Input
                value={deptDraft.head}
                onChange={(e) => setDeptDraft((d) => ({ ...d, head: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditDeptOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onChange({ ...data, department: deptDraft.department, head: deptDraft.head });
                setEditDeptOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Page ---------- */

export default function Goals() {
  const [company, setCompany] = useState<CompanyPillarOKRs[]>(COMPANY_OKRS);
  const [depts, setDepts] = useState<DepartmentOKRs[]>(DEPARTMENT_OKRS);
  const [filter, setFilter] = useState<DepartmentName | "all">("all");

  const visible = filter === "all" ? depts : depts.filter((d) => d.department === filter);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-secondary">Goals & OKRs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Q2 2026 · Company and department objectives in one view
        </p>
        <div className="mt-4 flex gap-2">
          <a
            href="#company-okrs"
            className="rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            Company OKRs
          </a>
          <a
            href="#department-okrs"
            className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-secondary hover:bg-muted"
          >
            Department OKRs
          </a>
        </div>
      </header>

      {/* Section 1 */}
      <section id="company-okrs" className="space-y-4 scroll-mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-secondary">Company OKRs</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> On Track
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> At Risk
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Off Track
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {company.map((p, idx) => (
            <CompanyPillarCard
              key={p.pillarId}
              data={p}
              onChange={(next) =>
                setCompany((cs) => cs.map((c, i) => (i === idx ? next : c)))
              }
            />
          ))}
        </div>
      </section>

      {/* Section 2 */}
      <section id="department-okrs" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-secondary">Department OKRs</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === "all"
                ? "border-primary bg-primary/10 text-primary"
                : "bg-background text-secondary hover:bg-muted",
            )}
          >
            All Departments
          </button>
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === d
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-background text-secondary hover:bg-muted",
              )}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {visible.map((d) => (
            <DepartmentBlock
              key={d.department}
              data={d}
              onChange={(next) =>
                setDepts((ds) => ds.map((x) => (x.department === d.department ? next : x)))
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
