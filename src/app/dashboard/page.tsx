"use client";

import { tools } from "@/lib/seed-data";
import { KpiCard } from "@/components/kpi-card";
import { PrivacyBadge, PricingBadge } from "@/components/status-badge";
import { ScoreRingInline } from "@/components/score-ring";
import Link from "next/link";
import { Database, ShieldCheck, GraduationCap, Clock, TrendingUp, Star, GitCompareArrows, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CHART_COLORS = ["#3A6EA5", "#0B1F3A", "#C5A55A", "#1B7340", "#7E9FC6", "#8B6914", "#B71C1C", "#537FB3"];

export default function DashboardPage() {
  const totalTools = tools.length;
  const districtReady = tools.filter((t) => t.privacy_flag === "District Ready").length;
  const teacherOnly = tools.filter((t) => t.privacy_flag === "Teacher Use Only").length;

  const categoryData = Object.entries(
    tools.reduce<Record<string, number>>((acc, t) => { acc[t.categories[0]] = (acc[t.categories[0]] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const pricingData = Object.entries(
    tools.reduce<Record<string, number>>((acc, t) => { acc[t.pricing_type] = (acc[t.pricing_type] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const privacyData = [
    { name: "District Ready", value: districtReady, color: "#1B7340" },
    { name: "Teacher Use Only", value: teacherOnly, color: "#8B6914" },
    { name: "Use Caution", value: tools.filter((t) => t.privacy_flag === "Use Caution").length, color: "#B71C1C" },
  ];

  const gradeBands = ["K-2", "3-5", "6-8", "9-12"] as const;
  const cats = [...new Set(tools.map((t) => t.categories[0]))].slice(0, 8);
  const heatmapData = cats.map((cat) => {
    const row: Record<string, string | number> = { category: cat };
    gradeBands.forEach((gb) => { row[gb] = tools.filter((t) => t.categories[0] === cat && t.grade_bands.includes(gb)).length; });
    return row;
  });

  const featured = tools.filter((t) => t.is_featured || t.listing_tier === "verified").slice(0, 4);
  const recentReviews = [...tools].sort((a, b) => new Date(b.last_reviewed).getTime() - new Date(a.last_reviewed).getTime()).slice(0, 5);
  const topCompared = [...tools].sort((a, b) => b.overall_score - a.overall_score).slice(0, 5);

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of the District AI Index directory</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total Tools" value={totalTools} subtitle="In the directory" icon={Database} trend={{ value: "+3 this month", positive: true }} />
          <KpiCard title="District Ready" value={districtReady} subtitle="Verified for adoption" icon={ShieldCheck} trend={{ value: `${Math.round((districtReady / totalTools) * 100)}% of total`, positive: true }} />
          <KpiCard title="Teacher Use Only" value={teacherOnly} subtitle="Individual use approved" icon={GraduationCap} />
          <KpiCard title="Under Review" value={2} subtitle="Pending evaluation" icon={Clock} />
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel title="Featured Recommendations" icon={Star} link="/verified" linkLabel="View all">
            {featured.map((tool) => (
              <ToolRow key={tool.id} tool={tool}><ScoreRingInline score={tool.overall_score} /></ToolRow>
            ))}
          </Panel>
          <Panel title="Recent Evaluations" icon={TrendingUp} link="/directory" linkLabel="View all">
            {recentReviews.map((tool) => (
              <ToolRow key={tool.id} tool={tool}><PrivacyBadge flag={tool.privacy_flag} /></ToolRow>
            ))}
          </Panel>
          <Panel title="Top Rated Tools" icon={GitCompareArrows} link="/compare" linkLabel="Compare">
            {topCompared.map((tool) => (
              <ToolRow key={tool.id} tool={tool}><PricingBadge model={tool.pricing_type} /></ToolRow>
            ))}
          </Panel>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Category Distribution">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 100, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fill: "#2E2E2E", fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="value" fill="#3A6EA5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="rounded-xl border border-border p-6">
            <h2 className="text-sm font-bold text-navy mb-4">Grade Band Coverage</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Category</th>
                    {gradeBands.map((gb) => <th key={gb} className="text-center py-2 px-2 font-semibold text-muted-foreground">{gb}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.category as string} className="border-t border-border">
                      <td className="py-2 px-2 font-medium text-navy truncate max-w-[120px]">{row.category as string}</td>
                      {gradeBands.map((gb) => {
                        const v = row[gb] as number;
                        const bg = v === 0 ? "bg-gray-50" : v === 1 ? "bg-accent-blue/10" : v === 2 ? "bg-accent-blue/25" : "bg-accent-blue/40";
                        return <td key={gb} className="py-2 px-2 text-center"><span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${bg} font-semibold text-navy`}>{v}</span></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ChartCard title="Pricing Mix">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pricingData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pricingData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {pricingData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} aria-hidden="true" />{d.name} ({d.value})
                </span>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Privacy Posture">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={privacyData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {privacyData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {privacyData.map((d) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} aria-hidden="true" />{d.name} ({d.value})
                </span>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border p-6">
          <h2 className="text-sm font-bold text-navy mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { href: "/directory", label: "Browse Directory", desc: "Explore all AI tools" },
              { href: "/compare", label: "Compare Tools", desc: "Side-by-side analysis" },
              { href: "/verified", label: "Verified Tools", desc: "District-ready picks" },
              { href: "/submit", label: "Submit a Tool", desc: "Add to the index" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-navy-50 hover:border-navy-200 transition-colors group">
                <div>
                  <p className="text-sm font-semibold text-navy group-hover:text-accent-blue transition-colors">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-accent-blue transition-colors" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, link, linkLabel, children }: { title: string; icon: React.ComponentType<{ className?: string }>; link: string; linkLabel: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-navy flex items-center gap-2"><Icon className="h-4 w-4 text-accent-blue" aria-hidden="true" />{title}</h2>
        <Link href={link} className="text-xs font-semibold text-accent-blue hover:text-navy transition-colors">{linkLabel}</Link>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToolRow({ tool, children }: { tool: { id: string; slug: string; name: string; categories: string[]; vendor: string }; children: React.ReactNode }) {
  return (
    <Link href={`/tool/${tool.slug}`} className="flex items-center justify-between rounded-lg bg-navy-50/50 p-3 hover:bg-navy-50 transition-colors group">
      <div className="min-w-0">
        <p className="text-sm font-medium text-navy group-hover:text-accent-blue transition-colors truncate">{tool.name}</p>
        <p className="text-xs text-muted-foreground truncate">{tool.vendor}</p>
      </div>
      {children}
    </Link>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-6">
      <h2 className="text-sm font-bold text-navy mb-4">{title}</h2>
      <div className="h-64">{children}</div>
    </div>
  );
}
