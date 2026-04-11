import { NextRequest, NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/seed-data";

/**
 * GET /api/track-click?tool=<slug>
 *
 * Affiliate click tracking endpoint.
 *
 * When Supabase is configured:
 *   1. Looks up tool's affiliate URL from database
 *   2. Increments click counter (atomic)
 *   3. Logs individual click with hashed IP
 *   4. 302 redirects to affiliate/website URL
 *
 * When Supabase is NOT configured (seed data mode):
 *   1. Looks up tool from seed data
 *   2. 302 redirects to affiliate_url or website
 *   (No tracking — just redirect)
 */
export async function GET(req: NextRequest) {
  const toolSlug = req.nextUrl.searchParams.get("tool");

  if (!toolSlug) {
    return NextResponse.json({ error: "Missing tool parameter" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // ── Supabase mode: full tracking ──────────────────────
  if (supabaseUrl && supabaseKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const { createHash } = await import("crypto");

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: tool } = await supabase
      .from("tools")
      .select("id, affiliate_url, website_url")
      .eq("slug", toolSlug)
      .eq("status", "published")
      .single();

    if (!tool) {
      return NextResponse.redirect(new URL(`/tool/${toolSlug}`, req.url));
    }

    const targetUrl = tool.affiliate_url || tool.website_url;

    // Hash IP for privacy
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = createHash("sha256").update(ip + toolSlug).digest("hex").slice(0, 16);

    // Atomic increment + log (fire and forget — don't block redirect)
    void (async () => {
      try {
        await supabase.rpc("increment_click_count", { p_tool_id: tool.id });
      } catch { /* RPC may not exist yet */ }
      try {
        await supabase.from("affiliate_clicks").insert({
          tool_id: tool.id,
          referrer: req.headers.get("referer") || null,
          user_agent: req.headers.get("user-agent") || null,
          ip_hash: ipHash,
        });
      } catch { /* non-blocking */ }
    })();

    return NextResponse.redirect(targetUrl, { status: 302 });
  }

  // ── Seed data mode: redirect only ─────────────────────
  const tool = getToolBySlug(toolSlug);

  if (!tool) {
    return NextResponse.redirect(new URL(`/tool/${toolSlug}`, req.url));
  }

  const targetUrl = tool.affiliate_url || tool.website;
  return NextResponse.redirect(targetUrl, { status: 302 });
}
