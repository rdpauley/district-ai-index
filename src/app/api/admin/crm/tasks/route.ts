import { NextRequest, NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Task } from "@/lib/crm/types";

export async function GET(req: NextRequest) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ tasks: [] });
  const status = req.nextUrl.searchParams.get("status");
  let query = adminDb.collection("tasks").orderBy("due_date", "asc").limit(500);
  if (status) query = adminDb.collection("tasks").where("status", "==", status).orderBy("due_date", "asc").limit(500);
  const snap = await query.get();
  const tasks: Task[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Task) }));
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  try {
    const body = (await req.json()) as Partial<Task>;
    if (!body.title || body.title.length > 200) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const task: Task = {
      title: body.title.trim(),
      description: body.description?.slice(0, 2000) || undefined,
      due_date: body.due_date || undefined,
      priority: body.priority || "medium",
      status: body.status || "pending",
      related_contact_id: body.related_contact_id || undefined,
      related_tool_slug: body.related_tool_slug || undefined,
      created_at: now,
    };
    const clean = Object.fromEntries(Object.entries(task).filter(([, v]) => v !== undefined));
    const docRef = await adminDb.collection("tasks").add(clean);
    return NextResponse.json({ id: docRef.id, ...clean }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
