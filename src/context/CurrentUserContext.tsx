import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type EmployeeProfile, type Role } from "@/context/AuthContext";

interface CurrentUserCtx {
  employee: EmployeeProfile | null;
  role: Role;
  isHrAdmin: boolean;
  isManager: boolean;
  isDepartmentHead: boolean;
  // dev-only setters (no-op in prod)
  setRole: (r: Role) => void;
  setEmployeeId: (id: string) => void;
  allEmployees: EmployeeProfile[];
  isDevOverride: boolean;
}

const Ctx = createContext<CurrentUserCtx | undefined>(undefined);

const isDev = import.meta.env.DEV;
const LS_ROLE = "dev:current-role";
const LS_EMP = "dev:current-employee-id";

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { employee: authEmployee, role: authRole } = useAuth();

  const [allEmployees, setAllEmployees] = useState<EmployeeProfile[]>([]);
  const [overrideRole, setOverrideRoleState] = useState<Role | null>(() => {
    if (!isDev) return null;
    return (localStorage.getItem(LS_ROLE) as Role | null) ?? null;
  });
  const [overrideEmpId, setOverrideEmpIdState] = useState<string | null>(() => {
    if (!isDev) return null;
    return localStorage.getItem(LS_EMP);
  });

  useEffect(() => {
    if (!isDev) return;
    supabase
      .from("employees")
      .select("*")
      .order("full_name")
      .then(({ data }) => setAllEmployees((data as EmployeeProfile[]) ?? []));
  }, []);

  const overrideEmployee = useMemo(() => {
    if (!isDev || !overrideEmpId) return null;
    return allEmployees.find((e) => e.id === overrideEmpId) ?? null;
  }, [allEmployees, overrideEmpId]);

  const setRole = (r: Role) => {
    if (!isDev) return;
    localStorage.setItem(LS_ROLE, r);
    setOverrideRoleState(r);
  };
  const setEmployeeId = (id: string) => {
    if (!isDev) return;
    localStorage.setItem(LS_EMP, id);
    setOverrideEmpIdState(id);
  };

  const employee = overrideEmployee ?? authEmployee;
  const role: Role = overrideRole ?? authRole ?? "employee";

  const value: CurrentUserCtx = {
    employee,
    role,
    isHrAdmin: role === "hr_admin",
    isManager: role === "manager",
    isDepartmentHead: role === "department_head",
    setRole,
    setEmployeeId,
    allEmployees,
    isDevOverride: isDev && (overrideRole !== null || overrideEmpId !== null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrentUser() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  return c;
}