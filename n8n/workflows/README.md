# n8n Workflow Designs — District AI Index

## Workflow A: Weekly Tool Update

**Trigger:** Cron — every Monday 6:00 AM UTC

### Node Map

```
[Cron Trigger: Monday 6am]
    │
    ▼
[Supabase: Query stale_tools view]
    │ Returns tools where last_reviewed_at > 90 days ago
    │
    ▼
[Split In Batches: Process each tool]
    │
    ├──▶ [HTTP Request: HEAD check tool website_url]
    │    └── Record: is_website_live (true/false)
    │
    ├──▶ [HTTP Request: Call Claude API]
    │    Prompt: update-summary.md
    │    Input: { tool_name, description, last_reviewed_at, website_url }
    │    Output: { summary, changes_detected, confidence }
    │
    ▼
[Supabase: Insert into update_queue]
    │ Fields: tool_id, reason, priority, ai_summary, status="pending"
    │
    ▼
[Supabase: Insert into automation_logs]
    │ Fields: workflow_name="weekly_update", status, items_processed
    │
    ▼
[Slack/Email: Notify admin]
    │ "Weekly Update: X tools flagged for refresh"
    │
    ▼
[End]
```

### Error Handling
- HTTP check timeout: 10s → mark as "website_unreachable"
- Claude API failure: retry 2x with 30s backoff, then skip
- Supabase write failure: log error, continue to next tool
- Entire workflow failure: automation_logs status="failed", error_message captured

---

## Workflow B: Social Media Posting

**Trigger:** Cron — Tuesday, Thursday, Saturday 10:00 AM UTC

### Node Map

```
[Cron Trigger: Tue/Thu/Sat 10am]
    │
    ▼
[Function: Determine post type by day]
    │ Tue → "tool_spotlight" (top monthly ranked tool)
    │ Thu → "free_tool" (random from best_free)
    │ Sat → "did_you_know" (random tool fact)
    │
    ▼
[Supabase: Fetch tool data based on post_type]
    │
    ▼
[HTTP Request: Call Claude API]
    │ Prompt: social-post.md
    │ Input: { tool, post_type, platforms: ["twitter","linkedin","facebook"] }
    │ Output: { twitter_post, linkedin_post, facebook_post }
    │
    ▼
[Split: One branch per platform]
    │
    ├──▶ [Supabase: Insert social_posts (platform="twitter")]
    ├──▶ [Supabase: Insert social_posts (platform="linkedin")]
    └──▶ [Supabase: Insert social_posts (platform="facebook")]
         │
         ▼ (if auto_publish enabled)
    [HTTP Request: Buffer API → schedule post]
         │
         ▼
    [Supabase: Update social_posts status → "scheduled"/"published"]
         │
         ▼
[Supabase: Insert into automation_logs]
    │
    ▼
[End]
```

### Error Handling
- Claude generation failure: use fallback template (stored in social_posts as post_type)
- Buffer API failure: mark as "draft" instead of "scheduled", notify admin
- Retry: 2 attempts with 60s backoff

---

## Workflow C: New Tool Intake

**Trigger:** Webhook — POST from /api/webhook/n8n (action: "new_submission")

### Node Map

```
[Webhook Trigger: POST with x-webhook-secret]
    │
    ▼
[Function: Validate required fields]
    │ Required: tool_name, website_url, contact_email
    │ Reject if missing → respond 400
    │
    ▼
[HTTP Request: Scrape tool website (basic metadata)]
    │ Extract: title, meta description, pricing page presence
    │
    ▼
[HTTP Request: Call Claude API]
    │ Prompt: tool-enrichment.md
    │ Input: { tool_name, website_url, scraped_metadata, submission_data }
    │ Output: {
    │   suggested_description,
    │   suggested_categories,
    │   suggested_grade_levels,
    │   privacy_flags,         ← "Cannot verify FERPA status from public info"
    │   confidence_level,      ← "low" / "medium" / "high"
    │   notes                  ← any concerns or flags
    │ }
    │
    ▼
[Supabase: Insert into submissions]
    │ Fields: tool_name, website_url, contact info, ai_enrichment (JSONB)
    │ Status: "pending"
    │
    ▼
[Slack/Email: Notify admin]
    │ "New submission: [tool_name] — AI confidence: [level]"
    │
    ▼
[Supabase: Insert into automation_logs]
    │
    ▼
[Respond: 200 OK { status: "received" }]
```

### Error Handling
- Website scrape failure: proceed without scraped data, note in ai_enrichment
- Claude API failure: insert submission without AI enrichment, flag for manual review
- Duplicate detection: check slug against existing tools before insert

---

## Environment Variables for n8n

Set these in n8n as credentials or environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
WEBHOOK_SECRET=your-shared-secret
BUFFER_ACCESS_TOKEN=...  (optional)
SLACK_WEBHOOK_URL=...    (optional)
ADMIN_EMAIL=admin@districtaiindex.com
```

## Importing Workflows into n8n

1. Open n8n → Workflows → Import from File
2. Import each JSON file from `n8n/workflows/`
3. Configure credentials (Supabase, HTTP headers for Claude)
4. Activate workflows
5. Test with manual execution first
