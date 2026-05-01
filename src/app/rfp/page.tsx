import type { Metadata } from "next";
import { Suspense } from "react";
import { RfpClient } from "./rfp-client";

export const metadata: Metadata = {
  title: "RFP / Procurement Pack — Board-Ready Tool Brief",
  description:
    "Generate a printable, board-ready procurement brief for any AI tools in the directory. Save as PDF and attach to RFPs, vendor reviews, or board memos.",
  alternates: { canonical: "/rfp" },
};

function RfpFallback() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-navy">RFP / Procurement Pack</h1>
        <p className="mt-1 text-sm text-charcoal-light">Loading…</p>
      </div>
    </div>
  );
}

export default function RfpPage() {
  return (
    <Suspense fallback={<RfpFallback />}>
      <RfpClient />
    </Suspense>
  );
}
