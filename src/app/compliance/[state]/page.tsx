import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATE_PROFILES, getStateBySlug, assessToolForState } from "@/lib/state-compliance";
import { tools } from "@/lib/seed-data";
import { ArrowLeft, CheckCircle2, AlertCircle, XCircle, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ state: string }>;
}

export function generateStaticParams() {
  return STATE_PROFILES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return { title: "State not found" };
  return {
    title: `${state.name} Student Data Privacy Compliance — ${state.statute}`,
    description: `How AI tools in our directory align with ${state.name}'s ${state.statute}. See per-tool requirement coverage for districts evaluating procurement.`,
    alternates: { canonical: `/compliance/${state.slug}` },
  };
}

export default async function StateCompliancePage({ params }: Props) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const assessments = tools
    .map((t) => assessToolForState(t, state))
    .sort((a, b) => {
      // pass > partial > missing; tiebreak by overall_score desc
      const order = { pass: 0, partial: 1, missing: 2 };
      if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
      return b.tool.overall_score - a.tool.overall_score;
    });

  const passCount = assessments.filter((a) => a.status === "pass").length;
  const partialCount = assessments.filter((a) => a.status === "partial").length;
  const missingCount = assessments.filter((a) => a.status === "missing").length;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-navy text-white" aria-labelledby="state-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <nav aria-label="Breadcrumb" className="mb-3">
            <Link href="/compliance" className="inline-flex items-center gap-1 text-xs text-navy-100 hover:text-white transition-colors">
              <ArrowLeft className="h-3 w-3" aria-hidden="true" /> All states
            </Link>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-base font-bold text-white" aria-hidden="true">
              {state.abbreviation}
            </div>
            <div>
              <h1 id="state-heading" className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                {state.name}
              </h1>
              <p className="text-sm text-navy-100 mt-1">{state.statute}</p>
            </div>
          </div>
          <p className="mt-3 text-base text-navy-100 max-w-3xl leading-relaxed">{state.summary}</p>

          {/* Counts */}
          <div className="mt-6 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              <span><strong className="text-white">{passCount}</strong> <span className="text-navy-100">tools fully aligned</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-warning" aria-hidden="true" />
              <span><strong className="text-white">{partialCount}</strong> <span className="text-navy-100">partially aligned</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="h-4 w-4 text-danger" aria-hidden="true" />
              <span><strong className="text-white">{missingCount}</strong> <span className="text-navy-100">missing documentation</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-navy-50/50 border-b border-border" aria-labelledby="requirements-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 id="requirements-heading" className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-4">
            What {state.name} requires
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.requirements.map((req) => (
              <li key={req.label} className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-start gap-2 mb-1.5">
                  <ShieldCheck className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-navy">{req.label}</h3>
                </div>
                <p className="text-xs text-charcoal leading-relaxed">{req.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tool table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-xl font-bold text-navy mb-2">
          Tools evaluated against {state.name}'s requirements
        </h2>
        <p className="text-sm text-charcoal-light mb-6">
          Status is derived from each vendor's publicly documented compliance signals. Independently verify before procurement.
        </p>

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label={`Tools evaluated for ${state.name}`}>
              <thead className="bg-navy-50/50">
                <tr>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal">Tool</th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal hidden sm:table-cell">Status</th>
                  {state.requirements.map((req) => (
                    <th key={req.label} scope="col" className="text-center py-3 px-3 text-xs font-semibold uppercase tracking-wider text-charcoal hidden md:table-cell">
                      {req.label.split(" ").slice(0, 3).join(" ")}
                    </th>
                  ))}
                  <th scope="col" className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider text-charcoal">Score</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map(({ tool, status, requirementResults }) => (
                  <tr key={tool.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/tool/${tool.slug}`} className="group">
                        <p className="text-sm font-semibold text-navy group-hover:text-accent-blue transition-colors">{tool.name}</p>
                        <p className="text-xs text-charcoal-light">{tool.vendor}</p>
                      </Link>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <StatusBadge status={status} />
                    </td>
                    {requirementResults.map((r, i) => (
                      <td key={i} className="py-3 px-3 text-center hidden md:table-cell">
                        <RequirementIcon status={r.status} label={r.requirement.label} />
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right text-sm font-bold text-navy tabular-nums">
                      {tool.overall_score.toFixed(1)}<span className="text-xs font-normal text-charcoal-light">/10</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-charcoal-light">
          <strong className="text-charcoal">Methodology:</strong> Each requirement is derived from {state.statute}. A tool "passes" a
          requirement when its publicly documented compliance signals indicate the relevant control is available.
          "Partial" means the signal is documented but with caveats. "Missing" means we found no documentation —
          which is not the same as non-compliance; the vendor may simply not publish it. <Link href="/compliance" className="text-accent-blue hover:underline">View other states.</Link>
        </p>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: "pass" | "partial" | "missing" }) {
  const config = {
    pass: { label: "Fully aligned", bg: "bg-success-bg", text: "text-success", border: "border-success/20", Icon: CheckCircle2 },
    partial: { label: "Partial", bg: "bg-warning-bg", text: "text-warning", border: "border-warning/20", Icon: AlertCircle },
    missing: { label: "Not documented", bg: "bg-danger-bg", text: "text-danger", border: "border-danger/20", Icon: XCircle },
  }[status];
  const Icon = config.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.border} ${config.text} px-2.5 py-1 text-xs font-semibold`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}

function RequirementIcon({ status, label }: { status: "pass" | "partial" | "missing"; label: string }) {
  if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-success mx-auto" aria-label={`${label}: pass`} />;
  if (status === "partial") return <AlertCircle className="h-4 w-4 text-warning mx-auto" aria-label={`${label}: partial`} />;
  return <XCircle className="h-4 w-4 text-charcoal-light mx-auto" aria-label={`${label}: missing`} />;
}
