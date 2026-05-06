export function tenureYears(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  return ms / (1000 * 60 * 60 * 24 * 365.25);
}

export function formatTenure(startDate: string): string {
  const years = tenureYears(startDate);
  return `${years.toFixed(1)} years`;
}

export function gulfGreeting(): string {
  // UTC+4 Gulf Standard Time
  const now = new Date();
  const gstHour = (now.getUTCHours() + 4) % 24;
  if (gstHour < 12) return "Good morning";
  if (gstHour < 17) return "Good afternoon";
  return "Good evening";
}

export function currentQuarter(): { q: number; year: number } {
  const now = new Date();
  return { q: Math.floor(now.getUTCMonth() / 3) + 1, year: now.getUTCFullYear() };
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function firstName(name: string): string {
  return name.split(/\s+/)[0] ?? name;
}