"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { tools } from "@/lib/seed-data";
import { ToolLogo } from "@/components/tool-logo";
import { ScoreRingInline } from "@/components/score-ring";
import {
  CheckCircle2, AlertCircle, XCircle, HelpCircle,
  Calendar, ShieldCheck, ExternalLink, ArrowRight, Bell, Search, X,
  ArrowUpDown, ArrowUp, ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tool } from "@/lib/types";

type VpatFilter = "all" | "available" | "on_request" | "not_available" | "unknown";
type SortKey = "name" | "vpat_status" | "accessibility_score" | "overall_score" | "last_reviewed";
type SortDir = "asc" | "desc";

const VPAT_STATUS_LABEL: Record<Tool["vpat_status"], string> = {
  available: "Published",
  on_request: "On request",
  not_available: "Not published",
  unknown: "Unknown",
};

const VPAT_STATUS_ORDER: Record<Tool["vpat_status"], number> = {
  available: 0,
  on_request: 1,
  unknown: 2,
  not_available: 3,
};

// April 26, 2027 — DOJ Title II ADA web/app rule deadline for entities under 50,000 population.
// Most WV districts fall under this deadline.
const DEADLINE = new Date("2027-04-26T00:00:00Z");

function daysUntilDeadline(): number {
  const ms = DEADLINE.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function VpatClient() {
  const [filter, setFilter] = useState<VpatFilter>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("vpat_status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir(key === "vpat_status" ? "asc" : "desc");
      return key;
    });
  }, []);

  const counts = useMemo(() => {
    const base = { available: 0, on_request: 0, not_available: 0, unknown: 0 };
    for (const t of tools) base[t.vpat_status] += 1;
    return base;
  }, []);

  const filtered = useMemo(() => {
    let result = [...tools];
    if (filter !== "all") result = result.filter((t) => t.vpat_status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.vendor.toLowerCase().includes(q) ||
          t.categories.some((c) => c.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "vpat_status":
          return (VPAT_STATUS_ORDER[a.vpat_status] - VPAT_STATUS_ORDER[b.vpat_status]) * dir;
        case "accessibility_score":
          return (a.scores.accessibility - b.scores.accessibility) * dir;
        case "overall_score":
          return (a.overall_score - b.overall_score) * dir;
        case "last_reviewed":
          return (new Date(a.last_reviewed).getTime() - new Date(b.last_reviewed).getTime()) * dir;
      }
    });
    return result;
  }, [filter, search, sortKey, sortDir]);

  const days = daysUntilDeadline();

  return (
    <div className="bg-white min-h-screen">
      {/* ============ HEADER ============ */}
      <section className="bg-navy text-white" aria-labelledby="vpat-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" /> VPAT Tracker
            </span>
          </div>
          <h1 id="vpat-heading" className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            Which AI tools have a published VPAT — and which ones you'll need to chase
          </h1>
          <p className="mt-3 text-base text-navy-100 max-w-3xl leading-relaxed">
            The DOJ's Title II ADA rule requires every public school district to demonstrate WCAG 2.1 AA conformance
            for the digital tools it provides — including third-party vendor tools. This tracker shows the current
            VPAT/ACR status of every AI tool we've evaluated, so you know which vendors are ready and which still
            owe documentation.
          </p>

          {/* Deadline callout */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-accent-gold/15 border border-accent-gold/30 px-4 py-3">
            <Calendar className="h-5 w-5 text-accent-gold-light shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold text-white">
                {days.toLocaleString()} days until the federal deadline
              </p>
              <p className="text-xs text-navy-100">
                April 26, 2027 — DOJ Title II ADA rule for entities under 50,000 population (covers most US K-12 districts)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BANNER ============ */}
      <section className="bg-navy-50/50 border-b border-border" aria-labelledby="counts-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h2 id="counts-heading" className="sr-only">VPAT status across the directory</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatusCard
              icon={CheckCircle2}
              count={counts.available}
              label="Published VPAT"
              helper="Ready for your compliance file"
              tone="success"
              onClick={() => setFilter("available")}
              active={filter === "available"}
            />
            <StatusCard
              icon={AlertCircle}
              count={counts.on_request}
              label="Available on request"
              helper="Email the vendor — usually a quick turnaround"
              tone="info"
              onClick={() => setFilter("on_request")}
              active={filter === "on_request"}
            />
            <StatusCard
              icon={HelpCircle}
              count={counts.unknown}
              label="Status unknown"
              helper="Not documented either way — verify with the vendor"
              tone="muted"
              onClick={() => setFilter("unknown")}
              active={filter === "unknown"}
            />
            <StatusCard
              icon={XCircle}
              count={counts.not_available}
              label="Not published"
              helper="Vendor has indicated no VPAT exists"
              tone="danger"
              onClick={() => setFilter("not_available")}
              active={filter === "not_available"}
            />
          </div>
        </div>
      </section>

      {/* ============ TABLE ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="tools-heading">
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 id="tools-heading" className="text-xl font-bold text-navy">
              Tools evaluated ({filtered.length}{filtered.length !== tools.length && ` of ${tools.length}`})
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              Click any column header to sort. Click a row to view the tool's full accessibility documentation.
            </p>
          </div>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-charcoal hover:bg-navy-50 hover:text-navy transition-colors"
            >
              <X className="h-3 w-3" aria-hidden="true" /> Clear filter
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-md">
          <label htmlFor="vpat-search" className="sr-only">Search tools</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" aria-hidden="true" />
          <input
            id="vpat-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, vendor, or category"
            className="w-full rounded-lg border border-border bg-white pl-10 pr-9 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-navy"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="AI tools VPAT status">
              <thead className="bg-navy-50/50">
                <tr>
                  <SortableTh label="Tool" field="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="VPAT Status" field="vpat_status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal hidden md:table-cell">
                    Document
                  </th>
                  <SortableTh label="Accessibility" field="accessibility_score" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="hidden lg:table-cell" />
                  <SortableTh label="Overall" field="overall_score" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                  <SortableTh label="Reviewed" field="last_reviewed" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-charcoal-light">
                      No tools match this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tool) => (
                    <tr key={tool.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <Link href={`/tool/${tool.slug}`} className="group flex items-center gap-3">
                          <ToolLogo name={tool.name} logoUrl={tool.logo_url} size="sm" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-navy group-hover:text-accent-blue transition-colors truncate">
                              {tool.name}
                            </p>
                            <p className="text-xs text-charcoal-light truncate">{tool.vendor}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <VpatBadge status={tool.vpat_status} />
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {tool.vpat_url ? (
                          <a
                            href={tool.vpat_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-accent-blue hover:text-navy transition-colors"
                            aria-label={`Open ${tool.name} VPAT documentation (opens in new tab)`}
                          >
                            <ExternalLink className="h-3 w-3" aria-hidden="true" /> Open
                          </a>
                        ) : (
                          <span className="text-xs text-charcoal-light">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-xs font-semibold text-charcoal tabular-nums">
                          {tool.scores.accessibility}/10
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ScoreRingInline score={tool.overall_score} />
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="text-xs text-charcoal-light tabular-nums">{tool.last_reviewed}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-charcoal-light leading-relaxed">
          <strong className="text-charcoal">A note on methodology:</strong> "Published" means the vendor lists a current
          VPAT/ACR on a public-facing page. "On request" means the vendor confirms a VPAT exists but requires a request
          to obtain it. "Not published" / "Unknown" do <em>not</em> mean the tool is inaccessible — only that documentation
          isn't publicly verifiable. For procurement, request the document directly from the vendor and verify it covers
          the version of the product you're adopting.
        </p>
      </section>

      {/* ============ ACTIONS ============ */}
      <section className="bg-navy-50/50 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/alerts"
              className="group rounded-xl border border-border bg-white p-5 hover:border-navy-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-accent-blue shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-navy group-hover:text-accent-blue transition-colors">
                    Get alerts when VPAT status changes
                  </h3>
                  <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                    Pick the tools your district uses or is evaluating — we'll email you when a vendor publishes a new
                    VPAT or updates its accessibility documentation.
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-blue">
                    Subscribe to alerts <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </p>
                </div>
              </div>
            </Link>
            <Link
              href="/rfp"
              className="group rounded-xl border border-border bg-white p-5 hover:border-navy-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-accent-blue shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-navy group-hover:text-accent-blue transition-colors">
                    Generate a procurement brief
                  </h3>
                  <p className="mt-1 text-xs text-charcoal-light leading-relaxed">
                    Pick up to 3 tools and download a board-ready PDF including each one's VPAT status, privacy posture,
                    and editorial review — ready to attach to an RFP or compliance file.
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-blue">
                    Build a brief <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusCard({
  icon: Icon, count, label, helper, tone, onClick, active,
}: {
  icon: typeof CheckCircle2;
  count: number;
  label: string;
  helper: string;
  tone: "success" | "info" | "danger" | "muted";
  onClick: () => void;
  active: boolean;
}) {
  const styles = {
    success: { iconColor: "text-success", ring: "ring-success/30 bg-success-bg" },
    info: { iconColor: "text-accent-blue", ring: "ring-accent-blue/30 bg-accent-blue/5" },
    danger: { iconColor: "text-danger", ring: "ring-danger/30 bg-danger-bg" },
    muted: { iconColor: "text-charcoal", ring: "ring-charcoal/20 bg-navy-50" },
  }[tone];
  return (
    <button
      onClick={onClick}
      className={cn(
        "group rounded-xl border border-border bg-white p-4 text-left transition-all hover:border-navy-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-blue/40",
        active && `ring-2 ${styles.ring}`
      )}
      aria-pressed={active}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", styles.iconColor)} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-2xl font-bold text-navy tabular-nums">{count}</p>
          <p className="text-sm font-bold text-navy">{label}</p>
          <p className="mt-0.5 text-[11px] text-charcoal-light leading-snug">{helper}</p>
        </div>
      </div>
    </button>
  );
}

function VpatBadge({ status }: { status: Tool["vpat_status"] }) {
  const config = {
    available: { Icon: CheckCircle2, bg: "bg-success-bg", text: "text-success", border: "border-success/20" },
    on_request: { Icon: AlertCircle, bg: "bg-accent-blue/10", text: "text-accent-blue", border: "border-accent-blue/20" },
    not_available: { Icon: XCircle, bg: "bg-danger-bg", text: "text-danger", border: "border-danger/20" },
    unknown: { Icon: HelpCircle, bg: "bg-navy-50", text: "text-charcoal", border: "border-border" },
  }[status];
  const Icon = config.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", config.bg, config.text, config.border)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {VPAT_STATUS_LABEL[status]}
    </span>
  );
}

function SortableTh({
  label, field, sortKey, sortDir, onSort, className,
}: {
  label: string;
  field: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === field;
  const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      className={cn(
        "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal cursor-pointer hover:text-navy transition-colors select-none",
        className
      )}
      onClick={() => onSort(field)}
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <Icon className={cn("h-3 w-3", active ? "text-accent-blue" : "text-charcoal-light")} aria-hidden="true" />
      </span>
    </th>
  );
}
