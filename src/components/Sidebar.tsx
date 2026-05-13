import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  ClipboardCheck,
  Target,
  Compass,
  Users,
  UserCog,
  CalendarRange,
  Hexagon,
  BarChart3,
  Network,
  LineChart,
} from "lucide-react";
import { useCurrentUser } from "@/context/CurrentUserContext";
import logo from "@/assets/logo.png";
import { initials } from "@/lib/format";

const navItems = [
  { to: "/strategic-overview", label: "Strategic Overview", icon: LayoutDashboard, hrOnly: true },
  { to: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { to: "/career", label: "Career path", icon: TrendingUp },
  { to: "/reviews", label: "Reviews", icon: ClipboardCheck },
  { to: "/org-design", label: "Org Design", icon: Network },
  { to: "/sales-performance", label: "Sales Performance", icon: LineChart },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/explore", label: "Explore roles", icon: Compass, comingSoon: true },
];

const hrItems = [
  { to: "/overview", label: "People Overview", icon: BarChart3 },
  { to: "/admin/talent", label: "Talent pool", icon: Users },
  { to: "/admin/employees", label: "Manage employees", icon: UserCog },
  { to: "/admin/cycles", label: "Review cycles", icon: CalendarRange },
];

function Item({
  to,
  label,
  icon: Icon,
  comingSoon,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  comingSoon?: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
          isActive
            ? "bg-sidebar-accent text-sidebar-foreground border-l-[3px] border-l-primary pl-[13px]"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground border-l-[3px] border-l-transparent pl-[13px]"
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {comingSoon && (
        <span className="rounded-full bg-sidebar-accent px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-sidebar-foreground/70">
          Soon
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { employee, isHrAdmin } = useCurrentUser();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[200px] flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="px-4 pb-4 pt-5">
        <img src={logo} alt="Beehive — an e& enterprise company" className="h-10 w-auto" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="space-y-0.5">
          {navItems
            .filter((it) => !it.hrOnly || isHrAdmin)
            .map(({ hrOnly: _hr, ...it }) => (
              <Item key={it.to} {...it} />
            ))}
        </div>

        {isHrAdmin && (
          <>
            <div className="my-3 border-t border-sidebar-border" />
            <div className="px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              HR Team
            </div>
            <div className="space-y-0.5">
              {hrItems.map((it) => (
                <Item key={it.to} {...it} />
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User chip */}
      {employee && (
        <div className="border-t border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials(employee.full_name)}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-xs font-medium text-sidebar-foreground">
                {employee.full_name}
              </div>
              <div className="truncate text-[10px] text-sidebar-foreground/60">
                <span className="font-mono-code">{employee.level_code}</span> ·{" "}
                {employee.department}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}