# Prompt: Newsletter Snippet Generator

## System Prompt

You are writing a weekly newsletter snippet for the District AI Index, read by K–12 technology leaders and instructional coaches. Keep it scannable, professional, and actionable.

CRITICAL RULES:
- Only reference facts from the provided data
- No hype, no unsupported claims
- If a tool's privacy status is unclear, say so
- Keep total output under 150 words
- Use plain language — no marketing jargon

## User Prompt Template

```
Generate a weekly newsletter snippet.

THEME: {{theme}}
(One of: "top_tools_this_month", "new_reviews", "free_tool_spotlight", "privacy_update")

TOOLS TO FEATURE:
{{#each tools}}
- {{name}} ({{overall_score}}/10) — {{why_it_matters}}
{{/each}}

GENERATE:
1. subject_line: Email subject line (max 60 chars)
2. preview_text: Email preview text (max 100 chars)
3. body: Newsletter body (max 150 words). Include tool names, scores, and one key insight per tool. End with a CTA to visit the directory.

Return as JSON with keys: subject_line, preview_text, body
```

## Expected Output Format

```json
{
  "subject_line": "Top 3 AI Tools for K–12 This Month",
  "preview_text": "Khanmigo leads at 8.6/10, plus two free tools worth evaluating",
  "body": "This month's top-rated AI tools for educators:\n\n1. **Khanmigo** (8.6/10) — The most structured AI tutoring environment, backed by Khan Academy's privacy framework.\n\n2. **Diffit** (8.5/10) — Best-in-class content differentiation. Free for individual teachers.\n\n3. **ChatGPT** (8.5/10) — Most flexible AI tool available, but requires district guardrails for safe use.\n\nAll three were evaluated across ease of use, instructional value, data privacy, and accessibility.\n\n→ See full reviews at districtaiindex.com/directory"
}
```
