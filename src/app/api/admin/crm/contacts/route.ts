import { NextRequest, NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Contact } from "@/lib/crm/types";

export async function GET() {
  if (!isFirebaseAdminConfigured() || !adminDb) {
    return NextResponse.json({ contacts: [] });
  }

  const snap = await adminDb.collection("contacts").orderBy("updated_at", "desc").limit(500).get();
  const contacts: Contact[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Contact) }));
  return NextResponse.json({ contacts });
}

export async function POST(req: NextRequest) {
  if (!isFirebaseAdminConfigured() || !adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const body = (await req.json()) as Partial<Contact>;
    if (!body.name || body.name.length > 200) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const contact: Contact = {
      name: body.name.trim(),
      email: body.email?.trim() || undefined,
      phone: body.phone?.trim() || undefined,
      company: body.company?.trim() || undefined,
      role: body.role?.trim() || undefined,
      contact_type: body.contact_type || "other",
      stage: body.stage || "cold",
      tags: Array.isArray(body.tags) ? body.tags.slice(0, 20) : [],
      source: body.source?.trim() || undefined,
      linked_tool_slug: body.linked_tool_slug || undefined,
      last_contact_date: body.last_contact_date || undefined,
      next_follow_up: body.next_follow_up || undefined,
      notes: body.notes?.slice(0, 5000) || "",
      created_at: now,
      updated_at: now,
    };

    // Remove undefined fields (Firestore doesn't allow undefined)
    const clean = Object.fromEntries(
      Object.entries(contact).filter(([, v]) => v !== undefined)
    );

    const docRef = await adminDb.collection("contacts").add(clean);
    return NextResponse.json({ id: docRef.id, ...clean }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
