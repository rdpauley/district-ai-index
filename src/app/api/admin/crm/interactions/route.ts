import { NextRequest, NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Interaction } from "@/lib/crm/types";

export async function GET(req: NextRequest) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ interactions: [] });

  const contactId = req.nextUrl.searchParams.get("contact_id");
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "100", 10), 500);

  let query = adminDb.collection("interactions").orderBy("date", "desc").limit(limit);
  if (contactId) query = adminDb.collection("interactions").where("contact_id", "==", contactId).orderBy("date", "desc").limit(limit);

  const snap = await query.get();
  const interactions: Interaction[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Interaction) }));
  return NextResponse.json({ interactions });
}

export async function POST(req: NextRequest) {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });

  try {
    const body = (await req.json()) as Partial<Interaction>;
    if (!body.contact_id || !body.type || !body.notes) {
      return NextResponse.json({ error: "contact_id, type, and notes required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const interaction: Interaction = {
      contact_id: body.contact_id,
      type: body.type,
      date: body.date || now,
      subject: body.subject?.slice(0, 200) || undefined,
      notes: body.notes.slice(0, 5000),
      outcome: body.outcome || "neutral",
      follow_up_date: body.follow_up_date || undefined,
      created_at: now,
    };

    const clean = Object.fromEntries(Object.entries(interaction).filter(([, v]) => v !== undefined));
    const docRef = await adminDb.collection("interactions").add(clean);

    // Also update the contact's last_contact_date
    await adminDb.collection("contacts").doc(body.contact_id).update({
      last_contact_date: interaction.date,
      updated_at: now,
      ...(interaction.follow_up_date ? { next_follow_up: interaction.follow_up_date } : {}),
    }).catch(() => { /* contact may not exist */ });

    return NextResponse.json({ id: docRef.id, ...clean }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
