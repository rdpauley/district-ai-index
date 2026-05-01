import { Suspense } from "react";
import { CompareContent } from "./compare-content";

function CompareFallback() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-navy">Compare Tools</h1>
        <p className="mt-1 text-sm text-charcoal-light">Loading comparison…</p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareFallback />}>
      <CompareContent />
    </Suspense>
  );
}
