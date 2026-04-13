/**
 * Seed the 3-week operating plan into Firestore tasks collection.
 * Admin-gated by middleware. Idempotent on (title, due_date) — re-hitting
 * won't create duplicates.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { THREE_WEEK_PLAN } from "@/lib/calendar/three-week-plan";
import type { Task } from "@/lib/crm/types";

function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseStart(s: string | undefined): Date {
  if (!s) { const d = new Date(); d.setHours(0,0,0,0); return d; }
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export async function POST(req: NextRequest) {
  if (!isFirebaseAdminConfigured() || !adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  let startDate: string | undefined;
  try {
    const body = await req.json().catch(() => ({}));
    startDate = typeof body?.startDate === "string" ? body.startDate : undefined;
  } catch {
    // body optional
  }

  const start = parseStart(startDate);
  const now = new Date().toISOString();

  // Check existing tasks on these dates to avoid duplicates
  const endDate = new Date(start); endDate.setDate(endDate.getDate() + 20);
  const existingSnap = await adminDb.collection("tasks")
    .where("due_date", ">=", toIso(start))
    .where("due_date", "<=", toIso(endDate))
    .get();
  const existingKeys = new Set(
    existingSnap.docs.map((d) => {
      const data = d.data() as Task;
      return `${(data.due_date || "").slice(0,10)}::${(data.title || "").trim()}`;
    })
  );

  const batch = adminDb.batch();
  let created = 0;
  let skipped = 0;

  for (const item of THREE_WEEK_PLAN) {
    const d = new Date(start);
    d.setDate(d.getDate() + item.dayOffset);
    const dueIso = toIso(d);
    const key = `${dueIso}::${item.title.trim()}`;
    if (existingKeys.has(key)) { skipped++; continue; }

    const task: Task = {
      title: item.title,
      description: item.description,
      due_date: dueIso,
      priority: item.priority,
      status: "pending",
      created_at: now,
    };
    const clean = Object.fromEntries(Object.entries(task).filter(([, v]) => v !== undefined));
    const ref = adminDb.collection("tasks").doc();
    batch.set(ref, clean);
    created++;
  }

  if (created > 0) await batch.commit();

  return NextResponse.json({
    created,
    skipped,
    start: toIso(start),
    end: toIso(endDate),
  });
}
