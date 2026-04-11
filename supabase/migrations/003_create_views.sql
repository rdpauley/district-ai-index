-- ============================================================
-- Migration 003: Views for Computed Fields + Common Queries
-- ============================================================

-- Published tools with computed privacy_flag
create or replace view published_tools as
select
  t.*,
  case
    when t.privacy_level = 'High' then 'District Ready'
    when t.privacy_level = 'Medium' then 'Teacher Use Only'
    else 'Use Caution'
  end as privacy_flag,
  coalesce(al.click_count, 0) as total_clicks,
  al.url as tracked_affiliate_url
from tools t
left join affiliate_links al on al.tool_id = t.id and al.is_active = true
where t.status = 'published';

-- Current month's Top Tools
create or replace view current_top_tools as
select
  mr.rank_position,
  mr.computed_score,
  t.id,
  t.name,
  t.slug,
  t.vendor,
  t.description,
  t.overall_score,
  t.pricing_type,
  t.privacy_level,
  t.logo_url,
  t.featured_flag,
  case
    when t.privacy_level = 'High' then 'District Ready'
    when t.privacy_level = 'Medium' then 'Teacher Use Only'
    else 'Use Caution'
  end as privacy_flag
from monthly_rankings mr
join tools t on t.id = mr.tool_id
where mr.ranking_month = date_trunc('month', current_date)::date
  and mr.ranking_type = 'top_tools'
order by mr.rank_position;

-- Current month's Best Free Tools
create or replace view current_best_free as
select
  mr.rank_position,
  mr.computed_score,
  t.id,
  t.name,
  t.slug,
  t.vendor,
  t.description,
  t.overall_score,
  t.pricing_type,
  t.privacy_level,
  t.logo_url,
  case
    when t.privacy_level = 'High' then 'District Ready'
    when t.privacy_level = 'Medium' then 'Teacher Use Only'
    else 'Use Caution'
  end as privacy_flag
from monthly_rankings mr
join tools t on t.id = mr.tool_id
where mr.ranking_month = date_trunc('month', current_date)::date
  and mr.ranking_type = 'best_free'
order by mr.rank_position;

-- Tools with active featured campaigns
create or replace view active_featured_tools as
select
  fc.tier,
  fc.placement_zones,
  fc.monthly_fee,
  t.id,
  t.name,
  t.slug,
  t.vendor,
  t.description,
  t.overall_score,
  t.pricing_type,
  t.logo_url,
  t.featured_flag,
  t.featured_rank
from featured_campaigns fc
join tools t on t.id = fc.tool_id
where fc.is_active = true
order by t.featured_rank nulls last, t.overall_score desc;

-- Stale tools needing review (configurable threshold)
create or replace view stale_tools as
select
  t.id,
  t.name,
  t.slug,
  t.last_reviewed_at,
  current_date - t.last_reviewed_at as days_since_review,
  t.overall_score
from tools t
where t.status = 'published'
  and t.last_reviewed_at < current_date - interval '90 days'
order by t.last_reviewed_at asc;

-- Affiliate performance summary (30-day)
create or replace view affiliate_performance_30d as
select
  t.id as tool_id,
  t.name,
  t.slug,
  al.url as affiliate_url,
  al.click_count as total_clicks,
  count(ac.id) as clicks_30d,
  max(ac.clicked_at) as last_click
from tools t
join affiliate_links al on al.tool_id = t.id
left join affiliate_clicks ac on ac.tool_id = t.id
  and ac.clicked_at > now() - interval '30 days'
group by t.id, t.name, t.slug, al.url, al.click_count
order by clicks_30d desc;

-- Submission pipeline summary
create or replace view submission_pipeline as
select
  status,
  count(*) as count,
  min(submitted_at) as oldest,
  max(submitted_at) as newest
from submissions
group by status;

-- Profile completeness calculation
create or replace view tool_completeness as
select
  t.id,
  t.name,
  t.slug,
  (
    (case when t.overview is not null and t.overview != '' then 1 else 0 end) +
    (case when t.why_it_matters is not null and t.why_it_matters != '' then 1 else 0 end) +
    (case when array_length(t.best_for, 1) > 0 then 1 else 0 end) +
    (case when array_length(t.not_ideal_for, 1) > 0 then 1 else 0 end) +
    (case when array_length(t.key_features, 1) > 0 then 1 else 0 end) +
    (case when t.instructional_fit is not null and t.instructional_fit != '' then 1 else 0 end) +
    (case when t.privacy_notes is not null and t.privacy_notes != '' then 1 else 0 end) +
    (case when t.accessibility_notes is not null and t.accessibility_notes != '' then 1 else 0 end) +
    (case when t.editorial_verdict is not null and t.editorial_verdict != '' then 1 else 0 end) +
    (case when t.logo_url is not null and t.logo_url != '' then 1 else 0 end) +
    (case when array_length(t.integrations, 1) > 0 then 1 else 0 end) +
    (case when t.last_reviewed_at is not null then 1 else 0 end)
  )::numeric / 12 as completeness_ratio
from tools t
where t.status = 'published';
