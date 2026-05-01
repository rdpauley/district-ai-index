import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getToolById } from "@/lib/seed-data";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_TOOLS_PER_ALERT = 25;

/**
 * POST /api/alerts/subscribe
 * Body: { email: string, tool_ids: string[] }
 *
 * Creates an unconfirmed alert subscription and (when N8N_ALERTS_WEBHOOK_URL
 * is configured) dispatches a confirmation email via n8n. The link in the
 * email points at /alerts/confirm?token=<confirm_token>.
 */
export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { key: "alerts-subscribe", max: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: unknown; tool_ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!Array.isArray(body.tool_ids) || body.tool_ids.length === 0) {
    return NextResponse.json({ error: "Pick at least one tool" }, { status: 400 });
  }

  const validIds: string[] = [];
  const seen = new Set<string>();
  for (const raw of body.tool_ids) {
    if (typeof raw !== "string") continue;
    if (seen.has(raw)) continue;
    if (!getToolById(raw)) continue;
    seen.add(raw);
    validIds.push(raw);
    if (validIds.length >= MAX_TOOLS_PER_ALERT) break;
  }
  if (validIds.length === 0) {
    return NextResponse.json({ error: "No valid tool IDs" }, { status: 400 });
  }

  const confirmToken = randomUUID();
  const unsubscribeToken = randomUUID();
  const now = new Date().toISOString();

  const db = getAdminDb();
  if (db) {
    try {
      await db.collection("tool_alerts").add({
        email,
        tool_ids: validIds,
        confirm_token: confirmToken,
        unsubscribe_token: unsubscribeToken,
        confirmed_at: null,
        unsubscribed_at: null,
        created_at: now,
        last_notified_at: null,
      });
    } catch (err) {
      console.error("[alerts/subscribe] firestore error:", err instanceof Error ? err.message : "unknown");
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://districtaiindex.com";
  const confirmUrl = `${siteUrl}/alerts/confirm?token=${confirmToken}`;
  const n8nUrl = process.env.N8N_ALERTS_WEBHOOK_URL;
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

  if (n8nUrl && n8nSecret) {
    try {
      await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": n8nSecret,
        },
        body: JSON.stringify({
          action: "send_confirmation",
          to: email,
          confirm_url: confirmUrl,
          tool_count: validIds.length,
        }),
      });
    } catch (err) {
      console.error("[alerts/subscribe] n8n dispatch failed:", err instanceof Error ? err.message : "unknown");
      // Don't fail the request — the alert is stored and the user can retry.
    }
  }

  return NextResponse.json({
    status: "pending_confirmation",
    message: "Check your inbox to confirm the subscription.",
  });
}
