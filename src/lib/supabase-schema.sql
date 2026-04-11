-- District AI Index — Supabase Database Schema
-- Run this in your Supabase SQL editor to create all tables

-- Tools: the core directory listing
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  vendor text not null,
  website text not null,
  logo_url text,
  description text not null,
  overview text,
  best_for text[] default '{}',
  not_ideal_for text[] default '{}',
  key_features text[] default '{}',
  instructional_fit text,
  implementation_notes text,
  data_privacy_notes text,
  accessibility_notes text,
  admin_integration_notes text,
  editorial_verdict text,
  category text not null,
  grade_bands text[] default '{}',
  audiences text[] default '{}',
  pricing_model text not null,
  pricing_details text,
  tags text[] default '{}',
  integrations text[] default '{}',
  last_reviewed date,
  reviewer_notes text,
  listing_tier text not null default 'basic' check (listing_tier in ('basic', 'featured', 'verified')),
  is_verified boolean default false,
  is_sponsored boolean default false,
  status text not null default 'pending' check (status in ('pending', 'in_review', 'approved', 'rejected', 'published')),
  similar_tools text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tool scores: the 5-dimension scoring model
create table if not exists tool_scores (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade not null,
  ease_of_implementation int not null check (ease_of_implementation between 0 and 20),
  teacher_usability int not null check (teacher_usability between 0 and 20),
  student_safety int not null check (student_safety between 0 and 20),
  instructional_impact int not null check (instructional_impact between 0 and 20),
  integration_admin_readiness int not null check (integration_admin_readiness between 0 and 20),
  district_readiness_score int generated always as (
    ease_of_implementation + teacher_usability + student_safety + instructional_impact + integration_admin_readiness
  ) stored,
  created_at timestamptz default now(),
  unique(tool_id)
);

-- Tool tags: normalized tag table
create table if not exists tool_tags (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade not null,
  tag text not null,
  unique(tool_id, tag)
);

-- Compliance signals
create table if not exists compliance_signals (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade not null,
  label text not null,
  status text not null check (status in ('available', 'partial', 'unavailable', 'unknown')),
  unique(tool_id, label)
);

-- Pricing models
create table if not exists pricing_models (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade not null,
  model text not null,
  details text,
  price_per_teacher_monthly numeric,
  has_free_tier boolean default false,
  has_district_pricing boolean default false,
  unique(tool_id)
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade not null,
  reviewer text not null,
  review_date date not null default current_date,
  summary text,
  ease_of_implementation int check (ease_of_implementation between 0 and 20),
  teacher_usability int check (teacher_usability between 0 and 20),
  student_safety int check (student_safety between 0 and 20),
  instructional_impact int check (instructional_impact between 0 and 20),
  integration_admin_readiness int check (integration_admin_readiness between 0 and 20),
  created_at timestamptz default now()
);

-- Featured listings
create table if not exists featured_listings (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools(id) on delete cascade not null,
  position int not null,
  start_date date not null,
  end_date date not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Compare selections (per-session / per-user)
create table if not exists compare_selections (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  tool_id uuid references tools(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(session_id, tool_id)
);

-- Submissions
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null,
  website text not null,
  contact_name text not null,
  contact_email text not null,
  category text not null,
  use_cases text,
  pricing text not null,
  privacy_docs boolean default false,
  accessibility_docs boolean default false,
  requested_tier text not null default 'basic',
  status text not null default 'pending' check (status in ('pending', 'in_review', 'approved', 'rejected', 'published')),
  submitted_at timestamptz default now()
);

-- Privacy flag computed view
create or replace view tools_with_privacy as
select
  t.*,
  ts.district_readiness_score,
  ts.ease_of_implementation,
  ts.teacher_usability,
  ts.student_safety,
  ts.instructional_impact,
  ts.integration_admin_readiness,
  case
    when ts.district_readiness_score >= 85
      and (select count(*) from compliance_signals cs where cs.tool_id = t.id and cs.status = 'available') >= 3
    then 'District Ready'
    when ts.district_readiness_score >= 70 then 'Teacher Use Only'
    else 'Use Caution'
  end as privacy_flag
from tools t
left join tool_scores ts on ts.tool_id = t.id;

-- Indexes for performance
create index if not exists idx_tools_slug on tools(slug);
create index if not exists idx_tools_category on tools(category);
create index if not exists idx_tools_status on tools(status);
create index if not exists idx_tools_listing_tier on tools(listing_tier);
create index if not exists idx_tool_scores_tool_id on tool_scores(tool_id);
create index if not exists idx_compliance_signals_tool_id on compliance_signals(tool_id);
create index if not exists idx_submissions_status on submissions(status);

-- Row Level Security (enable for production)
-- alter table tools enable row level security;
-- alter table submissions enable row level security;
