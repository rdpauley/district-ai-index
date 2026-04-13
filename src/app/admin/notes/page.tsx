"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Notebook, Save,
  Check, CircleAlert, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

interface MonthMeta { yearMonth: string; updated_at: string | null; length: number }

function currentYearMonth(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function shiftMonth(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return currentYearMonth(d);
}
function humanMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}
function formatRelative(iso: string | null): string {
  if (!iso) return "Never saved";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminNotesPage() {
  const todayYM = useMemo(() => currentYearMonth(), []);
  const [yearMonth, setYearMonth] = useState<string>(todayYM);
  const [body, setBody] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [state, setState] = useState<SaveState>("idle");
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState<MonthMeta[]>([]);

  // Ref to hold the latest body for the debounced save
  const bodyRef = useRef(body);
  bodyRef.current = body;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load month ─────────────────────────────────────────
  const loadMonth = useCallback(async (ym: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/notes/${ym}`, { cache: "no-store" });
      const data = await res.json();
      setBody(data.body || "");
      setUpdatedAt(data.updated_at || null);
      setState("idle");
    } catch {
      setBody("");
      setUpdatedAt(null);
      setState("error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMonthsList = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notes", { cache: "no-store" });
      const data = await res.json();
      setMonths(data.months || []);
    } catch {
      setMonths([]);
    }
  }, []);

  useEffect(() => { loadMonth(yearMonth); }, [yearMonth, loadMonth]);
  useEffect(() => { loadMonthsList(); }, [loadMonthsList]);

  // ── Save (manual or debounced) ────────────────────────
  const save = useCallback(async () => {
    setState("saving");
    try {
      const res = await fetch(`/api/admin/notes/${yearMonth}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: bodyRef.current }),
      });
      if (res.ok) {
        const data = await res.json();
        setUpdatedAt(data.updated_at || new Date().toISOString());
        setState("saved");
        // Refresh month list so the counter/last-saved updates
        loadMonthsList();
        // Flip back to idle after a moment
        setTimeout(() => setState((s) => (s === "saved" ? "idle" : s)), 2000);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }, [yearMonth, loadMonthsList]);

  // Debounced auto-save on typing
  const onChangeBody = (val: string) => {
    setBody(val);
    setState("dirty");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { save(); }, 1500);
  };

  // Cmd/Ctrl+S to save immediately
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (saveTimer.current) clearTimeout(saveTimer.current);
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state === "dirty" || state === "saving") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [state]);

  const charCount = body.length;
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy transition-colors mb-3">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to admin
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                <Notebook className="h-6 w-6 text-accent-blue" aria-hidden="true" /> Monthly Notes
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Capture anything for the month — ideas, retros, numbers, contacts, questions for later. Autosaves as you type.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* ── Month list sidebar ─────────────── */}
          <aside className="rounded-xl border border-border bg-white">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-light">Months</h2>
              <button
                onClick={() => setYearMonth(todayYM)}
                className="text-[10px] font-semibold text-accent-blue hover:underline"
              >
                This month
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-0.5">
              {months.length === 0 && (
                <p className="text-xs text-muted-foreground px-2 py-3">No saved months yet.</p>
              )}
              {months.map((m) => (
                <button
                  key={m.yearMonth}
                  onClick={() => setYearMonth(m.yearMonth)}
                  className={cn(
                    "w-full text-left rounded-lg px-2 py-1.5 text-xs transition-colors",
                    m.yearMonth === yearMonth
                      ? "bg-accent-blue/10 text-navy font-semibold"
                      : "text-charcoal-light hover:bg-navy-50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{humanMonth(m.yearMonth)}</span>
                    <span className="text-[10px] text-muted-foreground">{m.length.toLocaleString()} chars</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* ── Editor ─────────────── */}
          <div className="rounded-xl border border-border bg-white overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setYearMonth(shiftMonth(yearMonth, -1))}
                  aria-label="Previous month"
                  className="p-1.5 rounded-lg hover:bg-navy-50 text-charcoal-light"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <h2 className="text-base font-bold text-navy min-w-[10ch]">
                  {humanMonth(yearMonth)}
                </h2>
                <button
                  onClick={() => setYearMonth(shiftMonth(yearMonth, 1))}
                  aria-label="Next month"
                  className="p-1.5 rounded-lg hover:bg-navy-50 text-charcoal-light"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <StatusPill state={state} updatedAt={updatedAt} />
                <button
                  onClick={() => { if (saveTimer.current) clearTimeout(saveTimer.current); save(); }}
                  disabled={state === "saving"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save
                </button>
              </div>
            </div>

            <textarea
              value={body}
              onChange={(e) => onChangeBody(e.target.value)}
              disabled={loading}
              placeholder={loading ? "Loading…" : `What happened in ${humanMonth(yearMonth)}?\n\nTry sections like:\n• Wins\n• Numbers (emails sent, replies, traffic)\n• Lessons\n• Open questions\n• People to follow up with`}
              aria-label={`Notes for ${humanMonth(yearMonth)}`}
              className="w-full flex-1 min-h-[55vh] resize-none border-0 bg-transparent p-4 font-mono text-sm text-navy placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />

            <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-muted-foreground">
              <span>{wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars</span>
              <span>Cmd/Ctrl + S to save now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ state, updatedAt }: { state: SaveState; updatedAt: string | null }) {
  const base = "inline-flex items-center gap-1 text-[11px] font-medium";
  if (state === "saving") return <span className={cn(base, "text-muted-foreground")}><Clock className="h-3 w-3 animate-pulse" aria-hidden="true" /> Saving…</span>;
  if (state === "saved")  return <span className={cn(base, "text-success")}><Check className="h-3 w-3" aria-hidden="true" /> Saved</span>;
  if (state === "dirty")  return <span className={cn(base, "text-warning")}><Clock className="h-3 w-3" aria-hidden="true" /> Unsaved</span>;
  if (state === "error")  return <span className={cn(base, "text-danger")}><CircleAlert className="h-3 w-3" aria-hidden="true" /> Save failed</span>;
  return <span className={cn(base, "text-muted-foreground")}>Last saved {formatRelative(updatedAt)}</span>;
}
