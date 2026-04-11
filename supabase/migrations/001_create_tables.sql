-- ============================================================
-- PHASE 2: District AI Index — Supabase Schema
-- Migration 001: Core Tables
-- ============================================================

-- Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";    -- fuzzy text search

-- ============================================================
-- 1. CATEGORIES — normalized category list
-- ============================================================
create table categories (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  slug        text unique not null,
  description text,
  icon        text,                          -- Lucide icon name
  display_order int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- 2. TOOLS — primary directory listing
-- ============================================================
create table tools (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  slug                    text unique not null,
  vendor                  text not null,
  description             text not null,
  overview                text,
  why_it_matters          text,
  website_url             text not null,
  affiliate_url           text,              -- monetization: tracked outbound URL
  logo_url                text,

  -- Scoring (4 dimensions, each 0–10)
  ease_of_use_score       numeric(3,1) not null default 0
    check (ease_of_use_score >= 0 and ease_of_use_score <= 10),
  instructional_value_score numeric(3,1) not null default 0
    check (instructional_value_score >= 0 and instructional_value_score <= 10),
  privacy_score           numeric(3,1) not null default 0
    check (privacy_score >= 0 and privacy_score <= 10),
  accessibility_score     numeric(3,1) not null default 0
    check (accessibility_score >= 0 and accessibility_score <= 10),

  -- Overall score: weighted average (computed by trigger or application)
  overall_score           numeric(3,1) not null default 0
    check (overall_score >= 0 and overall_score <= 10),

  -- Classification
  pricing_type            text not null default 'Freemium'
    check (pricing_type in ('Free', 'Freemium', 'Paid')),
  pricing_details         text,
  privacy_level           text not null default 'Medium'
    check (privacy_level in ('High', 'Medium', 'Low')),
  accessibility_level     text not null default 'Moderate'
    check (accessibility_level in ('Strong', 'Moderate', 'Basic')),
  grade_levels            text[] default '{}',          -- e.g., {"K-2","3-5","6-8","9-12"}
  subjects                text[] default '{}',
  use_cases               text[] default '{}',
  audiences               text[] default '{}',

  -- Content fields
  best_for                text[] default '{}',
  not_ideal_for           text[] default '{}',
  key_features            text[] default '{}',
  instructional_fit       text,
  implementation_notes    text,
  privacy_notes           text,
  accessibility_notes     text,
  admin_integration_notes text,
  editorial_verdict       text,
  reviewer_notes          text,
  tags                    text[] default '{}',
  integrations            text[] default '{}',
  similar_tool_slugs      text[] default '{}',

  -- Listing management
  listing_tier            text not null default 'basic'
    check (listing_tier in ('basic', 'featured', 'verified')),
  featured_flag           boolean default false,
  featured_rank           int,
  is_sponsored            boolean default false,
  sponsor_label           text,              -- e.g., "Sponsored by Adobe"
  status                  text not null default 'pending'
    check (status in ('pending', 'in_review', 'approved', 'rejected', 'published', 'archived')),

  -- Dates
  last_reviewed_at        date,
  published_at            timestamptz,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- ============================================================
-- 3. TOOL_CATEGORIES — many-to-many join
-- ============================================================
create table tool_categories (
  tool_id     uuid references tools(id) on delete cascade not null,
  category_id uuid references categories(id) on delete cascade not null,
  is_primary  boolean default false,
  primary key (tool_id, category_id)
);

-- ============================================================
-- 4. COMPLIANCE_SIGNALS — per-tool compliance checklist
-- ============================================================
create table compliance_signals (
  id        uuid primary key default gen_random_uuid(),
  tool_id   uuid references tools(id) on delete cascade not null,
  label     text not null,                  -- e.g., "FERPA Compliant"
  status    text not null default 'unknown'
    check (status in ('available', 'partial', 'unavailable', 'unknown')),
  notes     text,
  unique(tool_id, label)
);

-- ============================================================
-- 5. AFFILIATE_LINKS — click tracking for monetization
-- ============================================================
create table affiliate_links (
  id            uuid primary key default gen_random_uuid(),
  tool_id       uuid references tools(id) on delete cascade not null,
  url           text not null,
  utm_source    text default 'districtai',
  utm_medium    text default 'directory',
  utm_campaign  text,
  click_count   int default 0,
  last_clicked  timestamptz,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique(tool_id)
);

-- ============================================================
-- 6. AFFILIATE_CLICKS — individual click log (for analytics)
-- ============================================================
create table affiliate_clicks (
  id          uuid primary key default gen_random_uuid(),
  tool_id     uuid references tools(id) on delete cascade not null,
  link_id     uuid references affiliate_links(id) on delete set null,
  referrer    text,
  user_agent  text,
  ip_hash     text,                         -- hashed IP, not raw (privacy)
  clicked_at  timestamptz default now()
);

-- ============================================================
-- 7. FEATURED_CAMPAIGNS — time-bound sponsored placements
-- ============================================================
create table featured_campaigns (
  id              uuid primary key default gen_random_uuid(),
  tool_id         uuid references tools(id) on delete cascade not null,
  tier            text not null check (tier in ('featured', 'verified')),
  placement_zones text[] default '{}',      -- e.g., {"homepage_featured","directory_top"}
  start_date      date not null,
  end_date        date not null,
  monthly_fee     numeric(10,2),
  is_active       boolean generated always as (
    current_date >= start_date and current_date <= end_date
  ) stored,
  notes           text,
  created_at      timestamptz default now()
);

-- ============================================================
-- 8. MONTHLY_RANKINGS — frozen monthly snapshots
-- ============================================================
create table monthly_rankings (
  id              uuid primary key default gen_random_uuid(),
  tool_id         uuid references tools(id) on delete cascade not null,
  ranking_month   date not null,            -- first day of month (e.g., 2026-04-01)
  rank_position   int not null,
  computed_score  numeric(5,3) not null,    -- the blended ranking score
  overall_score   numeric(3,1),
  recency_score   numeric(5,3),
  engagement_score numeric(5,3),
  completeness_score numeric(5,3),
  ranking_type    text not null default 'top_tools'
    check (ranking_type in ('top_tools', 'best_free', 'most_improved')),
  created_at      timestamptz default now(),
  unique(tool_id, ranking_month, ranking_type)
);

-- ============================================================
-- 9. SOCIAL_POSTS — generated content queue
-- ============================================================
create table social_posts (
  id            uuid primary key default gen_random_uuid(),
  tool_id       uuid references tools(id) on delete set null,
  platform      text not null check (platform in ('twitter', 'linkedin', 'facebook', 'instagram')),
  content       text not null,
  hashtags      text[] default '{}',
  media_url     text,
  status        text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published', 'failed', 'cancelled')),
  scheduled_for timestamptz,
  published_at  timestamptz,
  post_type     text default 'tool_spotlight'
    check (post_type in ('tool_spotlight', 'free_tool', 'did_you_know', 'top_tools', 'new_tool', 'custom')),
  generated_by  text default 'claude',      -- 'claude', 'manual', 'template'
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- 10. AUTOMATION_LOGS — n8n workflow execution tracking
-- ============================================================
create table automation_logs (
  id              uuid primary key default gen_random_uuid(),
  workflow_name   text not null,
  workflow_id     text,                     -- n8n workflow ID
  execution_id    text,                     -- n8n execution ID
  status          text not null default 'started'
    check (status in ('started', 'completed', 'failed', 'partial')),
  started_at      timestamptz default now(),
  completed_at    timestamptz,
  items_processed int default 0,
  items_failed    int default 0,
  error_message   text,
  metadata        jsonb default '{}',       -- flexible payload for workflow-specific data
  created_at      timestamptz default now()
);

-- ============================================================
-- 11. UPDATE_QUEUE — tools flagged for content refresh
-- ============================================================
create table update_queue (
  id            uuid primary key default gen_random_uuid(),
  tool_id       uuid references tools(id) on delete cascade not null,
  reason        text not null,              -- e.g., "stale_review", "pricing_change", "new_feature"
  priority      text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status        text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'dismissed')),
  ai_summary    text,                       -- Claude-generated change summary
  assigned_to   text,                       -- reviewer email
  created_at    timestamptz default now(),
  resolved_at   timestamptz
);

-- ============================================================
-- 12. SUBMISSIONS — vendor tool submission pipeline
-- ============================================================
create table submissions (
  id                uuid primary key default gen_random_uuid(),
  tool_name         text not null,
  website_url       text not null,
  contact_name      text not null,
  contact_email     text not null,
  category          text,
  use_cases         text,
  pricing_type      text check (pricing_type in ('Free', 'Freemium', 'Paid')),
  privacy_docs      boolean default false,
  accessibility_docs boolean default false,
  requested_tier    text default 'basic' check (requested_tier in ('basic', 'featured', 'verified')),
  status            text default 'pending' check (status in ('pending', 'in_review', 'approved', 'rejected')),
  ai_enrichment     jsonb,                  -- Claude-generated initial data
  reviewer_notes    text,
  submitted_at      timestamptz default now(),
  reviewed_at       timestamptz
);

-- ============================================================
-- 13. NEWSLETTER_SUBSCRIBERS — email capture
-- ============================================================
create table newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  name            text,
  source          text default 'website',   -- 'website', 'footer', 'tool_page', 'import'
  status          text default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  subscribed_at   timestamptz default now(),
  unsubscribed_at timestamptz
);

-- ============================================================
-- 14. RANKING_CONFIGS — configurable ranking parameters
-- ============================================================
create table ranking_configs (
  id              uuid primary key default gen_random_uuid(),
  config_key      text unique not null,
  config_value    text not null,
  description     text,
  updated_at      timestamptz default now()
);

-- Insert default ranking configuration
insert into ranking_configs (config_key, config_value, description) values
  ('top_tools_score_weight', '0.50', 'Weight for overall_score in Top Tools ranking'),
  ('top_tools_recency_weight', '0.25', 'Weight for recency in Top Tools ranking'),
  ('top_tools_engagement_weight', '0.15', 'Weight for engagement in Top Tools ranking'),
  ('top_tools_completeness_weight', '0.10', 'Weight for profile completeness in Top Tools ranking'),
  ('best_free_include_freemium', 'true', 'Include Freemium tools in Best Free list'),
  ('best_free_min_score', '7.0', 'Minimum overall_score for Best Free list'),
  ('best_free_max_results', '10', 'Max tools in Best Free list'),
  ('top_tools_max_results', '10', 'Max tools in Top Tools list'),
  ('stale_review_days', '90', 'Days before a tool is flagged for review refresh');
