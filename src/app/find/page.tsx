import type { Metadata } from "next";
import { Suspense } from "react";
import { FindClient } from "./find-client";

export const metadata: Metadata = {
  title: "Find the Right AI Tool — Use-Case Finder",
  description:
    "Answer five quick questions about your role, grade band, and goals. We'll surface AI tools that match — ranked by fit and editorial score.",
  alternates: { canonical: "/find" },
};

function FindFallback() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-navy-50/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">Find the Right Tool</h1>
          <p className="mt-1 text-sm text-charcoal-light">Loading…</p>
        </div>
      </div>
    </div>
  );
}

export default function FindPage() {
  return (
    <Suspense fallback={<FindFallback />}>
      <FindClient />
    </Suspense>
  );
}
