import { NextRequest, NextResponse } from "next/server";
import { computeTopToolsRanking, computeBestFreeRanking } from "@/lib/rankings";
import type { ToolRankingInput } from "@/lib/rankings";
import { tools as seedTools } from "@/lib/seed-data";

/**
 * POST /api/rankings
 *
 * Compute and store monthly rankings.
 * Called by n8n cron job on the 1st of each month.
 *
 * Auth: requires RANKING_COMPUTATION_SECRET header.
 *
 * In production: reads from Supabase, writes snapshots back.
 * Currently: computes from seed data for demonstration.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-ranking-secret");
  const expected = process.env.RANKING_COMPUTATION_SECRET;

  if (expected && secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Build ranking inputs from seed data (replace with Supabase query in production)
  const rankingInputs: ToolRankingInput[] = seedTools.map((t) => ({
    id: t.id,
    overall_score: t.overall_score,
    last_reviewed_at: t.last_reviewed,
    click_count_30d: 0,           // no click data yet
    completeness_ratio: computeCompleteness(t),
    pricing_type: t.pricing_type,
  }));

  const topTools = computeTopToolsRanking(rankingInputs, undefined, 10);
  const bestFree = computeBestFreeRanking(rankingInputs, true, 7.0, 10);

  // In production: insert into monthly_rankings table
  // For now: return the computed rankings
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM

  return NextResponse.json({
    month,
    top_tools: topTools.map((r) => ({
      rank: r.rank_position,
      tool_id: r.tool_id,
      tool_name: seedTools.find((t) => t.id === r.tool_id)?.name,
      computed_score: r.computed_score,
      breakdown: {
        overall: r.overall_score,
        recency: r.recency_score,
        engagement: r.engagement_score,
        completeness: r.completeness_score,
      },
    })),
    best_free: bestFree.map((r) => ({
      rank: r.rank_position,
      tool_id: r.tool_id,
      tool_name: seedTools.find((t) => t.id === r.tool_id)?.name,
      overall_score: r.overall_score,
    })),
  });
}

/**
 * GET /api/rankings — return current rankings (read-only)
 */
export async function GET() {
  const rankingInputs: ToolRankingInput[] = seedTools.map((t) => ({
    id: t.id,
    overall_score: t.overall_score,
    last_reviewed_at: t.last_reviewed,
    click_count_30d: 0,
    completeness_ratio: computeCompleteness(t),
    pricing_type: t.pricing_type,
  }));

  const topTools = computeTopToolsRanking(rankingInputs, undefined, 10);
  const bestFree = computeBestFreeRanking(rankingInputs, true, 7.0, 10);

  return NextResponse.json({
    top_tools: topTools.map((r) => ({
      rank: r.rank_position,
      tool_id: r.tool_id,
      name: seedTools.find((t) => t.id === r.tool_id)?.name,
      score: r.computed_score,
    })),
    best_free: bestFree.map((r) => ({
      rank: r.rank_position,
      tool_id: r.tool_id,
      name: seedTools.find((t) => t.id === r.tool_id)?.name,
      score: r.overall_score,
    })),
  });
}

function computeCompleteness(tool: (typeof seedTools)[0]): number {
  let filled = 0;
  const total = 12;
  if (tool.overview) filled++;
  if (tool.why_it_matters) filled++;
  if (tool.best_for.length > 0) filled++;
  if (tool.not_ideal_for.length > 0) filled++;
  if (tool.key_features.length > 0) filled++;
  if (tool.instructional_fit) filled++;
  if (tool.privacy_notes) filled++;
  if (tool.accessibility_notes) filled++;
  if (tool.editorial_verdict) filled++;
  if (tool.logo_url) filled++;
  if (tool.integrations.length > 0) filled++;
  if (tool.last_reviewed) filled++;
  return filled / total;
}
