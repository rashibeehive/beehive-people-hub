import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DevRoleSwitcher } from "./DevRoleSwitcher";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[200px] min-h-screen">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
      <DevRoleSwitcher />
    </div>
  );
}