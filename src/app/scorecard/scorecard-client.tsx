"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { tools } from "@/lib/seed-data";
import { ScoreRingInline } from "@/components/score-ring";
import { PrivacyBadge, PricingBadge } from "@/components/status-badge";
import { ToolLogo } from "@/components/tool-logo";
import { useCompare } from "@/lib/compare-context";
import { Sliders, RotateCcw, Link2, Check, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type DimensionKey = "ease_of_use" | "instructional_value" | "data_privacy" | "accessibility";

interface Dimension {
  key: DimensionKey;
  shortKey: "eu" | "iv" | "dp" | "ac";
  label: string;
  helper: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: "ease_of_use",
    shortKey: "eu",
    label: "Ease of Use",
    helper: "How quickly teachers can adopt without IT lift or steep training.",
  },
  {
    key: "instructional_value",
    shortKey: "iv",
    label: "Instructional Value",
    helper: "Pedagogical fit, standards alignment, and impact on learning outcomes.",
  },
  {
    key: "data_privacy",
    shortKey: "dp",
    label: "Data Privacy",
    helper: "FERPA/COPPA posture, DPA availability, and student-data protections.",
  },
  {
    key: "accessibility",
    shortKey: "ac",
    label: "Accessibility",
    helper: "VPAT, WCAG conformance, and support for learners with disabilities.",
  },
];

const IMPORTANCE_LABELS = ["Optional", "Nice to Have", "Important", "Critical", "Essential"] as const;

interface Preset {
  id: string;
  label: string;
  blurb: string;
  weights: Record<DimensionKey, number>;
}

const PRESETS: Preset[] = [
  {
    id: "balanced",
    label: "Balanced",
    blurb: "Even weight across all four dimensions — the editorial default.",
    weights: { ease_of_use: 3, instructional_value: 3, data_privacy: 3, accessibility: 3 },
  },
  {
    id: "privacy-first",
    label: "Privacy-First District",
    blurb: "Compliance-driven; nothing ships without strong DPAs and clear data posture.",
    weights: { ease_of_use: 2, instructional_value: 3, data_privacy: 5, accessibility: 4 },
  },
  {
    id: "pedagogy-first",
    label: "Pedagogy-First",
    blurb: "Curriculum and instructional impact lead; IT lift is a secondary concern.",
    weights: { ease_of_use: 2, instructional_value: 5, data_privacy: 3, accessibility: 3 },
  },
  {
    id: "lean-it",
    label: "Resource-Constrained IT",
    blurb: "Small team, no budget for change management — ease of rollout dominates.",
    weights: { ease_of_use: 5, instructional_value: 3, data_privacy: 3, accessibility: 2 },
  },
  {
    id: "equity",
    label: "Equity & Access",
    blurb: "Accessibility and safety lead; serves districts with diverse learner needs.",
    weights: { ease_of_use: 3, instructional_value: 3, data_privacy: 4, accessibility: 5 },
  },
];

function clampWeight(n: number): number {
  if (Number.isNaN(n)) return 3;
  return Math.max(1, Math.min(5, Math.round(n)));
}

function parseWeights(params: URLSearchParams): Record<DimensionKey, number> {
  const out: Record<DimensionKey, number> = {
    ease_of_use: 3,
    instructional_value: 3,
    data_privacy: 3,
    accessibility: 3,
  };
  for (const dim of DIMENSIONS) {
    const v = params.get(dim.shortKey);
    if (v !== null) out[dim.key] = clampWeight(Number(v));
  }
  return out;
}

function weightsAreDefault(w: Record<DimensionKey, number>): boolean {
  return DIMENSIONS.every((d) => w[d.key] === 3);
}

function computeCustomScore(scores: Record<DimensionKey, number>, weights: Record<DimensionKey, number>): number {
  const totalWeight = DIMENSIONS.reduce((sum, d) => sum + weights[d.key], 0);
  if (totalWeight === 0) return 0;
  const weighted = DIMENSIONS.reduce((sum, d) => sum + scores[d.key] * weights[d.key], 0);
  return Math.round((weighted / totalWeight) * 10) / 10;
}

export function ScorecardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toggle, isSelected } = useCompare();

  const [weights, setWeights] = useState<Record<DimensionKey, number>>(() =>
    parseWeights(new URLSearchParams(searchParams.toString()))
  );
  const [copied, setCopied] = useState(false);

  // Sync URL when weights change (debounced via React batch)
  useEffect(() => {
    const params = new URLSearchParams();
    for (const dim of DIMENSIONS) {
      if (weights[dim.key] !== 3) params.set(dim.shortKey, String(weights[dim.key]));
    }
    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    router.replace(next, { scroll: false });
  }, [weights, pathname, router]);

  const updateWeight = useCallback((key: DimensionKey, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: clampWeight(value) }));
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) setWeights(preset.weights);
  }, []);

  const reset = useCallback(() => {
    setWeights({ ease_of_use: 3, instructional_value: 3, data_privacy: 3, accessibility: 3 });
  }, []);

  const copyShareLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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

  const ranked = useMemo(() => {
    // Compute custom score, then rank by it. Track delta vs editorial overall_score.
    const editorialRanks = new Map<string, number>();
    [...tools]
      .sort((a, b) => b.overall_score - a.overall_score)
      .forEach((t, i) => editorialRanks.set(t.id, i + 1));

    const withCustom = tools.map((t) => {
      const customScore = computeCustomScore(t.scores, weights);
      return {
        tool: t,
        customScore,
        editorialRank: editorialRanks.get(t.id) ?? 0,
      };
    });

    withCustom.sort((a, b) => {
      if (b.customScore !== a.customScore) return b.customScore - a.customScore;
      return b.tool.overall_score - a.tool.overall_score;
    });

    return withCustom.map((row, i) => ({
      ...row,
      customRank: i + 1,
      delta: row.editorialRank - (i + 1), // positive = moved up
    }));
  }, [weights]);

  const isDefault = weightsAreDefault(weights);
  const totalImportance = DIMENSIONS.reduce((sum, d) => sum + weights[d.key], 0);

  return (
    <div className="bg-white min-h-screen">
      {/* ============ HEADER ============ */}
      <section className="bg-navy text-white" aria-labelledby="scorecard-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white">
              <Sliders className="h-3 w-3" aria-hidden="true" /> Custom Scorecard
            </span>
          </div>
          <h1 id="scorecard-heading" className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            Re-rank tools by what your district values most
          </h1>
          <p className="mt-3 text-base text-navy-100 max-w-2xl leading-relaxed">
            Our editorial scores weight each dimension equally. If your priorities differ — say, privacy
            outranks ease of use — adjust the sliders below. The directory will re-rank live, and you can
            share the URL with your team.
          </p>
        </div>
      </section>

      {/* ============ CONTROLS ============ */}
      <section className="bg-navy-50/50 border-b border-border" aria-labelledby="weights-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 id="weights-heading" className="sr-only">Weight controls and presets</h2>

          {/* Presets */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
              Quick start with a preset
            </p>
            <div className="flex items-start gap-2 flex-wrap" role="radiogroup" aria-label="Scoring presets">
              {PRESETS.map((preset) => {
                const active = DIMENSIONS.every((d) => weights[d.key] === preset.weights[d.key]);
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-charcoal border-border hover:bg-navy-50 hover:border-navy-200"
                    )}
                    role="radio"
                    aria-checked={active}
                    title={preset.blurb}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
              Adjust dimension importance
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {DIMENSIONS.map((dim) => {
                const value = weights[dim.key];
                const sliderId = `slider-${dim.shortKey}`;
                return (
                  <div key={dim.key} className="rounded-xl border border-border bg-white p-4">
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor={sliderId} className="text-sm font-bold text-navy">
                        {dim.label}
                      </label>
                      <span
                        className="rounded-full bg-navy-50 px-2.5 py-0.5 text-[11px] font-bold text-navy"
                        aria-hidden="true"
                      >
                        {IMPORTANCE_LABELS[value - 1]}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-light mb-3 leading-relaxed">{dim.helper}</p>
                    <div className="flex items-center gap-3">
                      <input
                        id={sliderId}
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={value}
                        onChange={(e) => updateWeight(dim.key, Number(e.target.value))}
                        className="flex-1 h-2 rounded-full bg-navy-100 appearance-none cursor-pointer accent-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:ring-offset-2"
                        aria-valuemin={1}
                        aria-valuemax={5}
                        aria-valuenow={value}
                        aria-valuetext={IMPORTANCE_LABELS[value - 1]}
                      />
                      <span className="text-sm font-bold text-navy tabular-nums w-6 text-right" aria-hidden="true">
                        {value}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-charcoal-light" aria-hidden="true">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </fieldset>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-2 flex-wrap">
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
            {!isDefault && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-charcoal hover:bg-navy-50 hover:text-navy transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset to balanced
              </button>
            )}
            <p className="text-xs text-charcoal-light ml-auto" aria-live="polite">
              Total importance: <strong className="text-navy">{totalImportance}</strong> · Showing {ranked.length} tools
            </p>
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="results-heading">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 id="results-heading" className="text-xl font-bold text-navy">
              Tools ranked by your priorities
            </h2>
            <p className="mt-1 text-sm text-charcoal-light">
              {isDefault
                ? "Move a slider above to see the ranking change."
                : "Custom score is the weighted average of each tool's four dimension scores using your importance values."}
            </p>
          </div>
          <Link
            href="/directory"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-accent-blue hover:text-navy transition-colors"
          >
            Browse full directory <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Tools ranked by custom weighting">
              <thead className="bg-navy-50/50">
                <tr>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal w-12">
                    Rank
                  </th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal">
                    Tool
                  </th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal hidden md:table-cell">
                    Privacy
                  </th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal hidden md:table-cell">
                    Pricing
                  </th>
                  <th scope="col" className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal">
                    Editorial
                  </th>
                  <th scope="col" className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal">
                    Your score
                  </th>
                  <th scope="col" className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal hidden sm:table-cell">
                    Movement
                  </th>
                  <th scope="col" className="py-3 px-4 w-20"><span className="sr-only">Compare</span></th>
                </tr>
              </thead>
              <tbody>
                {ranked.map(({ tool, customScore, customRank, delta }) => {
                  const selected = isSelected(tool.id);
                  return (
                    <tr key={tool.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy" aria-label={`Rank ${customRank}`}>
                          {customRank}
                        </span>
                      </td>
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
                      <td className="py-3 px-4 hidden md:table-cell">
                        <PrivacyBadge flag={tool.privacy_flag} />
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <PricingBadge model={tool.pricing_type} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-xs text-charcoal-light tabular-nums">{tool.overall_score.toFixed(1)}/10</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ScoreRingInline score={customScore} />
                      </td>
                      <td className="py-3 px-4 text-center hidden sm:table-cell">
                        <MovementIndicator delta={delta} isDefault={isDefault} />
                      </td>
                      <td className="py-3 px-4">
                        <label className="flex items-center justify-center cursor-pointer">
                          <span className="sr-only">Add {tool.name} to comparison</span>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggle(tool.id)}
                            className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue cursor-pointer"
                          />
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-charcoal-light">
          Custom scores are calculated from each tool's four published dimension scores using the weights you set.
          Editorial scores are unweighted averages reviewed by our team.{" "}
          <Link href="/#methodology" className="text-accent-blue hover:underline">
            Learn how we evaluate tools
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function MovementIndicator({ delta, isDefault }: { delta: number; isDefault: boolean }) {
  if (isDefault || delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-charcoal-light" aria-label="No change">
        <Minus className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">No change in rank</span>
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success" aria-label={`Up ${delta} ranks`}>
        <TrendingUp className="h-3 w-3" aria-hidden="true" /> {delta}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-danger" aria-label={`Down ${Math.abs(delta)} ranks`}>
      <TrendingDown className="h-3 w-3" aria-hidden="true" /> {Math.abs(delta)}
    </span>
  );
}
