"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { tools, savedViews } from "@/lib/seed-data";
import { ToolCard } from "@/components/tool-card";
import { useCompare } from "@/lib/compare-context";
import { PrivacyBadge, PricingBadge } from "@/components/status-badge";
import { ScoreRingInline } from "@/components/score-ring";
import { Search, LayoutGrid, List, X, Bookmark, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, GradeBand, PricingType, PrivacyFlag } from "@/lib/types";

const allCategories: Category[] = [
  "Lesson Planning", "Admin Tasks", "Tutoring", "Student Support", "Feedback & Grading",
  "Differentiation", "Engagement", "Content Creation", "General AI", "Assessment",
  "Study Tools", "Writing Support", "Accessibility & Notes", "ELA & Language",
  "Video Learning", "Productivity", "Student Interaction",
];
const allGradeBands: GradeBand[] = ["K-2", "3-5", "6-8", "9-12"];
const allPricingTypes: PricingType[] = ["Free", "Freemium", "Paid"];
const allPrivacyFlags: PrivacyFlag[] = ["District Ready", "Teacher Use Only", "Use Caution"];

type SortKey = "name" | "category" | "overall_score" | "last_reviewed";
type SortDir = "asc" | "desc";

export default function DirectoryPage() {
  const { toggle, isSelected } = useCompare();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [gradeBand, setGradeBand] = useState<GradeBand | "">("");
  const [pricing, setPricing] = useState<PricingType | "">("");
  const [privacy, setPrivacy] = useState<PrivacyFlag | "">("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [sortKey, setSortKey] = useState<SortKey>("overall_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [activeView, setActiveView] = useState("all");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const applyView = (viewId: string) => {
    setActiveView(viewId);
    const view = savedViews.find((v) => v.id === viewId);
    if (!view) return;
    setSearch(""); setCategory((view.filters.category as Category) || "");
    setGradeBand((view.filters.grade_band as GradeBand) || "");
    setPricing((view.filters.pricing as PricingType) || "");
    setPrivacy((view.filters.privacy_flag as PrivacyFlag) || "");
  };

  const clearFilters = () => {
    setSearch(""); setCategory(""); setGradeBand(""); setPricing(""); setPrivacy(""); setActiveView("all");
  };

  const activeFilters = [
    category && { label: category, clear: () => setCategory("") },
    gradeBand && { label: gradeBand, clear: () => setGradeBand("") },
    pricing && { label: pricing, clear: () => setPricing("") },
    privacy && { label: privacy, clear: () => setPrivacy("") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const filtered = useMemo(() => {
    let result = [...tools];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) =>
        t.name.toLowerCase().includes(q) || t.vendor.toLowerCase().includes(q) ||
        t.categories.some(c => c.toLowerCase().includes(q)) || t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (category) result = result.filter((t) => t.categories.includes(category));
    if (gradeBand) result = result.filter((t) => t.grade_bands.includes(gradeBand));
    if (pricing) result = result.filter((t) => t.pricing_type === pricing);
    if (privacy) result = result.filter((t) => t.privacy_flag === privacy);

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "category") return a.categories[0].localeCompare(b.categories[0]) * dir;
      if (sortKey === "overall_score") return (a.overall_score - b.overall_score) * dir;
      if (sortKey === "last_reviewed") return (new Date(a.last_reviewed).getTime() - new Date(b.last_reviewed).getTime()) * dir;
      return 0;
    });
    return result;
  }, [search, category, gradeBand, pricing, privacy, sortKey, sortDir]);

  const SortTh = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      scope="col"
      className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-navy transition-colors select-none"
      onClick={() => handleSort(field)}
      aria-sort={sortKey === field ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
    >
      <span className="flex items-center gap-1">
        {label}
        {sortKey === field && <span className="text-accent-blue">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </span>
    </th>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-navy-50/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">AI Tool Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and filter {tools.length} AI tools evaluated for K–12 classroom and district use
          </p>

          {/* Search */}
          <div className="mt-6 flex items-center gap-3" role="search" aria-label="Filter tools">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 flex-1 max-w-lg shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <label htmlFor="dir-search" className="sr-only">Search tools</label>
              <input
                id="dir-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, vendor, category, or tag..."
                className="w-full bg-transparent text-sm text-navy placeholder:text-gray-400 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-navy" aria-label="Clear search">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-white p-1 shadow-sm" role="radiogroup" aria-label="View mode">
              <button
                onClick={() => setViewMode("card")}
                className={cn("rounded-lg p-2 transition-colors", viewMode === "card" ? "bg-navy-50 text-navy" : "text-gray-400 hover:text-navy")}
                aria-label="Card view"
                aria-pressed={viewMode === "card"}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn("rounded-lg p-2 transition-colors", viewMode === "table" ? "bg-navy-50 text-navy" : "text-gray-400 hover:text-navy")}
                aria-label="Table view"
                aria-pressed={viewMode === "table"}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Saved Views */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Bookmark className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {savedViews.map((view) => (
              <button
                key={view.id}
                onClick={() => applyView(view.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeView === view.id
                    ? "bg-navy text-white"
                    : "bg-white text-charcoal-light border border-border hover:bg-navy-50 hover:text-navy"
                )}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {[
              { label: "Category", value: category, options: allCategories, set: (v: string) => setCategory(v as Category | "") },
              { label: "Grade Band", value: gradeBand, options: allGradeBands, set: (v: string) => setGradeBand(v as GradeBand | "") },
              { label: "Pricing", value: pricing, options: allPricingTypes, set: (v: string) => setPricing(v as PricingType | "") },
              { label: "Privacy Level", value: privacy, options: allPrivacyFlags, set: (v: string) => setPrivacy(v as PrivacyFlag | "") },
            ].map((f) => (
              <div key={f.label} className="relative">
                <label htmlFor={`filter-${f.label}`} className="sr-only">{f.label}</label>
                <select
                  id={`filter-${f.label}`}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="appearance-none rounded-lg border border-border bg-white pl-3 pr-8 py-1.5 text-xs font-medium text-charcoal-light focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue cursor-pointer"
                >
                  <option value="">All {f.label}s</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" aria-hidden="true" />
              </div>
            ))}
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap" role="status" aria-label="Active filters">
              {activeFilters.map((f) => (
                <button
                  key={f.label}
                  onClick={f.clear}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 px-2.5 py-1 text-xs font-semibold text-accent-blue hover:bg-accent-blue/20 transition-colors"
                  aria-label={`Remove filter: ${f.label}`}
                >
                  {f.label}
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              ))}
              <button onClick={clearFilters} className="text-xs font-medium text-muted-foreground hover:text-navy transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-xs font-medium text-muted-foreground mb-6" role="status" aria-live="polite">
          Showing {filtered.length} of {tools.length} tools
        </p>

        {/* Card view */}
        {viewMode === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        {/* Table view */}
        {viewMode === "table" && (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead className="bg-navy-50/50">
                  <tr>
                    <th scope="col" className="w-10 py-3 px-4"><span className="sr-only">Compare</span></th>
                    <SortTh label="Tool" field="name" />
                    <SortTh label="Category" field="category" />
                    <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Grade Band</th>
                    <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Pricing</th>
                    <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Privacy</th>
                    <SortTh label="Score" field="overall_score" />
                    <SortTh label="Reviewed" field="last_reviewed" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tool) => (
                    <tr key={tool.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected(tool.id)}
                          onChange={() => toggle(tool.id)}
                          className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue cursor-pointer"
                          aria-label={`Add ${tool.name} to comparison`}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/tool/${tool.slug}`} className="group flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-xs font-bold text-navy shrink-0" aria-hidden="true">
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-navy group-hover:text-accent-blue transition-colors">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.vendor}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-xs text-charcoal-light">{tool.categories[0]}</td>
                      <td className="py-3 px-4 text-xs text-charcoal-light hidden lg:table-cell">{tool.grade_bands.join(", ")}</td>
                      <td className="py-3 px-4 hidden md:table-cell"><PricingBadge model={tool.pricing_type} /></td>
                      <td className="py-3 px-4 hidden md:table-cell"><PrivacyBadge flag={tool.privacy_flag} /></td>
                      <td className="py-3 px-4"><ScoreRingInline score={tool.overall_score} /></td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{tool.last_reviewed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-10 w-10 text-gray-300 mb-4" aria-hidden="true" />
            <p className="text-base font-semibold text-navy">No tools match your filters</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-accent-blue hover:text-navy transition-colors">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
