import { Fragment, useMemo, useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import {
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  EXPECTED_CSV_COLUMNS,
  DEFAULT_PERIOD,
  MIN_THRESHOLD_AED,
  BD_SLABS,
  CHANNEL_PARTNER_GRID,
  TOPUP_GRID,
  BSS_INCENTIVES,
  WCF_INCENTIVES,
  TEAM_LEAD_TIERS,
  QUARTERLY_REWARDS,
  POLICY,
  fmtAED,
  currentPeriodWindow,
  calcIncentives,
  nextSlabGap,
  type DealRow,
  type BDSummary,
  type Team,
  type DealType,
  type Product,
} from "@/data/incentives";

// ===== CSV parsing =====
function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length);
  const split = (l: string) => l.split(",").map((c) => c.trim());
  return { headers: split(lines[0] ?? ""), rows: lines.slice(1).map(split) };
}

function toDealRows(
  headers: string[],
  rows: string[][],
): { deals: DealRow[]; warnings: number[] } {
  const idx = (name: string) =>
    headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const cols = {
    bd: idx("BD Name"),
    team: idx("Team"),
    dealDate: idx("Deal Date"),
    disbursalDate: idx("Disbursal Date"),
    loan: idx("Loan Amount"),
    fee: idx("Fee % Charged"),
    type: idx("Deal Type"),
    product: idx("Product"),
    disbursed: idx("Disbursed"),
  };
  const deals: DealRow[] = [];
  const warnings: number[] = [];
  rows.forEach((r, i) => {
    const loan = Number(String(r[cols.loan] ?? "").replace(/[, ]/g, ""));
    const fee = Number(String(r[cols.fee] ?? "").replace(/[%, ]/g, ""));
    if (!r[cols.bd] || isNaN(loan) || isNaN(fee)) {
      warnings.push(i);
      return;
    }
    deals.push({
      bdName: r[cols.bd],
      team: (r[cols.team] as Team) || "Direct Sales",
      dealDate: r[cols.dealDate] || "",
      disbursalDate: r[cols.disbursalDate] || "",
      loanAmount: loan,
      feePct: fee,
      dealType: (r[cols.type] as DealType) || "Self-sourced",
      product: (r[cols.product] as Product) || "TF",
      disbursed: /yes|true|1/i.test(String(r[cols.disbursed] ?? "")),
    });
  });
  return { deals, warnings };
}

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ===== Page =====
export default function Incentives() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold text-secondary">Incentives</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          BD incentive calculator and policy configuration.
        </p>
      </div>

      <Tabs defaultValue="calc" className="w-full">
        <TabsList>
          <TabsTrigger value="calc">Incentive Calculator</TabsTrigger>
          <TabsTrigger value="policy">Policy Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="calc" className="mt-6">
          <Calculator />
        </TabsContent>
        <TabsContent value="policy" className="mt-6">
          <PolicySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ===== Calculator =====
function Calculator() {
  const [deals, setDeals] = useState<DealRow[] | null>(null);
  const [view, setView] = useState<"month" | "quarter">("month");
  const [bdFilter, setBdFilter] = useState<string>("all");
  const initial = currentPeriodWindow();
  const [periodStart, setPeriodStart] = useState(
    initial.start.toISOString().slice(0, 10),
  );
  const [periodEnd, setPeriodEnd] = useState(
    initial.end.toISOString().slice(0, 10),
  );
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!deals) return [];
    const s = new Date(periodStart).getTime();
    const e = new Date(periodEnd).getTime();
    return deals.filter((d) => {
      const t = new Date(d.disbursalDate).getTime();
      return !isNaN(t) && t >= s && t <= e;
    });
  }, [deals, periodStart, periodEnd]);

  const summaries = useMemo(() => calcIncentives(filtered), [filtered]);
  const visible =
    bdFilter === "all" ? summaries : summaries.filter((s) => s.bdName === bdFilter);

  const totalPayout = summaries.reduce((s, b) => s + b.totalIncentive, 0);
  const metCount = summaries.filter((s) => s.met).length;
  const notMetCount = summaries.length - metCount;
  const avg = summaries.length ? totalPayout / summaries.length : 0;

  const bdNames = Array.from(new Set((deals ?? []).map((d) => d.bdName)));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-muted-foreground">Period start</label>
            <Input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="mt-1 h-9 w-[160px]"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Period end</label>
            <Input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="mt-1 h-9 w-[160px]"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">BD</label>
            <Select value={bdFilter} onValueChange={setBdFilter}>
              <SelectTrigger className="mt-1 h-9 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All BDs</SelectItem>
                {bdNames.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center rounded-md border p-0.5">
              <button
                className={`px-3 py-1 text-xs font-medium rounded ${view === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setView("month")}
              >
                Monthly
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium rounded ${view === "quarter" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setView("quarter")}
              >
                Quarterly
              </button>
            </div>
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Upload CSV
            </Button>
            {summaries.length > 0 && (
              <Button
                variant="outline"
                onClick={() =>
                  downloadCSV("incentives.csv", [
                    [
                      "BD",
                      "Team",
                      "Total Disbursed",
                      "Self-sourced",
                      "Channel Deals",
                      "Top-up Deals",
                      "Slab %",
                      "Slab Payout",
                      "Fixed Payout",
                      "Total Incentive",
                      "Status",
                    ],
                    ...summaries.map((s) => [
                      s.bdName,
                      s.team,
                      s.totalDisbursed,
                      s.selfDisbursed,
                      s.channelDeals,
                      s.topupDeals,
                      s.slabReachedPct,
                      s.slabPayout,
                      s.fixedPayout,
                      s.totalIncentive,
                      s.met ? "Met" : "Not Met",
                    ]),
                  ])
                }
              >
                <Download className="h-4 w-4" /> Export
              </Button>
            )}
          </div>
        </div>
      </Card>

      {!deals && <EmptyState onUpload={() => setUploadOpen(true)} />}

      {deals && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard label="Total Incentive Payout" value={fmtAED(totalPayout)} />
            <SummaryCard label="BDs hit threshold" value={String(metCount)} tone="green" />
            <SummaryCard label="BDs below threshold" value={String(notMetCount)} tone="red" />
            <SummaryCard label="Avg incentive / BD" value={fmtAED(avg)} />
          </div>

          {view === "month" ? (
            <BDTable rows={visible} />
          ) : (
            <QuarterlyView rows={visible} />
          )}
        </>
      )}

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onLoaded={(rows) => {
          setDeals(rows);
          setUploadOpen(false);
          toast({ title: "CSV loaded", description: `${rows.length} rows processed.` });
        }}
      />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green" | "red";
}) {
  const color =
    tone === "green"
      ? "text-emerald-600"
      : tone === "red"
        ? "text-red-600"
        : "text-secondary";
  return (
    <Card className="p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold ${color}`}>{value}</div>
    </Card>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
      <Upload className="h-10 w-10 text-muted-foreground" />
      <h3 className="text-base font-semibold text-secondary">
        Upload placeholder — data to be provided
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Upload a CSV of disbursed deals to calculate incentive payouts for the
        selected period.
      </p>
      <Button onClick={onUpload}>
        <Upload className="h-4 w-4" /> Upload CSV
      </Button>
    </Card>
  );
}

function BDTable({ rows }: { rows: BDSummary[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!rows.length)
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No BDs match the current filter.
      </Card>
    );
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>BD</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Total Disbursed</TableHead>
            <TableHead className="text-right">Self-sourced</TableHead>
            <TableHead className="text-right">Channel</TableHead>
            <TableHead className="text-right">Top-up</TableHead>
            <TableHead className="text-right">Slab %</TableHead>
            <TableHead className="text-right">Slab Payout</TableHead>
            <TableHead className="text-right">Fixed Payout</TableHead>
            <TableHead className="text-right">Total Incentive</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <Fragment key={r.bdName}>
              <TableRow
                className="cursor-pointer"
                onClick={() => setOpen(open === r.bdName ? null : r.bdName)}
              >
                <TableCell>
                  {open === r.bdName ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{r.bdName}</TableCell>
                <TableCell>{r.team}</TableCell>
                <TableCell className="text-right font-mono-code">
                  {fmtAED(r.totalDisbursed)}
                </TableCell>
                <TableCell className="text-right font-mono-code">
                  {fmtAED(r.selfDisbursed)}
                </TableCell>
                <TableCell className="text-right">{r.channelDeals}</TableCell>
                <TableCell className="text-right">{r.topupDeals}</TableCell>
                <TableCell className="text-right">
                  {r.slabReachedPct.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right font-mono-code">
                  {fmtAED(r.slabPayout)}
                </TableCell>
                <TableCell className="text-right font-mono-code">
                  {fmtAED(r.fixedPayout)}
                </TableCell>
                <TableCell className="text-right font-mono-code font-semibold">
                  {fmtAED(r.totalIncentive)}
                </TableCell>
                <TableCell>
                  {r.met ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Met
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <XCircle className="h-3 w-3" /> Not Met
                    </span>
                  )}
                </TableCell>
              </TableRow>
              {open === r.bdName && (
                <TableRow>
                  <TableCell colSpan={12} className="bg-muted/40">
                    <BDDetail row={r} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function BDDetail({ row }: { row: BDSummary }) {
  const { next, gap } = nextSlabGap(row.totalDisbursed);
  const max = BD_SLABS[BD_SLABS.length - 1].fromAED * 1.1;
  return (
    <div className="space-y-4 p-2">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Slab progression
        </div>
        <div className="relative h-3 w-full rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            style={{
              width: `${Math.min(100, (row.totalDisbursed / max) * 100)}%`,
            }}
          />
          {BD_SLABS.slice(1).map((s) => (
            <div
              key={s.fromAED}
              className="absolute inset-y-0 w-px bg-foreground/30"
              style={{ left: `${(s.fromAED / max) * 100}%` }}
              title={fmtAED(s.fromAED)}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          {BD_SLABS.slice(1).map((s) => (
            <span key={s.fromAED}>{(s.fromAED / 1_000_000).toFixed(2)}M</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {next
            ? `${fmtAED(gap)} to reach next slab (${(next.pct * 100).toFixed(2)}%)`
            : "Top slab reached"}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Deals
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deal Date</TableHead>
              <TableHead>Disbursal Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Loan Amount</TableHead>
              <TableHead className="text-right">Fee %</TableHead>
              <TableHead className="text-right">Net Disbursed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {row.deals.map((d, i) => (
              <TableRow key={i}>
                <TableCell>{d.dealDate}</TableCell>
                <TableCell>{d.disbursalDate}</TableCell>
                <TableCell>{d.dealType}</TableCell>
                <TableCell>{d.product}</TableCell>
                <TableCell className="text-right font-mono-code">
                  {fmtAED(d.loanAmount)}
                </TableCell>
                <TableCell className="text-right">{d.feePct}%</TableCell>
                <TableCell className="text-right font-mono-code">
                  {fmtAED(d.loanAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function QuarterlyView({ rows }: { rows: BDSummary[] }) {
  // Aggregate by team for team lead bonuses; QTD = same data here (single period)
  const teams = new Map<Team, { disbursed: number; bds: BDSummary[] }>();
  for (const r of rows) {
    const t = teams.get(r.team) ?? { disbursed: 0, bds: [] };
    t.disbursed += r.totalDisbursed;
    t.bds.push(r);
    teams.set(r.team, t);
  }
  const teamTarget = MIN_THRESHOLD_AED * 4; // illustrative target per team
  const tierFor = (pct: number) => {
    for (const t of TEAM_LEAD_TIERS)
      if (pct >= t.fromPct && (t.toPct === null || pct <= t.toPct)) return t;
    return null;
  };

  const topBd = rows.reduce<BDSummary | null>(
    (a, b) => (!a || b.totalDisbursed > a.totalDisbursed ? b : a),
    null,
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="border-b p-4 text-sm font-semibold text-secondary">
          Team Lead Quarterly Bonus
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">QTD Disbursed</TableHead>
              <TableHead className="text-right">Target</TableHead>
              <TableHead className="text-right">Attainment</TableHead>
              <TableHead className="text-right">Bonus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(teams.entries()).map(([team, info]) => {
              const pct = (info.disbursed / teamTarget) * 100;
              const tier = tierFor(pct);
              return (
                <TableRow key={team}>
                  <TableCell className="font-medium">{team}</TableCell>
                  <TableCell className="text-right font-mono-code">
                    {fmtAED(info.disbursed)}
                  </TableCell>
                  <TableCell className="text-right font-mono-code">
                    {fmtAED(teamTarget)}
                  </TableCell>
                  <TableCell className="text-right">{pct.toFixed(0)}%</TableCell>
                  <TableCell className="text-right font-mono-code">
                    {tier ? fmtAED(tier.bonusAED) : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Card>
        <div className="border-b p-4 text-sm font-semibold text-secondary">
          Quarterly Bonus Reward Eligibility
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>BD</TableHead>
              <TableHead>Highest Disbursed</TableHead>
              <TableHead>No Drop-offs</TableHead>
              <TableHead>Early Starter</TableHead>
              <TableHead>CRM Hygiene</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.bdName}>
                <TableCell className="font-medium">{r.bdName}</TableCell>
                <TableCell>
                  {topBd?.bdName === r.bdName
                    ? fmtAED(QUARTERLY_REWARDS.highestDisbursedAED)
                    : "—"}
                </TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// ===== Upload modal =====
function UploadModal({
  open,
  onClose,
  onLoaded,
}: {
  open: boolean;
  onClose: () => void;
  onLoaded: (rows: DealRow[]) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setFile(null);
    setHeaders([]);
    setRows([]);
    setError(null);
    setWarnings([]);
  }

  async function handleFile(f: File) {
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("Only .csv files are accepted");
      return;
    }
    setFile(f);
    const text = await f.text();
    const { headers: h, rows: r } = parseCSV(text);
    const missing = EXPECTED_CSV_COLUMNS.filter(
      (c) => !h.some((x) => x.toLowerCase() === c.toLowerCase()),
    );
    if (missing.length) {
      setError(`Missing column(s): ${missing.join(", ")}`);
      setHeaders(h);
      setRows([]);
      return;
    }
    setError(null);
    setHeaders(h);
    setRows(r);
    const { warnings: w } = toDealRows(h, r);
    setWarnings(w);
  }

  function confirm() {
    const { deals } = toDealRows(headers, rows);
    onLoaded(deals);
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload deals CSV</DialogTitle>
        </DialogHeader>

        {!file && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Drag and drop a .csv file here, or
            </div>
            <Button onClick={() => inputRef.current?.click()}>
              Choose file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="mt-2 text-[11px] text-muted-foreground">
              Expected columns: {EXPECTED_CSV_COLUMNS.join(", ")}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4" /> {error}
          </div>
        )}

        {file && rows.length > 0 && !error && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Previewing {Math.min(rows.length, 8)} of {rows.length} rows
              {warnings.length > 0 && ` · ${warnings.length} row(s) flagged`}
            </div>
            <div className="max-h-72 overflow-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 8).map((r, i) => (
                    <TableRow
                      key={i}
                      className={warnings.includes(i) ? "bg-yellow-50" : ""}
                    >
                      {r.map((c, j) => (
                        <TableCell key={j}>{c}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>
            Cancel
          </Button>
          <Button disabled={!rows.length || !!error} onClick={confirm}>
            Confirm & calculate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ===== Policy Settings =====
function PolicySettings() {
  const [period, setPeriod] = useState(DEFAULT_PERIOD);
  const [minThreshold, setMinThreshold] = useState(MIN_THRESHOLD_AED);
  const [slabs, setSlabs] = useState(BD_SLABS);
  const [channelGrid, setChannelGrid] = useState(CHANNEL_PARTNER_GRID);
  const [topupGrid, setTopupGrid] = useState(TOPUP_GRID);
  const [bss, setBss] = useState(BSS_INCENTIVES);
  const [wcf, setWcf] = useState(WCF_INCENTIVES);
  const [tiers, setTiers] = useState(TEAM_LEAD_TIERS);
  const [rewards, setRewards] = useState(QUARTERLY_REWARDS);
  const [policy, setPolicy] = useState(POLICY);
  const [meta, setMeta] = useState({
    editedAt: "Never",
    editedBy: "—",
  });

  const save = () => {
    setMeta({
      editedAt: new Date().toLocaleString("en-GB"),
      editedBy: "You",
    });
    toast({
      title: "Policy updated",
      description: "Changes apply to future periods only.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-secondary">Period & threshold</h3>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <Field label="Cycle start day">
            <Input
              type="number"
              value={period.startDay}
              onChange={(e) =>
                setPeriod({ ...period, startDay: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Cycle end day">
            <Input
              type="number"
              value={period.endDay}
              onChange={(e) =>
                setPeriod({ ...period, endDay: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Payout day">
            <Input
              type="number"
              value={period.payoutDay}
              onChange={(e) =>
                setPeriod({ ...period, payoutDay: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Minimum threshold (AED)">
            <Input
              type="number"
              value={minThreshold}
              onChange={(e) => setMinThreshold(Number(e.target.value))}
            />
          </Field>
        </div>
      </Card>

      <SlabEditor
        title="BD monthly slabs"
        rows={slabs}
        onChange={setSlabs}
        valueLabel="Percentage"
        valueType="pct"
      />

      <GridEditor
        title="Channel partner / introducer grid"
        rows={channelGrid}
        onChange={setChannelGrid}
      />
      <GridEditor
        title="Top-up cases grid"
        rows={topupGrid}
        onChange={setTopupGrid}
      />

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-secondary">BSS incentives</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Lead → BD closed (AED)">
            <Input
              type="number"
              value={bss.leadToBdClosedAED}
              onChange={(e) =>
                setBss({ ...bss, leadToBdClosedAED: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="BSS direct close (%)">
            <Input
              type="number"
              step="0.01"
              value={bss.bssDirectClosePct * 100}
              onChange={(e) =>
                setBss({
                  ...bss,
                  bssDirectClosePct: Number(e.target.value) / 100,
                })
              }
            />
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-secondary">WCF incentives</h3>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <Field label="Onboarding (%)">
            <Input
              type="number"
              step="0.01"
              value={wcf.onboardingPct * 100}
              onChange={(e) =>
                setWcf({ ...wcf, onboardingPct: Number(e.target.value) / 100 })
              }
            />
          </Field>
          <Field label="Min credit line (AED)">
            <Input
              type="number"
              value={wcf.onboardingMinCreditLineAED}
              onChange={(e) =>
                setWcf({
                  ...wcf,
                  onboardingMinCreditLineAED: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Utilisation window (days)">
            <Input
              type="number"
              value={wcf.utilisationWindowDays}
              onChange={(e) =>
                setWcf({
                  ...wcf,
                  utilisationWindowDays: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Quarterly utilisation (%)">
            <Input
              type="number"
              step="0.01"
              value={wcf.quarterlyUtilisationPct * 100}
              onChange={(e) =>
                setWcf({
                  ...wcf,
                  quarterlyUtilisationPct: Number(e.target.value) / 100,
                })
              }
            />
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-secondary">
          Team lead bonus tiers
        </h3>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Attainment from %</TableHead>
              <TableHead>Attainment to %</TableHead>
              <TableHead>Bonus (AED)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.map((t, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Input
                    type="number"
                    value={t.fromPct}
                    onChange={(e) => {
                      const c = [...tiers];
                      c[i] = { ...t, fromPct: Number(e.target.value) };
                      setTiers(c);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={t.toPct ?? ""}
                    placeholder="∞"
                    onChange={(e) => {
                      const c = [...tiers];
                      c[i] = {
                        ...t,
                        toPct: e.target.value ? Number(e.target.value) : null,
                      };
                      setTiers(c);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={t.bonusAED}
                    onChange={(e) => {
                      const c = [...tiers];
                      c[i] = { ...t, bonusAED: Number(e.target.value) };
                      setTiers(c);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-secondary">
          Quarterly bonus rewards
        </h3>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <Field label="Highest disbursed (AED)">
            <Input
              type="number"
              value={rewards.highestDisbursedAED}
              onChange={(e) =>
                setRewards({
                  ...rewards,
                  highestDisbursedAED: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="No drop-offs (AED)">
            <Input
              type="number"
              value={rewards.noDropoffsAED}
              onChange={(e) =>
                setRewards({
                  ...rewards,
                  noDropoffsAED: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Early starter / deal (AED)">
            <Input
              type="number"
              value={rewards.earlyStarterPerDealAED}
              onChange={(e) =>
                setRewards({
                  ...rewards,
                  earlyStarterPerDealAED: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="CRM hygiene (AED)">
            <Input
              type="number"
              value={rewards.crmHygieneAED}
              onChange={(e) =>
                setRewards({
                  ...rewards,
                  crmHygieneAED: Number(e.target.value),
                })
              }
            />
          </Field>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-secondary">
          Clawback & fees
        </h3>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Field label="Clawback window (months)">
            <Input
              type="number"
              value={policy.clawbackMonths}
              onChange={(e) =>
                setPolicy({
                  ...policy,
                  clawbackMonths: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Standard fee (%)">
            <Input
              type="number"
              step="0.01"
              value={policy.standardFeePct}
              onChange={(e) =>
                setPolicy({
                  ...policy,
                  standardFeePct: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Max discount (%)">
            <Input
              type="number"
              step="0.01"
              value={policy.maxDiscountPct}
              onChange={(e) =>
                setPolicy({
                  ...policy,
                  maxDiscountPct: Number(e.target.value),
                })
              }
            />
          </Field>
        </div>
      </Card>

      <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
        <div className="text-xs text-muted-foreground">
          Last edited: <span className="font-medium">{meta.editedAt}</span> by{" "}
          <span className="font-medium">{meta.editedBy}</span>
          <div className="mt-1">
            Changes apply to future periods only — historical calculations are
            not affected.
          </div>
        </div>
        <Button onClick={save}>Save changes</Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SlabEditor({
  title,
  rows,
  onChange,
}: {
  title: string;
  rows: typeof BD_SLABS;
  onChange: (r: typeof BD_SLABS) => void;
  valueLabel?: string;
  valueType?: "pct";
}) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-secondary">{title}</h3>
      <Table className="mt-3">
        <TableHeader>
          <TableRow>
            <TableHead>From (AED)</TableHead>
            <TableHead>To (AED)</TableHead>
            <TableHead>Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              <TableCell>
                <Input
                  type="number"
                  value={r.fromAED}
                  onChange={(e) => {
                    const c = [...rows];
                    c[i] = { ...r, fromAED: Number(e.target.value) };
                    onChange(c);
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={r.toAED ?? ""}
                  placeholder="∞"
                  onChange={(e) => {
                    const c = [...rows];
                    c[i] = {
                      ...r,
                      toAED: e.target.value ? Number(e.target.value) : null,
                    };
                    onChange(c);
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  step="0.01"
                  value={r.pct * 100}
                  onChange={(e) => {
                    const c = [...rows];
                    c[i] = { ...r, pct: Number(e.target.value) / 100 };
                    onChange(c);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function GridEditor({
  title,
  rows,
  onChange,
}: {
  title: string;
  rows: typeof CHANNEL_PARTNER_GRID;
  onChange: (r: typeof CHANNEL_PARTNER_GRID) => void;
}) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-secondary">{title}</h3>
      <Table className="mt-3">
        <TableHeader>
          <TableRow>
            <TableHead>From (AED)</TableHead>
            <TableHead>To (AED)</TableHead>
            <TableHead>Payout (AED)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i}>
              <TableCell>
                <Input
                  type="number"
                  value={r.fromAED}
                  onChange={(e) => {
                    const c = [...rows];
                    c[i] = { ...r, fromAED: Number(e.target.value) };
                    onChange(c);
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={r.toAED ?? ""}
                  placeholder="∞"
                  onChange={(e) => {
                    const c = [...rows];
                    c[i] = {
                      ...r,
                      toAED: e.target.value ? Number(e.target.value) : null,
                    };
                    onChange(c);
                  }}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={r.payoutAED}
                  onChange={(e) => {
                    const c = [...rows];
                    c[i] = { ...r, payoutAED: Number(e.target.value) };
                    onChange(c);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}