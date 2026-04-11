"use client";

import { X, GitCompareArrows } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { getToolById } from "@/lib/seed-data";
import Link from "next/link";

export function CompareTray() {
  const { selectedIds, remove, clear, count } = useCompare();
  if (count === 0) return null;

  const selectedTools = selectedIds.map(getToolById).filter(Boolean);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      role="region"
      aria-label="Compare tools tray"
    >
      <div className="mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3 max-w-7xl">
        <div className="flex items-center gap-3 min-w-0">
          <GitCompareArrows className="h-4 w-4 text-accent-blue shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold text-navy whitespace-nowrap">
            {count} tool{count !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto">
            {selectedTools.map((tool) =>
              tool ? (
                <span
                  key={tool.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 border border-navy-100 px-3 py-1 text-xs font-medium text-navy whitespace-nowrap"
                >
                  {tool.name}
                  <button
                    onClick={() => remove(tool.id)}
                    className="text-navy-400 hover:text-navy transition-colors rounded-full"
                    aria-label={`Remove ${tool.name} from comparison`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : null
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clear}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-navy transition-colors"
          >
            Clear all
          </button>
          <Link
            href="/compare"
            className="rounded-lg bg-navy px-4 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 transition-colors"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
