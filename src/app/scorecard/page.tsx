import type { Metadata } from "next";
import { Suspense } from "react";
import { ScorecardClient } from "./scorecard-client";

export const metadata: Metadata = {
  title: "Custom Readiness Scorecard — Weight What Matters to Your District",
  description:
    "Re-rank AI tools using your district's own priorities. Adjust weights for ease of use, instructional value, data privacy, and accessibility — share the result with your team.",
  alternates: { canonical: "/scorecard" },
};

function ScorecardFallback() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-navy-50/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">Custom Readiness Scorecard</h1>
          <p className="mt-1 text-sm text-charcoal-light">Loading your weighted view…</p>
        </div>
      </div>
    </div>
  );
}

export default function ScorecardPage() {
  return (
    <Suspense fallback={<ScorecardFallback />}>
      <ScorecardClient />
    </Suspense>
  );
}
