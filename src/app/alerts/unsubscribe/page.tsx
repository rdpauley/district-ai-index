import type { Metadata } from "next";
import { Suspense } from "react";
import { UnsubscribeClient } from "./unsubscribe-client";

export const metadata: Metadata = {
  title: "Unsubscribe from alerts",
  robots: { index: false, follow: false },
};

function UnsubFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="rounded-xl border border-border bg-white p-8 max-w-md shadow-sm">
        <p className="text-sm text-charcoal-light">Loading…</p>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<UnsubFallback />}>
      <UnsubscribeClient />
    </Suspense>
  );
}
