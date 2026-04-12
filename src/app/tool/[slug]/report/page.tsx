"use client";

import { useParams } from "next/navigation";
import { getToolBySlug } from "@/lib/seed-data";
import { generateToolReport, type DimensionReport } from "@/lib/score-report";
import { PrivacyBadge, PricingBadge, ComplianceDot } from "@/components/status-badge";
import Link from "next/link";
import {
  FileText, ArrowLeft, Printer, CheckCircle2, XCircle,
  AlertTriangle, ShieldCheck, TrendingUp, Target,
  Download, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ratingColors: Record<string, string> = {
  "Excellent": "text-success bg-success-bg border-success/20",
  "Strong": "text-success bg-success-bg border-success/20",
  "Adequate": "text-accent-blue bg-[#EEF2F7] border-accent-blue/20",
  "Needs Improvement": "text-warning bg-warning-bg border-warning/20",
  "Critical Gap": "text-danger bg-danger-bg border-danger/20",
};

export default function ScoreReportPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center px-4">
        <div>
          <p className="text-xl font-bold text-navy">Tool not found</p>
          <Link href="/directory" className="text-sm text-accent-blue hover:underline mt-2 inline-block">&larr; Back to Directory</Link>
        </div>
      </div>
    );
  }

  const report = generateToolReport(tool);

  return (
    <div className="bg-white min-h-screen">
      {/* Print-friendly styles */}
      <style>{`
        @media print {
          nav, footer, .no-print { display: none !important; }
          body { font-size: 11px; }
          .print-break { page-break-before: always; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-navy py-10 print:bg-white print:py-4 print:border-b-2 print:border-navy no-print">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link href={`/tool/${slug}`} className="inline-flex items-center gap-1 text-xs text-navy-200 hover:text-white mb-4 no-print">
            <ArrowLeft className="h-3 w-3" /> Back to {tool.name}
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-300">District AI Index — Vendor Score Report</p>
              <h1 className="text-2xl font-bold text-white mt-1">{tool.name}</h1>
              <p className="text-sm text-navy-200 mt-1">by {tool.vendor} &middot; Report generated {new Date(report.generated_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => window.print()} className="no-print flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block px-4 py-4 border-b-2 border-navy">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">District AI Index — Vendor Score Report</p>
        <h1 className="text-xl font-bold text-navy">{tool.name}</h1>
        <p className="text-xs text-muted-foreground">by {tool.vendor} &middot; Generated {new Date(report.generated_at).toLocaleDateString()}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-8">

        {/* Executive Summary */}
        <section className="rounded-xl border-2 border-navy-200 p-6">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Executive Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-navy">{tool.overall_score}</div>
              <div className="text-xs text-muted-foreground">Overall Score (of 10)</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-navy mt-2">{report.overall_rating}</div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
            <div className="text-center">
              <PrivacyBadge flag={tool.privacy_flag} />
              <div className="text-xs text-muted-foreground mt-1">Privacy Status</div>
            </div>
            <div className="text-center">
              <PricingBadge model={tool.pricing_type} />
              <div className="text-xs text-muted-foreground mt-1">Pricing Model</div>
            </div>
          </div>
          <p className="text-sm text-charcoal leading-relaxed italic border-l-4 border-accent-blue pl-4">
            &ldquo;{tool.editorial_verdict}&rdquo;
          </p>
        </section>

        {/* Score Breakdown */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Dimension Score Breakdown
          </h2>

          {/* Score bar overview */}
          <div className="rounded-xl border border-border p-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              {report.dimension_reports.map((d) => (
                <div key={d.dimension} className="text-center">
                  <div className="text-2xl font-bold text-navy">{d.score}</div>
                  <div className="text-[10px] text-muted-foreground">{d.dimension}</div>
                  <div className="text-[10px] text-muted-foreground">Weight: {d.weight}</div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", d.score >= 8 ? "bg-success" : d.score >= 7 ? "bg-accent-blue" : d.score >= 5 ? "bg-warning" : "bg-danger")}
                      style={{ width: `${(d.score / d.max) * 100}%` }}
                    />
                  </div>
                  <span className={cn("inline-block mt-1 rounded-full px-2 py-0.5 text-[9px] font-bold border", ratingColors[d.rating])}>
                    {d.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed dimension reports */}
          {report.dimension_reports.map((d, i) => (
            <div key={d.dimension} className={cn("rounded-xl border border-border p-6 mb-4", i >= 2 && "print-break")}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-navy">{d.dimension}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-navy">{d.score}/{d.max}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold border", ratingColors[d.rating])}>
                    {d.rating}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div>
                  <h4 className="text-xs font-bold text-success uppercase tracking-wider mb-2">Strengths</h4>
                  {d.strengths.length > 0 ? (
                    <ul className="space-y-1.5">
                      {d.strengths.map((s) => (
                        <li key={s} className="text-xs text-charcoal flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No specific strengths identified in this dimension.</p>
                  )}
                </div>

                {/* Gaps */}
                <div>
                  <h4 className="text-xs font-bold text-danger uppercase tracking-wider mb-2">Gaps Identified</h4>
                  {d.gaps.length > 0 ? (
                    <ul className="space-y-1.5">
                      {d.gaps.map((g) => (
                        <li key={g} className="text-xs text-charcoal flex items-start gap-2">
                          <XCircle className="h-3.5 w-3.5 text-danger shrink-0 mt-0.5" aria-hidden="true" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No critical gaps identified.</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {d.recommendations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-2">Recommendations to Improve Score</h4>
                  <ul className="space-y-1.5">
                    {d.recommendations.map((r) => (
                      <li key={r} className="text-xs text-charcoal flex items-start gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Compliance Gaps */}
        {report.compliance_gaps.length > 0 && (
          <section className="print-break">
            <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Compliance Gaps
            </h2>
            <div className="rounded-xl border border-danger/20 bg-danger-bg/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-danger-bg">
                  <tr>
                    <th className="text-left py-2 px-4 text-xs font-bold text-navy" scope="col">Signal</th>
                    <th className="text-left py-2 px-4 text-xs font-bold text-navy" scope="col">Current Status</th>
                    <th className="text-left py-2 px-4 text-xs font-bold text-navy hidden sm:table-cell" scope="col">Impact</th>
                    <th className="text-left py-2 px-4 text-xs font-bold text-navy" scope="col">Action Required</th>
                  </tr>
                </thead>
                <tbody>
                  {report.compliance_gaps.map((gap) => (
                    <tr key={gap.signal} className="border-t border-danger/10">
                      <td className="py-2 px-4 text-xs font-semibold text-navy">{gap.signal}</td>
                      <td className="py-2 px-4 text-xs">
                        <ComplianceDot status={gap.current_status === "partial" ? "partial" : gap.current_status === "unavailable" ? "unavailable" : "unknown"} />
                        <span className="ml-1.5 text-charcoal">{gap.current_status}</span>
                      </td>
                      <td className="py-2 px-4 text-xs text-muted-foreground hidden sm:table-cell">{gap.impact}</td>
                      <td className="py-2 px-4 text-xs text-charcoal">{gap.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* VPAT Assessment */}
        <section>
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-accent-blue" aria-hidden="true" /> VPAT / ACR Assessment
          </h2>
          <div className={cn(
            "rounded-xl border-2 p-5",
            tool.vpat_status === "available" ? "border-success/30 bg-success-bg/30" : "border-warning/30 bg-warning-bg/30"
          )}>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-xs font-bold text-muted-foreground block">Status</span><span className="text-navy font-semibold">{report.vpat_assessment.status}</span></div>
              <div><span className="text-xs font-bold text-muted-foreground block">Impact</span><span className="text-charcoal">{report.vpat_assessment.impact}</span></div>
              <div><span className="text-xs font-bold text-muted-foreground block">Recommendation</span><span className="text-charcoal">{report.vpat_assessment.recommendation}</span></div>
            </div>
            {tool.vpat_url && (
              <a href={tool.vpat_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-accent-blue hover:underline">
                <ExternalLink className="h-3 w-3" /> View current VPAT/ACR document
              </a>
            )}
          </div>
        </section>

        {/* Priority Actions */}
        <section className="print-break">
          <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Priority Actions to Improve Score
          </h2>
          <div className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-6">
            <p className="text-xs text-muted-foreground mb-4">The following actions would have the highest impact on your District AI Index score, listed in priority order:</p>
            <ol className="space-y-3">
              {report.priority_actions.map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-charcoal">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-blue text-white text-xs font-bold shrink-0">{i + 1}</span>
                  {action}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Scoring Methodology */}
        <section className="rounded-xl border border-border bg-navy-50/30 p-6">
          <h2 className="text-sm font-bold text-navy mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent-blue" aria-hidden="true" /> Scoring Methodology
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{report.scoring_methodology}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Full methodology: <Link href="/editorial-policy" className="text-accent-blue font-semibold hover:underline">districtaiindex.com/editorial-policy</Link>
          </p>
        </section>

        {/* Contact / Dispute */}
        <section className="rounded-xl border border-border p-6 text-center no-print">
          <h2 className="text-sm font-bold text-navy mb-2">Questions About This Report?</h2>
          <p className="text-xs text-muted-foreground mb-3">
            If you believe any information is inaccurate or have updated compliance documentation, contact our editorial team.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition-colors">
            Contact Editorial Team
          </Link>
        </section>
      </div>
    </div>
  );
}
