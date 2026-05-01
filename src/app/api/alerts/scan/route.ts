import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { tools } from "@/lib/seed-data";
import { snapshotTool, diffSnapshots, type ToolSnapshot } from "@/lib/alerts";

/**
 * POST /api/alerts/scan
 *
 * Cron-triggered (typically by n8n on a daily schedule). Compares the current
 * tool state against the last stored snapshot, computes diffs, and dispatches
 * one notification per affected subscriber via the n8n alerts webhook.
 *
 * Auth: shared secret via x-cron-secret header (matches CRON_SECRET env var).
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }
  if (secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  // 1. Load previous snapshots
  const prevSnap = await db.collection("tool_snapshots").get();
  const prevMap = new Map<string, ToolSnapshot>();
  for (const doc of prevSnap.docs) {
    prevMap.set(doc.id, doc.data() as ToolSnapshot);
  }

  // 2. Compute current snapshots and diffs
  const changesByToolId = new Map<string, ReturnType<typeof diffSnapshots>>();
  const writeBatch = db.batch();
  const scannedAt = new Date().toISOString();

  for (const tool of tools) {
    const current = snapshotTool(tool);
    const previous = prevMap.get(tool.id) || null;
    const changes = diffSnapshots(previous, current);
    if (changes.length > 0) {
      changesByToolId.set(tool.id, changes);
    }
    writeBatch.set(db.collection("tool_snapshots").doc(tool.id), {
      ...current,
      scanned_at: scannedAt,
    });
  }

  // 3. Persist new snapshots regardless of whether anything changed.
  await writeBatch.commit();

  if (changesByToolId.size === 0) {
    return NextResponse.json({
      status: "no_changes",
      scanned: tools.length,
      changed: 0,
      notified: 0,
    });
  }

  // 4. Find confirmed, non-unsubscribed alerts whose tool_ids overlap with changed tools
  const alertsSnap = await db
    .collection("tool_alerts")
    .where("confirmed_at", "!=", null)
    .get();

  const changedToolIds = new Set(changesByToolId.keys());
  const notifications: Array<{ email: string; alert_id: string; unsubscribe_token: string; tools: Array<{ id: string; name: string; changes: ReturnType<typeof diffSnapshots> }> }> = [];

  for (const alertDoc of alertsSnap.docs) {
    const alert = alertDoc.data() as {
      email: string;
      tool_ids: string[];
      unsubscribe_token: string;
      unsubscribed_at: string | null;
    };
    if (alert.unsubscribed_at) continue;
    const matchedToolIds = alert.tool_ids.filter((id) => changedToolIds.has(id));
    if (matchedToolIds.length === 0) continue;

    const matchedTools = matchedToolIds.map((id) => {
      const tool = tools.find((t) => t.id === id);
      return {
        id,
        name: tool?.name || id,
        changes: changesByToolId.get(id) || [],
      };
    });

    notifications.push({
      email: alert.email,
      alert_id: alertDoc.id,
      unsubscribe_token: alert.unsubscribe_token,
      tools: matchedTools,
    });
  }

  // 5. Dispatch notifications via n8n
  const n8nUrl = process.env.N8N_ALERTS_WEBHOOK_URL;
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://districtaiindex.com";

  let dispatched = 0;
  if (n8nUrl && n8nSecret) {
    for (const notif of notifications) {
      try {
        const res = await fetch(n8nUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-secret": n8nSecret,
          },
          body: JSON.stringify({
            action: "send_change_alert",
            to: notif.email,
            unsubscribe_url: `${siteUrl}/alerts/unsubscribe?token=${notif.unsubscribe_token}`,
            tools: notif.tools,
          }),
        });
        if (res.ok) dispatched += 1;

        // Stamp last_notified_at
        await db.collection("tool_alerts").doc(notif.alert_id).update({
          last_notified_at: scannedAt,
        });
      } catch (err) {
        console.error("[alerts/scan] dispatch failed for", notif.email, err instanceof Error ? err.message : "unknown");
      }
    }
  }

  return NextResponse.json({
    status: "scanned",
    scanned: tools.length,
    changed: changesByToolId.size,
    eligible_subscribers: notifications.length,
    notified: dispatched,
  });
}
