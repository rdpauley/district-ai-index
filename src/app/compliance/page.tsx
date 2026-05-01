import type { Metadata } from "next";
import Link from "next/link";
import { STATE_PROFILES } from "@/lib/state-compliance";
import { tools } from "@/lib/seed-data";
import { assessToolForState } from "@/lib/state-compliance";
import { ShieldCheck, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "State Compliance Guides — Student Data Privacy by State",
  description:
    "How AI tools stack up against state-specific student data privacy laws — New York Ed Law 2-d, California SOPIPA, Texas SB 820, Illinois SOPPA, and more.",
  alternates: { canonical: "/compliance" },
};

export default function ComplianceIndexPage() {
  // Pre-compute pass counts per state for the index
  const stateCounts = STATE_PROFILES.map((state) => {
    const assessments = tools.map((t) => assessToolForState(t, state));
    return {
      state,
      pass: assessments.filter((a) => a.status === "pass").length,
      partial: assessments.filter((a) => a.status === "partial").length,
      total: tools.length,
    };
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-navy text-white" aria-labelledby="compliance-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" /> State Compliance
            </span>
          </div>
          <h1 id="compliance-heading" className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            Student data privacy laws, state by state
          </h1>
          <p className="mt-3 text-base text-navy-100 max-w-2xl leading-relaxed">
            Federal FERPA and COPPA are the floor — most states layer additional requirements on top. Pick your
            state to see how each AI tool in our directory stacks against its specific statute.
          </p>
        </div>
      </section>

      {/* States grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="states-heading">
        <h2 id="states-heading" className="sr-only">Browse by state</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stateCounts.map(({ state, pass, partial, total }) => (
            <Link
              key={state.slug}
              href={`/compliance/${state.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-white p-5 transition-all duration-200 hover:shadow-md hover:border-navy-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-sm font-bold text-navy" aria-hidden="true">
                    {state.abbreviation}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy group-hover:text-accent-blue transition-colors">
                      {state.name}
                    </h3>
                    <p className="text-[11px] text-charcoal-light">{state.statute}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-charcoal-light group-hover:text-accent-blue transition-colors mt-1" aria-hidden="true" />
              </div>
              <p className="text-sm text-charcoal leading-relaxed line-clamp-3 mb-4">{state.summary}</p>
              <div className="mt-auto flex items-center gap-3 pt-3 border-t border-border text-xs">
                <span className="inline-flex items-center gap-1 text-success font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                  {pass} pass
                </span>
                <span className="inline-flex items-center gap-1 text-warning font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
                  {partial} partial
                </span>
                <span className="text-charcoal-light ml-auto">of {total} tools</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-xl border border-navy-100 bg-navy-50 p-5">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-navy shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-bold text-navy mb-1">Informational only — verify before procurement</h2>
              <p className="text-xs text-charcoal leading-relaxed">
                These overlays surface what vendors publicly document — they're a starting point, not a legal
                opinion. Statute requirements change, vendor practices change, and many states require district-
                specific contractual additions. Always confirm with your district's data privacy officer and the
                current vendor DPA before adopting a tool.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
