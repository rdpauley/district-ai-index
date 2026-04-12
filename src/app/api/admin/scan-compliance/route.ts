import { NextResponse } from "next/server";
import { tools } from "@/lib/seed-data";

/**
 * GET /api/admin/scan-compliance
 *
 * Automated compliance link scanner. For every tool's compliance signal
 * that has a URL, check if the URL is still live and accessible.
 *
 * Returns a report of:
 *   - Live links (200 OK)
 *   - Broken links (404, 403, 500, etc.)
 *   - Redirects (may indicate vendor moved the doc)
 *   - Timeouts (server unreachable)
 *
 * This is how you verify vendors haven't taken down their compliance docs.
 *
 * Runs behind admin auth (via middleware).
 */

interface ScanResult {
  tool_slug: string;
  tool_name: string;
  signal: string;
  url: string;
  status: "live" | "broken" | "redirected" | "timeout" | "error";
  http_status?: number;
  final_url?: string;
  error?: string;
}

async function checkUrl(url: string): Promise<Omit<ScanResult, "tool_slug" | "tool_name" | "signal">> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "DistrictAIIndex-ComplianceScanner/1.0 (+https://districtaiindex.com)",
      },
    });

    clearTimeout(timeoutId);

    if (res.status >= 200 && res.status < 300) {
      return {
        url,
        status: res.url !== url ? "redirected" : "live",
        http_status: res.status,
        final_url: res.url !== url ? res.url : undefined,
      };
    }

    return { url, status: "broken", http_status: res.status };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    if (error.includes("abort") || error.includes("timeout")) {
      return { url, status: "timeout", error };
    }
    return { url, status: "error", error };
  }
}

export async function GET() {
  const results: ScanResult[] = [];
  const toolsWithLinks = tools.filter((t) => t.compliance_signals.some((s) => s.url));

  // Scan in parallel batches of 10 to avoid overwhelming servers
  const batchSize = 10;
  const allChecks: Array<{ tool: typeof tools[0]; signal: typeof tools[0]["compliance_signals"][0] }> = [];

  for (const tool of toolsWithLinks) {
    for (const signal of tool.compliance_signals) {
      if (signal.url) allChecks.push({ tool, signal });
    }
  }

  for (let i = 0; i < allChecks.length; i += batchSize) {
    const batch = allChecks.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async ({ tool, signal }) => {
        const result = await checkUrl(signal.url!);
        return {
          tool_slug: tool.slug,
          tool_name: tool.name,
          signal: signal.label,
          ...result,
        };
      })
    );
    results.push(...batchResults);
  }

  // Aggregate
  const summary = {
    total_checked: results.length,
    live: results.filter((r) => r.status === "live").length,
    redirected: results.filter((r) => r.status === "redirected").length,
    broken: results.filter((r) => r.status === "broken").length,
    timeout: results.filter((r) => r.status === "timeout").length,
    error: results.filter((r) => r.status === "error").length,
    scanned_at: new Date().toISOString(),
  };

  // Flag tools that need review (broken or timeout links)
  const needs_review = results.filter(
    (r) => r.status === "broken" || r.status === "timeout"
  );

  // Also include tools with missing critical compliance signals
  const CRITICAL_SIGNALS = ["FERPA Compliant", "COPPA Compliant", "DPA Available"];
  const missing_critical = tools
    .map((t) => {
      const present = t.compliance_signals.map((s) => s.label);
      const missing = CRITICAL_SIGNALS.filter((c) => !present.includes(c));
      return missing.length > 0
        ? { tool_slug: t.slug, tool_name: t.name, missing_critical: missing }
        : null;
    })
    .filter((x) => x !== null);

  return NextResponse.json({
    summary,
    needs_review,
    missing_critical,
    all_results: results,
  });
}
