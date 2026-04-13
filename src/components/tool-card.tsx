"use client";

import Link from "next/link";
import type { Tool } from "@/lib/types";
import { PrivacyBadge, PricingBadge } from "./status-badge";
import { ScoreRingInline } from "./score-ring";
import { useCompare } from "@/lib/compare-context";
import { getTrackedUrl } from "@/lib/affiliate";
import { ToolLogo } from "./tool-logo";
import { ExternalLink, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

export function ToolCard({ tool, featured = false }: ToolCardProps) {
  const { toggle, isSelected } = useCompare();
  const selected = isSelected(tool.id);

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border bg-white p-5 transition-all duration-200",
        featured
          ? "border-accent-gold/40 shadow-[0_0_0_1px_rgba(197,165,90,0.1)] hover:shadow-lg hover:shadow-accent-gold/10"
          : "border-border hover:shadow-md hover:border-navy-200",
        selected && "ring-2 ring-accent-blue/30"
      )}
    >
      {/* Featured label */}
      {featured && (
        <div className="absolute -top-2.5 left-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold px-2.5 py-0.5 text-[10px] font-bold text-navy uppercase tracking-wider">
            <Star className="h-2.5 w-2.5" aria-hidden="true" /> Featured
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <ToolLogo name={tool.name} logoUrl={tool.logo_url} size="md" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-navy group-hover:text-accent-blue transition-colors truncate">
              <Link href={`/tool/${tool.slug}`} className="after:absolute after:inset-0">
                {tool.name}
              </Link>
            </h3>
            <p className="text-xs text-muted-foreground truncate">{tool.vendor}</p>
          </div>
        </div>
        <div className="relative z-10">
          <label className="sr-only">Add {tool.name} to comparison</label>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggle(tool.id)}
            className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue cursor-pointer"
            aria-label={`Add ${tool.name} to comparison`}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-charcoal-light leading-relaxed line-clamp-2 mb-3">
        {tool.description}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-medium text-navy-700">
          {tool.categories[0]}
        </span>
        <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-medium text-navy-700">
          {tool.grade_bands[0]}
          {tool.grade_bands.length > 1 && ` +${tool.grade_bands.length - 1}`}
        </span>
        {tool.audiences[0] && (
          <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-medium text-navy-700">
            {tool.audiences[0]}
          </span>
        )}
      </div>

      {/* Why it matters */}
      <p className="text-xs text-accent-blue font-medium mb-4 italic">
        &ldquo;{tool.editorial_verdict.split(".")[0]}.&rdquo;
      </p>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <PricingBadge model={tool.pricing_type} />
          <PrivacyBadge flag={tool.privacy_flag} />
        </div>
        <ScoreRingInline score={tool.overall_score} />
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-2 mt-3 relative z-10">
        <Link
          href={`/tool/${tool.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition-colors"
        >
          View Details <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
        <a
          href={getTrackedUrl(tool.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-50 transition-colors"
          aria-label={`Visit ${tool.name} website (opens in new tab)`}
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" /> Visit
        </a>
      </div>
    </article>
  );
}
