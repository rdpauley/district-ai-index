-- ============================================================
-- Migration 005: Database Functions
-- ============================================================

-- Atomic click counter increment
-- Called by /api/track-click to avoid race conditions
create or replace function increment_click_count(p_tool_id uuid)
returns void as $$
begin
  update affiliate_links
  set click_count = click_count + 1,
      last_clicked = now(),
      updated_at = now()
  where tool_id = p_tool_id
    and is_active = true;
end;
$$ language plpgsql security definer;

-- Compute overall score from dimension scores
-- Can be called as a trigger or manually
create or replace function compute_overall_score(
  p_ease numeric,
  p_instructional numeric,
  p_privacy numeric,
  p_accessibility numeric
) returns numeric as $$
begin
  -- Weighted average: Instructional Value gets highest weight
  return round(
    (p_ease * 0.20 +
     p_instructional * 0.40 +
     p_privacy * 0.20 +
     p_accessibility * 0.20)::numeric,
    1
  );
end;
$$ language plpgsql immutable;

-- Get click count for a tool in the last N days
create or replace function get_clicks_since(
  p_tool_id uuid,
  p_days int default 30
) returns int as $$
  select count(*)::int
  from affiliate_clicks
  where tool_id = p_tool_id
    and clicked_at > now() - make_interval(days => p_days);
$$ language sql stable;

-- Batch compute monthly rankings (called by n8n or API)
create or replace function compute_monthly_rankings(
  p_ranking_month date default date_trunc('month', current_date)::date,
  p_max_results int default 10
) returns void as $$
declare
  v_score_weight numeric := 0.50;
  v_recency_weight numeric := 0.25;
  v_engagement_weight numeric := 0.15;
  v_completeness_weight numeric := 0.10;
begin
  -- Read weights from config if available
  select coalesce(
    (select config_value::numeric from ranking_configs where config_key = 'top_tools_score_weight'),
    0.50
  ) into v_score_weight;

  -- Delete existing rankings for this month (idempotent)
  delete from monthly_rankings
  where ranking_month = p_ranking_month
    and ranking_type = 'top_tools';

  -- Insert top tools ranking
  insert into monthly_rankings (
    tool_id, ranking_month, rank_position, computed_score,
    overall_score, recency_score, engagement_score, completeness_score,
    ranking_type
  )
  select
    t.id,
    p_ranking_month,
    row_number() over (order by
      (t.overall_score / 10.0) * v_score_weight +
      (case
        when t.last_reviewed_at is null then 0
        when current_date - t.last_reviewed_at >= 180 then 0
        else 1.0 - (current_date - t.last_reviewed_at)::numeric / 180
      end) * v_recency_weight +
      coalesce(get_clicks_since(t.id, 30)::numeric /
        nullif(max(get_clicks_since(t2.id, 30)) over (), 0), 0) * v_engagement_weight +
      (select completeness_ratio from tool_completeness tc where tc.id = t.id) * v_completeness_weight
      desc
    ),
    -- computed_score
    round(
      (t.overall_score / 10.0) * v_score_weight +
      (case
        when t.last_reviewed_at is null then 0
        when current_date - t.last_reviewed_at >= 180 then 0
        else 1.0 - (current_date - t.last_reviewed_at)::numeric / 180
      end) * v_recency_weight +
      coalesce(get_clicks_since(t.id, 30)::numeric /
        nullif(max(get_clicks_since(t2.id, 30)) over (), 0), 0) * v_engagement_weight +
      (select completeness_ratio from tool_completeness tc where tc.id = t.id) * v_completeness_weight
    , 3),
    t.overall_score,
    -- recency_score
    round(case
      when t.last_reviewed_at is null then 0
      when current_date - t.last_reviewed_at >= 180 then 0
      else 1.0 - (current_date - t.last_reviewed_at)::numeric / 180
    end, 3),
    -- engagement_score (percentile)
    round(coalesce(get_clicks_since(t.id, 30)::numeric /
      nullif(max(get_clicks_since(t2.id, 30)) over (), 0), 0), 3),
    -- completeness_score
    round((select completeness_ratio from tool_completeness tc where tc.id = t.id), 3),
    'top_tools'
  from tools t
  cross join tools t2
  where t.status = 'published'
  group by t.id
  order by 4  -- by computed_score desc (via row_number ordering)
  limit p_max_results;

  -- Delete existing best_free rankings
  delete from monthly_rankings
  where ranking_month = p_ranking_month
    and ranking_type = 'best_free';

  -- Insert best free tools ranking
  insert into monthly_rankings (
    tool_id, ranking_month, rank_position, computed_score,
    overall_score, ranking_type
  )
  select
    t.id,
    p_ranking_month,
    row_number() over (order by t.overall_score desc),
    t.overall_score / 10.0,
    t.overall_score,
    'best_free'
  from tools t
  where t.status = 'published'
    and t.pricing_type in ('Free', 'Freemium')
    and t.overall_score >= 7.0
  order by t.overall_score desc
  limit p_max_results;
end;
$$ language plpgsql security definer;
