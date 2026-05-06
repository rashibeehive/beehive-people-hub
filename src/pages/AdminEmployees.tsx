import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCurrentUser } from "@/context/CurrentUserContext";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

const DEPARTMENTS = [
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

const TRACKS = ["IC", "MG", "EX"];
const LOCATIONS = ["UAE", "KSA", "Oman"];

interface Row {
  id: string;
  employee_id: string;
  full_name: string;
  work_email: string;
  department: string;
  job_title: string;
  track: string;
  level_code: string;
  location: string;
  start_date: string;
  manager_email: string | null;
  employment_type: string;
}

export default function AdminEmployees() {
  const { isHrAdmin } = useCurrentUser();
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [track, setTrack] = useState<string>("all");
  const [loc, setLoc] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const load = () => {
    supabase
      .from("employees")
      .select("*")
      .order("employee_id")
      .then(({ data }) => setRows((data as Row[]) ?? []));
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const s = search.toLowerCase();
      if (s && !`${r.full_name} ${r.employee_id} ${r.work_email}`.toLowerCase().includes(s)) return false;
      if (dept !== "all" && r.department !== dept) return false;
      if (track !== "all" && r.track !== track) return false;
      if (loc !== "all" && r.location !== loc) return false;
      return true;
    });
  }, [rows, search, dept, track, loc]);

  if (!isHrAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Manage employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} active records across UAE, KSA, Oman.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1.5 h-4 w-4" /> Add employee
            </Button>
          </DialogTrigger>
          <AddEmployeeDialog onClose={() => setOpen(false)} onSaved={load} />
        </Dialog>
      </header>

      <div className="mb-4 grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or email"
            className="pl-9"
          />
        </div>
        <FilterSelect value={dept} onChange={setDept} label="Department" options={DEPARTMENTS} />
        <FilterSelect value={track} onChange={setTrack} label="Track" options={TRACKS} />
        <FilterSelect value={loc} onChange={setLoc} label="Location" options={LOCATIONS} />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Department</Th>
              <Th>Job title</Th>
              <Th>Level</Th>
              <Th>Track</Th>
              <Th>Location</Th>
              <Th>Start date</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <Td><span className="font-mono-code text-xs">{r.employee_id}</span></Td>
                <Td><div className="font-medium text-secondary">{r.full_name}</div><div className="text-xs text-muted-foreground">{r.work_email}</div></Td>
                <Td>{r.department}</Td>
                <Td>{r.job_title}</Td>
                <Td><span className="font-mono-code text-xs">{r.level_code}</span></Td>
                <Td>{r.track}</Td>
                <Td>{r.location}</Td>
                <Td>{new Date(r.start_date).toLocaleDateString("en-GB")}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" variant="ghost"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost"><Pencil className="h-3.5 w-3.5" /></Button>
                  </div>
                </Td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">No employees match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>
);
const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 align-top ${className}`}>{children}</td>
);

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (v: string) => void; label: string; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label.toLowerCase()}</SelectItem>
        {options.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
      </SelectContent>
    </Select>
  );
}

function AddEmployeeDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    work_email: "",
    department: "HR",
    job_title: "",
    track: "IC",
    level_code: "IC1",
    manager_email: "",
    location: "UAE",
    employment_type: "Full time",
    start_date: new Date().toISOString().slice(0, 10),
    salary_aed: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSave = async () => {
    const payload: Record<string, unknown> = { ...form };
    payload.salary_aed = form.salary_aed ? parseInt(form.salary_aed, 10) : null;
    if (!form.manager_email) payload.manager_email = null;
    const { error } = await supabase.from("employees").insert(payload as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Employee added.");
    onSaved();
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add employee</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Employee ID"><Input value={form.employee_id} onChange={(e) => set("employee_id", e.target.value)} placeholder="BH-100" /></Field>
        <Field label="Full name"><Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></Field>
        <Field label="Work email"><Input type="email" value={form.work_email} onChange={(e) => set("work_email", e.target.value)} placeholder="name@beehive.ae" /></Field>
        <Field label="Job title"><Input value={form.job_title} onChange={(e) => set("job_title", e.target.value)} /></Field>
        <Field label="Department">
          <Select value={form.department} onValueChange={(v) => set("department", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{DEPARTMENTS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent>
          </Select>
        </Field>
        <Field label="Track">
          <Select value={form.track} onValueChange={(v) => set("track", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TRACKS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent>
          </Select>
        </Field>
        <Field label="Level code"><Input value={form.level_code} onChange={(e) => set("level_code", e.target.value)} placeholder="IC3" /></Field>
        <Field label="Location">
          <Select value={form.location} onValueChange={(v) => set("location", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{LOCATIONS.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent>
          </Select>
        </Field>
        <Field label="Manager email"><Input value={form.manager_email} onChange={(e) => set("manager_email", e.target.value)} placeholder="optional" /></Field>
        <Field label="Employment type"><Input value={form.employment_type} onChange={(e) => set("employment_type", e.target.value)} /></Field>
        <Field label="Start date"><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></Field>
        <Field label="Salary (AED)"><Input type="number" value={form.salary_aed} onChange={(e) => set("salary_aed", e.target.value)} placeholder="optional" /></Field>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onSave}>Add employee</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}