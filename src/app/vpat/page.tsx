import type { Metadata } from "next";
import { Suspense } from "react";
import { VpatClient } from "./vpat-client";

export const metadata: Metadata = {
  title: "VPAT Tracker — Get Ahead of the Federal Accessibility Deadline",
  description:
    "Which K-12 AI tools have a published VPAT/ACR ready for your DOJ Title II compliance file? Track every tool's accessibility documentation in one place, sortable and filterable.",
  alternates: { canonical: "/vpat" },
};

function VpatFallback() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-navy-50/50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">VPAT Tracker</h1>
          <p className="mt-1 text-sm text-charcoal-light">Loading…</p>
        </div>
      </div>
    </div>
  );
}

export default function VpatPage() {
  return (
    <Suspense fallback={<VpatFallback />}>
      <VpatClient />
    </Suspense>
  );
}
