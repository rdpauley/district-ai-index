"use client";
import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-50"
    >
      <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Print / Save as PDF
    </button>
  );
}
