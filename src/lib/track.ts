/**
 * Client-side event tracker for vendor analytics.
 * Fire-and-forget — never blocks user interaction.
 */

import type { VendorEventType } from "./vendor";

export function trackEvent(toolId: string, eventType: VendorEventType): void {
  if (typeof window === "undefined") return;
  // sendBeacon survives page navigation; falls back to fetch if unavailable.
  const body = JSON.stringify({ tool_id: toolId, event_type: eventType });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track-event", blob);
      return;
    }
  } catch {
    // fall through
  }
  fetch("/api/track-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking failures are silent.
  });
}
