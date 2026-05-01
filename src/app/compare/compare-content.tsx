"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCompare } from "@/lib/compare-context";
import { getToolById, tools } from "@/lib/seed-data";
import { PrivacyBadge, PricingBadge, ComplianceDot } from "@/components/status-badge";
import { ScoreRingInline } from "@/components/score-ring";
import Link from "next/link";
import { GitCompareArrows, X, ArrowLeft, Link2, Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

const compareRows = [
  { key: "category", label: "Category" },
  { key: "audiences", label: "Intended Audience" },
  { key: "grade_bands", label: "Grade Bands" },
  { key: "instructional_fit", label: "Teacher Workflow Fit" },
  { key: "best_for", label: "Student-Facing Use" },
  { key: "pricing_type", label: "Pricing Model" },
  { key: "pricing_details", label: "Pricing Details" },
  { key: "integrations", label: "LMS Integration" },
  { key: "admin_integration_notes", label: "Admin Controls" },
  { key: "accessibility_notes", label: "Accessibility Notes" },
  { key: "editorial_verdict", label: "Editorial Recommendation" },
] as const;

const scoreDimensions = [
  { key: "ease_of_use" as const, label: "Ease of Use" },
  { key: "instructional_value" as const, label: "Instructional Value" },
  { key: "data_privacy" as const, label: "Data Privacy" },
  { key: "accessibility" as const, label: "Accessibility" },
];

function getCellValue(tool: NonNullable<ReturnType<typeof getToolById>>, key: string): string {
  switch (key) {
    case "category": return tool.categories.join(", ");
    case "audiences": return tool.audiences.join(", ");
    case "grade_bands": return tool.grade_bands.join(", ");
    case "instructional_fit": return tool.instructional_fit;
    case "best_for": return tool.best_for.join(", ");
    case "pricing_type": return tool.pricing_type;
    case "pricing_details": return tool.pricing_details;
    case "integrations": return tool.integrations.length > 0 ? tool.integrations.join(", ") : "None listed";
    case "admin_integration_notes": return tool.admin_integration_notes;
    case "accessibility_notes": return tool.accessibility_notes;
    case "editorial_verdict": return tool.editorial_verdict;
    default: return "";
  }
}

export function CompareContent() {
  const { selectedIds, remove, toggle, clear, setIds } = useCompare();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hydratedRef = useRef(false);
  const [copied, setCopied] = useState(false);

  // Hydrate from URL on first load only — never overwrite later in-session changes.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const urlIds = parseIds(searchParams.get("ids"));
    if (urlIds.length > 0) {
      // URL is the source of truth on hard navigation — overrides in-memory selection
      // so a shared link always shows what the sender intended.
      const valid = urlIds.filter((id) => getToolById(id));
      if (valid.length > 0) setIds(valid);
    }
  }, [searchParams, setIds]);

  // Keep URL in sync with selection (after hydration).
  useEffect(() => {
    if (!hydratedRef.current) return;
    const params = new URLSearchParams(searchParams.toString());
    if (selectedIds.length === 0) {
      params.delete("ids");
    } else {
      params.set("ids", selectedIds.join(","));
    }
    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    router.replace(next, { scroll: false });
  }, [selectedIds, pathname, router, searchParams]);

  const copyShareLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const selectedTools = selectedIds.map(getToolById).filter(Boolean);
  const availableTools = tools.filter((t) => !selectedIds.includes(t.id));

  if (selectedTools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="rounded-xl border border-border bg-white p-12 max-w-lg shadow-sm">
          <GitCompareArrows className="h-12 w-12 text-navy-200 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-bold text-navy mb-2">Compare AI Tools</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Select up to 4 tools from the directory to compare side-by-side across privacy, pricing, instructional fit, and more.
          </p>
          <Link href="/directory" className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
            Browse Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <nav aria-label="Breadcrumb" className="mb-2">
              <Link href="/directory" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy transition-colors">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Back to Directory
              </Link>
            </nav>
            <h1 className="text-2xl font-bold text-navy">Compare Tools</h1>
            <p className="mt-1 text-sm text-charcoal-light">Side-by-side comparison of {selectedTools.length} tool{selectedTools.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/rfp?ids=${selectedIds.slice(0, 3).join(",")}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-gold px-4 py-2 text-xs font-bold text-navy hover:bg-accent-gold-light transition-colors"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Generate RFP Pack
            </Link>
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-blue px-4 py-2 text-xs font-semibold text-white hover:bg-accent-blue/90 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Link copied
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Copy share link
                </>
              )}
            </button>
            <button onClick={clear} className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-charcoal hover:bg-navy-50 hover:text-navy transition-colors">
              Clear All
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Tool comparison">
              <thead>
                <tr className="border-b border-border bg-navy-50/50">
                  <th className="sticky left-0 z-10 bg-navy-50/95 backdrop-blur-sm w-[180px] min-w-[180px] p-4 text-left text-xs font-semibold text-muted-foreground" scope="col">Dimension</th>
                  {selectedTools.map((tool) => tool && (
                    <th key={tool.id} className="p-4 min-w-[220px]" scope="col">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-lg font-bold text-navy mb-2" aria-hidden="true">{tool.name.charAt(0)}</div>
                        <Link href={`/tool/${tool.slug}`} className="text-sm font-bold text-navy hover:text-accent-blue transition-colors">{tool.name}</Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{tool.vendor}</p>
                        <button onClick={() => remove(tool.id)} className="mt-2 text-xs text-muted-foreground hover:text-danger transition-colors flex items-center gap-1" aria-label={`Remove ${tool.name}`}>
                          <X className="h-3 w-3" aria-hidden="true" /> Remove
                        </button>
                      </div>
                    </th>
                  ))}
                  {selectedTools.length < 4 && (
                    <th className="p-4 min-w-[200px]" scope="col">
                      <label htmlFor="add-tool-select" className="sr-only">Add a tool to compare</label>
                      <select
                        id="add-tool-select"
                        onChange={(e) => { if (e.target.value) toggle(e.target.value); e.target.value = ""; }}
                        className="rounded-lg border-2 border-dashed border-gray-200 bg-navy-50/50 px-3 py-2 text-xs text-muted-foreground focus:outline-none focus:border-accent-blue"
                        defaultValue=""
                      >
                        <option value="" disabled>+ Add tool</option>
                        {availableTools.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Readiness Score */}
                <tr className="border-b border-border bg-accent-blue/5">
                  <td className="sticky left-0 z-10 bg-[#EEF4FB] backdrop-blur-sm p-4 text-xs font-bold text-accent-blue">District Readiness</td>
                  {selectedTools.map((tool) => tool && (
                    <td key={tool.id} className="p-4 text-center"><ScoreRingInline score={tool.overall_score} /></td>
                  ))}
                  {selectedTools.length < 4 && <td />}
                </tr>

                {/* Score Dimensions */}
                {scoreDimensions.map((dim) => (
                  <tr key={dim.key} className="border-b border-border">
                    <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm p-4 text-xs font-medium text-muted-foreground">{dim.label}</td>
                    {selectedTools.map((tool) => tool && (
                      <td key={tool.id} className="p-4 text-center text-sm font-semibold text-navy">{tool.scores[dim.key]}/10</td>
                    ))}
                    {selectedTools.length < 4 && <td />}
                  </tr>
                ))}

                {/* Privacy Status */}
                <tr className="border-b border-border bg-navy-50/30">
                  <td className="sticky left-0 z-10 bg-navy-50/95 backdrop-blur-sm p-4 text-xs font-bold text-navy">Privacy Status</td>
                  {selectedTools.map((tool) => tool && (
                    <td key={tool.id} className="p-4 text-center"><PrivacyBadge flag={tool.privacy_flag} /></td>
                  ))}
                  {selectedTools.length < 4 && <td />}
                </tr>

                {/* Compare Rows */}
                {compareRows.map((row) => (
                  <tr key={row.key} className="border-b border-border">
                    <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm p-4 text-xs font-medium text-muted-foreground">{row.label}</td>
                    {selectedTools.map((tool) => tool && (
                      <td key={tool.id} className="p-4">
                        {row.key === "pricing_type" ? <PricingBadge model={tool.pricing_type} /> :
                          <p className="text-xs text-charcoal leading-relaxed">{getCellValue(tool, row.key)}</p>
                        }
                      </td>
                    ))}
                    {selectedTools.length < 4 && <td />}
                  </tr>
                ))}

                {/* Compliance */}
                <tr className="border-b border-border">
                  <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm p-4 text-xs font-medium text-muted-foreground">Compliance Signals</td>
                  {selectedTools.map((tool) => tool && (
                    <td key={tool.id} className="p-4">
                      <div className="space-y-1.5">
                        {tool.compliance_signals.map((s) => (
                          <div key={s.label} className="flex items-center gap-2 text-xs">
                            <ComplianceDot status={s.status} />
                            {s.url ? (
                              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">{s.label}</a>
                            ) : (
                              <span className="text-charcoal">{s.label}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                  {selectedTools.length < 4 && <td />}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
