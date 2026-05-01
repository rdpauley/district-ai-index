import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmClient } from "./confirm-client";

export const metadata: Metadata = {
  title: "Confirm your alert subscription",
  robots: { index: false, follow: false },
};

function ConfirmFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="rounded-xl border border-border bg-white p-8 max-w-md shadow-sm">
        <p className="text-sm text-charcoal-light">Loading…</p>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<ConfirmFallback />}>
      <ConfirmClient />
    </Suspense>
  );
}
