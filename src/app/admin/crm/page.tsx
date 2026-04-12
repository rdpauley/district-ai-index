"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Users, Phone, Mail, MessageSquare, Calendar, Plus,
  Search, Filter, CheckCircle2, Clock, AlertCircle, Briefcase,
  User, Building2, Tag, X, Edit, Trash2, RefreshCw, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STAGE_ORDER, STAGE_LABELS, STAGE_COLORS,
  type Contact, type Interaction, type Task, type PipelineStage,
  type ContactType, type InteractionType, type InteractionOutcome,
} from "@/lib/crm/types";

type View = "pipeline" | "contacts" | "activity" | "tasks";

export default function CRMPage() {
  const [view, setView] = useState<View>("pipeline");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNewContact, setShowNewContact] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showLogInteraction, setShowLogInteraction] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [c, i, t] = await Promise.all([
        fetch("/api/admin/crm/contacts").then((r) => r.json()),
        fetch("/api/admin/crm/interactions?limit=50").then((r) => r.json()),
        fetch("/api/admin/crm/tasks").then((r) => r.json()),
      ]);
      setContacts(c.contacts || []);
      setInteractions(i.interactions || []);
      setTasks(t.tasks || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const seedVendors = async () => {
    if (!confirm("Seed 64 vendors from directory as CRM contacts? (Safe — skips duplicates.)")) return;
    await fetch("/api/admin/crm/seed", { method: "POST" });
    await loadAll();
  };

  const updateContactStage = async (contactId: string, newStage: PipelineStage) => {
    await fetch(`/api/admin/crm/contacts/${contactId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });
    setContacts((prev) => prev.map((c) => c.id === contactId ? { ...c, stage: newStage } : c));
  };

  const completeTask = async (taskId: string) => {
    await fetch(`/api/admin/crm/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "done" } : t));
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    await fetch(`/api/admin/crm/tasks/${taskId}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Summary metrics
  const stageCounts = STAGE_ORDER.reduce((acc, s) => {
    acc[s] = contacts.filter((c) => c.stage === s).length;
    return acc;
  }, {} as Record<PipelineStage, number>);

  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in_progress");
  const dueSoon = pendingTasks.filter((t) => {
    if (!t.due_date) return false;
    const due = new Date(t.due_date);
    const week = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return due <= week;
  });

  const upcomingFollowUps = contacts
    .filter((c) => c.next_follow_up && new Date(c.next_follow_up) >= new Date())
    .sort((a, b) => new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime())
    .slice(0, 10);

  const filteredContacts = search
    ? contacts.filter((c) =>
        [c.name, c.company, c.email, c.notes].join(" ").toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy mb-2">
              <ArrowLeft className="h-3 w-3" /> Back to Admin
            </Link>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-accent-blue" aria-hidden="true" /> CRM &amp; Operations Hub
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {contacts.length} contacts · {pendingTasks.length} open tasks · {upcomingFollowUps.length} upcoming follow-ups
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-charcoal hover:bg-navy-50" title="Refresh">
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} aria-hidden="true" /> Refresh
            </button>
            {contacts.length === 0 && (
              <button onClick={seedVendors} className="inline-flex items-center gap-1 rounded-lg bg-accent-blue text-white px-3 py-2 text-xs font-semibold hover:bg-accent-blue/90">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Seed 64 Vendors
              </button>
            )}
            <button onClick={() => setShowNewContact(true)} className="inline-flex items-center gap-1 rounded-lg bg-navy text-white px-3 py-2 text-xs font-semibold hover:bg-navy-800">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> New Contact
            </button>
          </div>
        </div>

        {/* Summary strip — always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard icon={Users} label="Total Contacts" value={contacts.length} color="text-accent-blue" />
          <SummaryCard icon={CheckCircle2} label="Paid Customers" value={stageCounts.paid || 0} color="text-success" />
          <SummaryCard icon={Clock} label="Due This Week" value={dueSoon.length} color="text-warning" />
          <SummaryCard icon={AlertCircle} label="Follow-ups Pending" value={upcomingFollowUps.length} color="text-[#7C3AED]" />
        </div>

        {/* View tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-border p-1 w-fit overflow-x-auto">
          {[
            { key: "pipeline" as const, label: "Pipeline", icon: Briefcase },
            { key: "contacts" as const, label: "Contacts", icon: Users },
            { key: "activity" as const, label: "Activity Log", icon: MessageSquare },
            { key: "tasks" as const, label: "Tasks & Calendar", icon: Calendar },
          ].map((t) => (
            <button key={t.key} onClick={() => setView(t.key)} className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
              view === t.key ? "bg-navy text-white" : "text-muted-foreground hover:text-navy hover:bg-navy-50"
            )}>
              <t.icon className="h-3.5 w-3.5" aria-hidden="true" /> {t.label}
            </button>
          ))}
        </div>

        {/* PIPELINE VIEW */}
        {view === "pipeline" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {STAGE_ORDER.filter((s) => s !== "churned" && s !== "declined").map((stage) => {
              const stageContacts = contacts.filter((c) => c.stage === stage);
              return (
                <div key={stage} className="rounded-xl border border-border bg-navy-50/30 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={cn("text-xs font-bold rounded-full px-2.5 py-0.5 border", STAGE_COLORS[stage])}>{STAGE_LABELS[stage]}</h3>
                    <span className="text-xs font-bold text-navy">{stageContacts.length}</span>
                  </div>
                  <div className="space-y-2">
                    {stageContacts.slice(0, 20).map((c) => (
                      <PipelineCard key={c.id} contact={c} onStageChange={updateContactStage} onLogInteraction={() => setShowLogInteraction(c.id!)} onEdit={() => setEditingContact(c)} />
                    ))}
                    {stageContacts.length === 0 && (
                      <p className="text-xs text-muted-foreground italic py-4 text-center">No contacts in this stage.</p>
                    )}
                    {stageContacts.length > 20 && (
                      <p className="text-xs text-muted-foreground italic py-1 text-center">+{stageContacts.length - 20} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CONTACTS VIEW */}
        {view === "contacts" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 flex-1 max-w-md">
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, company, email, notes..." className="w-full bg-transparent text-sm focus:outline-none" />
              </div>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-navy-50/50">
                  <tr>
                    {["Name / Company", "Type", "Stage", "Last Contact", "Follow-up", "Actions"].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-bold uppercase text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c) => (
                    <tr key={c.id} className="border-t border-border hover:bg-navy-50/30">
                      <td className="py-2 px-3">
                        <p className="text-sm font-semibold text-navy">{c.name}</p>
                        {c.company && c.company !== c.name && <p className="text-xs text-muted-foreground">{c.company}</p>}
                        {c.email && <p className="text-xs text-muted-foreground">{c.email}</p>}
                      </td>
                      <td className="py-2 px-3 text-xs text-charcoal capitalize">{c.contact_type}</td>
                      <td className="py-2 px-3">
                        <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] font-bold border", STAGE_COLORS[c.stage])}>{STAGE_LABELS[c.stage]}</span>
                      </td>
                      <td className="py-2 px-3 text-xs text-muted-foreground">{c.last_contact_date ? new Date(c.last_contact_date).toLocaleDateString() : "—"}</td>
                      <td className="py-2 px-3 text-xs">
                        {c.next_follow_up ? (
                          <span className={cn(new Date(c.next_follow_up) < new Date() ? "text-danger font-semibold" : "text-muted-foreground")}>
                            {new Date(c.next_follow_up).toLocaleDateString()}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setShowLogInteraction(c.id!)} className="rounded-md p-1.5 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue" aria-label="Log interaction">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setEditingContact(c)} className="rounded-md p-1.5 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue" aria-label="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          {c.linked_tool_slug && (
                            <Link href={`/tool/${c.linked_tool_slug}`} target="_blank" className="rounded-md p-1.5 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue" aria-label="View tool">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredContacts.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {contacts.length === 0 ? "No contacts yet. Click 'Seed 64 Vendors' above to start." : "No contacts match search."}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVITY LOG VIEW */}
        {view === "activity" && (
          <div className="space-y-2">
            {interactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No interactions logged yet. Log one from any contact.</p>
            ) : (
              interactions.map((i) => {
                const contact = contacts.find((c) => c.id === i.contact_id);
                return (
                  <div key={i.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <InteractionTypeIcon type={i.type} />
                          <span className="text-sm font-bold text-navy">{contact?.name || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground capitalize">· {i.type}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold",
                            i.outcome === "positive" ? "bg-success-bg text-success" :
                            i.outcome === "negative" ? "bg-danger-bg text-danger" :
                            i.outcome === "follow_up_needed" ? "bg-warning-bg text-warning" :
                            "bg-muted text-muted-foreground"
                          )}>{i.outcome.replace("_", " ")}</span>
                        </div>
                        {i.subject && <p className="text-xs font-semibold text-charcoal">{i.subject}</p>}
                        <p className="text-sm text-charcoal mt-1 whitespace-pre-wrap">{i.notes}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(i.date).toLocaleDateString()}</span>
                    </div>
                    {i.follow_up_date && (
                      <p className="mt-2 text-xs text-accent-blue font-semibold">Follow up: {new Date(i.follow_up_date).toLocaleDateString()}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TASKS & CALENDAR VIEW */}
        {view === "tasks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">Tasks &amp; Upcoming</h2>
              <button onClick={() => setShowNewTask(true)} className="inline-flex items-center gap-1 rounded-lg bg-navy text-white px-3 py-2 text-xs font-semibold hover:bg-navy-800">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" /> New Task
              </button>
            </div>

            {/* Upcoming follow-ups */}
            {upcomingFollowUps.length > 0 && (
              <section>
                <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent-blue" aria-hidden="true" /> Upcoming Contact Follow-ups
                </h3>
                <div className="space-y-2">
                  {upcomingFollowUps.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                      <div>
                        <p className="text-sm font-semibold text-navy">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(c.next_follow_up!).toLocaleDateString()} · {STAGE_LABELS[c.stage]}</p>
                      </div>
                      <button onClick={() => setShowLogInteraction(c.id!)} className="text-xs font-semibold text-accent-blue hover:underline">Log contact →</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pending tasks */}
            <section>
              <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-blue" aria-hidden="true" /> Open Tasks ({pendingTasks.length})
              </h3>
              <div className="space-y-2">
                {pendingTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No open tasks. Click &ldquo;New Task&rdquo; to add one.</p>
                ) : pendingTasks.map((t) => (
                  <div key={t.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                    <button onClick={() => completeTask(t.id!)} className="mt-0.5 rounded-full border-2 border-muted hover:border-success hover:bg-success-bg transition-colors h-5 w-5 shrink-0" aria-label="Mark done" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy">{t.title}</p>
                      {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        {t.due_date && (
                          <span className={cn("text-[10px] font-semibold rounded-full px-2 py-0.5",
                            new Date(t.due_date) < new Date() ? "bg-danger-bg text-danger" :
                            new Date(t.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? "bg-warning-bg text-warning" :
                            "bg-muted text-muted-foreground"
                          )}>
                            Due {new Date(t.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span className={cn("text-[10px] font-semibold rounded-full px-2 py-0.5 capitalize",
                          t.priority === "urgent" ? "bg-danger text-white" :
                          t.priority === "high" ? "bg-warning text-white" :
                          "bg-navy-50 text-navy"
                        )}>{t.priority}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(t.id!)} className="text-muted-foreground hover:text-danger" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewContact && <ContactModal onClose={() => setShowNewContact(false)} onSaved={loadAll} />}
      {editingContact && <ContactModal contact={editingContact} onClose={() => setEditingContact(null)} onSaved={loadAll} />}
      {showNewTask && <TaskModal onClose={() => setShowNewTask(false)} onSaved={loadAll} />}
      {showLogInteraction && <InteractionModal contactId={showLogInteraction} contactName={contacts.find((c) => c.id === showLogInteraction)?.name || ""} onClose={() => setShowLogInteraction(null)} onSaved={loadAll} />}
    </div>
  );
}

/* ───────────────────────── Subcomponents ───────────────────────── */

function SummaryCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-4 w-4", color)} aria-hidden="true" />
        <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
      </div>
      <p className="text-2xl font-bold text-navy">{value}</p>
    </div>
  );
}

function PipelineCard({ contact, onStageChange, onLogInteraction, onEdit }: { contact: Contact; onStageChange: (id: string, s: PipelineStage) => void; onLogInteraction: () => void; onEdit: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-white p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy truncate">{contact.name}</p>
          {contact.role && <p className="text-[10px] text-muted-foreground truncate">{contact.role}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2">
        <select value={contact.stage} onChange={(e) => onStageChange(contact.id!, e.target.value as PipelineStage)}
          className="text-[10px] bg-navy-50 border border-border rounded px-1 py-0.5 text-navy flex-1">
          {STAGE_ORDER.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
        <button onClick={onLogInteraction} className="rounded p-1 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue" aria-label="Log">
          <MessageSquare className="h-3 w-3" />
        </button>
        <button onClick={onEdit} className="rounded p-1 text-muted-foreground hover:bg-navy-50 hover:text-accent-blue" aria-label="Edit">
          <Edit className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function InteractionTypeIcon({ type }: { type: InteractionType }) {
  const Icon = type === "email" ? Mail : type === "phone" ? Phone : type === "meeting" ? Calendar : type === "linkedin" ? User : type === "event" ? Building2 : MessageSquare;
  return <Icon className="h-4 w-4 text-accent-blue" aria-hidden="true" />;
}

/* ───────────────────────── Modals ───────────────────────── */

const inputCls = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue";

function ContactModal({ contact, onClose, onSaved }: { contact?: Contact; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Contact>>(contact || {
    name: "", contact_type: "vendor", stage: "cold", tags: [], notes: ""
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name?.trim()) return;
    setSaving(true);
    try {
      const url = contact?.id ? `/api/admin/crm/contacts/${contact.id}` : `/api/admin/crm/contacts`;
      const method = contact?.id ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { onSaved(); onClose(); }
    } finally { setSaving(false); }
  };

  const del = async () => {
    if (!contact?.id) return;
    if (!confirm("Delete this contact? All associated interactions remain.")) return;
    await fetch(`/api/admin/crm/contacts/${contact.id}`, { method: "DELETE" });
    onSaved(); onClose();
  };

  return (
    <Modal title={contact?.id ? "Edit Contact" : "New Contact"} onClose={onClose}>
      <div className="space-y-3">
        <Field label="Name *"><input className={inputCls} value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email"><input type="email" className={inputCls} value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Phone"><input className={inputCls} value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Company"><input className={inputCls} value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
          <Field label="Role / Title"><input className={inputCls} value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            <select className={inputCls} value={form.contact_type} onChange={(e) => setForm({ ...form, contact_type: e.target.value as ContactType })}>
              <option value="vendor">Vendor (AI tool company)</option>
              <option value="district">District / School</option>
              <option value="press">Press / Media</option>
              <option value="partner">Partner</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Pipeline Stage">
            <select className={inputCls} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as PipelineStage })}>
              {STAGE_ORDER.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Source (how you met them)"><input className={inputCls} value={form.source || ""} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="LinkedIn, conference, inbound..." /></Field>
        <Field label="Next Follow-up Date"><input type="date" className={inputCls} value={form.next_follow_up?.split("T")[0] || ""} onChange={(e) => setForm({ ...form, next_follow_up: e.target.value })} /></Field>
        <Field label="Notes"><textarea className={inputCls} rows={4} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        {contact?.id ? (
          <button onClick={del} className="text-xs text-danger hover:underline">Delete contact</button>
        ) : <span />}
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-charcoal hover:bg-navy-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.name?.trim()} className="rounded-lg bg-navy text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InteractionModal({ contactId, contactName, onClose, onSaved }: { contactId: string; contactName: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Interaction>>({
    contact_id: contactId, type: "email", date: new Date().toISOString().slice(0, 10), outcome: "neutral", notes: ""
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.notes?.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/crm/interactions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { onSaved(); onClose(); }
    } finally { setSaving(false); }
  };

  return (
    <Modal title={`Log Interaction — ${contactName}`} onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Channel">
            <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as InteractionType })}>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="meeting">Meeting</option>
              <option value="conversation">In-person</option>
              <option value="linkedin">LinkedIn</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Date"><input type="date" className={inputCls} value={form.date?.slice(0, 10) || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Outcome">
            <select className={inputCls} value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value as InteractionOutcome })}>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
              <option value="no_response">No response</option>
              <option value="follow_up_needed">Follow-up needed</option>
            </select>
          </Field>
        </div>
        <Field label="Subject / Topic"><input className={inputCls} value={form.subject || ""} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Optional" /></Field>
        <Field label="Notes *"><textarea className={inputCls} rows={5} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="What was discussed, decided, next steps..." required /></Field>
        <Field label="Follow-up Date (optional)"><input type="date" className={inputCls} value={form.follow_up_date?.slice(0, 10) || ""} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} /></Field>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
        <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-charcoal hover:bg-navy-50">Cancel</button>
        <button onClick={save} disabled={saving || !form.notes?.trim()} className="rounded-lg bg-navy text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 disabled:opacity-50">
          {saving ? "Saving..." : "Log Interaction"}
        </button>
      </div>
    </Modal>
  );
}

function TaskModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Task>>({ title: "", priority: "medium", status: "pending" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title?.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/crm/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { onSaved(); onClose(); }
    } finally { setSaving(false); }
  };

  return (
    <Modal title="New Task" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Title *"><input className={inputCls} value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
        <Field label="Description"><textarea className={inputCls} rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Due Date"><input type="date" className={inputCls} value={form.due_date?.slice(0, 10) || ""} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></Field>
          <Field label="Priority">
            <select className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </Field>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border">
        <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-charcoal hover:bg-navy-50">Cancel</button>
        <button onClick={save} disabled={saving || !form.title?.trim()} className="rounded-lg bg-navy text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 disabled:opacity-50">
          {saving ? "Saving..." : "Create Task"}
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-navy/60 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold text-navy">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-navy rounded-md p-1" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-charcoal-light mb-1">{label}</label>
      {children}
    </div>
  );
}
