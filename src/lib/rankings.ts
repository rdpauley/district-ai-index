/**
 * District AI Index — Ranking Engine
 *
 * Computes monthly rankings using a weighted formula:
 *   monthly_score = (
 *     overall_score × score_weight          (default 0.50)
 *   + recency_score × recency_weight        (default 0.25)
 *   + engagement_score × engagement_weight  (default 0.15)
 *   + completeness_score × completeness_weight (default 0.10)
 *   )
 *
 * CRITICAL: featured_flag and is_sponsored DO NOT affect ranking.
 * Paid placement is handled separately via placement zones.
 */

export interface RankingWeights {
  score_weight: number;
  recency_weight: number;
  engagement_weight: number;
  completeness_weight: number;
}

export interface ToolRankingInput {
  id: string;
  overall_score: number;
  last_reviewed_at: string | null;
  click_count_30d: number;
  completeness_ratio: number;     // 0–1
  pricing_type: string;
}

export interface RankedTool {
  tool_id: string;
  rank_position: number;
  computed_score: number;
  overall_score: number;
  recency_score: number;
  engagement_score: number;
  completeness_score: number;
}

const DEFAULT_WEIGHTS: RankingWeights = {
  score_weight: 0.50,
  recency_weight: 0.25,
  engagement_weight: 0.15,
  completeness_weight: 0.10,
};

/**
 * Compute recency score (0–1).
 * Reviewed today = 1.0, 180+ days ago = 0.0.
 */
function computeRecencyScore(lastReviewedAt: string | null): number {
  if (!lastReviewedAt) return 0;
  const daysSince = Math.floor(
    (Date.now() - new Date(lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSince <= 0) return 1.0;
  if (daysSince >= 180) return 0.0;
  return 1.0 - daysSince / 180;
}

/**
 * Compute engagement score (0–1) using percentile ranking.
 * Tools are ranked by click_count_30d within the dataset.
 */
function computeEngagementScores(tools: ToolRankingInput[]): Map<string, number> {
  const sorted = [...tools].sort((a, b) => a.click_count_30d - b.click_count_30d);
  const map = new Map<string, number>();
  const n = sorted.length;
  if (n === 0) return map;
  if (n === 1) { map.set(sorted[0].id, sorted[0].click_count_30d > 0 ? 1 : 0); return map; }
  sorted.forEach((t, i) => {
    map.set(t.id, i / (n - 1));   // percentile 0–1
  });
  return map;
}

/**
 * Compute Top Tools This Month rankings.
 */
export function computeTopToolsRanking(
  tools: ToolRankingInput[],
  weights: RankingWeights = DEFAULT_WEIGHTS,
  maxResults = 10
): RankedTool[] {
  const engagementMap = computeEngagementScores(tools);

  const scored = tools.map((t) => {
    const normalizedScore = t.overall_score / 10;   // 0–1
    const recency = computeRecencyScore(t.last_reviewed_at);
    const engagement = engagementMap.get(t.id) || 0;
    const completeness = t.completeness_ratio;

    const computed =
      normalizedScore * weights.score_weight +
      recency * weights.recency_weight +
      engagement * weights.engagement_weight +
      completeness * weights.completeness_weight;

    return {
      tool_id: t.id,
      rank_position: 0,
      computed_score: Math.round(computed * 1000) / 1000,
      overall_score: t.overall_score,
      recency_score: Math.round(recency * 1000) / 1000,
      engagement_score: Math.round(engagement * 1000) / 1000,
      completeness_score: Math.round(completeness * 1000) / 1000,
    };
  });

  scored.sort((a, b) => b.computed_score - a.computed_score);

  return scored.slice(0, maxResults).map((t, i) => ({
    ...t,
    rank_position: i + 1,
  }));
}

/**
 * Compute Best Free Tools rankings.
 * Filters to Free + Freemium (configurable), then sorts by overall_score.
 */
export function computeBestFreeRanking(
  tools: ToolRankingInput[],
  includeFreemium = true,
  minScore = 7.0,
  maxResults = 10
): RankedTool[] {
  const eligible = tools.filter((t) => {
    if (t.overall_score < minScore) return false;
    if (t.pricing_type === "Free") return true;
    if (includeFreemium && t.pricing_type === "Freemium") return true;
    return false;
  });

  const scored = eligible.map((t) => ({
    tool_id: t.id,
    rank_position: 0,
    computed_score: t.overall_score / 10,
    overall_score: t.overall_score,
    recency_score: computeRecencyScore(t.last_reviewed_at),
    engagement_score: 0,
    completeness_score: t.completeness_ratio,
  }));

  scored.sort((a, b) => b.overall_score - a.overall_score);

  return scored.slice(0, maxResults).map((t, i) => ({
    ...t,
    rank_position: i + 1,
  }));
}
