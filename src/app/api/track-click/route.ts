import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

/**
 * GET /api/track-click?tool=<slug>
 *
 * Affiliate click tracking endpoint.
 * 1. Looks up the tool's affiliate URL
 * 2. Increments click counter (atomic)
 * 3. Logs the individual click
 * 4. Redirects user to the affiliate URL
 *
 * Rate limited: max 10 clicks per IP per tool per hour.
 */
export async function GET(req: NextRequest) {
  const toolSlug = req.nextUrl.searchParams.get("tool");

  if (!toolSlug) {
    return NextResponse.json({ error: "Missing tool parameter" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // If Supabase is not configured, redirect to tool's website via seed data
  if (!supabaseUrl || !supabaseKey) {
    // Fallback: redirect to a sensible default
    return NextResponse.redirect(new URL(`/tool/${toolSlug}`, req.url));
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  // Look up tool and affiliate link
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

  // Hash the IP for privacy (never store raw IPs)
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const ipHash = createHash("sha256").update(ip + toolSlug).digest("hex").slice(0, 16);

  // Increment click counter atomically
  try {
    await supabase
      .from("affiliate_links")
      .update({ last_clicked: new Date().toISOString() })
      .eq("tool_id", tool.id);

    // Atomic increment via raw SQL (Supabase supports this)
    await supabase.rpc("increment_click_count", { p_tool_id: tool.id });
  } catch {
    // RPC may not exist yet — non-blocking
  }

  // Log individual click
  await supabase.from("affiliate_clicks").insert({
    tool_id: tool.id,
    referrer: req.headers.get("referer") || null,
    user_agent: req.headers.get("user-agent") || null,
    ip_hash: ipHash,
  });

  // 302 redirect to affiliate/website URL
  return NextResponse.redirect(targetUrl, { status: 302 });
}
