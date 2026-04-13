/**
 * 3-week operating plan for District AI Index.
 * ~2-4 hrs/day cadence. Offsets are days from start date.
 * Week 1 = setup & first outreach. Week 2 = content + vendor pitches.
 * Week 3 = follow-up + first paid conversion attempt.
 */

import type { TaskPriority } from "@/lib/crm/types";

export interface PlanItem {
  dayOffset: number;                 // 0 = start date
  title: string;
  priority: TaskPriority;
  description?: string;
}

export const THREE_WEEK_PLAN: PlanItem[] = [
  // ── Week 1: Foundation & First Outreach (days 0–6) ────────────
  { dayOffset: 0, priority: "high", title: "Write district cold-email template (v1)", description: "Subject + 120-word body. Emphasize the free tool-report PDF as the hook." },
  { dayOffset: 0, priority: "medium", title: "Build first outreach list: 25 district tech directors", description: "Target mid-size districts (5k–20k students). Save to CRM with stage=cold." },

  { dayOffset: 1, priority: "high", title: "Send 5 district cold emails (batch 1)" },
  { dayOffset: 1, priority: "medium", title: "Publish LinkedIn post #1: 'Why we built District AI Index'", description: "Voice: practitioner, not vendor. End with link to /directory." },

  { dayOffset: 2, priority: "high", title: "Send 5 district cold emails (batch 2)" },
  { dayOffset: 2, priority: "medium", title: "Draft newsletter #1: 'The 5 K-12 AI tools with real privacy posture'" },

  { dayOffset: 3, priority: "high", title: "Send 5 district cold emails (batch 3)" },
  { dayOffset: 3, priority: "medium", title: "Finish newsletter #1 draft; schedule for Tue Apr 21" },

  { dayOffset: 4, priority: "high", title: "Send 5 district cold emails (batch 4)" },
  { dayOffset: 4, priority: "low", title: "Create X/Twitter profile for District AI Index" },

  { dayOffset: 5, priority: "high", title: "Send 5 district cold emails (batch 5) — 25 total sent" },
  { dayOffset: 5, priority: "medium", title: "Publish LinkedIn post #2: 'One thing every AI tool in K-12 gets wrong'" },

  { dayOffset: 6, priority: "medium", title: "Week 1 review: log every reply/open in CRM, mark stage transitions" },

  // ── Week 2: Content + Vendor Pitches (days 7–13) ──────────────
  { dayOffset: 7, priority: "medium", title: "Pick 10 featured-listing candidates from the 64 tools", description: "Score: high instructional value + good privacy posture + willing to pay $99-199/mo." },

  { dayOffset: 8, priority: "high", title: "Send district follow-up emails to anyone who opened but didn't reply" },
  { dayOffset: 8, priority: "high", title: "Draft vendor pitch email (featured listing $)", description: "Lead with traffic stats, not features. Offer 14-day trial of Featured tier." },

  { dayOffset: 9, priority: "high", title: "Send 3 vendor cold emails (featured tier pitch, batch 1)" },
  { dayOffset: 9, priority: "high", title: "Publish newsletter #1" },

  { dayOffset: 10, priority: "high", title: "Send 3 vendor cold emails (batch 2) — 6 total" },
  { dayOffset: 10, priority: "medium", title: "LinkedIn post #3: case-study style — one tool that gets accessibility right" },

  { dayOffset: 11, priority: "high", title: "Send 3 vendor cold emails (batch 3) — 9 total" },
  { dayOffset: 11, priority: "medium", title: "Review 10 tool reports for accuracy + broken links" },

  { dayOffset: 12, priority: "high", title: "Send 5 more district cold emails (cohort 2 begins) — 30 total" },
  { dayOffset: 12, priority: "medium", title: "LinkedIn post #4: 'The questions districts should ask every AI vendor'" },

  { dayOffset: 13, priority: "medium", title: "Update CRM with all Week 2 activity; calculate reply rate" },
  { dayOffset: 13, priority: "medium", title: "Draft newsletter #2" },

  // ── Week 3: Follow-up + First Conversion (days 14–20) ─────────
  { dayOffset: 14, priority: "medium", title: "Review all responses; identify 3 warmest district leads" },

  { dayOffset: 15, priority: "urgent", title: "Email warmest 3 district leads: offer free 30-min walkthrough", description: "Async walkthrough — send a Loom link, not a meeting request." },
  { dayOffset: 15, priority: "medium", title: "LinkedIn post #5" },

  { dayOffset: 16, priority: "high", title: "Follow up with vendor non-responders (2nd touch)" },
  { dayOffset: 16, priority: "high", title: "Publish newsletter #2" },

  { dayOffset: 17, priority: "high", title: "Send 5 more district cold emails — 35 total" },
  { dayOffset: 17, priority: "medium", title: "Review 20 more tool reports for accuracy" },

  { dayOffset: 18, priority: "high", title: "Set up Stripe account for paid listings ($99 / $199 / $499 tiers)" },
  { dayOffset: 18, priority: "medium", title: "Add pricing page copy: what each tier gets" },

  { dayOffset: 19, priority: "medium", title: "Review remaining tool reports (finish all 64)" },
  { dayOffset: 19, priority: "medium", title: "LinkedIn post #6" },

  { dayOffset: 20, priority: "high", title: "Week 3 review: measure reply rate, traffic, first paid conversion" },
  { dayOffset: 20, priority: "medium", title: "Draft 4-week retrospective for your own notes; set Week 4 goals" },
];

export function countPlanByDay(): number[] {
  const counts = new Array(21).fill(0);
  for (const item of THREE_WEEK_PLAN) counts[item.dayOffset]++;
  return counts;
}
