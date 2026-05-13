import SalesPerformance from "@/components/SalesPerformance";

export default function SalesPerformancePage() {
  return (
    <div className="container mx-auto max-w-[1400px] px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary">Sales Performance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Finance written, approval-to-disbursement flow, and time-to-release tracking.
        </p>
      </div>
      <SalesPerformance />
    </div>
  );
}