"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, Calendar, Mail, MessageSquare, Users, Target,
  CheckCircle2, Copy, Lock, Printer, Zap, TrendingUp,
  AlertCircle, FileText, Clock, Send, Coffee, Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Script {
  id: string;
  title: string;
  when: string;
  body: string;
  notes?: string;
}

function ScriptCard({ script }: { script: Script }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(script.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="bg-navy-50/50 px-4 py-3 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-navy">{script.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">When: {script.when}</p>
          </div>
          <button onClick={copy} className="text-xs font-semibold text-accent-blue hover:text-navy transition-colors flex items-center gap-1 shrink-0">
            {copied ? <><CheckCircle2 className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
          </button>
        </div>
      </div>
      <div className="p-4 bg-white">
        <pre className="text-xs text-charcoal whitespace-pre-wrap font-mono leading-relaxed">{script.body}</pre>
        {script.notes && (
          <p className="text-xs text-muted-foreground mt-3 italic border-t border-border pt-2">
            <strong>Note:</strong> {script.notes}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MarketingPlanPage() {
  return (
    <div className="bg-white min-h-screen">
      <style>{`@media print { nav, footer, .no-print { display: none !important; } body { font-size: 10px; } .print-break { page-break-before: always; } }`}</style>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-10">

        {/* Header */}
        <div className="no-print">
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-lg bg-navy px-2 py-1"><Lock className="h-4 w-4 text-white" aria-hidden="true" /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy">Private Marketing Playbook</span>
              </div>
              <h1 className="text-3xl font-bold text-navy">90-Day Marketing Plan</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Async-first launch strategy — written comms over phone calls.
              </p>
            </div>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-50">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Core Principle */}
        <section className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-6">
          <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Core Principle: Written Comms First
          </h2>
          <p className="text-sm text-charcoal leading-relaxed">
            Your marketing plan is designed around <strong>async-first, written-first communication</strong>. You never need to make a cold phone call. When someone requests a call, you redirect to email or a short written exchange. The scripts in this document handle every common scenario.
          </p>
          <p className="text-sm text-charcoal leading-relaxed mt-3">
            <strong>Why this works for District AI Index specifically:</strong> Your buyers (district CTOs, instructional coaches) are overwhelmed with calls and Zoom meetings. A well-written email that respects their time is WELCOMED — it&apos;s often preferred over a phone call. Same for vendors — they get 50 sales calls a week. A written outreach stands out.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* 90-DAY SCHEDULE */}
        {/* ═══════════════════════════════════════════════════ */}
        <section aria-labelledby="schedule-heading" className="print-break">
          <h2 id="schedule-heading" className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-accent-blue" aria-hidden="true" /> 90-Day Launch Schedule
          </h2>

          <p className="text-sm text-charcoal mb-4">
            <strong>Launch window:</strong> April 12, 2026 → July 11, 2026. Dates below are Mondays for weekly rhythm.
          </p>

          <div className="space-y-4">
            {/* WEEK 1-2: Foundation */}
            <div className="rounded-xl border-2 border-navy-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-navy">WEEKS 1-2: Foundation (April 14 – April 27)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Get brand + infrastructure ready. No outreach yet.</p>
                </div>
                <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-bold text-navy">Setup</span>
              </div>
              <div className="space-y-2">
                {[
                  { date: "Mon Apr 14", task: "Buy domain districtaiindex.com + point to Vercel", owner: "You" },
                  { date: "Tue Apr 15", task: "Create LinkedIn Company Page + Twitter/X @DistrictAIIndex", owner: "You" },
                  { date: "Wed Apr 16", task: "Update admin password from default", owner: "You" },
                  { date: "Thu Apr 17", task: "Draft LinkedIn launch post (use Script E-L1)", owner: "You" },
                  { date: "Fri Apr 18", task: "Set up calendar template for check-ins (use Notion/Google Cal)", owner: "You" },
                  { date: "Mon Apr 21", task: "Launch Day 1 — Post LinkedIn launch, share in 3 K-12 groups", owner: "You" },
                  { date: "Tue Apr 22", task: "Send announcement email to personal network (use Script E-N1)", owner: "You" },
                  { date: "Wed Apr 23", task: "Post first directory walkthrough thread on X/Twitter", owner: "You" },
                  { date: "Thu Apr 24", task: "Write 'What Districts Need From AI Tools' LinkedIn article", owner: "You" },
                  { date: "Fri Apr 25", task: "Check-in: Review week — visitors, signups. Adjust if needed.", owner: "Check-in" },
                ].map((t, i) => (
                  <div key={i} className={cn("flex items-center gap-3 rounded-lg p-2", t.owner === "Check-in" ? "bg-accent-blue/5 border border-accent-blue/20" : "bg-white")}>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-20">{t.date}</span>
                    <p className="text-xs text-charcoal flex-1">{t.task}</p>
                    <span className={cn("text-[10px] font-semibold uppercase shrink-0", t.owner === "Check-in" ? "text-accent-blue" : "text-muted-foreground")}>{t.owner}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-success-bg/30 border border-success/20 p-3">
                <p className="text-xs font-semibold text-success">KPIs for Weeks 1-2</p>
                <p className="text-xs text-charcoal mt-1">100-300 visitors • 10-25 newsletter signups • 2-5 vendor replies (curious, not closing yet)</p>
              </div>
            </div>

            {/* WEEK 3-4: Vendor Outreach */}
            <div className="rounded-xl border-2 border-navy-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-navy">WEEKS 3-4: Vendor Outreach (April 28 – May 11)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Start converting vendors. All outreach via email.</p>
                </div>
                <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-xs font-bold text-accent-blue">Outreach</span>
              </div>
              <div className="space-y-2">
                {[
                  { date: "Mon Apr 28", task: "Batch 1: Email 20 vendors (Script E-V1 — warm introduction)", owner: "You" },
                  { date: "Tue Apr 29", task: "LinkedIn post: 'How we score AI tools for schools' (Script E-L2)", owner: "You" },
                  { date: "Wed Apr 30", task: "Batch 2: Email 20 more vendors", owner: "You" },
                  { date: "Thu May 1", task: "Follow-up Batch 1 (Script E-V2 — 3-day followup)", owner: "You" },
                  { date: "Fri May 2", task: "Check-in: Review open rates, reply rates. Adjust subject lines.", owner: "Check-in" },
                  { date: "Mon May 5", task: "Batch 3: Final 24 vendors emailed", owner: "You" },
                  { date: "Tue May 6", task: "Respond to ALL replies within 24h (even \"not interested\")", owner: "You" },
                  { date: "Wed May 7", task: "LinkedIn post: 'FERPA + AI — what you need to know'", owner: "You" },
                  { date: "Thu May 8", task: "Send free 30-day Featured trial to 3-5 interested vendors (Script E-V3)", owner: "You" },
                  { date: "Fri May 9", task: "Check-in: Trials running, email engagement, first conversations", owner: "Check-in" },
                ].map((t, i) => (
                  <div key={i} className={cn("flex items-center gap-3 rounded-lg p-2", t.owner === "Check-in" ? "bg-accent-blue/5 border border-accent-blue/20" : "bg-white")}>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-20">{t.date}</span>
                    <p className="text-xs text-charcoal flex-1">{t.task}</p>
                    <span className={cn("text-[10px] font-semibold uppercase shrink-0", t.owner === "Check-in" ? "text-accent-blue" : "text-muted-foreground")}>{t.owner}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-success-bg/30 border border-success/20 p-3">
                <p className="text-xs font-semibold text-success">KPIs for Weeks 3-4</p>
                <p className="text-xs text-charcoal mt-1">64 vendor emails sent • 10-15% open rate • 3-5% reply rate • 2-4 free trials started</p>
              </div>
            </div>

            {/* WEEK 5-8: Content + Conversion */}
            <div className="rounded-xl border-2 border-navy-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-navy">WEEKS 5-8: Content + First Conversions (May 12 – June 8)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Build content engine, convert trials to paid.</p>
                </div>
                <span className="rounded-full bg-[#EEF2F7] px-2 py-0.5 text-xs font-bold text-accent-blue">Convert</span>
              </div>
              <div className="space-y-2">
                {[
                  { date: "Mon May 12", task: "Publish weekly newsletter issue #1 (Script E-N2)", owner: "You" },
                  { date: "Tue May 13", task: "LinkedIn article: 'The AI Tools Your District Probably Hasn't Evaluated'", owner: "You" },
                  { date: "Wed May 14", task: "Check-in: 30-day trial mid-point — ask vendors: 'Going well?'", owner: "Check-in" },
                  { date: "Mon May 19", task: "Launch on r/Teachers / r/education (check rules first)", owner: "You" },
                  { date: "Thu May 22", task: "Write case study from first engaged vendor", owner: "You" },
                  { date: "Mon May 26", task: "Convert trials: Send pitch email (Script E-V4)", owner: "You" },
                  { date: "Fri May 30", task: "Check-in: First paid conversion expected around this week", owner: "Check-in" },
                  { date: "Mon Jun 2", task: "Second vendor email batch — reference case study", owner: "You" },
                  { date: "Mon Jun 9", task: "Check-in: Month 2 metrics review, adjust strategy", owner: "Check-in" },
                ].map((t, i) => (
                  <div key={i} className={cn("flex items-center gap-3 rounded-lg p-2", t.owner === "Check-in" ? "bg-accent-blue/5 border border-accent-blue/20" : "bg-white")}>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-20">{t.date}</span>
                    <p className="text-xs text-charcoal flex-1">{t.task}</p>
                    <span className={cn("text-[10px] font-semibold uppercase shrink-0", t.owner === "Check-in" ? "text-accent-blue" : "text-muted-foreground")}>{t.owner}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-success-bg/30 border border-success/20 p-3">
                <p className="text-xs font-semibold text-success">KPIs for Weeks 5-8</p>
                <p className="text-xs text-charcoal mt-1">Target: 2-4 paid Featured subscribers ($600-$1,200 MRR) • 1,000+ visitors/mo • 75+ newsletter subs</p>
              </div>
            </div>

            {/* WEEK 9-12: Scale */}
            <div className="rounded-xl border-2 border-success/30 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-navy">WEEKS 9-12: Scale + First Verified (June 16 – July 11)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Push for Verified tier, launch district-side marketing.</p>
                </div>
                <span className="rounded-full bg-success-bg px-2 py-0.5 text-xs font-bold text-success">Scale</span>
              </div>
              <div className="space-y-2">
                {[
                  { date: "Mon Jun 16", task: "Begin district-side outreach (Script E-D1 — to CTOs)", owner: "You" },
                  { date: "Thu Jun 19", task: "Upsell email to Featured subscribers: Upgrade to Verified (Script E-V5)", owner: "You" },
                  { date: "Mon Jun 23", task: "Guest post pitch to EdSurge / Edweek / THE Journal", owner: "You" },
                  { date: "Fri Jun 27", task: "Check-in: MRR review, district engagement, Verified conversions", owner: "Check-in" },
                  { date: "Mon Jun 30", task: "Webinar invite sent to newsletter (async recording, not live)", owner: "You" },
                  { date: "Mon Jul 7", task: "Q2 wrap-up content: 'State of AI Tools for K-12 Q2 2026'", owner: "You" },
                  { date: "Fri Jul 11", task: "Check-in: 90-day review, plan Q3", owner: "Check-in" },
                ].map((t, i) => (
                  <div key={i} className={cn("flex items-center gap-3 rounded-lg p-2", t.owner === "Check-in" ? "bg-accent-blue/5 border border-accent-blue/20" : "bg-white")}>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0 w-20">{t.date}</span>
                    <p className="text-xs text-charcoal flex-1">{t.task}</p>
                    <span className={cn("text-[10px] font-semibold uppercase shrink-0", t.owner === "Check-in" ? "text-accent-blue" : "text-muted-foreground")}>{t.owner}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-success-bg/30 border border-success/20 p-3">
                <p className="text-xs font-semibold text-success">KPIs for Weeks 9-12 (Day 90 target)</p>
                <p className="text-xs text-charcoal mt-1">4-6 Featured ($1,196-$1,794 MRR) + 1 Verified ($599 MRR) = <strong>$1,795-$2,393 total MRR</strong> • 3,000+ visitors/mo • 200+ newsletter subs</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* EMAIL SCRIPTS */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break" aria-labelledby="email-heading">
          <h2 id="email-heading" className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Email Scripts
          </h2>
          <p className="text-sm text-charcoal mb-4">Copy-paste ready. Replace [variables]. All scripts are async-friendly.</p>

          <div className="space-y-4">
            <ScriptCard script={{
              id: "e-n1",
              title: "E-N1: Personal Network Launch Announcement",
              when: "Week 1, sent to your existing contacts",
              body: `Subject: Something I've been building — District AI Index

Hi [Name],

I've spent the past few months building something I think you might find useful or interesting:

**District AI Index** — an independent K–12 AI tools directory with privacy ratings, district readiness scores, and VPAT/ACR tracking. 64 tools reviewed so far.

It's live: https://districtaiindex.com

I built it because I kept seeing districts struggle to evaluate AI tools, and existing directories don't focus on compliance/privacy the way K-12 needs.

No ask — just wanted to share. If you know anyone in a district who'd find this useful, feel free to forward.

— Rachel`,
              notes: "Send to 20-50 personal contacts. No pitch. Just a share. 3-5 will reply with interest or intros.",
            }} />

            <ScriptCard script={{
              id: "e-v1",
              title: "E-V1: Vendor First-Touch (Warm Introduction)",
              when: "Week 3, sent to all 64 vendors",
              body: `Subject: Your tool is on District AI Index

Hi [Vendor Contact],

I run District AI Index — an independent K–12 AI tools directory that helps district CTOs and instructional coaches evaluate tools for classroom adoption.

[Tool Name] is listed at: https://districtaiindex.com/tool/[slug]

Current District Readiness Score: [X]/10
Privacy Status: [District Ready / Teacher Use Only / Use Caution]

I wanted to introduce myself and the directory. No pitch today — just wanted to let you know your tool is listed and give you the link so you can review how it appears.

If you'd like to see how to appear higher in search results or on our Verified District Ready page, I can send a short overview.

— Rachel
Editor, District AI Index
hello@districtaiindex.com`,
              notes: "Don't sell in email #1. Just inform. Curiosity drives replies, not pitches.",
            }} />

            <ScriptCard script={{
              id: "e-v2",
              title: "E-V2: Vendor Follow-Up (3 days after E-V1)",
              when: "Week 3-4, automated 3-day follow-up",
              body: `Subject: Re: Your tool is on District AI Index

Hi [Name],

Quick follow-up on my note last week. No pressure at all — wanted to make sure the original didn't get buried.

Two quick things if useful:

1. Your detailed score report: https://districtaiindex.com/tool/[slug]/report — shows exactly where you scored well and where there are gaps you could address to improve your rating.

2. Pricing for premium placement: https://districtaiindex.com/pricing — Featured is $299/mo, Verified District Ready is $599/mo.

If neither is interesting, that's totally fine. I just wanted to make sure you had the context.

— Rachel`,
              notes: "Shorter than E-V1. The score report link is the hook — most vendors open it out of curiosity.",
            }} />

            <ScriptCard script={{
              id: "e-v3",
              title: "E-V3: Free 30-Day Featured Trial Offer",
              when: "Week 4, sent to interested vendors",
              body: `Subject: 30-day Featured trial for [Tool Name]

Hi [Name],

Thanks for your reply — glad to hear [Tool Name] is on your radar for district expansion.

I'd like to offer you a 30-day free Featured listing:

• Priority placement in the directory
• Enhanced profile with rich media
• Dashboard recommendation eligibility
• Monthly performance analytics (I'll send you a report)

In exchange, I'd ask for permission to use your results (views, CTR) as an anonymized case study for other vendors.

The trial starts whenever you're ready. Just reply "yes" and I'll activate it today.

After 30 days, you can continue at $299/mo or drop back to the free Basic listing — no pressure either way.

— Rachel`,
              notes: "Use this for your first 5 trial vendors. The case study ask is what makes this a fair trade.",
            }} />

            <ScriptCard script={{
              id: "e-v4",
              title: "E-V4: Trial → Paid Conversion Pitch",
              when: "Day 26-28 of their 30-day trial",
              body: `Subject: Your 30-day trial results + what's next

Hi [Name],

Your 30-day Featured trial wraps up on [Date]. Here are your results:

**Profile views:** [X] ([X% vs. baseline])
**"Visit Tool" clicks:** [X]
**Comparison inclusions:** [X] (districts who compared you to competitors)
**Top searches that found you:** [search 1], [search 2], [search 3]

Compared to the average Basic listing, Featured got you roughly [X]x more visibility.

To continue at $299/mo, just reply "yes" and I'll send a payment link. To return to Basic (free), just reply "basic" and I'll switch it back — no hard feelings either way.

Happy to answer any questions via email.

— Rachel`,
              notes: "Lead with data, not a pitch. Let the numbers do the work.",
            }} />

            <ScriptCard script={{
              id: "e-v5",
              title: "E-V5: Featured → Verified Upgrade Pitch",
              when: "60+ days into Featured subscription",
              body: `Subject: Thinking about Verified District Ready?

Hi [Name],

You've been on Featured for [X] months now, and I've noticed something:

[X]% of the district admins viewing [Tool Name]'s profile also view our /verified page. That page converts 10-20x better than general directory traffic — but it only shows Verified tools.

The difference between Featured and Verified:
• Verified District Ready badge (major trust signal for CTOs)
• Premium /verified page placement
• DPA + Accessibility documentation highlights
• **Direct demo request routing to your sales team**
• Quarterly editorial re-evaluation

Price: $599/mo (vs. $299 you're paying now)

The upgrade fee pays for itself with one new district customer — and [Tool Name] already has [X] of the right compliance signals in place. Want me to send the Verified application link?

— Rachel`,
              notes: "Only send when you have the analytics to back it up. Otherwise the pitch falls flat.",
            }} />

            <ScriptCard script={{
              id: "e-d1",
              title: "E-D1: District CTO First Touch (Buyer-Side Outreach)",
              when: "Week 9, targeted district contacts",
              body: `Subject: AI tools your teachers are already using

Hi [CTO Name],

I run District AI Index — an independent directory of 64 AI tools being used in K–12 classrooms, with privacy ratings, FERPA/COPPA documentation links, and VPAT/ACR availability for each.

It's free for districts to use: https://districtaiindex.com

Two specific pages you might find useful:

1. Verified District Ready (tools that passed compliance review): https://districtaiindex.com/verified
2. Compare tool (side-by-side evaluation, up to 4): https://districtaiindex.com/compare

No pitch and nothing to sign up for. I just want district leaders to have this resource during procurement.

If there are specific tools or categories you wish were covered, reply and let me know — I prioritize reviews based on district requests.

— Rachel
Editor, District AI Index`,
              notes: "District CTOs respond to resources, not sales pitches. Give value first. Later you'll convert some into paid Custom Report buyers.",
            }} />

            <ScriptCard script={{
              id: "e-n2",
              title: "E-N2: Weekly Newsletter (Template)",
              when: "Every Monday",
              body: `Subject: [Week of Date] — 3 AI tools to evaluate this week

**This week's picks**

**1. [Tool Name]** ([Score]/10) — [Why it matters in one sentence]
→ [Profile link]

**2. [Tool Name]** ([Score]/10) — [Why it matters]
→ [Profile link]

**3. [Tool Name]** ([Score]/10) — [Why it matters]
→ [Profile link]

---

**Compliance corner**

[One short paragraph on a FERPA/COPPA/accessibility topic relevant this week]

---

**New this week**

[1-2 sentences about directory updates]

---

**Forward this to a district colleague?** They can subscribe at districtaiindex.com.

— Rachel
District AI Index`,
              notes: "Keep it short. 3 tools, 1 compliance tip, 1 site update. Under 300 words total. Send same time every Monday.",
            }} />

            <ScriptCard script={{
              id: "e-q1",
              title: "E-Q1: Reply to 'Can we jump on a call?' (Async Redirect)",
              when: "Any time someone asks for a phone/Zoom call",
              body: `Subject: Re: Can we jump on a call?

Hi [Name],

Thanks for the interest. I generally work async via email rather than phone — I find it lets me give more considered answers and document decisions cleanly.

Happy to answer any questions via email, usually within 24 hours. What would you like to know?

If you're deciding between tiers, this page walks through everything: https://districtaiindex.com/pricing

If you have a specific scenario (e.g., "How would my tool score if I published a VPAT?"), I can turn that around in writing.

— Rachel`,
              notes: "NEVER apologize for being async. Frame it as a feature, not a limitation. This filters out low-intent buyers.",
            }} />

            <ScriptCard script={{
              id: "e-q2",
              title: "E-Q2: Reply to 'Why was our score lower than X?'",
              when: "Vendor score dispute / complaint",
              body: `Subject: Re: Our score

Hi [Name],

Thanks for reaching out. Scores are based on four dimensions (Ease of Use, Instructional Value, Data Privacy, Accessibility) weighted as described in our methodology: https://districtaiindex.com/editorial-policy

Your detailed breakdown is here: https://districtaiindex.com/tool/[slug]/report

Looking at your specific case:
• [Specific gap 1, with link to the dimension breakdown]
• [Specific gap 2]

If you believe any of the underlying information is incorrect or outdated, send me the updated documentation and I'll re-evaluate. Common updates that affect scores:

• Published VPAT/ACR (currently marked: [status])
• DPA availability documentation
• FERPA compliance statement on your site
• New LMS integrations shipped

I re-review at no cost when there's new information.

— Rachel
Editor, District AI Index`,
              notes: "Always point them to the public methodology first. Be transparent about why and what they can fix.",
            }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* LINKEDIN SCRIPTS */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-accent-blue" aria-hidden="true" /> LinkedIn Scripts
          </h2>

          <div className="space-y-4">
            <ScriptCard script={{
              id: "l-1",
              title: "L-1: Launch Post",
              when: "Week 1, Day 1 of launch",
              body: `I just launched something I've been working on for months.

District AI Index — an independent directory of 64 AI tools for K–12 schools, with privacy ratings, district readiness scores, and VPAT/ACR tracking for each tool.

Why I built it: districts keep telling me they struggle to evaluate AI tools because existing directories don't focus on what matters for K-12 (FERPA compliance, DPA availability, accessibility conformance).

So I built one that does.

It's free for districts to use. Check it out: districtaiindex.com

If you're a district tech leader, instructional coach, or curriculum director evaluating AI tools — I'd love your feedback.

#K12 #EdTech #AIinEducation #DistrictAI`,
              notes: "Post on Monday 8am ET. Include a screenshot of the directory homepage in the post.",
            }} />

            <ScriptCard script={{
              id: "l-2",
              title: "L-2: Thought Leadership — Scoring Methodology",
              when: "Week 2-3, establishes expertise",
              body: `How we score AI tools for K-12 districts:

We evaluate across 4 dimensions (each 0-10):

1. **Ease of Use** (20% weight) — Can a teacher start using this in under 5 minutes?
2. **Instructional Value** (40% weight) — Does this genuinely improve teaching/learning?
3. **Data Privacy** (20% weight) — FERPA, COPPA, DPA, SOC 2 documented?
4. **Accessibility** (20% weight) — VPAT/ACR published? WCAG AA?

Why Instructional Value is weighted highest: educators care about learning outcomes, not features.

We score 64 tools this way. Here's a sample (Khanmigo, 8.6/10): districtaiindex.com/tool/khanmigo/report

Every score is editorial. Vendors can't pay for higher scores. Featured/Verified listings are clearly labeled and separate from editorial evaluation.

Full methodology: districtaiindex.com/editorial-policy

#AIinEducation #K12 #EdTechEvaluation`,
              notes: "This post is your 'expert positioning' anchor. Pin it to your profile.",
            }} />

            <ScriptCard script={{
              id: "l-3",
              title: "L-3: Tool Spotlight (weekly)",
              when: "Weekly — rotate between different tools",
              body: `Tool spotlight: [Tool Name]

What it does: [One sentence]
District AI Index score: [X]/10
Privacy status: [District Ready / Teacher Use Only / Use Caution]
Best for: [Grade band], [Use case]
Watch out for: [One specific limitation]

Why it matters: [2-3 sentence editorial take]

Full review: districtaiindex.com/tool/[slug]

[If applicable: Has VPAT / Has DPA / COPPA compliant — call out positives]

#K12 #AIinEducation #EdTech`,
              notes: "Rotate tools weekly. Don't spotlight the same tool twice in a quarter.",
            }} />

            <ScriptCard script={{
              id: "l-4",
              title: "L-4: Compliance Education",
              when: "Bi-weekly, establishes authority",
              body: `What is a VPAT and why should district CTOs care?

VPAT = Voluntary Product Accessibility Template. When a vendor fills one out, it becomes an Accessibility Conformance Report (ACR) that documents how well their tool meets WCAG 2.1 AA.

Why this matters for districts:

1. Section 508 compliance is required for federally-funded schools
2. ADA lawsuits against districts are rising
3. Your procurement team will ask for this — if the vendor doesn't have one, it's a red flag

Of 64 AI tools we reviewed, only 6 have publicly-available VPATs. Most either don't have one or only provide on request.

Full list with direct VPAT links: districtaiindex.com/verified

If you're vetting an AI tool, ask for the VPAT FIRST.

#K12 #Accessibility #VPAT #Section508`,
              notes: "These educational posts position you as the expert. They also send traffic to /verified.",
            }} />

            <ScriptCard script={{
              id: "l-5",
              title: "L-5: District Pain Point",
              when: "Weekly, drives district-side traffic",
              body: `Real question from a district CTO last week:

"I need to evaluate 12 AI tools for board approval by [date]. Where do I even start?"

My honest answer:

1. **Privacy first, features second.** Filter out anything without FERPA + COPPA compliance, full stop.

2. **Get DPA availability in writing.** If a vendor won't sign your district DPA, they're not an adult vendor.

3. **Don't trust vendor marketing.** Look for third-party scoring.

4. **Compare apples to apples.** Use a structured evaluation rubric.

We built districtaiindex.com for exactly this. Free for districts to use. 64 tools scored across 4 dimensions with compliance documentation linked for each.

Filter by "District Ready" to skip tools that fail the compliance bar: districtaiindex.com/verified

#K12CTO #EdTechProcurement #AIinEducation`,
              notes: "Answer a real-sounding question. Gets massive engagement from district audience.",
            }} />

            <ScriptCard script={{
              id: "l-dm-1",
              title: "L-DM-1: LinkedIn DM to District CTO",
              when: "When you see someone engage with your posts",
              body: `Hi [Name],

Saw you engaging with my recent post on [topic]. Thanks.

Quick question: what's the hardest part of evaluating AI tools at [District Name]? I'm working on new resources and want to make sure I'm solving real problems, not imagined ones.

No pitch — genuinely curious.

— Rachel
(District AI Index)`,
              notes: "Keep DMs SHORT. Always be the one giving, never asking. Converts to email exchanges.",
            }} />

            <ScriptCard script={{
              id: "l-dm-2",
              title: "L-DM-2: LinkedIn DM to Vendor (after they engage)",
              when: "When a vendor likes/comments on your post",
              body: `Hi [Name],

Thanks for engaging with my post on [topic]. I appreciate you weighing in.

[Tool Name] is already in the directory at districtaiindex.com/tool/[slug] — check it out when you have a second.

If you ever want to chat about how your tool appears to district buyers, I'm easiest to reach at hello@districtaiindex.com.

— Rachel`,
              notes: "Never pitch in a DM. Mention email at the end as the preferred channel.",
            }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* EVENT / CONFERENCE SCRIPTS */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Event & Conference Scripts
          </h2>
          <p className="text-sm text-charcoal mb-4">
            For when you attend ISTE, FETC, state CTO conferences. You can hand out written cards instead of chatting.
          </p>

          <div className="space-y-4">
            <ScriptCard script={{
              id: "ev-1",
              title: "EV-1: Business Card Back (Printed)",
              when: "Any conference or networking event",
              body: `Front of card:
  RACHEL [LAST NAME]
  Editor, District AI Index
  districtaiindex.com
  hello@districtaiindex.com

Back of card:
  The independent K–12 AI tools directory.

  64 tools reviewed across:
    • Ease of Use
    • Instructional Value
    • Data Privacy
    • Accessibility

  Free for districts. Linked FERPA/COPPA/VPAT docs.

  Scan QR → districtaiindex.com`,
              notes: "Print 500 cards. Hand them out at events instead of chatting. Include a QR code that goes to /directory.",
            }} />

            <ScriptCard script={{
              id: "ev-2",
              title: "EV-2: 30-Second Pitch (Memorized)",
              when: "When someone asks 'What do you do?' at an event",
              body: `"I run District AI Index — an independent directory of K-12 AI tools. We score every tool on privacy, accessibility, and instructional value, and link to the actual FERPA and VPAT documentation so districts can verify compliance themselves. 64 tools so far. Free for districts to use. Here's a card."

(Hand them a card. Don't wait for them to ask more questions.)`,
              notes: "Practice until this is automatic. Exactly 3 sentences + the card handoff. Leaves them curious enough to visit the site.",
            }} />

            <ScriptCard script={{
              id: "ev-3",
              title: "EV-3: Follow-Up Email After Event",
              when: "24-48 hours after meeting someone at a conference",
              body: `Subject: Great meeting you at [Event Name]

Hi [Name],

Good to meet you at [Event] yesterday. You mentioned [specific topic they brought up] — I thought about it and wanted to share a resource:

[Link to a relevant tool / article / directory page]

If useful, our Verified District Ready page is the fastest way to find tools that passed compliance review: districtaiindex.com/verified

And if you're on a district evaluation team, I'd love to know what's giving you the most friction. Always helpful to hear from practitioners.

— Rachel`,
              notes: "Send within 48 hours or they'll forget who you are. Reference a specific detail from the conversation to stand out.",
            }} />

            <ScriptCard script={{
              id: "ev-4",
              title: "EV-4: Speaker / Panelist Intro Email (Pitch Yourself)",
              when: "Pitching to conferences to speak",
              body: `Subject: Speaker submission — [Conference Name] [Year]

Hi [Organizer Name],

I'd like to submit a talk proposal for [Conference].

**Proposed Title:** "The 4 Questions Every District Should Ask Before Buying an AI Tool"

**Abstract:** 78% of K-12 districts now deploy at least one AI tool, but most lack a structured evaluation framework. In this session, I'll share a 4-dimension rubric used by District AI Index to score 64 AI tools, with a focus on data privacy and accessibility gaps that cost districts real money when overlooked. Attendees will leave with a printable evaluation checklist.

**Audience:** District CTOs, instructional coaches, curriculum directors

**Format:** 30-minute presentation + 15 min Q&A

**About me:** Editor at District AI Index (districtaiindex.com), an independent directory used by [X] district leaders per month. Background: [your relevant background].

Happy to customize the talk for [Conference]'s audience.

— Rachel`,
              notes: "Pitch 3-5 conferences per quarter. One YES per year moves your brand dramatically.",
            }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* CASUAL CONVERSATION SCRIPTS */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Coffee className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Casual Conversation Scripts
          </h2>
          <p className="text-sm text-charcoal mb-4">
            For dinner parties, family gatherings, coffee meetings. When someone asks &ldquo;what are you working on?&rdquo;
          </p>

          <div className="space-y-4">
            <ScriptCard script={{
              id: "c-1",
              title: "C-1: 'What do you do?' — Family/Friends",
              when: "Non-work casual setting, no tech background",
              body: `"I run a directory that helps schools figure out which AI tools are safe to use with students. There's a huge amount of AI hitting classrooms right now, and most schools don't have time to evaluate all of it — especially the privacy side. So I score them and the districts use my site to decide what to buy."

(If they want more: "Think of it like Consumer Reports, but for AI tools for schools.")

(If they ask how you make money: "Vendors pay to get featured placement. Districts use it free.")`,
              notes: "Tailor to their level. Most people don't need the full pitch — they want to understand the shape of the business.",
            }} />

            <ScriptCard script={{
              id: "c-2",
              title: "C-2: 'What do you do?' — Educator (Potential User)",
              when: "Talking to a teacher, principal, or district staff casually",
              body: `"I built a K-12 AI tools directory — 64 tools reviewed for FERPA compliance, accessibility, and classroom value. It's at districtaiindex.com, completely free for educators. If you're looking for something specific, you can filter by grade band or category. There's also a compare tool."

(Then ASK:) "Are you using any AI tools in your classroom / at your school right now?"

(This turns them into a conversation partner, not a pitch target. Their answer gives you real intelligence.)`,
              notes: "Always end with a question that gets them talking. That's when you learn what's broken and what to build next.",
            }} />

            <ScriptCard script={{
              id: "c-3",
              title: "C-3: 'What do you do?' — Tech/Startup People",
              when: "Meetup, startup event, VC/investor conversation",
              body: `"I run District AI Index — a B2B SaaS play in the K-12 AI space. It's a content directory with listing tiers — Basic is free, Featured is $299/mo, Verified is $599/mo. 64 tools listed, MRR growing, targeting $50k MRR by end of year. The TAM is big because every AI tool vendor needs distribution to districts, and existing channels are broken — Common Sense Media is too slow, G2 doesn't focus on K-12."

(For investors): "I'm bootstrapped right now and not raising, but happy to keep you posted as it scales."`,
              notes: "Lead with the business model and numbers. Tech people want to understand the mechanics, not the mission.",
            }} />

            <ScriptCard script={{
              id: "c-4",
              title: "C-4: 'How can I help?' Response",
              when: "When someone offers to help",
              body: `"Most helpful thing: share the site with one district person you know — a tech director, instructional coach, curriculum director, anyone in K-12 central office. Even just forwarding a link helps me grow the audience that makes the vendor side of the business work.

If you know any AI tool vendors, even better — I'd love an intro, just a one-line email."

(Have districtaiindex.com bookmarked on your phone so you can show it.)`,
              notes: "Always have a specific, easy ask ready. Vague 'just share it around' doesn't convert. Ask for ONE specific thing.",
            }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* OBJECTION HANDLERS */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Objection Handler Scripts
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Use these exact phrasings when these objections come up (they will, repeatedly).
          </p>

          <div className="space-y-4">
            <ScriptCard script={{
              id: "o-1",
              title: "O-1: 'Too expensive' ($299 or $599)",
              when: "Any price pushback from vendors",
              body: `"Completely fair. Here's the math I work with:

The average district contract for an AI tool is $10,000–$50,000 per year. If District AI Index helps [Tool Name] close even ONE new district this year, that's [$10K-$50K] in revenue for [$3,588-$7,188] in fees — a 3x-13x return.

If the directory doesn't generate any new district customers for you in 90 days, I'll refund in full. I've never had anyone take me up on the refund offer.

But I understand if the budget isn't there right now. Basic tier remains free, and I'll circle back in 3-6 months."`,
              notes: "Never drop the price. Always use the ROI framing. Offering a refund signals confidence.",
            }} />

            <ScriptCard script={{
              id: "o-2",
              title: "O-2: 'We already list on Common Sense / G2 / Capterra'",
              when: "Vendor already uses competitor directories",
              body: `"Good — those are solid platforms. District AI Index complements them, it doesn't replace them.

The specific value we add over those:
• We're K-12 specific (G2/Capterra serve every industry)
• We link to your actual VPAT, DPA, FERPA docs — district CTOs use this as a shortcut in procurement
• Our audience is district decision-makers, not teacher consumers (Common Sense focus)
• We're new, so early vendors get lasting 'first 10 listed' brand positioning

Most of our Featured vendors also list on G2 and see us as additive, not alternative."`,
              notes: "Reframe from competitor to complement. Never trash-talk competing platforms.",
            }} />

            <ScriptCard script={{
              id: "o-3",
              title: "O-3: 'Let me think about it / need to check with team'",
              when: "Standard stall response",
              body: `"Totally understand. Two things that might help the discussion:

1. Your detailed score report (shows exactly what Featured/Verified would improve): districtaiindex.com/tool/[slug]/report

2. ROI calculator: If you close 1 district at average $15K contract value, Featured pays back 4x. If you close 1 at average $25K Verified deal, Verified pays back 4x.

What specific information would help your team decide? Happy to send additional context via email."`,
              notes: "Always ask what specifically they need. This flushes out real objections or commits them to respond.",
            }} />

            <ScriptCard script={{
              id: "o-4",
              title: "O-4: 'Why should I trust your scoring?'",
              when: "Vendor questioning editorial integrity",
              body: `"Fair question. Our methodology is public:

• Full editorial policy: districtaiindex.com/editorial-policy
• Our scoring formula is documented (4 dimensions, specific weights)
• Every score links to the evidence (FERPA docs, VPATs, etc.)
• Featured/Verified status explicitly does NOT affect editorial scores
• Our ranking algorithm excludes paid status from its computation
• Our corrections policy is published — if you think we got something wrong, send documentation and we'll re-review at no cost

If you disagree with a specific score, send me the evidence and I'll walk through it."`,
              notes: "Transparency is your superpower. Point to the public documentation every time.",
            }} />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* WEEKLY CHECK-IN TEMPLATE */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Weekly Check-In Template
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Every Friday at 4pm. 30 minutes with yourself. Answer these questions honestly.
          </p>

          <div className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-6 space-y-4">
            <h3 className="text-sm font-bold text-navy">Friday Check-In Questions</h3>

            <div className="space-y-3">
              {[
                { q: "What did I plan to do this week?", a: "Review last Friday's plan + the 90-day schedule" },
                { q: "What did I actually do?", a: "Not blame — just observation. What got done? What didn't?" },
                { q: "Numbers", a: "Visitors this week • Newsletter signups • Vendor emails sent • Replies received • Paid conversions" },
                { q: "What worked?", a: "Which outreach got replies? Which post got engagement? Repeat these." },
                { q: "What didn't work?", a: "Stop doing these. Be ruthless." },
                { q: "What's my #1 priority next week?", a: "ONE thing. Not three. Not five. One." },
                { q: "What am I avoiding?", a: "Is there a task I keep pushing? Usually it's the most important one." },
                { q: "Anyone to circle back with?", a: "Vendors in trial, Featured subs needing check-in, reply threads left hanging" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg bg-white p-3 border border-border">
                  <p className="text-sm font-semibold text-navy">{i + 1}. {item.q}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.a}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-navy text-white p-3 text-xs">
              <p className="font-semibold mb-1">At the end of each check-in:</p>
              <p>Block 2 hours on Monday morning to execute your #1 priority BEFORE anything else. That's the rule.</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* KPIs TO TRACK */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent-blue" aria-hidden="true" /> KPIs to Track Weekly
          </h2>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50">
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Metric</th>
                  <th className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Where to find it</th>
                  <th className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Day 30 Target</th>
                  <th className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Day 90 Target</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m: "Unique visitors / week", w: "Vercel Analytics / Plausible", d30: "200+", d90: "1,000+" },
                  { m: "Newsletter signups", w: "Supabase `newsletter_subscribers`", d30: "30+", d90: "200+" },
                  { m: "Vendor emails sent", w: "Your CRM / spreadsheet", d30: "64", d90: "150+" },
                  { m: "Email reply rate", w: "Inbox", d30: "5-10%", d90: "10-15%" },
                  { m: "Free Featured trials active", w: "Admin dashboard", d30: "3-5", d90: "5-8" },
                  { m: "Paid Featured subs (MRR)", w: "Stripe + Admin pricing page", d30: "$299-$897", d90: "$1,196-$1,794" },
                  { m: "Paid Verified subs (MRR)", w: "Stripe + Admin pricing page", d30: "$0", d90: "$599-$1,198" },
                  { m: "LinkedIn impressions / week", w: "LinkedIn analytics", d30: "5,000+", d90: "20,000+" },
                  { m: "LinkedIn followers", w: "LinkedIn", d30: "100+", d90: "500+" },
                  { m: "Directory tool page views", w: "Firestore / Plausible", d30: "500+", d90: "3,000+" },
                  { m: "Affiliate clicks tracked", w: "Firestore `affiliate_clicks`", d30: "20-50", d90: "200+" },
                ].map((k, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2 px-4 font-semibold text-navy">{k.m}</td>
                    <td className="py-2 px-4 text-xs text-muted-foreground">{k.w}</td>
                    <td className="py-2 px-4 text-xs font-semibold text-accent-blue">{k.d30}</td>
                    <td className="py-2 px-4 text-xs font-semibold text-success">{k.d90}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <section className="rounded-xl border border-border bg-navy-50/30 p-6 text-center">
          <p className="text-xs font-bold text-navy uppercase tracking-widest mb-1">Private Marketing Playbook</p>
          <p className="text-xs text-muted-foreground">
            All scripts copy-ready. Async-first. You should never need to make a cold phone call.
            <br />
            Print this and keep it on your desk.
          </p>
        </section>

      </div>
    </div>
  );
}
