-- ============================================================
-- Migration 004: Row-Level Security Policies
-- ============================================================
-- Strategy:
--   Public tables: anyone can read published data
--   Admin tables: only authenticated service role can write
--   Sensitive tables: restricted access

-- ============================================================
-- TOOLS — public read, admin write
-- ============================================================
alter table tools enable row level security;

-- Anyone can read published tools
create policy "Public can read published tools"
  on tools for select
  using (status = 'published');

-- Service role can do everything (used by admin/n8n)
create policy "Service role full access on tools"
  on tools for all
  using (auth.role() = 'service_role');

-- ============================================================
-- CATEGORIES — public read, admin write
-- ============================================================
alter table categories enable row level security;

create policy "Public can read categories"
  on categories for select
  using (true);

create policy "Service role full access on categories"
  on categories for all
  using (auth.role() = 'service_role');

-- ============================================================
-- TOOL_CATEGORIES — public read, admin write
-- ============================================================
alter table tool_categories enable row level security;

create policy "Public can read tool_categories"
  on tool_categories for select
  using (true);

create policy "Service role full access on tool_categories"
  on tool_categories for all
  using (auth.role() = 'service_role');

-- ============================================================
-- COMPLIANCE_SIGNALS — public read, admin write
-- ============================================================
alter table compliance_signals enable row level security;

create policy "Public can read compliance_signals"
  on compliance_signals for select
  using (true);

create policy "Service role full access on compliance_signals"
  on compliance_signals for all
  using (auth.role() = 'service_role');

-- ============================================================
-- AFFILIATE_LINKS — public read (for redirect), admin write
-- ============================================================
alter table affiliate_links enable row level security;

create policy "Public can read active affiliate_links"
  on affiliate_links for select
  using (is_active = true);

create policy "Service role full access on affiliate_links"
  on affiliate_links for all
  using (auth.role() = 'service_role');

-- ============================================================
-- AFFILIATE_CLICKS — admin only (sensitive analytics)
-- ============================================================
alter table affiliate_clicks enable row level security;

-- No public read — this is internal analytics data
create policy "Service role full access on affiliate_clicks"
  on affiliate_clicks for all
  using (auth.role() = 'service_role');

-- ============================================================
-- FEATURED_CAMPAIGNS — public read (active only), admin write
-- ============================================================
alter table featured_campaigns enable row level security;

create policy "Public can read active campaigns"
  on featured_campaigns for select
  using (is_active = true);

create policy "Service role full access on featured_campaigns"
  on featured_campaigns for all
  using (auth.role() = 'service_role');

-- ============================================================
-- MONTHLY_RANKINGS — public read, admin write
-- ============================================================
alter table monthly_rankings enable row level security;

create policy "Public can read monthly_rankings"
  on monthly_rankings for select
  using (true);

create policy "Service role full access on monthly_rankings"
  on monthly_rankings for all
  using (auth.role() = 'service_role');

-- ============================================================
-- SOCIAL_POSTS — admin only
-- ============================================================
alter table social_posts enable row level security;

create policy "Service role full access on social_posts"
  on social_posts for all
  using (auth.role() = 'service_role');

-- ============================================================
-- AUTOMATION_LOGS — admin only
-- ============================================================
alter table automation_logs enable row level security;

create policy "Service role full access on automation_logs"
  on automation_logs for all
  using (auth.role() = 'service_role');

-- ============================================================
-- UPDATE_QUEUE — admin only
-- ============================================================
alter table update_queue enable row level security;

create policy "Service role full access on update_queue"
  on update_queue for all
  using (auth.role() = 'service_role');

-- ============================================================
-- SUBMISSIONS — public insert (form), admin read/update
-- ============================================================
alter table submissions enable row level security;

-- Anyone can submit a tool (insert only)
create policy "Public can submit tools"
  on submissions for insert
  with check (true);

-- Only service role can read/update submissions
create policy "Service role full access on submissions"
  on submissions for all
  using (auth.role() = 'service_role');

-- ============================================================
-- NEWSLETTER_SUBSCRIBERS — public insert, admin manage
-- ============================================================
alter table newsletter_subscribers enable row level security;

create policy "Public can subscribe"
  on newsletter_subscribers for insert
  with check (true);

create policy "Service role full access on newsletter"
  on newsletter_subscribers for all
  using (auth.role() = 'service_role');

-- ============================================================
-- RANKING_CONFIGS — admin only
-- ============================================================
alter table ranking_configs enable row level security;

create policy "Public can read ranking_configs"
  on ranking_configs for select
  using (true);

create policy "Service role full access on ranking_configs"
  on ranking_configs for all
  using (auth.role() = 'service_role');

-- ============================================================
-- AUTO-UPDATE TRIGGER for updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tools_updated_at
  before update on tools
  for each row execute function update_updated_at();

create trigger affiliate_links_updated_at
  before update on affiliate_links
  for each row execute function update_updated_at();

create trigger social_posts_updated_at
  before update on social_posts
  for each row execute function update_updated_at();

create trigger categories_updated_at
  before update on categories
  for each row execute function update_updated_at();
