"use client";

import { useState } from "react";
import { tools } from "@/lib/seed-data";
import { PrivacyBadge, TierBadge } from "@/components/status-badge";
import { ScoreRingInline } from "@/components/score-ring";
import Link from "next/link";
import { Settings, Search, Eye, FileEdit, CheckCircle2, Clock, AlertCircle, Trash2, FileText, BarChart3, Users, DollarSign, Activity, TrendingUp, ArrowRight, Shield, Timer, Briefcase, CalendarDays, Notebook } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubmissionStatus, ListingTier } from "@/lib/types";

const mockSubmissions = [
  { id: "s1", tool_name: "AI Tutor Pro", contact: "Sarah Johnson", email: "sarah@aitutorpro.com", submitted_at: "2026-04-08", status: "pending" as SubmissionStatus, tier: "featured" as ListingTier },
  { id: "s2", tool_name: "LearnBot", contact: "Michael Chen", email: "m.chen@learnbot.io", submitted_at: "2026-04-06", status: "in_review" as SubmissionStatus, tier: "basic" as ListingTier },
  { id: "s3", tool_name: "ClassroomGPT", contact: "Emily Rodriguez", email: "emily@classroomgpt.com", submitted_at: "2026-04-02", status: "in_review" as SubmissionStatus, tier: "verified" as ListingTier },
];

const statusConfig: Record<SubmissionStatus, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-muted-foreground bg-muted" },
  in_review: { label: "In Review", icon: AlertCircle, color: "text-warning bg-warning-bg" },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-success bg-success-bg" },
  rejected: { label: "Rejected", icon: Trash2, color: "text-danger bg-danger-bg" },
  published: { label: "Published", icon: Eye, color: "text-accent-blue bg-[#EEF2F7]" },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "tools" | "analytics">("queue");
  const [search, setSearch] = useState("");
  const filteredTools = search ? tools.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.vendor.toLowerCase().includes(search.toLowerCase())) : tools;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2"><Settings className="h-6 w-6 text-accent-blue" aria-hidden="true" /> Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage tool listings, review submissions, and monitor business operations</p>
        </div>

        {/* Admin Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/admin/calendar", label: "Daily Work Calendar", desc: "What to work on each day — check items off as you finish them", icon: CalendarDays, color: "text-success" },
            { href: "/admin/notes", label: "Monthly Notes", desc: "Freeform notebook per month — wins, numbers, lessons, follow-ups", icon: Notebook, color: "text-[#7C3AED]" },
            { href: "/admin/crm", label: "CRM & Operations Hub", desc: "Contacts, pipeline, activity log, tasks, follow-ups — your daily command center", icon: Briefcase, color: "text-accent-blue" },
            { href: "/admin/playbook", label: "Business Playbook", desc: "Full pricing rationale, Day 1 plan, reinvestment strategy (private)", icon: TrendingUp, color: "text-danger" },
            { href: "/admin/marketing-plan", label: "Marketing Plan", desc: "90-day schedule, scripts for every conversation (private)", icon: Users, color: "text-[#7C3AED]" },
            { href: "/admin/compliance-framework", label: "Compliance Framework", desc: "How to verify compliance without a lawyer — your legal shield", icon: Shield, color: "text-warning" },
            { href: "/admin/security-architecture", label: "Security Architecture", desc: "OWASP-aligned hardening, Top 10 fixes, incident response plan", icon: Shield, color: "text-danger" },
            { href: "/admin/workflow", label: "Daily Workflow", desc: "2-4 hr/day playbook + automated compliance scanner", icon: Timer, color: "text-accent-blue" },
            { href: "/admin/pricing", label: "Pricing Operations", desc: "Tier economics, MRR, subscribers, unit margins", icon: DollarSign, color: "text-success" },
            { href: "/admin/reports", label: "Score Reports Review", desc: "Bulk review all 64 tool reports + compliance gaps", icon: FileText, color: "text-accent-blue" },
            { href: "/admin/operations", label: "Business Operations", desc: "System health, weekly rhythm, revenue streams, tech stack", icon: Activity, color: "text-[#7C3AED]" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group rounded-xl border border-border p-5 hover:border-accent-blue/30 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className={cn("rounded-lg bg-navy-50 p-2", item.color)}>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent-blue transition-colors" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-navy">{item.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Listings", value: tools.length, icon: FileText, color: "text-accent-blue" },
            { label: "Pending Review", value: 3, icon: Clock, color: "text-warning" },
            { label: "Verified Tools", value: tools.filter((t) => t.is_featured).length, icon: CheckCircle2, color: "text-success" },
            { label: "Sponsored", value: 0, icon: DollarSign, color: "text-[#7C3AED]" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-1"><stat.icon className={cn("h-4 w-4", stat.color)} aria-hidden="true" /><span className="text-xs font-semibold text-muted-foreground">{stat.label}</span></div>
              <span className="text-2xl font-bold text-navy">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-border p-1 w-fit" role="tablist">
          {[
            { key: "queue" as const, label: "Review Queue", icon: Clock },
            { key: "tools" as const, label: "All Tools", icon: FileText },
            { key: "analytics" as const, label: "Analytics", icon: BarChart3 },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} role="tab" aria-selected={activeTab === tab.key}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", activeTab === tab.key ? "bg-navy text-white" : "text-muted-foreground hover:text-navy hover:bg-navy-50")}>
              <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />{tab.label}
            </button>
          ))}
        </div>

        {/* Queue */}
        {activeTab === "queue" && (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-navy-50/50">
                <tr>
                  {["Tool", "Contact", "Submitted", "Status", "Tier", "Actions"].map((h) => (
                    <th key={h} scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockSubmissions.map((sub) => {
                  const sc = statusConfig[sub.status]; const Icon = sc.icon;
                  return (
                    <tr key={sub.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-semibold text-navy">{sub.tool_name}</td>
                      <td className="py-3 px-4"><p className="text-sm text-navy">{sub.contact}</p><p className="text-xs text-muted-foreground">{sub.email}</p></td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{sub.submitted_at}</td>
                      <td className="py-3 px-4"><span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", sc.color)}><Icon className="h-3 w-3" aria-hidden="true" />{sc.label}</span></td>
                      <td className="py-3 px-4"><TierBadge tier={sub.tier} /></td>
                      <td className="py-3 px-4"><div className="flex items-center gap-1">
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue transition-colors" aria-label="View"><Eye className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue transition-colors" aria-label="Edit"><FileEdit className="h-3.5 w-3.5" /></button>
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-success-bg hover:text-success transition-colors" aria-label="Approve"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* All Tools */}
        {activeTab === "tools" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="admin-search" className="sr-only">Search tools</label>
              <input id="admin-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tools..." className="w-full bg-transparent text-sm text-navy placeholder:text-gray-400 focus:outline-none" />
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-navy-50/50"><tr>
                  {["Tool", "Status", "Tier", "Privacy", "Score", "Actions"].map((h) => (
                    <th key={h} scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredTools.map((tool) => {
                    const sc = statusConfig[tool.status]; const Icon = sc.icon;
                    return (
                      <tr key={tool.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                        <td className="py-3 px-4"><Link href={`/tool/${tool.slug}`} className="group"><p className="text-sm font-semibold text-navy group-hover:text-accent-blue transition-colors">{tool.name}</p><p className="text-xs text-muted-foreground">{tool.vendor}</p></Link></td>
                        <td className="py-3 px-4"><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", sc.color)}><Icon className="h-3 w-3" aria-hidden="true" />{sc.label}</span></td>
                        <td className="py-3 px-4"><TierBadge tier={tool.listing_tier} /></td>
                        <td className="py-3 px-4"><PrivacyBadge flag={tool.privacy_flag} /></td>
                        <td className="py-3 px-4"><ScoreRingInline score={tool.overall_score} /></td>
                        <td className="py-3 px-4"><div className="flex items-center gap-1">
                          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue transition-colors" aria-label={`Edit ${tool.name}`}><FileEdit className="h-3.5 w-3.5" /></button>
                          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue transition-colors" aria-label={`View ${tool.name}`}><Eye className="h-3.5 w-3.5" /></button>
                        </div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Unique Visitors (30d)", value: "12,847", change: "+23%", icon: Users },
                { label: "Tool Views (30d)", value: "34,215", change: "+18%", icon: BarChart3 },
                { label: "MRR", value: "$4,485", change: "5 featured + 2 verified", icon: DollarSign },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-3"><s.icon className="h-4 w-4 text-accent-blue" aria-hidden="true" /><span className="text-xs font-semibold text-muted-foreground">{s.label}</span></div>
                  <p className="text-2xl font-bold text-navy">{s.value}</p>
                  <p className="text-xs text-success mt-1 font-medium">{s.change}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border p-6">
              <h3 className="text-sm font-bold text-navy mb-4">Top Viewed Tools (30 days)</h3>
              <div className="space-y-3">
                {tools.slice(0, 8).map((tool, i) => {
                  const views = Math.floor(4000 - i * 400 + Math.random() * 200);
                  return (
                    <div key={tool.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between"><span className="text-sm font-medium text-navy">{tool.name}</span><span className="text-xs text-muted-foreground">{views.toLocaleString()} views</span></div>
                        <div className="h-1.5 rounded-full bg-gray-100 mt-1 overflow-hidden"><div className="h-full rounded-full bg-accent-blue/30" style={{ width: `${(views / 4200) * 100}%` }} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
