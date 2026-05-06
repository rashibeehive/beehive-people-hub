import { useState } from "react";
import { ChevronUp, ChevronDown, Wrench } from "lucide-react";
import { useCurrentUser } from "@/context/CurrentUserContext";
import type { Role } from "@/context/AuthContext";

const ROLES: Role[] = ["employee", "manager", "department_head", "hr_admin"];

export function DevRoleSwitcher() {
  if (!import.meta.env.DEV) return null;
  const { role, setRole, employee, allEmployees, setEmployeeId, isDevOverride } = useCurrentUser();
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-border bg-card text-card-foreground shadow-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-t-xl border-b border-border bg-secondary px-3 py-2 text-secondary-foreground"
      >
        <div className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Dev switcher</span>
          {isDevOverride && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary-foreground">
              Active
            </span>
          )}
        </div>
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="space-y-3 p-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-secondary"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Mock user
            </label>
            <select
              value={employee?.id ?? ""}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-secondary"
            >
              {!employee && <option value="">— select —</option>}
              {allEmployees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name} · {e.level_code} · {e.department}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Local override only — does not affect database or RLS.
          </p>
        </div>
      )}
    </div>
  );
}