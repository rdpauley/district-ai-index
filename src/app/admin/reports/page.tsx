"use client";

import { useState } from "react";
import { tools } from "@/lib/seed-data";
import { generateToolReport } from "@/lib/score-report";
import Link from "next/link";
import {
  FileText, ArrowLeft, AlertCircle, CheckCircle2, XCircle,
  Calendar, Filter, ExternalLink, Download, TrendingDown, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
  const [filter, setFilter] = useState<"all" | "low" | "high" | "stale" | "missing_compliance">("all");

  // Generate reports for all tools
  const allReports = tools.map((t) => ({
    tool: t,
    report: generateToolReport(t),
  }));

  // Apply filter
  const filtered = allReports.filter(({ tool, report }) => {
    if (filter === "low") return tool.overall_score < 7.5;
    if (filter === "high") return tool.overall_score >= 8.5;
    if (filter === "stale") {
      const daysSince = Math.floor((Date.now() - new Date(tool.last_reviewed).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 90;
    }
    if (filter === "missing_compliance") return report.compliance_gaps.length > 0;
    return true;
  });

  // Stats
  const stats = {
    total: allReports.length,
    high: allReports.filter(r => r.tool.overall_score >= 8.5).length,
    mid: allReports.filter(r => r.tool.overall_score >= 7.5 && r.tool.overall_score < 8.5).length,
    low: allReports.filter(r => r.tool.overall_score < 7.5).length,
    stale: allReports.filter(({ tool }) => {
      const daysSince = Math.floor((Date.now() - new Date(tool.last_reviewed).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 90;
    }).length,
    missingCompliance: allReports.filter(r => r.report.compliance_gaps.length >= 2).length,
  };

  // Compliance gap aggregate
  const gapCounts: Record<string, number> = {};
  allReports.forEach(r => r.report.compliance_gaps.forEach(g => {
    gapCounts[g.signal] = (gapCounts[g.signal] || 0) + 1;
  }));

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <FileText className="h-6 w-6 text-accent-blue" aria-hidden="true" /> Score Reports Review
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bulk review of all {tools.length} tool score reports with gap analysis
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {[
            { label: "Total Reports", value: stats.total, icon: FileText, color: "text-navy" },
            { label: "High (≥8.5)", value: stats.high, icon: TrendingUp, color: "text-success" },
            { label: "Mid (7.5-8.4)", value: stats.mid, icon: TrendingUp, color: "text-accent-blue" },
            { label: "Low (<7.5)", value: stats.low, icon: TrendingDown, color: "text-warning" },
            { label: "Stale (90d+)", value: stats.stale, icon: Calendar, color: "text-danger" },
            { label: "Compliance Gaps", value: stats.missingCompliance, icon: AlertCircle, color: "text-danger" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 mb-1"><s.icon className={cn("h-3.5 w-3.5", s.color)} aria-hidden="true" /><span className="text-[10px] font-semibold text-muted-foreground uppercase">{s.label}</span></div>
              <p className="text-xl font-bold text-navy">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Aggregate Compliance Gap Analysis */}
        <div className="rounded-xl border-2 border-danger/20 bg-danger-bg/20 p-5">
          <h2 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-danger" aria-hidden="true" /> Portfolio-Wide Compliance Gaps
          </h2>
          <p className="text-xs text-muted-foreground mb-3">How many tools are missing each critical compliance signal:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["FERPA Compliant", "COPPA Compliant", "DPA Available", "SOC 2 Type II"].map(signal => {
              const count = gapCounts[signal] || 0;
              const pct = Math.round((count / tools.length) * 100);
              return (
                <div key={signal} className="rounded-lg bg-white p-3">
                  <p className="text-xs font-semibold text-navy">{signal}</p>
                  <p className="text-2xl font-bold text-danger mt-1">{count}</p>
                  <p className="text-[10px] text-muted-foreground">{pct}% of portfolio missing</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {[
            { key: "all" as const, label: `All (${stats.total})` },
            { key: "high" as const, label: `High scores (${stats.high})` },
            { key: "low" as const, label: `Low scores (${stats.low})` },
            { key: "stale" as const, label: `Stale reviews (${stats.stale})` },
            { key: "missing_compliance" as const, label: `Compliance gaps (${allReports.filter(r => r.report.compliance_gaps.length > 0).length})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border",
                filter === f.key ? "bg-navy text-white border-navy" : "bg-white text-charcoal-light border-border hover:bg-navy-50"
              )}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Reports Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-navy-50/50">
              <tr>
                {["Tool", "Score", "Rating", "Gaps", "Last Review", "Priority Action", "Actions"].map(h => (
                  <th key={h} scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ tool, report }) => {
                const daysSince = Math.floor((Date.now() - new Date(tool.last_reviewed).getTime()) / (1000 * 60 * 60 * 24));
                const isStale = daysSince > 90;
                return (
                  <tr key={tool.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/tool/${tool.slug}/report`} target="_blank" className="group">
                        <p className="text-sm font-semibold text-navy group-hover:text-accent-blue transition-colors">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.vendor}</p>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-bold",
                        tool.overall_score >= 8.5 ? "bg-success-bg text-success" :
                        tool.overall_score >= 7.5 ? "bg-[#EEF2F7] text-accent-blue" :
                        "bg-warning-bg text-warning"
                      )}>
                        {tool.overall_score}/10
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-charcoal">{report.overall_rating}</span>
                    </td>
                    <td className="py-3 px-4">
                      {report.compliance_gaps.length > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-danger-bg px-2 py-0.5 text-xs font-bold text-danger">
                          <XCircle className="h-3 w-3" /> {report.compliance_gaps.length}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-xs font-bold text-success">
                          <CheckCircle2 className="h-3 w-3" /> 0
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn("text-xs", isStale ? "text-danger font-semibold" : "text-muted-foreground")}>
                        {tool.last_reviewed} {isStale && <span>({daysSince}d ago)</span>}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[280px]">
                      <p className="text-xs text-charcoal line-clamp-2">{report.priority_actions[0] || "All priority items addressed"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/tool/${tool.slug}/report`} target="_blank"
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold text-navy hover:bg-navy-50 transition-colors">
                        <ExternalLink className="h-3 w-3" /> Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No reports match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
