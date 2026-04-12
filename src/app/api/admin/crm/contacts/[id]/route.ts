import { NextRequest, NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Contact } from "@/lib/crm/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  const { id } = await params;
  const doc = await adminDb.collection("contacts").doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: doc.id, ...doc.data() });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  const { id } = await params;
  try {
    const body = (await req.json()) as Partial<Contact>;
    const ALLOWED = [
      "name", "email", "phone", "company", "role", "contact_type",
      "stage", "tags", "source", "linked_tool_slug",
      "last_contact_date", "next_follow_up", "notes",
    ];
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const k of ALLOWED) {
      if ((body as Record<string, unknown>)[k] !== undefined) updates[k] = (body as Record<string, unknown>)[k];
    }
    await adminDb.collection("contacts").doc(id).update(updates);
    return NextResponse.json({ id, ...updates });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  const { id } = await params;
  await adminDb.collection("contacts").doc(id).delete();
  return NextResponse.json({ status: "deleted", id });
}
