"use client";

import { Search, SlidersHorizontal, GitCompareArrows, User, Bookmark } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import Link from "next/link";
import { useState } from "react";

export function Topbar({ children }: { children?: React.ReactNode }) {
  const { count } = useCompare();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-navy-700/50 bg-navy-950/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {children}
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all w-full ${
            searchFocused
              ? "border-electric/50 bg-navy-800 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
              : "border-navy-700/50 bg-navy-900"
          }`}
        >
          <Search className="h-4 w-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search tools, categories, or features..."
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-navy-600 bg-navy-800 px-1.5 py-0.5 text-[10px] text-slate-500 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-xl border border-navy-700/50 bg-navy-900 px-3 py-2 text-xs text-slate-400 hover:bg-navy-800 hover:text-slate-200 transition-colors">
          <Bookmark className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Saved Views</span>
        </button>

        <button className="flex items-center gap-1.5 rounded-xl border border-navy-700/50 bg-navy-900 px-3 py-2 text-xs text-slate-400 hover:bg-navy-800 hover:text-slate-200 transition-colors">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        <Link
          href="/compare"
          className="flex items-center gap-1.5 rounded-xl border border-navy-700/50 bg-navy-900 px-3 py-2 text-xs text-slate-400 hover:bg-navy-800 hover:text-slate-200 transition-colors relative"
        >
          <GitCompareArrows className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Compare</span>
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-electric text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>

        <div className="ml-2 h-8 w-8 rounded-full bg-navy-700 flex items-center justify-center cursor-pointer hover:bg-navy-600 transition-colors">
          <User className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
