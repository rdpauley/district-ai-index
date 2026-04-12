import { NextRequest, NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  const { id } = await params;
  try {
    const body = await req.json();
    const ALLOWED = ["title", "description", "due_date", "priority", "status", "related_contact_id", "related_tool_slug"];
    const updates: Record<string, unknown> = {};
    for (const k of ALLOWED) if (body[k] !== undefined) updates[k] = body[k];
    if (body.status === "done") updates.completed_at = new Date().toISOString();
    await adminDb.collection("tasks").doc(id).update(updates);
    return NextResponse.json({ id, ...updates });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  const { id } = await params;
  await adminDb.collection("tasks").doc(id).delete();
  return NextResponse.json({ status: "deleted", id });
}
