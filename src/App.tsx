import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CurrentUserProvider } from "@/context/CurrentUserContext";
import { AppLayout } from "@/components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Career from "./pages/Career";
import Reviews from "./pages/Reviews";
import AdminEmployees from "./pages/AdminEmployees";
import Profile from "./pages/Profile";
import ComingSoon from "./pages/ComingSoon";
import Overview from "./pages/Overview";
import OrgDesign from "./pages/OrgDesign";
import Goals from "./pages/Goals";
import StrategicOverview from "./pages/StrategicOverview";
import SalesPerformancePage from "./pages/SalesPerformance";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function Gate({ children }: { children: React.ReactNode }) {
  const { loading, employee, user, isDemo } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }
  // Signed in but no employee record
  if (user && !employee && !isDemo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm rounded-xl border bg-card p-6 text-center">
          <h1 className="text-base font-semibold text-secondary">Account not set up</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account hasn't been set up yet. Contact HR.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CurrentUserProvider>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <Gate>
                  <AppLayout />
                </Gate>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/strategic-overview" element={<StrategicOverview />} />
              <Route path="/career" element={<Career />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/explore" element={<ComingSoon title="Explore roles" />} />
              <Route path="/admin/employees" element={<AdminEmployees />} />
              <Route path="/admin/talent" element={<ComingSoon title="Talent pool" />} />
              <Route path="/admin/cycles" element={<ComingSoon title="Review cycles" />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/org-design" element={<OrgDesign />} />
              <Route path="/sales-performance" element={<SalesPerformancePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            </Routes>
          </CurrentUserProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
