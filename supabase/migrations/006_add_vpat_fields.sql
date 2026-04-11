-- ============================================================
-- Migration 006: Add VPAT/ACR Fields
-- ============================================================

-- Add VPAT accessibility conformance report tracking to tools
alter table tools
  add column vpat_status text not null default 'unknown'
    check (vpat_status in ('available', 'on_request', 'not_available', 'unknown')),
  add column vpat_url text,
  add column vpat_notes text;

-- Index for filtering by VPAT availability
create index idx_tools_vpat_status on tools(vpat_status);

-- Update the published_tools view to include VPAT fields
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

comment on column tools.vpat_status is 'VPAT/ACR document availability: available (public download), on_request (vendor provides on request), not_available (no VPAT published), unknown (not yet researched)';
comment on column tools.vpat_url is 'Direct URL to download or view the VPAT/ACR document. NULL if not available.';
comment on column tools.vpat_notes is 'Human-readable notes about the VPAT status, e.g., "VPAT 2.5 published, WCAG AA 2.2 conformance."';
