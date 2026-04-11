"use client";

import { tools } from "@/lib/seed-data";
import { FileBarChart, Download, TrendingUp, Shield, DollarSign, GraduationCap } from "lucide-react";

export default function ReportsPage() {
  const districtReady = tools.filter((t) => t.privacy_flag === "District Ready").length;
  const avgScore = (tools.reduce((sum, t) => sum + t.overall_score, 0) / tools.length).toFixed(1);
  const freeTools = tools.filter((t) => t.pricing_type === "Free" || t.pricing_type === "Freemium").length;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-accent-blue" aria-hidden="true" /> Reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Exportable insights for district leadership and board presentations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, value: avgScore, label: "Avg. Readiness Score", color: "text-accent-blue" },
            { icon: Shield, value: districtReady, label: "District Ready Tools", color: "text-success" },
            { icon: DollarSign, value: freeTools, label: "Free for Education", color: "text-warning" },
            { icon: GraduationCap, value: tools.length, label: "Total Evaluated", color: "text-[#7C3AED]" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border p-5">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} aria-hidden="true" />
              <p className="text-2xl font-bold text-navy">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title: "District Readiness Summary", desc: "Overview of all evaluated tools with readiness scores, privacy postures, and editorial recommendations. Suitable for superintendent briefings.", format: "PDF", pages: "12 pages" },
            { title: "Privacy & Compliance Audit", desc: "Detailed compliance analysis including FERPA, COPPA, SOC 2, DPA availability, and VPAT status. Designed for CTO and legal review.", format: "PDF", pages: "18 pages" },
            { title: "Tool Comparison Matrix", desc: "Side-by-side comparison of all District Ready tools across all evaluation dimensions. Exportable for procurement review.", format: "CSV / Excel", pages: "25 tools x 15 dimensions" },
            { title: "Category Deep Dive", desc: "In-depth analysis by category with market landscape and recommendations per category.", format: "PDF", pages: "8 sections" },
            { title: "Budget Planning Guide", desc: "Pricing analysis with per-teacher cost estimates, volume discount availability, and procurement strategies.", format: "Excel", pages: "3 worksheets" },
            { title: "Implementation Roadmap", desc: "Phased rollout recommendations for district AI adoption, including pilot selection and success metrics.", format: "PDF", pages: "16 pages" },
          ].map((report) => (
            <div key={report.title} className="rounded-xl border border-border p-6 hover:shadow-md hover:border-navy-200 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-bold text-navy">{report.title}</h3>
                <span className="text-[10px] font-semibold text-muted-foreground bg-navy-50 rounded px-1.5 py-0.5">{report.format}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{report.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{report.pages}</span>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy-50 transition-colors">
                  <Download className="h-3 w-3" aria-hidden="true" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-navy-50/50 p-8 text-center">
          <h2 className="text-lg font-bold text-navy mb-2">Need a Custom Report?</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">Our team can create custom evaluation reports tailored to your district&apos;s specific requirements.</p>
          <button className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">Request Custom Report</button>
        </div>
      </div>
    </div>
  );
}
