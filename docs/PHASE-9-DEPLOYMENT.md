# PHASE 9 — Deployment & Operations

## Deployment Architecture

```
┌─────────────┐    ┌──────────────┐    ┌──────────┐
│   Vercel     │◄──►│   Supabase   │◄──►│   n8n    │
│  (Frontend)  │    │  (Database)  │    │  (Auto)  │
└──────┬──────┘    └──────────────┘    └────┬─────┘
       │                                     │
       │           ┌──────────────┐          │
       └──────────►│  Claude API  │◄─────────┘
                   │  (Anthropic) │
                   └──────────────┘
```

## Step 1: Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Note your `Project URL` and `anon key` and `service_role key`
3. Run migrations in order via SQL Editor:
   ```
   supabase/migrations/001_create_tables.sql
   supabase/migrations/002_create_indexes.sql
   supabase/migrations/003_create_views.sql
   supabase/migrations/004_create_rls_policies.sql
   ```
4. Verify tables created: Settings → Database → Tables

## Step 2: Seed Data Import

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Run import script (imports all 25 tools)
npx tsx supabase/seed/import.ts supabase/seed/tools.json
```

Expected output:
```
District AI Index — Tool Import
================================
Found 25 tools to import.
✓ All tools passed validation.
Ensuring 17 categories exist...
✓ 17 categories ready.
  Importing "MagicSchool AI"... ✓
  Importing "Khanmigo"... ✓
  ...
================================
Import complete:
  ✓ Imported: 25
```

## Step 3: Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect to Vercel: [vercel.com/new](https://vercel.com/new)
3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ANTHROPIC_API_KEY
   N8N_WEBHOOK_SECRET
   RANKING_COMPUTATION_SECRET
   NEXT_PUBLIC_SITE_URL
   ```
4. Deploy

## Step 4: n8n Setup

### Option A: Self-hosted (recommended for cost)
```bash
docker run -d --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your-password \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

### Option B: n8n Cloud ($20/mo)
Sign up at [n8n.io](https://n8n.io)

### Configure Workflows
1. Import workflow JSONs from `n8n/workflows/`
2. Set credentials:
   - Supabase: URL + service_role key
   - Anthropic: API key (as HTTP header credential)
   - Webhook secret: match `N8N_WEBHOOK_SECRET` env var
3. Activate all three workflows
4. Run manual test execution for each

## Operations Playbook

### Monthly: Update Rankings

Rankings are computed on the 1st of each month by n8n, but can also be triggered manually:

```bash
curl -X POST https://your-site.com/api/rankings \
  -H "x-ranking-secret: your-secret" \
  -H "Content-Type: application/json"
```

Or via n8n: add a Cron node that POSTs to `/api/rankings` on the 1st of each month.

### Managing Affiliate Links

**Add a new affiliate link:**
```sql
INSERT INTO affiliate_links (tool_id, url, utm_campaign)
SELECT id, 'https://tool.com?ref=dai', 'spring2026'
FROM tools WHERE slug = 'magicschool-ai';
```

**Deactivate an affiliate link:**
```sql
UPDATE affiliate_links SET is_active = false
WHERE tool_id = (SELECT id FROM tools WHERE slug = 'magicschool-ai');
```

**View affiliate performance:**
```sql
SELECT * FROM affiliate_performance_30d ORDER BY clicks_30d DESC;
```

### Managing Featured Tools

**Activate a featured campaign:**
```sql
INSERT INTO featured_campaigns (tool_id, tier, placement_zones, start_date, end_date, monthly_fee)
SELECT id, 'featured', ARRAY['homepage_featured', 'directory_top'], '2026-04-01', '2026-06-30', 299
FROM tools WHERE slug = 'grammarly';
```

**View active campaigns:**
```sql
SELECT * FROM active_featured_tools;
```

**Mark a tool as editorially featured (not paid):**
```sql
UPDATE tools SET featured_flag = true, featured_rank = 8 WHERE slug = 'edpuzzle';
```

### Adding or Removing Tools

**Publish a new tool from submissions:**
```sql
-- After reviewing the submission, create the tool record
INSERT INTO tools (name, slug, vendor, ...) VALUES (...);
-- Then update the submission status
UPDATE submissions SET status = 'approved', reviewed_at = now() WHERE id = '...';
```

**Archive a tool (soft delete):**
```sql
UPDATE tools SET status = 'archived' WHERE slug = 'old-tool';
```

### Reviewing Automation Logs

```sql
-- Last 10 workflow executions
SELECT workflow_name, status, items_processed, started_at, error_message
FROM automation_logs
ORDER BY started_at DESC
LIMIT 10;

-- Failed workflows in the last week
SELECT * FROM automation_logs
WHERE status = 'failed' AND started_at > now() - interval '7 days';
```

### Pausing Automation Safely

1. **In n8n:** Deactivate workflows (toggle off in the workflow list)
2. **Verify:** Check `automation_logs` to confirm no new executions
3. **Resume:** Reactivate workflows. They will pick up from the next scheduled trigger.

Pausing does NOT lose data. n8n cron triggers simply skip missed intervals.

### Monitoring Checklist (Weekly)

- [ ] Check `automation_logs` for failed executions
- [ ] Review `update_queue` for pending tool refreshes
- [ ] Check `submission_pipeline` view for unreviewed submissions
- [ ] Verify `affiliate_performance_30d` for click tracking health
- [ ] Review `social_posts` where status = 'draft' (approve or edit)

## Cost Estimates (Monthly)

| Service | Free Tier Covers | Paid If Needed |
|---|---|---|
| Supabase | 25 tools, moderate traffic | Pro $25/mo at scale |
| Vercel | 100GB bandwidth, 1000 builds | Pro $20/mo if needed |
| n8n | Self-hosted = $0 | Cloud $20/mo |
| Claude API | ~$1–3/mo for weekly content gen | Pay-per-use |
| Resend | 100 emails/day | Starter $20/mo |
| **Total (bootstrapped)** | **$0–5/mo** | |
| **Total (growth)** | | **$85–90/mo** |
