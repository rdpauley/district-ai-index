"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Plus, Calendar as CalIcon,
  CheckCircle2, Circle, ArrowRightCircle, X, AlertTriangle, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/lib/crm/types";

// ── Date helpers (local time, not UTC) ─────────────────
function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function startOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date): Date { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function addMonths(d: Date, n: number): Date { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "bg-danger text-white",
  high: "bg-warning text-white",
  medium: "bg-accent-blue text-white",
  low: "bg-muted text-muted-foreground",
};

export default function AdminCalendarPage() {
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const [cursor, setCursor] = useState<Date>(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState<string>(toIso(today));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/crm/tasks", { cache: "no-store" });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Group tasks by due_date (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const m = new Map<string, Task[]>();
    for (const t of tasks) {
      if (!t.due_date) continue;
      const key = t.due_date.slice(0, 10); // tolerate ISO datetime
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(t);
    }
    return m;
  }, [tasks]);

  const selectedTasks = tasksByDate.get(selectedDate) || [];
  const undated = tasks.filter((t) => !t.due_date);

  // Overdue: due_date < today AND status != done/cancelled
  const overdueCount = useMemo(() => {
    const iso = toIso(today);
    return tasks.filter((t) => t.due_date && t.due_date.slice(0,10) < iso && t.status !== "done" && t.status !== "cancelled").length;
  }, [tasks, today]);

  // Build 42-cell grid (6 weeks) for current cursor month
  const gridDays = useMemo(() => {
    const first = startOfMonth(cursor);
    const startWeekday = first.getDay();
    const start = new Date(first);
    start.setDate(first.getDate() - startWeekday);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [cursor]);

  async function toggleTask(task: Task) {
    if (!task.id) return;
    const nextStatus = task.status === "done" ? "pending" : "done";
    // Optimistic
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, status: nextStatus, completed_at: nextStatus === "done" ? new Date().toISOString() : undefined } : t));
    try {
      await fetch(`/api/admin/crm/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {
      loadTasks(); // revert by reloading
    }
  }

  async function pushToNextDay(task: Task) {
    if (!task.id) return;
    // Next day is the day AFTER the task's current due_date (or today if undated)
    const base = task.due_date ? fromIso(task.due_date.slice(0, 10)) : new Date(today);
    const next = new Date(base);
    next.setDate(base.getDate() + 1);
    const nextIso = toIso(next);

    // Optimistic update
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, due_date: nextIso } : t));
    try {
      await fetch(`/api/admin/crm/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: nextIso }),
      });
    } catch {
      loadTasks(); // revert
    }
  }

  async function seedThreeWeeks() {
    if (seeding) return;
    if (!confirm("Seed the 3-week operating plan starting today?\n\nThis adds ~40 tasks across the next 21 days. Duplicates by (date, title) are skipped, so it's safe to run again.")) return;
    setSeeding(true);
    setSeedMsg(null);
    try {
      const res = await fetch("/api/admin/calendar/seed-3weeks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate: toIso(today) }),
      });
      const data = await res.json();
      if (res.ok) {
        setSeedMsg(`Seeded ${data.created} tasks (${data.skipped} already existed).`);
        await loadTasks();
      } else {
        setSeedMsg(`Error: ${data.error || "seed failed"}`);
      }
    } catch {
      setSeedMsg("Error: network failure");
    } finally {
      setSeeding(false);
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const payload: Partial<Task> = {
      title: newTitle.trim(),
      due_date: selectedDate,
      priority: newPriority,
      status: "pending",
    };
    try {
      const res = await fetch("/api/admin/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = (await res.json()) as Task;
        setTasks((prev) => [...prev, saved]);
        setNewTitle("");
        setNewPriority("medium");
        setShowNew(false);
      }
    } catch {
      // no-op; user can retry
    }
  }

  const selectedDateObj = fromIso(selectedDate);
  const pendingSelected = selectedTasks.filter((t) => t.status !== "done" && t.status !== "cancelled");
  const doneSelected = selectedTasks.filter((t) => t.status === "done");

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
                <CalIcon className="h-6 w-6 text-accent-blue" aria-hidden="true" /> Daily Work Calendar
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Plan what you&rsquo;re doing each day. Check items off as you finish them.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {overdueCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-bg border border-danger/20 px-3 py-1 text-xs font-semibold text-danger">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> {overdueCount} overdue
                </span>
              )}
              <button
                onClick={seedThreeWeeks}
                disabled={seeding}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-blue/90 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {seeding ? "Seeding..." : "Seed 3-week plan"}
              </button>
              <button
                onClick={() => { setCursor(startOfMonth(today)); setSelectedDate(toIso(today)); }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-charcoal-light hover:bg-navy-50 hover:text-navy"
              >
                Today
              </button>
            </div>
          </div>
          {seedMsg && (
            <div className="mt-3 rounded-lg bg-success-bg border border-success/20 px-3 py-2 text-xs text-success" role="status">
              {seedMsg}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* ── Calendar grid ───────────────────── */}
          <div className="rounded-xl border border-border bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-base font-bold text-navy">
                {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCursor(addMonths(cursor, -1))}
                  aria-label="Previous month"
                  className="p-1.5 rounded-lg hover:bg-navy-50 text-charcoal-light"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setCursor(addMonths(cursor, 1))}
                  aria-label="Next month"
                  className="p-1.5 rounded-lg hover:bg-navy-50 text-charcoal-light"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 border-b border-border bg-navy-50/50">
              {WEEKDAYS.map((w) => (
                <div key={w} className="px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-charcoal-light">
                  {w}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {gridDays.map((d) => {
                const iso = toIso(d);
                const dayTasks = tasksByDate.get(iso) || [];
                const dayPending = dayTasks.filter((t) => t.status !== "done" && t.status !== "cancelled");
                const dayDone = dayTasks.filter((t) => t.status === "done");
                const inMonth = d.getMonth() === cursor.getMonth();
                const isToday = isSameDay(d, today);
                const isSelected = iso === selectedDate;
                const isOverdue = iso < toIso(today) && dayPending.length > 0;

                return (
                  <button
                    key={iso}
                    onClick={() => setSelectedDate(iso)}
                    className={cn(
                      "relative min-h-20 border-b border-r border-border p-1.5 text-left transition-colors",
                      !inMonth && "bg-navy-50/30 text-muted-foreground",
                      inMonth && "hover:bg-navy-50/70",
                      isSelected && "ring-2 ring-inset ring-accent-blue bg-accent-blue/5",
                      isToday && !isSelected && "bg-accent-blue/5",
                    )}
                    aria-label={`${d.toDateString()}, ${dayPending.length} pending, ${dayDone.length} done`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold",
                        isToday ? "bg-navy text-white" : inMonth ? "text-navy" : "text-muted-foreground",
                      )}>
                        {d.getDate()}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-[9px] font-semibold text-muted-foreground">
                          {dayDone.length}/{dayTasks.length}
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-[10px] font-medium",
                            t.status === "done" ? "bg-success-bg text-success line-through" : "bg-navy-50 text-navy",
                            isOverdue && t.status !== "done" && "bg-danger-bg text-danger",
                          )}
                        >
                          {t.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-[9px] text-muted-foreground pl-1">+{dayTasks.length - 2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Day panel ───────────────────── */}
          <div className="rounded-xl border border-border bg-white">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {WEEKDAYS[selectedDateObj.getDay()].toUpperCase()}
              </div>
              <h2 className="text-base font-bold text-navy">
                {MONTH_NAMES[selectedDateObj.getMonth()]} {selectedDateObj.getDate()}, {selectedDateObj.getFullYear()}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {pendingSelected.length === 0 && doneSelected.length === 0
                  ? "Nothing planned — add an item below."
                  : `${pendingSelected.length} to do · ${doneSelected.length} done`}
              </p>
            </div>

            <div className="p-3 space-y-2 max-h-[50vh] overflow-y-auto">
              {loading && <p className="text-xs text-muted-foreground px-2">Loading&hellip;</p>}

              {!loading && pendingSelected.length === 0 && doneSelected.length === 0 && !showNew && (
                <p className="text-xs text-muted-foreground px-2 py-4 text-center">No tasks yet.</p>
              )}

              {pendingSelected.map((t) => (
                <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t)} onPushNext={() => pushToNextDay(t)} />
              ))}

              {doneSelected.length > 0 && (
                <>
                  <div className="px-2 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Completed
                  </div>
                  {doneSelected.map((t) => (
                    <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t)} onPushNext={() => pushToNextDay(t)} />
                  ))}
                </>
              )}
            </div>

            {/* Add task form */}
            <div className="border-t border-border p-3">
              {showNew ? (
                <form onSubmit={addTask} className="space-y-2">
                  <input
                    autoFocus
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What needs to get done?"
                    maxLength={200}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm text-navy placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <button
                      type="submit"
                      disabled={!newTitle.trim()}
                      className="flex-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowNew(false); setNewTitle(""); }}
                      aria-label="Cancel"
                      className="rounded-lg border border-border p-1.5 text-charcoal-light hover:bg-navy-50"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowNew(true)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-charcoal-light hover:bg-navy-50 hover:border-accent-blue hover:text-accent-blue transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add item to {MONTH_NAMES[selectedDateObj.getMonth()].slice(0,3)} {selectedDateObj.getDate()}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Undated backlog */}
        {undated.length > 0 && (
          <div className="rounded-xl border border-border bg-white p-4">
            <h3 className="text-sm font-bold text-navy mb-2">Undated backlog ({undated.length})</h3>
            <p className="text-xs text-muted-foreground mb-3">Tasks without a due date. Manage them in the CRM Tasks view.</p>
            <div className="space-y-1.5">
              {undated.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold", PRIORITY_COLORS[t.priority])}>{t.priority}</span>
                  <span className={cn("truncate", t.status === "done" ? "line-through text-muted-foreground" : "text-navy")}>{t.title}</span>
                </div>
              ))}
              {undated.length > 5 && <p className="text-[11px] text-muted-foreground pt-1">&hellip; and {undated.length - 5} more</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, onToggle, onPushNext }: { task: Task; onToggle: () => void; onPushNext: () => void }) {
  const done = task.status === "done";
  return (
    <div className={cn(
      "group flex items-start gap-2 rounded-lg border border-border px-2 py-2 transition-colors",
      done ? "bg-navy-50/50" : "bg-white hover:border-accent-blue/30",
    )}>
      <button
        onClick={onToggle}
        aria-label={done ? `Mark ${task.title} not done` : `Mark ${task.title} done`}
        className="mt-0.5 shrink-0 text-accent-blue hover:text-navy"
      >
        {done ? <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" /> : <Circle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className={cn("text-sm font-medium", done ? "line-through text-muted-foreground" : "text-navy")}>
          {task.title}
        </div>
        {task.description && !done && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}
        <div className="mt-1 flex items-center gap-1.5">
          <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider", PRIORITY_COLORS[task.priority])}>
            {task.priority}
          </span>
        </div>
      </div>
      {!done && (
        <button
          onClick={onPushNext}
          aria-label={`Move ${task.title} to the next day`}
          title="Move to next day"
          className="opacity-0 group-hover:opacity-100 shrink-0 text-muted-foreground hover:text-accent-blue transition-opacity"
        >
          <ArrowRightCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
