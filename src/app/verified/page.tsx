"use client";

import { tools } from "@/lib/seed-data";
import { PrivacyBadge, PricingBadge, ComplianceDot } from "@/components/status-badge";
import { ScoreRingInline } from "@/components/score-ring";
import Link from "next/link";
import { ShieldCheck, FileCheck, FileText, Accessibility, Settings, Calendar, Star } from "lucide-react";

export default function VerifiedPage() {
  const verifiedTools = tools.filter((t) => t.is_featured || t.privacy_flag === "District Ready");

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-navy py-12" aria-labelledby="verified-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/10 p-3 shrink-0" aria-hidden="true">
              <ShieldCheck className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h1 id="verified-heading" className="text-2xl font-bold text-white">Verified District Ready</h1>
              <p className="mt-2 text-sm text-navy-200 max-w-2xl leading-relaxed">
                These tools have been independently evaluated by our editorial team and meet the highest standards for privacy, compliance, usability, and instructional value.
              </p>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                {[
                  { icon: FileCheck, label: "Privacy packet verified" },
                  { icon: FileText, label: "DPA available" },
                  { icon: Accessibility, label: "Accessibility documented" },
                  { icon: Settings, label: "Admin controls available" },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5 text-xs text-navy-200">
                    <item.icon className="h-3.5 w-3.5 text-green-400" aria-hidden="true" /> {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {verifiedTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tool/${tool.slug}`}
              className="group rounded-xl border border-border bg-white p-6 hover:shadow-md hover:border-success/30 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-lg font-bold text-navy shrink-0" aria-hidden="true">{tool.name.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-navy group-hover:text-accent-blue transition-colors">{tool.name}</h2>
                      <ShieldCheck className="h-4 w-4 text-success" aria-label="Verified" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">by {tool.vendor}</p>
                  </div>
                </div>
                <ScoreRingInline score={tool.overall_score} />
              </div>
              <p className="text-sm text-charcoal-light leading-relaxed mb-4">{tool.description}</p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <PricingBadge model={tool.pricing_type} />
                <PrivacyBadge flag={tool.privacy_flag} />
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {tool.compliance_signals.slice(0, 4).map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-xs">
                    <ComplianceDot status={s.status} />
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline" onClick={(e) => e.stopPropagation()} aria-label={`${s.label} documentation`}>
                        {s.label}
                      </a>
                    ) : (
                      <span className="text-charcoal-light">{s.label}</span>
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-charcoal-light">
                  <ComplianceDot status={tool.vpat_status === "available" ? "available" : tool.vpat_status === "on_request" ? "partial" : "unavailable"} />
                  VPAT/ACR {tool.vpat_status === "available" ? "Available" : tool.vpat_status === "on_request" ? "On Request" : "Not Published"}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" aria-hidden="true" /> Reviewed {tool.last_reviewed}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" aria-hidden="true" /> {tool.listing_tier === "verified" ? "Verified Listing" : "District Ready"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic line-clamp-2">&ldquo;{tool.editorial_verdict}&rdquo;</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
