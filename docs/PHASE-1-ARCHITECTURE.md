# PHASE 1 — System Architecture

## District AI Index: AI Tools for Educators Directory
### Revenue-Ready Platform Architecture

---

## 1. System Overview

The District AI Index is a monetization-ready directory platform for K–12 AI tools. It generates revenue through three channels: **affiliate link clicks**, **featured/sponsored listings**, and **content marketing automation** (newsletter, social).

The architecture separates concerns into five layers:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│            Next.js App (Vercel / Edge)                  │
│   Homepage · Directory · Tool Pages · Admin · Reports    │
├─────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                     │
│         Supabase Client · API Routes · Edge Funcs        │
│   Ranking Engine · Affiliate Tracking · Search/Filter    │
├─────────────────────────────────────────────────────────┤
│                      DATA LAYER                          │
│              Supabase (PostgreSQL)                        │
│   tools · categories · affiliate_links · campaigns       │
│   monthly_rankings · social_posts · automation_logs      │
├─────────────────────────────────────────────────────────┤
│                   AUTOMATION LAYER                        │
│                    n8n (Self-hosted)                      │
│   Weekly Update · Social Posting · New Tool Intake       │
├─────────────────────────────────────────────────────────┤
│                   INTELLIGENCE LAYER                     │
│                Claude API (Anthropic)                     │
│   Descriptions · Social Posts · Summaries · QA Flags     │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Frontend — Next.js (App Router)

**Purpose:** Premium public-facing directory + admin interface.

| Component | Responsibility |
|---|---|
| Homepage | Hero, search, categories, featured tools, top tools, free tools, newsletter capture |
| Directory | Filterable/sortable browse with card + table views |
| Tool Detail | Full profile with scores, privacy notes, affiliate CTA |
| Compare | Side-by-side tool comparison (up to 4) |
| Verified | District-ready tools showcase |
| Pricing | Listing tier sales page |
| Submit | Vendor tool submission form |
| Admin | Review queue, tool management, analytics |
| Reports | Exportable PDFs/CSV for district leaders |

**Data fetching strategy:**
- Static Generation (ISR) for tool pages — rebuild every 1 hour
- Server Components for directory/homepage — fresh on each request
- Client Components for interactive filters, compare tray, search
- Supabase client for real-time admin updates

**Rendering approach:**
```
/ (homepage)         → SSG + ISR (revalidate: 3600)
/directory           → SSR (dynamic filters)
/tool/[slug]         → SSG + ISR (revalidate: 3600)
/compare             → Client-side (state-driven)
/verified            → SSG + ISR (revalidate: 3600)
/admin/*             → SSR + Auth-gated
/api/track-click     → Edge Function (affiliate tracking)
/api/webhook/n8n     → API Route (n8n integration)
```

### 2.2 Database — Supabase (PostgreSQL)

**Purpose:** Source of truth for all tool data, rankings, affiliate tracking, and automation state.

**Core tables:**
- `tools` — primary directory data (25+ records)
- `categories` — normalized category list
- `tool_categories` — many-to-many join
- `affiliate_links` — per-tool affiliate URLs with click tracking
- `featured_campaigns` — time-bound featured placement campaigns
- `monthly_rankings` — computed monthly "Top Tools" snapshots
- `social_posts` — generated social content queue
- `automation_logs` — n8n workflow execution logs
- `update_queue` — tools flagged for refresh
- `submissions` — vendor submission pipeline
- `newsletter_subscribers` — email capture

**Key design decisions:**
- Tool scores stored as individual columns (not JSONB) for direct SQL sorting/filtering
- `monthly_rankings` is a snapshot table — rankings computed and frozen monthly, not live-calculated
- `affiliate_links` has a `click_count` counter updated via Edge Function — no analytics dependency
- `featured_campaigns` has `start_date`/`end_date` so featured status expires automatically
- All tables have `created_at`/`updated_at` timestamps

### 2.3 Affiliate Monetization Structure

**Revenue flow:**
```
User clicks "Visit Tool" on tool card or detail page
         │
         ▼
   /api/track-click?tool_id=X
         │
    ┌────┴────┐
    │ Edge Fn │  1. Increment click_count in affiliate_links
    │         │  2. Log click with timestamp + referrer
    └────┬────┘
         │
         ▼
   302 Redirect → affiliate_url (with tracking params)
```

**Affiliate link types:**
- **Direct affiliate** — partner program URL with ref code (e.g., `?ref=districtai`)
- **Tracked outbound** — no affiliate program, but we track clicks for sponsor reporting
- **Sponsored CTA** — paid placement with custom CTA text, clearly labeled

**Transparency rules (non-negotiable):**
- All sponsored/featured tools are labeled with a visible badge
- Editorial scores are NEVER influenced by paid placement
- "Featured" and "Sponsored" are distinct labels:
  - Featured = editorially selected for quality
  - Sponsored = paid placement, clearly marked

### 2.4 Featured Listing Structure

**Three-tier model:**

| Tier | Price | What They Get |
|---|---|---|
| Basic | Free | Directory listing, profile page, score, editorial review |
| Featured | $299/mo | Priority placement, enhanced profile, category spotlight, analytics |
| Verified | $599/mo | Verified badge, compliance showcase, demo routing, quarterly re-eval |

**Featured campaigns table design:**
```sql
featured_campaigns (
  id, tool_id, tier, start_date, end_date,
  placement_zones,  -- JSONB: ["homepage_hero", "category_spotlight", "directory_top"]
  is_active,        -- computed from date range
  monthly_fee,
  notes
)
```

**Placement zones:**
1. `homepage_featured` — Top 3 cards on homepage with gold badge
2. `directory_top` — Pinned at top of directory results (labeled "Sponsored")
3. `category_spotlight` — Featured in category browse sections
4. `tool_sidebar` — "Related Sponsored Tool" on competitor detail pages

### 2.5 Top Tools This Month — Ranking Logic

**Formula (defensible, transparent):**

```
monthly_score = (
    overall_score × 0.50          -- editorial quality is primary signal
  + recency_score × 0.25          -- recently reviewed tools get a boost
  + engagement_score × 0.15       -- click-through rate proxy
  + completeness_score × 0.10     -- tools with full profiles rank higher
)
```

**Component definitions:**
- `overall_score` — the 4-dimension weighted average (0–10), normalized to 0–1
- `recency_score` — days since last review, mapped to 0–1 (reviewed today = 1.0, 180+ days ago = 0.0)
- `engagement_score` — affiliate clicks in past 30 days, percentile-ranked within dataset (0–1)
- `completeness_score` — % of optional fields filled (privacy_notes, accessibility_notes, compliance_signals, etc.)

**Critical rule:** `is_featured` and `is_sponsored` do NOT affect the monthly ranking formula. Paid placement is handled separately via placement zones. The editorial ranking is independent.

**Monthly snapshot process:**
1. On the 1st of each month, n8n workflow triggers ranking computation
2. Rankings are computed and stored in `monthly_rankings` table
3. Frontend reads from snapshot (not live-computed)
4. Previous months are preserved for trend analysis

### 2.6 Best Free Tools Logic

**Filter criteria:**
```sql
WHERE pricing_type IN ('Free', 'Freemium')
ORDER BY overall_score DESC, recency_score DESC
LIMIT 10
```

**Configurable rules (stored in `ranking_configs` table):**
- `include_freemium` — boolean (default: true)
- `min_score` — minimum overall_score threshold (default: 7.0)
- `max_results` — number of tools to display (default: 10)

### 2.7 n8n Workflow Design

Three core workflows:

#### Workflow A — Weekly Tool Update
```
Trigger: Cron (every Monday 6am UTC)
    │
    ▼
Query Supabase: tools WHERE last_reviewed < (now - 90 days)
    │
    ▼
For each stale tool:
  ├─ Fetch current website status (HTTP check)
  ├─ Call Claude: "Has anything changed for [tool]? Summarize."
  ├─ Generate update summary
  └─ Insert into update_queue (status: "pending_review")
    │
    ▼
Notify admin (Slack/email): "X tools flagged for refresh"
    │
    ▼
Log execution in automation_logs
```

#### Workflow B — Social Media Posting
```
Trigger: Cron (Tue/Thu/Sat 10am UTC)
    │
    ▼
Select content source:
  ├─ Monday: "Top Tool This Week" (highest monthly_ranking)
  ├─ Wednesday: "Free Tool Spotlight" (random from best_free_tools)
  └─ Friday: "Did You Know?" (random tool fact/feature)
    │
    ▼
Call Claude: Generate platform-specific posts
  ├─ Twitter/X (280 chars, hashtags)
  ├─ LinkedIn (professional tone, 1-2 paragraphs)
  └─ Facebook (conversational, question-based)
    │
    ▼
Insert into social_posts (status: "draft" or "scheduled")
    │
    ▼
If auto_publish enabled:
  ├─ Post to Buffer/Hootsuite API
  └─ Update status to "published"
    │
    ▼
Log execution in automation_logs
```

#### Workflow C — New Tool Intake
```
Trigger: Webhook (POST /api/webhook/n8n/new-submission)
    │
    ▼
Validate submission data
    │
    ▼
Call Claude: Enrich record
  ├─ Generate initial description from website scrape
  ├─ Categorize tool
  ├─ Flag potential compliance issues
  └─ Estimate initial scores (marked as "AI-estimated, pending review")
    │
    ▼
Insert into submissions table (status: "pending")
    │
    ▼
Notify admin: "New tool submission: [name]"
    │
    ▼
Log execution in automation_logs
```

### 2.8 Claude Integration Points

| Task | Input | Output | Guardrails |
|---|---|---|---|
| Tool description generation | Structured tool data (name, features, pricing) | 2-sentence description | Must not invent features. Source: provided data only. |
| Social post generation | Tool name + key facts + platform | Platform-specific post text | Professional tone. No hype. No unsupported claims. |
| Newsletter snippet | Top 3 tools + theme | 150-word newsletter block | Mark uncertainty. Preserve accessibility language. |
| Update summary | Old data + new data | Change summary | Only report verified changes. Flag unknowns. |
| Missing data flag | Tool record | List of missing/low-confidence fields | Never fabricate data to fill gaps. |

**Prompt engineering principles:**
- Every prompt includes: "Only use the structured data provided. Do not invent facts."
- Every prompt includes: "If uncertain, say 'Unverified' or 'Not confirmed'."
- Claude outputs are ALWAYS marked as AI-generated until human review
- Claude NEVER overwrites authoritative data — it writes to a staging/draft field

---

## 3. Data Flow Diagram

```
                                    ┌──────────────┐
                                    │   Visitor     │
                                    └──────┬───────┘
                                           │
                              browse / search / click
                                           │
                                    ┌──────▼───────┐
                                    │   Next.js     │
                                    │   Frontend    │
                                    └──────┬───────┘
                                           │
                          ┌────────────────┼────────────────┐
                          │                │                │
                   read tools        track click       submit tool
                          │                │                │
                   ┌──────▼─────┐  ┌──────▼─────┐  ┌──────▼──────┐
                   │  Supabase  │  │  Edge Fn   │  │  Webhook    │
                   │  Query     │  │  /track    │  │  /submit    │
                   └──────┬─────┘  └──────┬─────┘  └──────┬──────┘
                          │                │                │
                          │         increment          trigger n8n
                          │         click_count        intake workflow
                          │                │                │
                   ┌──────▼────────────────▼────────────────▼──────┐
                   │                  Supabase                      │
                   │    tools · affiliate_links · submissions       │
                   │    monthly_rankings · social_posts              │
                   └──────────────────┬────────────────────────────┘
                                      │
                          ┌───────────┼───────────┐
                          │           │           │
                     weekly       social      intake
                     update       posting     enrichment
                          │           │           │
                   ┌──────▼───────────▼───────────▼──────┐
                   │               n8n                     │
                   │     Workflow A · B · C                 │
                   └──────────────────┬───────────────────┘
                                      │
                               Claude API calls
                                      │
                               ┌──────▼──────┐
                               │  Claude API  │
                               │  (Anthropic) │
                               └─────────────┘
```

---

## 4. Folder Structure

```
district-ai-index/
├── docs/
│   ├── PHASE-1-ARCHITECTURE.md      ← you are here
│   ├── PHASE-2-DATABASE.md
│   ├── PHASE-6-N8N-WORKFLOWS.md
│   └── PHASE-7-CLAUDE-PROMPTS.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   ← homepage
│   │   ├── dashboard/page.tsx
│   │   ├── directory/page.tsx
│   │   ├── tool/[slug]/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── verified/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── submit/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── reports/page.tsx
│   │   └── api/
│   │       ├── track-click/route.ts   ← affiliate click tracking
│   │       ├── webhook/
│   │       │   └── n8n/route.ts       ← n8n webhook endpoint
│   │       ├── rankings/route.ts      ← compute monthly rankings
│   │       └── import/route.ts        ← JSON data import endpoint
│   ├── components/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── shell.tsx
│   │   ├── tool-card.tsx
│   │   ├── compare-tray.tsx
│   │   ├── score-ring.tsx
│   │   ├── status-badge.tsx
│   │   ├── kpi-card.tsx
│   │   └── ui/                        ← shadcn/ui primitives
│   ├── lib/
│   │   ├── types.ts                   ← TypeScript types
│   │   ├── seed-data.ts               ← static seed (fallback)
│   │   ├── supabase/
│   │   │   ├── client.ts              ← browser Supabase client
│   │   │   ├── server.ts              ← server Supabase client
│   │   │   ├── admin.ts               ← service-role client (admin ops)
│   │   │   └── queries.ts             ← reusable query functions
│   │   ├── rankings.ts                ← ranking computation logic
│   │   ├── affiliate.ts               ← affiliate URL builder + tracker
│   │   ├── compare-context.tsx         ← React context for compare
│   │   └── utils.ts
│   └── hooks/
│       ├── use-tools.ts               ← data fetching hooks
│       └── use-rankings.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_create_indexes.sql
│   │   ├── 003_create_views.sql
│   │   ├── 004_create_rls_policies.sql
│   │   └── 005_seed_data.sql
│   ├── functions/
│   │   └── track-click/index.ts       ← Supabase Edge Function
│   └── seed/
│       ├── tools.json                 ← importable JSON seed file
│       └── import.ts                  ← seed/import script
├── n8n/
│   ├── workflows/
│   │   ├── weekly-tool-update.json
│   │   ├── social-media-posting.json
│   │   └── new-tool-intake.json
│   └── README.md
├── prompts/
│   ├── tool-description.md
│   ├── social-post.md
│   ├── newsletter-snippet.md
│   ├── update-summary.md
│   └── missing-data-flag.md
├── .env.local                         ← local environment
├── .env.example                       ← documented env template
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 5. Environment Variables

```bash
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                    # public anon key (safe for client)
SUPABASE_SERVICE_ROLE_KEY=eyJ...                         # service role (server-only, NEVER expose)

# === Anthropic / Claude ===
ANTHROPIC_API_KEY=sk-ant-...                             # Claude API key (server-only)
CLAUDE_MODEL=claude-sonnet-4-20250514                          # model to use for content generation

# === n8n ===
N8N_WEBHOOK_SECRET=your-random-secret-here               # shared secret for webhook auth
N8N_BASE_URL=https://your-n8n-instance.com               # n8n instance URL

# === Affiliate Tracking ===
AFFILIATE_REDIRECT_BASE=https://districtaiindex.com/go   # base URL for tracked redirects
DEFAULT_UTM_SOURCE=districtai                            # default UTM source param
DEFAULT_UTM_MEDIUM=directory                             # default UTM medium param

# === Email / Newsletter ===
RESEND_API_KEY=re_...                                    # Resend.com for transactional email
NEWSLETTER_FROM=hello@districtaiindex.com

# === Social Media (for auto-posting) ===
BUFFER_ACCESS_TOKEN=...                                  # Buffer API (optional, for auto-posting)

# === App Config ===
NEXT_PUBLIC_SITE_URL=https://districtaiindex.com
ADMIN_EMAIL=admin@districtaiindex.com
RANKING_COMPUTATION_SECRET=your-cron-secret              # auth for ranking computation endpoint
```

---

## 6. Third-Party Integrations

| Service | Purpose | Required? | Cost |
|---|---|---|---|
| **Supabase** | Database, auth, edge functions, storage | Yes | Free tier → Pro ($25/mo) |
| **Vercel** | Frontend hosting, edge functions, ISR | Yes | Free tier → Pro ($20/mo) |
| **Anthropic Claude API** | Content generation, enrichment | Yes | Pay-per-use (~$3/MTok sonnet) |
| **n8n** | Workflow automation | Yes | Self-hosted (free) or Cloud ($20/mo) |
| **Resend** | Transactional email + newsletter | Recommended | Free tier (100 emails/day) |
| **Buffer** | Social media scheduling | Optional | Free tier (3 channels) |
| **Plausible/PostHog** | Privacy-friendly analytics | Recommended | Free tier available |
| **Stripe** | Payment processing for listing tiers | Phase 2 | 2.9% + $0.30 per transaction |

---

## 7. Security Considerations

- **Row-Level Security (RLS)** on all Supabase tables — public reads, authenticated writes
- **Service role key** used ONLY in server-side code (never in client bundle)
- **Webhook authentication** — n8n webhooks validated via shared secret in header
- **Rate limiting** on `/api/track-click` to prevent click fraud
- **Input validation** on all submission forms (server-side, not just client)
- **CORS** configured to allow only production domain
- **Affiliate URLs** validated against allowlist — no open redirect vulnerability

---

## 8. Scalability Notes

- **25 tools today → 500+ tools in 12 months**: Schema supports this. Add full-text search via `pg_trgm` extension at ~100 tools.
- **Monthly rankings**: Snapshot model means homepage never hits a complex query. O(1) reads.
- **Affiliate tracking**: Edge Function is stateless, scales horizontally. Click counts use `UPDATE ... SET click_count = click_count + 1` (atomic, no race condition).
- **n8n workflows**: Stateless automation. Each workflow execution is independent. Retry logic built in.
- **ISR (Incremental Static Regeneration)**: Tool pages are pre-rendered and cached. 1-hour revalidation means database load stays constant regardless of traffic.

---

## 9. Architecture Decisions Record

| Decision | Rationale |
|---|---|
| Supabase over Firebase | PostgreSQL gives us real SQL for ranking queries, views, and joins. RLS is more mature. |
| n8n over Zapier | Self-hostable, no per-execution pricing, supports custom code nodes for Claude calls. |
| ISR over full SSR | Tool data changes weekly, not per-request. ISR gives fast page loads with acceptable freshness. |
| Snapshot rankings over live computation | Monthly snapshots are auditable, cacheable, and don't create N+1 query problems. |
| Separate affiliate tracking endpoint | Keeps click tracking logic isolated. Allows rate limiting without affecting page loads. |
| Claude over GPT for content | Better at following constraints ("do not invent facts"), more predictable output for professional tone. |
| Edge Functions for click tracking | Sub-50ms response time globally. No cold starts. Critical for redirect UX. |

---

## Next: PHASE 2 — Database Design

Phase 2 will deliver:
- Complete SQL schema for Supabase
- All indexes and relationships
- Row-level security policies
- Views for computed fields (privacy_flag, ranking scores)
- Migration files ready to run
