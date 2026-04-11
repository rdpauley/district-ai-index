# PHASE 2 — Database Design

## Schema Overview

14 tables across 5 domains:

### Core Directory
| Table | Purpose | Rows (initial) |
|---|---|---|
| `tools` | Primary tool records with scores, content, classification | 25 |
| `categories` | Normalized category list | ~17 |
| `tool_categories` | Many-to-many join (tools ↔ categories) | ~35 |
| `compliance_signals` | Per-tool FERPA/COPPA/SOC2 checklist | ~75 |

### Monetization
| Table | Purpose |
|---|---|
| `affiliate_links` | Per-tool affiliate URLs with click counters |
| `affiliate_clicks` | Individual click log for analytics |
| `featured_campaigns` | Time-bound paid placement campaigns |

### Rankings
| Table | Purpose |
|---|---|
| `monthly_rankings` | Frozen monthly ranking snapshots |
| `ranking_configs` | Configurable weight/threshold parameters |

### Automation
| Table | Purpose |
|---|---|
| `social_posts` | Generated social content queue |
| `automation_logs` | n8n workflow execution tracking |
| `update_queue` | Tools flagged for content refresh |

### Intake
| Table | Purpose |
|---|---|
| `submissions` | Vendor tool submission pipeline |
| `newsletter_subscribers` | Email capture |

## Entity Relationship Summary

```
categories ←──── tool_categories ────→ tools
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
          compliance_signals    affiliate_links    featured_campaigns
                                        │
                                affiliate_clicks
                                        │
                                monthly_rankings
```

## Key Design Decisions

1. **Scores as columns, not JSONB** — enables `ORDER BY overall_score DESC` without function calls
2. **`monthly_rankings` as snapshots** — rankings frozen monthly, not live-computed. Auditable and cacheable.
3. **`featured_campaigns.is_active` as generated column** — automatically computed from date range, no cron needed
4. **`affiliate_clicks` separate from `affiliate_links`** — counter for fast reads, log for detailed analytics
5. **`pg_trgm` for fuzzy search** — trigram index on `name` and `description` enables `ILIKE '%query%'` with index support
6. **Array columns for multi-value fields** — `grade_levels`, `tags`, `integrations` use `text[]` with GIN indexes for `@>` containment queries

## Row-Level Security Strategy

- **Public reads**: `tools`, `categories`, `compliance_signals`, `monthly_rankings` — anyone can read published data
- **Public inserts**: `submissions`, `newsletter_subscribers` — form submissions allowed without auth
- **Admin only**: `affiliate_clicks`, `social_posts`, `automation_logs`, `update_queue` — service role required
- **Service role**: All tables have a service_role policy for n8n/admin operations

## Running Migrations

```bash
# In Supabase dashboard: SQL Editor → paste each migration file in order
# Or with Supabase CLI:
supabase db push
```

Migration order:
1. `001_create_tables.sql` — all 14 tables + default config
2. `002_create_indexes.sql` — 30+ performance indexes
3. `003_create_views.sql` — 8 computed views
4. `004_create_rls_policies.sql` — RLS + auto-update triggers

## Scalability Notes

- At 25 tools: zero performance concerns, any query is instant
- At 500 tools: `pg_trgm` indexes become valuable for search
- At 5000 tools: consider materialized views for rankings, partition `affiliate_clicks` by month
- Click tracking: atomic `UPDATE SET click_count = click_count + 1` handles concurrent writes without locks
