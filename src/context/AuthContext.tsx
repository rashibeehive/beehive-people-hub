import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Role = "employee" | "manager" | "department_head" | "hr_admin";

export interface EmployeeProfile {
  id: string;
  employee_id: string;
  full_name: string;
  work_email: string;
  department: string;
  job_title: string;
  track: "IC" | "MG" | "EX";
  level_code: string;
  manager_email: string | null;
  location: string;
  employment_type: string;
  start_date: string;
  last_promotion_date: string | null;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  employee: EmployeeProfile | null;
  role: Role | null;
  isHrAdmin: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  // demo mode used when no employee record exists for the auth user
  isDemo: boolean;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

// Default preview employee (Rashi) used in demo mode
const DEMO_EMAIL = "rashi.agarwal@beehive.ae";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const loadProfile = async (u: User | null) => {
    if (!u) {
      // Demo mode: load Rashi as default preview user
      const { data: emp } = await supabase
        .from("employees")
        .select("*")
        .eq("work_email", DEMO_EMAIL)
        .maybeSingle();
      setEmployee((emp as EmployeeProfile) ?? null);
      setRole("hr_admin"); // demo grants full visibility for the preview
      setIsDemo(true);
      return;
    }
    setIsDemo(false);
    const email = u.email ?? "";
    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("work_email", email)
      .maybeSingle();
    setEmployee((emp as EmployeeProfile) ?? null);
    const { data: r } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.id)
      .maybeSingle();
    setRole(((r?.role as Role) ?? "employee") as Role);
  };

  useEffect(() => {
    // Subscribe FIRST, then fetch session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      // defer profile load to avoid deadlocks
      setTimeout(() => {
        loadProfile(sess?.user ?? null).finally(() => setLoading(false));
      }, 0);
    });
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      loadProfile(sess?.user ?? null).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      session,
      loading,
      employee,
      role,
      isHrAdmin: role === "hr_admin",
      isDemo,
      signOut: async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      },
      refresh: async () => loadProfile(user),
    }),
    [user, session, loading, employee, role, isDemo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}