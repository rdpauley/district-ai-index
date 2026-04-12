"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, Clock, CheckCircle2, Calendar, Zap, Coffee,
  Lock, Printer, Play, AlertCircle, TrendingUp, Moon, Sun,
  Briefcase, Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanSummary {
  summary: {
    total_checked: number;
    live: number;
    redirected: number;
    broken: number;
    timeout: number;
    error: number;
    scanned_at: string;
  };
  needs_review: Array<{ tool_name: string; signal: string; url: string; status: string; http_status?: number }>;
  missing_critical: Array<{ tool_name: string; missing_critical: string[] }>;
}

export default function WorkflowPage() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanSummary | null>(null);

  const runScan = async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/admin/scan-compliance");
      if (res.ok) {
        const data = await res.json();
        setScanResult(data);
      }
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <style>{`@media print { nav, footer, .no-print { display: none !important; } body { font-size: 10px; } .print-break { page-break-before: always; } }`}</style>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-10">

        {/* Header */}
        <div className="no-print">
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-lg bg-navy px-2 py-1"><Lock className="h-4 w-4 text-white" aria-hidden="true" /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy">Daily Workflow — Retirement Track</span>
              </div>
              <h1 className="text-3xl font-bold text-navy">Your 2-4 Hours/Day Playbook</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Maximize leverage. Minimize low-value tasks. On track for April 2029 retirement.
              </p>
            </div>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-50">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>

        {/* THE REALITY CHECK */}
        <section className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-6">
          <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
            <Timer className="h-5 w-5 text-accent-blue" aria-hidden="true" /> The Reality Check
          </h2>
          <div className="space-y-2 text-sm text-charcoal">
            <p><strong>You have:</strong> 2-4 hours per day</p>
            <p><strong>Runway to retirement:</strong> April 2029 (~36 months)</p>
            <p><strong>Total working hours available:</strong> ~2,200 hours over 36 months</p>
            <p><strong>Rule #1:</strong> Do NOT do low-leverage work. Every hour spent on manual data entry is an hour not spent on sales.</p>
            <p><strong>Rule #2:</strong> Automate everything that happens more than 3 times.</p>
            <p><strong>Rule #3:</strong> Batch similar tasks. Never switch contexts mid-hour.</p>
          </div>
        </section>

        {/* DAILY SCHEDULE */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-accent-blue" aria-hidden="true" /> The Daily Schedule
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Three daily modes depending on how much time you have. Pick one each day based on reality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 30-MIN MODE */}
            <div className="rounded-xl border-2 border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <Moon className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                <h3 className="text-sm font-bold text-navy">30-MINUTE MODE</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">On exhausting workdays — minimum viable progress</p>
              <ul className="space-y-1.5 text-xs text-charcoal">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">10m</span>
                  <span>Reply to vendor/district emails from inbox</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">10m</span>
                  <span>Post ONE pre-written LinkedIn update</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">10m</span>
                  <span>Review scan results / flag tools for tomorrow</span>
                </li>
              </ul>
            </div>

            {/* 2-HOUR MODE */}
            <div className="rounded-xl border-2 border-accent-blue/30 bg-accent-blue/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                <h3 className="text-sm font-bold text-navy">2-HOUR MODE (standard)</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Most weeknights — solid, sustainable progress</p>
              <ul className="space-y-1.5 text-xs text-charcoal">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">20m</span>
                  <span>Email replies (batch, don&apos;t check inbox mid-task)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">30m</span>
                  <span>ONE piece of content (LinkedIn post OR newsletter section)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">30m</span>
                  <span>Vendor outreach — 3-5 personalized emails</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">30m</span>
                  <span>Compliance review — 2-3 tools using 5-step process</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">10m</span>
                  <span>Log progress in your weekly tracker</span>
                </li>
              </ul>
            </div>

            {/* 4-HOUR MODE */}
            <div className="rounded-xl border-2 border-success/30 bg-success-bg/30 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-success" aria-hidden="true" />
                <h3 className="text-sm font-bold text-navy">4-HOUR MODE (weekends)</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Saturdays or days off — big-batch work</p>
              <ul className="space-y-1.5 text-xs text-charcoal">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">60m</span>
                  <span>Write newsletter + schedule for Monday</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">60m</span>
                  <span>Batch 5-10 vendor outreach emails</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">45m</span>
                  <span>Deep compliance review of 4-6 tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">45m</span>
                  <span>Write 1 LinkedIn article or blog post</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-muted-foreground shrink-0">30m</span>
                  <span>Run compliance scan + review broken links</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* COMPLIANCE SCANNER */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Compliance Scanner
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Click below to run an automated scan of all compliance links across all 64 tools. Takes ~30 seconds. Shows broken links, redirects, and tools missing critical compliance signals.
          </p>

          <div className="rounded-xl border-2 border-border p-6">
            <button
              onClick={runScan}
              disabled={scanning}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors",
                scanning ? "bg-muted cursor-not-allowed" : "bg-navy hover:bg-navy-800"
              )}
            >
              {scanning ? (
                <><Timer className="h-4 w-4 animate-pulse" aria-hidden="true" /> Scanning all compliance links...</>
              ) : (
                <><Play className="h-4 w-4" aria-hidden="true" /> Run Compliance Scan Now</>
              )}
            </button>

            {scanResult && (
              <div className="mt-6 space-y-4">
                {/* Summary */}
                <div>
                  <h3 className="text-sm font-bold text-navy mb-2">Scan Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: "Checked", value: scanResult.summary.total_checked, color: "text-navy" },
                      { label: "Live", value: scanResult.summary.live, color: "text-success" },
                      { label: "Redirected", value: scanResult.summary.redirected, color: "text-warning" },
                      { label: "Broken", value: scanResult.summary.broken, color: "text-danger" },
                      { label: "Timeout/Error", value: scanResult.summary.timeout + scanResult.summary.error, color: "text-danger" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg border border-border p-3 text-center">
                        <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Scanned {new Date(scanResult.summary.scanned_at).toLocaleString()}</p>
                </div>

                {/* Needs review */}
                {scanResult.needs_review.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-danger mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" /> Links needing review ({scanResult.needs_review.length})
                    </h3>
                    <div className="rounded-xl border border-danger/20 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-danger-bg">
                          <tr>
                            <th className="text-left py-2 px-3 font-bold text-navy">Tool</th>
                            <th className="text-left py-2 px-3 font-bold text-navy">Signal</th>
                            <th className="text-left py-2 px-3 font-bold text-navy">Status</th>
                            <th className="text-left py-2 px-3 font-bold text-navy">URL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanResult.needs_review.map((r, i) => (
                            <tr key={i} className="border-t border-danger/10">
                              <td className="py-2 px-3 font-semibold text-navy">{r.tool_name}</td>
                              <td className="py-2 px-3 text-charcoal">{r.signal}</td>
                              <td className="py-2 px-3"><span className="rounded-full bg-danger text-white px-2 py-0.5 text-[10px] font-bold">{r.status}{r.http_status ? ` (${r.http_status})` : ""}</span></td>
                              <td className="py-2 px-3"><a href={r.url} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline truncate block max-w-xs">{r.url}</a></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Missing critical */}
                {scanResult.missing_critical.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-warning mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" /> Tools missing critical compliance signals ({scanResult.missing_critical.length})
                    </h3>
                    <div className="rounded-xl border border-warning/20 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-warning-bg">
                          <tr>
                            <th className="text-left py-2 px-3 font-bold text-navy">Tool</th>
                            <th className="text-left py-2 px-3 font-bold text-navy">Missing</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanResult.missing_critical.map((m, i) => (
                            <tr key={i} className="border-t border-warning/10">
                              <td className="py-2 px-3 font-semibold text-navy">{m.tool_name}</td>
                              <td className="py-2 px-3 text-charcoal">{m.missing_critical.join(", ")}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* HIGH-LEVERAGE VS LOW-LEVERAGE */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent-blue" aria-hidden="true" /> High-Leverage vs Low-Leverage Activities
          </h2>
          <p className="text-sm text-charcoal mb-4">
            At 2-4 hours/day, you cannot waste time on low-leverage work. Use this filter every day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 border-success/30 bg-success-bg/30 p-5">
              <h3 className="text-sm font-bold text-success mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> HIGH-LEVERAGE (Do These)
              </h3>
              <ul className="space-y-2 text-xs text-charcoal">
                {[
                  "Vendor outreach emails (direct path to $299/mo)",
                  "LinkedIn posts that establish expertise",
                  "Writing newsletter content (build audience)",
                  "Editorial reviews of high-traffic tool pages",
                  "Responding to warm leads within 4 hours",
                  "Upselling Featured → Verified",
                  "Conference speaker pitches (one YES = months of traffic)",
                  "Writing new sales scripts that unlock conversions",
                ].map((t) => <li key={t} className="flex items-start gap-2"><CheckCircle2 className="h-3 w-3 text-success shrink-0 mt-0.5" aria-hidden="true" />{t}</li>)}
              </ul>
            </div>

            <div className="rounded-xl border-2 border-danger/30 bg-danger-bg/30 p-5">
              <h3 className="text-sm font-bold text-danger mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" aria-hidden="true" /> LOW-LEVERAGE (Automate or Skip)
              </h3>
              <ul className="space-y-2 text-xs text-charcoal">
                {[
                  "Manual compliance link checking → use the scanner",
                  "Writing tool descriptions from scratch → use Claude prompts",
                  "Formatting social posts → write once, schedule in bulk",
                  "Checking analytics hourly → Friday only",
                  "Responding to low-intent inquiries → template replies",
                  "Reading all industry news → filter to 1 newsletter",
                  "Manual data entry → use admin CRUD + imports",
                  "Chasing unpaid vendors → use automated reminders",
                ].map((t) => <li key={t} className="flex items-start gap-2"><AlertCircle className="h-3 w-3 text-danger shrink-0 mt-0.5" aria-hidden="true" />{t}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* 36-MONTH MILESTONE TRACK */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-accent-blue" aria-hidden="true" /> 36-Month Retirement Track
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Goal: By April 2029, have a self-sustaining business that pays you $5K-$15K/mo passive income. Here are your major milestones.
          </p>

          <div className="space-y-3">
            {[
              {
                period: "Q2 2026 (Now – June)",
                goal: "Foundation",
                targets: ["$500-$1,500 MRR", "5-8 active Featured", "1 Verified", "500 newsletter subs"],
                focus: "Launch, first vendor outreach wave, daily workflow locked in",
              },
              {
                period: "Q3-Q4 2026",
                goal: "Validate",
                targets: ["$2K-$3K MRR", "10-15 Featured", "3-5 Verified", "1,500 newsletter subs"],
                focus: "Content flywheel, repeat vendor successes, first speaker slot",
              },
              {
                period: "2027",
                goal: "Scale",
                targets: ["$5K-$8K MRR", "20-25 Featured", "8-12 Verified", "5,000 newsletter subs"],
                focus: "First part-time hire (editorial reviewer), conference presence, paid ads",
              },
              {
                period: "2028",
                goal: "Systemize",
                targets: ["$10K-$15K MRR", "40+ Featured", "20+ Verified"],
                focus: "Full-time editorial director, sales contractor, custom reports product",
              },
              {
                period: "Q1 2029",
                goal: "Transition",
                targets: ["$15K+ MRR sustainable", "Team runs daily ops", "You own and advise"],
                focus: "Retirement prep — business operates without you 5+ days/month",
              },
            ].map((m, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-navy">{m.period}</h3>
                    <p className="text-xs text-muted-foreground">Phase: {m.goal}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <p className="text-[10px] font-bold text-accent-blue uppercase mb-1">Targets</p>
                    <ul className="space-y-0.5">
                      {m.targets.map((t) => <li key={t} className="text-xs text-charcoal flex items-start gap-1">• {t}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-accent-blue uppercase mb-1">Focus</p>
                    <p className="text-xs text-charcoal">{m.focus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <section className="rounded-xl border border-border bg-navy-50/30 p-6 text-center">
          <p className="text-xs font-bold text-navy uppercase tracking-widest mb-1">Your Time Is The Constraint</p>
          <p className="text-xs text-muted-foreground">
            2-4 hours/day × 36 months = ~2,200 hours. That&apos;s enough to build real revenue — IF every hour is high-leverage.
            <br />
            Automate everything. Write once, use many times. Never do a task manually more than 3 times.
          </p>
        </section>

      </div>
    </div>
  );
}
