"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { tools, getToolById } from "@/lib/seed-data";
import { trackEvent } from "@/lib/track";
import { Printer, FileText, X, Plus, ArrowLeft, Calendar } from "lucide-react";
import "./rfp-print.css";

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function RfpClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedIds, setSelectedIds] = useState<string[]>(() => parseIds(searchParams.get("ids")));
  const [districtName, setDistrictName] = useState<string>(() => searchParams.get("district") || "");
  const [preparedFor, setPreparedFor] = useState<string>(() => searchParams.get("for") || "");

  // Sync everything to the URL (debounced by React's batching)
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedIds.length) params.set("ids", selectedIds.join(","));
    if (districtName.trim()) params.set("district", districtName.trim());
    if (preparedFor.trim()) params.set("for", preparedFor.trim());
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [selectedIds, districtName, preparedFor, pathname, router]);

  const addTool = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) || prev.length >= 3 ? prev : [...prev, id]));
  }, []);

  const removeTool = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const selectedTools = useMemo(
    () => selectedIds.map(getToolById).filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [selectedIds]
  );

  const availableTools = useMemo(
    () => tools.filter((t) => !selectedIds.includes(t.id)).sort((a, b) => a.name.localeCompare(b.name)),
    [selectedIds]
  );

  const handlePrint = useCallback(() => {
    // Fire-and-forget analytics for any vendors watching their dashboard.
    for (const id of selectedIds) trackEvent(id, "rfp_generate");
    window.print();
  }, [selectedIds]);

  return (
    <div className="bg-white min-h-screen">
      {/* ============ TOOLBAR (hidden when printing) ============ */}
      <section className="bg-navy-50/50 border-b border-border print:hidden" aria-labelledby="rfp-controls">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <nav aria-label="Breadcrumb" className="mb-2">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 text-xs text-charcoal-light hover:text-navy transition-colors"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Back to Compare
            </Link>
          </nav>
          <h1 id="rfp-controls" className="text-2xl font-bold text-navy">RFP / Procurement Pack</h1>
          <p className="mt-1 text-sm text-charcoal-light max-w-2xl">
            Pick up to 3 tools, customize the cover, then save the brief as a PDF for your board, RFP, or vendor review.
            Use your browser's <strong className="text-navy">Save as PDF</strong> option in the print dialog.
          </p>

          {/* District / "prepared for" inputs */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="district-input" className="block text-xs font-semibold text-charcoal mb-1">
                District / Organization
              </label>
              <input
                id="district-input"
                type="text"
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                placeholder="e.g., Maple Grove Unified"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
              />
            </div>
            <div>
              <label htmlFor="for-input" className="block text-xs font-semibold text-charcoal mb-1">
                Prepared for (optional)
              </label>
              <input
                id="for-input"
                type="text"
                value={preparedFor}
                onChange={(e) => setPreparedFor(e.target.value)}
                placeholder="e.g., Board of Education, Tech Committee"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
              />
            </div>
          </div>

          {/* Selected tools chips */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
              Tools in this brief ({selectedTools.length}/3)
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {selectedTools.map((tool) => (
                <span
                  key={tool.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy text-white px-3 py-1 text-xs font-semibold"
                >
                  {tool.name}
                  <button
                    onClick={() => removeTool(tool.id)}
                    className="rounded-full p-0.5 hover:bg-white/20 transition-colors"
                    aria-label={`Remove ${tool.name}`}
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
              {selectedTools.length < 3 && (
                <div className="relative">
                  <label htmlFor="add-tool" className="sr-only">Add tool to brief</label>
                  <select
                    id="add-tool"
                    onChange={(e) => {
                      if (e.target.value) addTool(e.target.value);
                      e.target.value = "";
                    }}
                    defaultValue=""
                    className="appearance-none rounded-full border border-dashed border-navy-200 bg-white pl-7 pr-8 py-1 text-xs font-semibold text-charcoal hover:bg-navy-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                  >
                    <option value="" disabled>Add tool…</option>
                    {availableTools.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} — {t.vendor}</option>
                    ))}
                  </select>
                  <Plus className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-charcoal-light pointer-events-none" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={selectedTools.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Printer className="h-4 w-4" aria-hidden="true" /> Print / Save as PDF
            </button>
            <Link
              href="/directory"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-charcoal hover:bg-navy-50 hover:text-navy transition-colors"
            >
              Browse directory
            </Link>
          </div>
        </div>
      </section>

      {/* ============ EMPTY STATE ============ */}
      {selectedTools.length === 0 && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center print:hidden">
          <FileText className="h-12 w-12 text-navy-200 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-xl font-bold text-navy mb-2">Add a tool to begin</h2>
          <p className="text-sm text-charcoal-light max-w-md mx-auto">
            Pick up to 3 tools above and a board-ready brief will appear below. You can also start by
            comparing tools and clicking "Generate RFP Pack" from the{" "}
            <Link href="/compare" className="text-accent-blue hover:underline">compare page</Link>.
          </p>
        </section>
      )}

      {/* ============ PRINTABLE DOCUMENT ============ */}
      {selectedTools.length > 0 && (
        <article className="rfp-doc mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 print:py-0 print:px-0 print:max-w-none">
          {/* Cover page */}
          <section className="rfp-page rfp-cover">
            <div className="border-b-4 border-navy pb-6 mb-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-blue mb-2">
                AI Tool Procurement Brief
              </p>
              <h2 className="text-4xl font-bold text-navy leading-tight tracking-tight">
                {districtName.trim() || "District AI Tool Evaluation"}
              </h2>
              {preparedFor.trim() && (
                <p className="mt-3 text-base text-charcoal">Prepared for: <strong className="text-navy">{preparedFor.trim()}</strong></p>
              )}
              <div className="mt-4 flex items-center gap-2 text-xs text-charcoal-light">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>Generated {todayLabel()} · District AI Index</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-navy mb-2">Tools evaluated</h3>
                <ul className="space-y-2">
                  {selectedTools.map((tool) => (
                    <li key={tool.id} className="flex items-start gap-3">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-blue shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-bold text-navy">{tool.name} <span className="font-normal text-charcoal-light">— {tool.vendor}</span></p>
                        <p className="text-xs text-charcoal-light">{tool.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-navy-50 border border-navy-100 p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy mb-2">About this brief</h3>
                <p className="text-xs text-charcoal leading-relaxed">
                  Each tool below has been independently evaluated by the District AI Index editorial team
                  across five dimensions: ease of use, instructional value, data privacy, accessibility,
                  and admin/integration. Scores are out of 10, weighted equally. Privacy posture is derived
                  from documented FERPA/COPPA compliance, DPA availability, and SOC 2 attestation.
                </p>
                <p className="mt-2 text-xs text-charcoal leading-relaxed">
                  This brief is a starting point — districts should validate vendor claims, request a current
                  Data Privacy Agreement (DPA), and confirm pricing for their seat count before committing.
                </p>
              </div>
            </div>
          </section>

          {/* Summary comparison table */}
          <section className="rfp-page mt-12 print:mt-0">
            <h2 className="text-2xl font-bold text-navy mb-4 pb-2 border-b border-border">
              At-a-glance comparison
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th scope="col" className="text-left py-2 pr-3 text-[10px] font-bold uppercase tracking-wider text-charcoal">Dimension</th>
                  {selectedTools.map((tool) => (
                    <th key={tool.id} scope="col" className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-wider text-charcoal">
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs text-charcoal">
                <RfpRow label="Vendor" cells={selectedTools.map((t) => t.vendor)} />
                <RfpRow label="Pricing" cells={selectedTools.map((t) => t.pricing_type)} />
                <RfpRow label="Privacy" cells={selectedTools.map((t) => t.privacy_flag)} bold />
                <RfpRow label="Accessibility" cells={selectedTools.map((t) => t.accessibility_level)} />
                <RfpRow label="Categories" cells={selectedTools.map((t) => t.categories.slice(0, 2).join(", "))} />
                <RfpRow label="Grade Bands" cells={selectedTools.map((t) => t.grade_bands.join(", "))} />
                <tr className="border-t border-border">
                  <td className="py-2 pr-3 text-[10px] font-bold uppercase tracking-wider text-charcoal">Overall Score</td>
                  {selectedTools.map((tool) => (
                    <td key={tool.id} className="py-2 px-3 text-base font-bold text-navy">
                      {tool.overall_score.toFixed(1)}<span className="text-xs font-normal text-charcoal-light">/10</span>
                    </td>
                  ))}
                </tr>
                <RfpRow label="Ease of Use" cells={selectedTools.map((t) => `${t.scores.ease_of_use}/10`)} />
                <RfpRow label="Instructional Value" cells={selectedTools.map((t) => `${t.scores.instructional_value}/10`)} />
                <RfpRow label="Data Privacy" cells={selectedTools.map((t) => `${t.scores.data_privacy}/10`)} />
                <RfpRow label="Accessibility (score)" cells={selectedTools.map((t) => `${t.scores.accessibility}/10`)} />
                <RfpRow label="VPAT" cells={selectedTools.map((t) => formatVpat(t.vpat_status))} />
                <RfpRow label="Last Reviewed" cells={selectedTools.map((t) => t.last_reviewed)} />
              </tbody>
            </table>
          </section>

          {/* Per-tool detail pages */}
          {selectedTools.map((tool) => (
            <section key={tool.id} className="rfp-page mt-12 print:mt-0 page-break-before">
              <header className="mb-4 pb-3 border-b-2 border-navy">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent-blue">Tool Detail</p>
                <h2 className="text-2xl font-bold text-navy">{tool.name}</h2>
                <p className="text-sm text-charcoal-light">{tool.vendor} · <a href={tool.website} className="text-accent-blue hover:underline">{tool.website}</a></p>
              </header>

              <p className="text-sm text-charcoal leading-relaxed mb-5">{tool.overview}</p>

              <div className="grid grid-cols-2 gap-5 mb-5">
                <DetailBlock title="Best for">
                  <ul className="text-xs text-charcoal space-y-1">
                    {tool.best_for.map((item) => <li key={item}>· {item}</li>)}
                  </ul>
                </DetailBlock>
                <DetailBlock title="Not ideal for">
                  <ul className="text-xs text-charcoal space-y-1">
                    {tool.not_ideal_for.map((item) => <li key={item}>· {item}</li>)}
                  </ul>
                </DetailBlock>
              </div>

              <div className="space-y-4">
                <DetailBlock title="Privacy & compliance">
                  <p className="text-xs text-charcoal leading-relaxed mb-2">{tool.privacy_notes}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tool.compliance_signals.map((s) => (
                      <span
                        key={s.label}
                        className="inline-flex items-center gap-1 rounded-full border border-navy-100 bg-navy-50 px-2 py-0.5 text-[10px] font-semibold text-navy"
                      >
                        {s.label} {s.status === "available" ? "✓" : s.status === "partial" ? "~" : s.status === "unavailable" ? "✗" : "?"}
                      </span>
                    ))}
                  </div>
                </DetailBlock>

                <DetailBlock title="Accessibility">
                  <p className="text-xs text-charcoal leading-relaxed">{tool.accessibility_notes}</p>
                  <p className="text-xs text-charcoal-light mt-1">
                    VPAT: {formatVpat(tool.vpat_status)}
                    {tool.vpat_url && (
                      <> · <a href={tool.vpat_url} className="text-accent-blue hover:underline">view document</a></>
                    )}
                  </p>
                </DetailBlock>

                <DetailBlock title="Implementation & integration">
                  <p className="text-xs text-charcoal leading-relaxed">{tool.implementation_notes}</p>
                  {tool.integrations.length > 0 && (
                    <p className="text-xs text-charcoal-light mt-1">
                      Integrations: <span className="text-charcoal">{tool.integrations.join(", ")}</span>
                    </p>
                  )}
                </DetailBlock>

                <DetailBlock title="Pricing">
                  <p className="text-xs text-charcoal leading-relaxed">
                    <strong className="text-navy">{tool.pricing_type}</strong> — {tool.pricing_details}
                  </p>
                </DetailBlock>

                <DetailBlock title="Editorial verdict">
                  <p className="text-xs text-charcoal leading-relaxed italic">"{tool.editorial_verdict}"</p>
                  <p className="text-[10px] text-charcoal-light mt-1">— District AI Index editorial, last reviewed {tool.last_reviewed}</p>
                </DetailBlock>
              </div>
            </section>
          ))}

          {/* Methodology footer */}
          <section className="rfp-page mt-12 print:mt-0 page-break-before pt-6 border-t-2 border-navy">
            <h2 className="text-lg font-bold text-navy mb-3">Methodology & disclosures</h2>
            <div className="space-y-3 text-xs text-charcoal leading-relaxed">
              <p>
                <strong className="text-navy">Scoring:</strong> Each tool is scored 0–10 across four
                dimensions (ease of use, instructional value, data privacy, accessibility). The overall
                score is an unweighted average. For a custom-weighted view, visit{" "}
                <span className="text-accent-blue">districtaiindex.com/scorecard</span>.
              </p>
              <p>
                <strong className="text-navy">Privacy posture</strong> is determined from publicly
                available FERPA/COPPA compliance documentation, DPA availability, SOC 2 status, and
                stated data-handling practices. "District Ready" requires all four. Districts should
                independently verify before signing.
              </p>
              <p>
                <strong className="text-navy">No paid placement:</strong> Editorial scores and rankings
                are not influenced by sponsorship. Featured listings and sponsored placements are
                disclosed where they appear.
              </p>
              <p>
                <strong className="text-navy">Sources:</strong> Vendor documentation, public privacy
                policies, VPAT/ACR filings, and hands-on editorial review. Last reviewed dates are
                captured per tool.
              </p>
              <p className="pt-3 border-t border-border text-charcoal-light">
                Prepared with District AI Index · districtaiindex.com · This brief is informational and
                does not constitute a recommendation. Always validate with the vendor and your legal
                counsel before procurement.
              </p>
            </div>
          </section>
        </article>
      )}
    </div>
  );
}

function RfpRow({ label, cells, bold = false }: { label: string; cells: string[]; bold?: boolean }) {
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-3 text-[10px] font-bold uppercase tracking-wider text-charcoal">{label}</td>
      {cells.map((value, i) => (
        <td key={i} className={bold ? "py-2 px-3 font-bold text-navy" : "py-2 px-3"}>
          {value}
        </td>
      ))}
    </tr>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-accent-blue mb-1">{title}</h3>
      {children}
    </div>
  );
}

function formatVpat(status: string): string {
  switch (status) {
    case "available": return "Available";
    case "on_request": return "On request";
    case "not_available": return "Not available";
    default: return "Unknown";
  }
}
