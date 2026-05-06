import { Sparkles } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-secondary">{title}</h1>
      <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
        <div className="text-base font-medium text-secondary">Coming soon</div>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          This module is on the roadmap. Reach out to People Ops if you'd like to shape it.
        </p>
      </div>
    </div>
  );
}