"use client";

import { useParams } from "next/navigation";
import { getToolBySlug, getSimilarTools } from "@/lib/seed-data";
import { useCompare } from "@/lib/compare-context";
import { getTrackedUrl } from "@/lib/affiliate";
import { PrivacyBadge, PricingBadge, TierBadge, ComplianceDot } from "@/components/status-badge";
import { ScoreRingInline } from "@/components/score-ring";
import Link from "next/link";
import {
  ExternalLink, GitCompareArrows, Mail, Shield,
  CheckCircle2, XCircle, Sparkles, BookOpen, Settings,
  Eye, Accessibility, FileText, ArrowLeft, ThumbsUp, ThumbsDown,
  Star, Calendar, Users, Download, FileDown, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const scoreDimensions = [
  { key: "ease_of_use" as const, label: "Ease of Use", icon: Settings, max: 10 },
  { key: "instructional_value" as const, label: "Instructional Value", icon: BookOpen, max: 10 },
  { key: "data_privacy" as const, label: "Data Privacy", icon: Shield, max: 10 },
  { key: "accessibility" as const, label: "Accessibility", icon: Users, max: 10 },
];

export default function ToolProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const tool = getToolBySlug(slug);
  const { toggle, isSelected } = useCompare();

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-xl font-bold text-navy">Tool not found</p>
        <p className="text-sm text-muted-foreground mt-1">The tool you&apos;re looking for doesn&apos;t exist in our directory.</p>
        <Link href="/directory" className="mt-4 text-sm font-semibold text-accent-blue hover:text-navy transition-colors">
          &larr; Back to Directory
        </Link>
      </div>
    );
  }

  const similar = getSimilarTools(tool);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-navy-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/directory" className="hover:text-navy transition-colors">Directory</Link>
            <span aria-hidden="true">/</span>
            <span className="text-navy font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <div className="rounded-xl border border-border p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-navy-50 text-2xl font-bold text-navy shrink-0" aria-hidden="true">
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-navy">{tool.name}</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">by {tool.vendor}</p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <PricingBadge model={tool.pricing_type} />
                      <PrivacyBadge flag={tool.privacy_flag} />
                      <TierBadge tier={tool.listing_tier} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-6">
                <a
                  href={getTrackedUrl(tool.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
                  aria-label={`Visit ${tool.name} website (opens in new tab)`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> Visit Tool
                </a>
                <button
                  onClick={() => toggle(tool.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors",
                    isSelected(tool.id)
                      ? "border-accent-blue bg-accent-blue/5 text-accent-blue"
                      : "border-border text-charcoal-light hover:bg-navy-50 hover:text-navy"
                  )}
                  aria-pressed={isSelected(tool.id)}
                >
                  <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
                  {isSelected(tool.id) ? "Added to Compare" : "Add to Compare"}
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-charcoal-light hover:bg-navy-50 hover:text-navy transition-colors">
                  <Star className="h-4 w-4" aria-hidden="true" /> Save to Favorites
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-charcoal-light hover:bg-navy-50 hover:text-navy transition-colors">
                  <Mail className="h-4 w-4" aria-hidden="true" /> Request Demo
                </button>
              </div>
            </div>

            {/* Overview */}
            <Section title="Overview" icon={BookOpen}>
              <p className="text-sm text-charcoal leading-relaxed">{tool.overview}</p>
            </Section>

            {/* Best For / Not Ideal For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-success/20 bg-success-bg/50 p-6">
                <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-success" aria-hidden="true" /> Best For
                </h3>
                <ul className="space-y-2.5" role="list">
                  {tool.best_for.map((item) => (
                    <li key={item} className="text-sm text-charcoal flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-danger/10 bg-danger-bg/50 p-6">
                <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-danger" aria-hidden="true" /> Not Ideal For
                </h3>
                <ul className="space-y-2.5" role="list">
                  {tool.not_ideal_for.map((item) => (
                    <li key={item} className="text-sm text-charcoal flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-danger shrink-0 mt-0.5" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Features */}
            <Section title="Key Features" icon={Sparkles}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.key_features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-charcoal">
                    <CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                    {f}
                  </div>
                ))}
              </div>
            </Section>

            {/* Instructional Fit */}
            <Section title="Instructional Fit" icon={BookOpen}>
              <p className="text-sm text-charcoal leading-relaxed">{tool.instructional_fit}</p>
            </Section>

            {/* Implementation Notes */}
            <Section title="Implementation Notes" icon={Settings}>
              <p className="text-sm text-charcoal leading-relaxed">{tool.implementation_notes}</p>
            </Section>

            {/* Privacy & Data — CRITICAL section */}
            <div className="rounded-xl border-2 border-navy-200 bg-navy-50/30 p-6">
              <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Privacy &amp; Data Notes
              </h3>
              <p className="text-sm text-charcoal leading-relaxed mb-4">{tool.privacy_notes}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tool.compliance_signals.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-sm">
                    <ComplianceDot status={s.status} />
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-blue hover:text-navy underline decoration-accent-blue/30 hover:decoration-navy transition-colors font-medium"
                        aria-label={`${s.label} — view documentation (opens in new tab)`}
                      >
                        {s.label}
                        <ExternalLink className="inline h-3 w-3 ml-1 -mt-0.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="text-charcoal">{s.label}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" /> Verified
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-accent-gold" aria-hidden="true" /> Partial
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-danger" aria-hidden="true" /> Unavailable
                </span>
              </div>
            </div>

            {/* Accessibility Notes */}
            <Section title="Accessibility Notes" icon={Accessibility}>
              <p className="text-sm text-charcoal leading-relaxed">{tool.accessibility_notes}</p>
            </Section>

            {/* VPAT / ACR Document */}
            <div className={cn(
              "rounded-xl border-2 p-6",
              tool.vpat_status === "available" ? "border-success/30 bg-success-bg/30" :
              tool.vpat_status === "on_request" ? "border-accent-blue/20 bg-accent-blue/5" :
              "border-border bg-navy-50/30"
            )}>
              <h3 className="text-base font-bold text-navy mb-3 flex items-center gap-2">
                <FileDown className="h-5 w-5 text-accent-blue" aria-hidden="true" />
                VPAT / Accessibility Conformance Report
              </h3>

              {tool.vpat_status === "available" && tool.vpat_url && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                    <span className="text-sm font-semibold text-success">VPAT/ACR Available for Download</span>
                  </div>
                  <p className="text-sm text-charcoal leading-relaxed">{tool.vpat_notes}</p>
                  <a
                    href={tool.vpat_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
                    aria-label={`Download VPAT/ACR for ${tool.name} (opens in new tab)`}
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Download VPAT/ACR
                  </a>
                </div>
              )}

              {tool.vpat_status === "on_request" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-accent-blue" aria-hidden="true" />
                    <span className="text-sm font-semibold text-accent-blue">VPAT/ACR Available on Request</span>
                  </div>
                  <p className="text-sm text-charcoal leading-relaxed">{tool.vpat_notes}</p>
                  {tool.vpat_url && (
                    <a
                      href={tool.vpat_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-accent-blue text-accent-blue px-4 py-2.5 text-sm font-semibold hover:bg-accent-blue/5 transition-colors"
                      aria-label={`View accessibility information for ${tool.name} (opens in new tab)`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      View Accessibility Info
                    </a>
                  )}
                </div>
              )}

              {(tool.vpat_status === "not_available" || tool.vpat_status === "unknown") && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm font-semibold text-muted-foreground">VPAT/ACR Not Publicly Available</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.vpat_notes}</p>
                  <p className="text-xs text-muted-foreground italic">
                    Districts should request VPAT/ACR documentation directly from the vendor during procurement evaluation.
                  </p>
                </div>
              )}
            </div>

            {/* Admin & Integration */}
            <Section title="Admin & Integration" icon={Settings}>
              <p className="text-sm text-charcoal leading-relaxed">{tool.admin_integration_notes}</p>
            </Section>

            {/* Editorial Verdict */}
            <div className="rounded-xl border border-accent-gold/30 bg-[#FFFBF0] p-6">
              <h3 className="text-base font-bold text-navy mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent-gold" aria-hidden="true" /> Editorial Verdict
              </h3>
              <p className="text-sm text-charcoal leading-relaxed italic">
                &ldquo;{tool.editorial_verdict}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                — District AI Index Editorial Team, reviewed {tool.last_reviewed}
              </p>
            </div>
          </div>

          {/* Sticky Side Panel */}
          <aside className="space-y-6" aria-label="Tool details sidebar">
            <div className="sticky top-20 space-y-6">
              {/* Score Breakdown */}
              <div className="rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-navy mb-2">Overall Score</h3>
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-4xl font-bold text-navy">{tool.overall_score}</div>
                  <div className="text-xs text-muted-foreground leading-tight">out of<br />10 points</div>
                </div>
                <div className="space-y-4">
                  {scoreDimensions.map((dim) => {
                    const val = tool.scores[dim.key];
                    const pct = (val / dim.max) * 100;
                    return (
                      <div key={dim.key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-charcoal-light">{dim.label}</span>
                          <span className="text-xs font-bold text-navy">{val}/{dim.max}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-valuenow={val} aria-valuemin={0} aria-valuemax={dim.max} aria-label={`${dim.label}: ${val} out of 20`}>
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              pct >= 85 ? "bg-success" : pct >= 70 ? "bg-warning" : "bg-danger"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing */}
              <div className="rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-navy mb-3">Pricing</h3>
                <PricingBadge model={tool.pricing_type} />
                <p className="text-sm text-muted-foreground mt-2">{tool.pricing_details}</p>
              </div>

              {/* Integrations */}
              {tool.integrations.length > 0 && (
                <div className="rounded-xl border border-border p-6">
                  <h3 className="text-sm font-bold text-navy mb-3">Integrations</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.integrations.map((i) => (
                      <span key={i} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700">{i}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Info */}
              <div className="rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-navy mb-3">Review Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Reviewed</dt>
                    <dd className="font-medium text-navy">{tool.last_reviewed}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Grade Bands</dt>
                    <dd className="font-medium text-navy">{tool.grade_bands.join(", ")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Audiences</dt>
                    <dd className="font-medium text-navy text-right">{tool.audiences.join(", ")}</dd>
                  </div>
                </dl>
                {tool.reviewer_notes && (
                  <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border italic">
                    {tool.reviewer_notes}
                  </p>
                )}
              </div>

              {/* Similar Tools */}
              {similar.length > 0 && (
                <div className="rounded-xl border border-border p-6">
                  <h3 className="text-sm font-bold text-navy mb-3">Similar Tools</h3>
                  <div className="space-y-2">
                    {similar.map((s) => (
                      <Link
                        key={s.id}
                        href={`/tool/${s.slug}`}
                        className="flex items-center justify-between rounded-lg bg-navy-50/50 p-3 hover:bg-navy-50 transition-colors group"
                      >
                        <span className="text-sm font-medium text-navy group-hover:text-accent-blue transition-colors">{s.name}</span>
                        <ScoreRingInline score={s.overall_score} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border p-6" aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h3 id={`section-${title.toLowerCase().replace(/\s+/g, "-")}`} className="text-base font-bold text-navy mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-accent-blue" aria-hidden="true" /> {title}
      </h3>
      {children}
    </section>
  );
}
