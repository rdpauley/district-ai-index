-- ============================================================
-- Migration 002: Indexes for Performance
-- ============================================================

-- Tools — primary lookup patterns
create index idx_tools_slug on tools(slug);
create index idx_tools_status on tools(status);
create index idx_tools_listing_tier on tools(listing_tier);
create index idx_tools_featured on tools(featured_flag) where featured_flag = true;
create index idx_tools_pricing on tools(pricing_type);
create index idx_tools_privacy on tools(privacy_level);
create index idx_tools_overall_score on tools(overall_score desc);
create index idx_tools_last_reviewed on tools(last_reviewed_at desc nulls last);
create index idx_tools_published on tools(status, published_at desc) where status = 'published';

-- Fuzzy search on tool name and description (pg_trgm)
create index idx_tools_name_trgm on tools using gin (name gin_trgm_ops);
create index idx_tools_desc_trgm on tools using gin (description gin_trgm_ops);

-- Array search on grade_levels and tags
create index idx_tools_grade_levels on tools using gin (grade_levels);
create index idx_tools_tags on tools using gin (tags);

-- Tool categories — join performance
create index idx_tool_categories_tool on tool_categories(tool_id);
create index idx_tool_categories_category on tool_categories(category_id);

-- Compliance signals
create index idx_compliance_tool on compliance_signals(tool_id);

-- Affiliate links
create index idx_affiliate_links_tool on affiliate_links(tool_id);
create index idx_affiliate_links_active on affiliate_links(is_active) where is_active = true;

-- Affiliate clicks — time-series queries
create index idx_affiliate_clicks_tool on affiliate_clicks(tool_id);
create index idx_affiliate_clicks_time on affiliate_clicks(clicked_at desc);
create index idx_affiliate_clicks_tool_time on affiliate_clicks(tool_id, clicked_at desc);

-- Featured campaigns — active lookups
create index idx_featured_campaigns_tool on featured_campaigns(tool_id);
create index idx_featured_campaigns_active on featured_campaigns(start_date, end_date);

-- Monthly rankings — fast month+type lookups
create index idx_monthly_rankings_month on monthly_rankings(ranking_month desc, ranking_type);
create index idx_monthly_rankings_tool on monthly_rankings(tool_id);

-- Social posts — queue processing
create index idx_social_posts_status on social_posts(status);
create index idx_social_posts_scheduled on social_posts(scheduled_for) where status = 'scheduled';

-- Automation logs — recent lookups
create index idx_automation_logs_workflow on automation_logs(workflow_name);
create index idx_automation_logs_status on automation_logs(status);
create index idx_automation_logs_time on automation_logs(started_at desc);

-- Update queue — pending items
create index idx_update_queue_status on update_queue(status) where status = 'pending';
create index idx_update_queue_priority on update_queue(priority, created_at);

-- Submissions — review queue
create index idx_submissions_status on submissions(status);
create index idx_submissions_time on submissions(submitted_at desc);

-- Newsletter — active subscribers
create index idx_newsletter_active on newsletter_subscribers(status) where status = 'active';
create index idx_newsletter_email on newsletter_subscribers(email);
