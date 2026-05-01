"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CompareContextValue {
  selectedIds: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setIds: (ids: string[]) => void;
  isSelected: (id: string) => boolean;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setSelectedIds([]), []);

  const setIds = useCallback((ids: string[]) => {
    // Cap at 4 (matches toggle behavior) and de-dupe.
    const seen = new Set<string>();
    const next: string[] = [];
    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      next.push(id);
      if (next.length >= 4) break;
    }
    setSelectedIds(next);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  return (
    <CompareContext.Provider
      value={{ selectedIds, toggle, remove, clear, setIds, isSelected, count: selectedIds.length }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
