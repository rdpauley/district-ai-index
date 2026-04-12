"use client";

import { tools } from "@/lib/seed-data";
import Link from "next/link";
import {
  Activity, ArrowLeft, FileText, DollarSign,
  AlertTriangle, CheckCircle2, Clock, Zap,
  GitBranch, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminOperationsPage() {
  // Health checks
  const healthChecks = [
    { name: "Directory pages", status: "healthy", detail: "All 64 tool pages responding 200" },
    { name: "API routes", status: "healthy", detail: "7 endpoints operational" },
    { name: "Firestore database", status: "healthy", detail: "64 tools + 17 categories indexed" },
    { name: "Affiliate tracking", status: "healthy", detail: "Logging to affiliate_clicks collection" },
    { name: "Newsletter capture", status: "healthy", detail: "Accepting signups" },
    { name: "Submission pipeline", status: "healthy", detail: "Accepting tool submissions" },
    { name: "Monthly ranking cron", status: "healthy", detail: "Scheduled 1st of month at 6am UTC" },
    { name: "n8n workflows", status: "warning", detail: "3 workflow designs documented, not yet activated" },
    { name: "Claude API integration", status: "warning", detail: "Prompts written, not yet wired to n8n" },
    { name: "VPAT coverage", status: "warning", detail: "Only 9% of tools have public VPATs" },
  ];

  // Weekly operations rhythm
  const weeklyOps = [
    { day: "Monday", tasks: ["Review stale tools queue", "Claude-generated update summaries"], automation: "Weekly Tool Update (n8n)" },
    { day: "Tuesday", tasks: ["Social post: Tool Spotlight", "Approve scheduled posts"], automation: "Social Media Workflow (n8n)" },
    { day: "Wednesday", tasks: ["Review new submissions", "Editorial evaluations"], automation: "Manual" },
    { day: "Thursday", tasks: ["Social post: Free Tool Spotlight", "Newsletter content"], automation: "Social Media Workflow (n8n)" },
    { day: "Friday", tasks: ["Vendor inquiries & demos", "Compliance doc verification"], automation: "Manual" },
    { day: "Saturday", tasks: ["Social post: Did You Know", "Weekly analytics review"], automation: "Social Media Workflow (n8n)" },
    { day: "Sunday", tasks: ["Content planning", "Light maintenance"], automation: "Manual" },
  ];

  // Monthly operations
  const monthlyOps = [
    { day: "1st", task: "Compute monthly rankings", automation: "Vercel Cron → /api/rankings", status: "automated" },
    { day: "1st", task: "Publish 'Top Tools This Month'", automation: "Claude generates summary", status: "pending wire-up" },
    { day: "15th", task: "Quarterly re-evaluation queue (Verified tier)", automation: "Manual editorial", status: "manual" },
    { day: "End of month", task: "Revenue reconciliation + vendor billing", automation: "Stripe (future)", status: "manual" },
    { day: "End of month", task: "Compliance audit — re-check VPAT/privacy links", automation: "Manual", status: "manual" },
  ];

  // Revenue streams
  const revenueStreams = [
    { stream: "Featured listings", type: "MRR", status: "active", note: "$299/mo per vendor" },
    { stream: "Verified listings", type: "MRR", status: "active", note: "$599/mo per vendor" },
    { stream: "Affiliate clicks", type: "Per-click", status: "active", note: "Tracked on all tools, revenue depends on vendor programs" },
    { stream: "Custom reports", type: "Project-based", status: "planned", note: "Sell custom evaluation reports to districts" },
    { stream: "Newsletter sponsorships", type: "Per-issue", status: "planned", note: "Weekly newsletter, future ad slots" },
    { stream: "Consulting / RFP support", type: "Hourly", status: "planned", note: "Advise districts on AI procurement" },
    { stream: "Vendor score consultations", type: "Hourly", status: "planned", note: "Walk vendors through their score reports" },
  ];

  // Security & access
  const securityItems = [
    { item: "Admin authentication", status: "active", detail: "Session cookie + password (current)" },
    { item: "Admin route protection", status: "active", detail: "Middleware guards all /admin/* and /api/admin/*" },
    { item: "Service account key", status: "active", detail: "Firebase Admin SDK (env var, not in repo)" },
    { item: "Firestore security rules", status: "active", detail: "Public read, admin-only write" },
    { item: "Affiliate IP anonymization", status: "active", detail: "SHA-256 hashed, raw IPs never stored" },
    { item: "Two-factor auth", status: "planned", detail: "Upgrade to Firebase Auth with MFA" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Activity className="h-6 w-6 text-accent-blue" aria-hidden="true" /> Business Operations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            How the District AI Index business runs: systems, rhythm, and revenue
          </p>
        </div>

        {/* System Health */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent-blue" aria-hidden="true" /> System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {healthChecks.map(h => (
              <div key={h.name} className={cn(
                "rounded-lg border p-4",
                h.status === "healthy" ? "border-success/20 bg-success-bg/30" :
                h.status === "warning" ? "border-warning/20 bg-warning-bg/30" :
                "border-danger/20 bg-danger-bg/30"
              )}>
                <div className="flex items-start gap-2">
                  {h.status === "healthy" ? <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> :
                   h.status === "warning" ? <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" aria-hidden="true" /> :
                   <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" aria-hidden="true" />}
                  <div>
                    <p className="text-sm font-semibold text-navy">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Rhythm */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Weekly Operations Rhythm
          </h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50">
                <tr>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Day</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Tasks</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Automation</th>
                </tr>
              </thead>
              <tbody>
                {weeklyOps.map(w => (
                  <tr key={w.day} className="border-t border-border">
                    <td className="py-2 px-4 font-semibold text-navy">{w.day}</td>
                    <td className="py-2 px-4 text-xs text-charcoal">{w.tasks.join(" • ")}</td>
                    <td className="py-2 px-4 text-xs text-muted-foreground">{w.automation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Monthly Operations */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Monthly Operations
          </h2>
          <div className="space-y-2">
            {monthlyOps.map(m => (
              <div key={m.task} className="rounded-lg border border-border p-4 flex items-center gap-4">
                <span className="inline-flex h-8 w-16 items-center justify-center rounded-lg bg-navy-50 text-xs font-bold text-navy shrink-0">{m.day}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy">{m.task}</p>
                  <p className="text-xs text-muted-foreground">{m.automation}</p>
                </div>
                <span className={cn(
                  "text-[10px] font-semibold rounded-full px-2 py-0.5",
                  m.status === "automated" ? "bg-success-bg text-success" :
                  m.status === "manual" ? "bg-navy-50 text-navy" :
                  "bg-warning-bg text-warning"
                )}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Streams */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Revenue Streams
          </h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50">
                <tr>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Stream</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Type</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Status</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-semibold uppercase text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {revenueStreams.map(r => (
                  <tr key={r.stream} className="border-t border-border">
                    <td className="py-2 px-4 font-semibold text-navy">{r.stream}</td>
                    <td className="py-2 px-4 text-xs text-charcoal">{r.type}</td>
                    <td className="py-2 px-4">
                      <span className={cn(
                        "text-[10px] font-semibold rounded-full px-2 py-0.5",
                        r.status === "active" ? "bg-success-bg text-success" : "bg-warning-bg text-warning"
                      )}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-xs text-muted-foreground">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security & Access */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Security &amp; Access Control
          </h2>
          <div className="space-y-2">
            {securityItems.map(s => (
              <div key={s.item} className="rounded-lg border border-border p-3 flex items-start gap-3">
                {s.status === "active" ?
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" /> :
                  <Clock className="h-4 w-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
                }
                <div>
                  <p className="text-sm font-semibold text-navy">{s.item}</p>
                  <p className="text-xs text-muted-foreground">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Next.js 16", role: "Frontend + API", cost: "Free" },
              { name: "Vercel", role: "Hosting + CDN", cost: "$0/mo (hobby)" },
              { name: "Firebase Firestore", role: "Database", cost: "$0/mo (free tier)" },
              { name: "Firebase Storage", role: "File uploads", cost: "$0/mo" },
              { name: "GitHub", role: "Version control", cost: "$0/mo" },
              { name: "n8n", role: "Workflow automation", cost: "Self-hosted" },
              { name: "Claude API", role: "Content generation", cost: "Pay-per-use (~$3/mo)" },
              { name: "Plausible", role: "Analytics (planned)", cost: "$9/mo" },
              { name: "Resend", role: "Email (planned)", cost: "$0-20/mo" },
            ].map(t => (
              <div key={t.name} className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold text-navy">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
                <p className="text-xs text-accent-blue mt-1">{t.cost}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
