"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { tools } from "@/lib/seed-data";
import { Bell, Search, Mail, CheckCircle2, AlertCircle, X, ShieldCheck, DollarSign, FileBadge, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_TOOLS = 25;

const WATCHED_FIELDS = [
  { icon: ShieldCheck, label: "Privacy posture changes (e.g., gains DPA, loses District Ready status)" },
  { icon: DollarSign, label: "Pricing model changes (Free → Paid, new tiers)" },
  { icon: Star, label: "Editorial score updates after a re-review" },
  { icon: FileBadge, label: "VPAT or accessibility documentation updates" },
];

export function AlertsClient() {
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return tools;
    const q = search.toLowerCase();
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.vendor.toLowerCase().includes(q) ||
        t.categories.some((c) => c.toLowerCase().includes(q))
    );
  }, [search]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_TOOLS) return prev;
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelected(new Set()), []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || selected.size === 0 || submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          tool_ids: Array.from(selected),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResult({
          ok: true,
          message: data.message || "Subscription pending — check your inbox to confirm.",
        });
        setEmail("");
        setSelected(new Set());
      } else {
        setResult({ ok: false, message: data.error || "Could not subscribe. Please try again." });
      }
    } catch {
      setResult({ ok: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }, [email, selected, submitting]);

  return (
    <div className="bg-white min-h-screen">
      {/* ============ HEADER ============ */}
      <section className="bg-navy text-white" aria-labelledby="alerts-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white">
              <Bell className="h-3 w-3" aria-hidden="true" /> Change Alerts
            </span>
          </div>
          <h1 id="alerts-heading" className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            Get notified when an AI tool changes
          </h1>
          <p className="mt-3 text-base text-navy-100 max-w-2xl leading-relaxed">
            Vendors quietly update privacy policies, pricing, and accessibility documentation. Pick the tools
            your district uses or is evaluating, and we'll email you when something changes.
          </p>
        </div>
      </section>

      {/* ============ WATCHED FIELDS ============ */}
      <section className="bg-navy-50/50 border-b border-border" aria-labelledby="watched-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 id="watched-heading" className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-4">
            What we watch for
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WATCHED_FIELDS.map((f) => (
              <li key={f.label} className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
                <f.icon className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm text-charcoal">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ FORM ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Email + submit */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-5">
              <div>
                <label htmlFor="alerts-email" className="block text-sm font-bold text-navy mb-1">
                  Email address
                </label>
                <p className="text-xs text-charcoal-light mb-2">
                  We'll send a one-time confirmation link before you start receiving alerts.
                </p>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" aria-hidden="true" />
                  <input
                    id="alerts-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    className="w-full rounded-lg border border-border bg-white pl-10 pr-3 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                  Tools selected
                </p>
                <p className="mt-1 text-2xl font-bold text-navy" aria-live="polite">
                  {selected.size} <span className="text-sm font-normal text-charcoal-light">/ {MAX_TOOLS}</span>
                </p>
                {selected.size > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="mt-2 text-xs font-medium text-accent-blue hover:text-navy transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !email.trim() || selected.size === 0}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy px-4 py-3 text-sm font-bold text-white hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Subscribing…" : "Subscribe to alerts"}
              </button>

              {result && (
                <div
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "rounded-xl border p-4 text-sm",
                    result.ok
                      ? "border-success/30 bg-success-bg text-success"
                      : "border-danger/30 bg-danger-bg text-danger"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {result.ok ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
                    )}
                    <span>{result.message}</span>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-charcoal-light leading-relaxed">
                We never share your email. Every alert includes a one-click unsubscribe.
                Read our <Link href="/privacy-policy" className="text-accent-blue hover:underline">privacy policy</Link>.
              </p>
            </div>
          </div>

          {/* RIGHT: Tool picker */}
          <div className="lg:col-span-2">
            <fieldset>
              <legend className="text-sm font-bold text-navy mb-1">Pick tools to watch</legend>
              <p className="text-xs text-charcoal-light mb-3">
                Choose up to {MAX_TOOLS} tools. You can unsubscribe or update your selection later.
              </p>

              {/* Search */}
              <div className="relative mb-4">
                <label htmlFor="alerts-search" className="sr-only">Filter tools</label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" aria-hidden="true" />
                <input
                  id="alerts-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by name, vendor, or category"
                  className="w-full rounded-lg border border-border bg-white pl-10 pr-9 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-navy"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-border overflow-hidden divide-y divide-border max-h-[600px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="p-6 text-sm text-charcoal-light text-center">No tools match "{search}".</p>
                ) : (
                  filtered.map((tool) => {
                    const checked = selected.has(tool.id);
                    const inputId = `alert-tool-${tool.id}`;
                    return (
                      <label
                        key={tool.id}
                        htmlFor={inputId}
                        className={cn(
                          "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                          checked ? "bg-accent-blue/5" : "hover:bg-navy-50/50"
                        )}
                      >
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(tool.id)}
                          disabled={!checked && selected.size >= MAX_TOOLS}
                          className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-navy truncate">{tool.name}</p>
                          <p className="text-xs text-charcoal-light truncate">
                            {tool.vendor} · {tool.categories[0]} · {tool.privacy_flag}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-charcoal-light tabular-nums shrink-0">
                          {tool.overall_score.toFixed(1)}/10
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </fieldset>
          </div>
        </form>
      </section>
    </div>
  );
}
