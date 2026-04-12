"use client";

import Link from "next/link";
import {
  ArrowLeft, Lock, DollarSign, Target, Rocket, TrendingUp,
  AlertCircle, CheckCircle2, Calculator, Zap, Shield,
  Lightbulb, Clock, FileText, Printer,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlaybookPage() {
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy">Private — Founder Eyes Only</span>
              </div>
              <h1 className="text-3xl font-bold text-navy">Business Playbook</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete business model, tier economics, Day 1 bootstrap plan, and reinvestment strategy.
              </p>
            </div>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-50">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 1: THE VENDOR'S PROBLEM (why they pay you) */}
        {/* ═══════════════════════════════════════════════════ */}
        <section aria-labelledby="problem-heading">
          <h2 id="problem-heading" className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 1: The Vendor&apos;s Problem (The Why)
          </h2>

          <p className="text-sm text-charcoal leading-relaxed mb-4">
            Before breaking down each tier, understand <strong>who your customer is and what they&apos;re desperately trying to do</strong>.
          </p>

          <p className="text-sm text-charcoal leading-relaxed mb-4">
            Your customer is an <strong>AI tool vendor selling to K–12 school districts</strong>. They face four brutal realities:
          </p>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50">
                <tr>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Challenge</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Typical Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border"><td className="py-2 px-4 font-semibold text-navy">Customer Acquisition Cost (CAC) per district</td><td className="py-2 px-4 text-charcoal">$5,000 – $25,000</td></tr>
                <tr className="border-t border-border"><td className="py-2 px-4 font-semibold text-navy">Sales cycle length</td><td className="py-2 px-4 text-charcoal">6 – 18 months</td></tr>
                <tr className="border-t border-border"><td className="py-2 px-4 font-semibold text-navy">Stakeholders involved in one deal</td><td className="py-2 px-4 text-charcoal">5 – 12 people</td></tr>
                <tr className="border-t border-border"><td className="py-2 px-4 font-semibold text-navy">Compliance docs required</td><td className="py-2 px-4 text-charcoal">FERPA, COPPA, DPA, VPAT, SOC 2, state laws</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-5">
            <p className="text-sm text-charcoal leading-relaxed">
              <strong>The key insight:</strong> Districts don&apos;t trust vendor marketing. They trust <strong>independent third-party validation</strong>. That&apos;s what you sell. You&apos;re not selling &ldquo;a listing&rdquo; — you&apos;re selling <strong>trust, qualified leads, and reduced friction in district sales cycles</strong>.
            </p>
            <p className="text-sm text-charcoal leading-relaxed mt-3">
              A typical district contract is <strong>$10,000 – $100,000 per year</strong>. If your directory helps a vendor close even ONE new district, you&apos;ve paid for yourself 100x over.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 2: BASIC TIER (FREE) */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break" aria-labelledby="basic-heading">
          <h2 id="basic-heading" className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 2: Basic Listing — <span className="text-success">FREE</span>
          </h2>

          <p className="text-sm text-charcoal leading-relaxed mb-4">
            <strong>Why it&apos;s free:</strong> Every listing helps build the directory&apos;s value to district buyers. A thin directory = useless to buyers = no vendors pay for upgrades. The free tier is a <strong>funnel, not a revenue product</strong>.
          </p>

          <h3 className="text-sm font-bold text-navy mb-3">What the vendor gets:</h3>
          <div className="rounded-xl border border-border overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50">
                <tr>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Deliverable</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Value to Vendor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { d: "Directory listing with name, logo, description", v: "Visibility to district buyers actively searching" },
                  { d: "Tool profile page at /tool/[slug]", v: "SEO-indexable page with Schema.org markup Google can rank" },
                  { d: "Category + grade band tags", v: "Found by buyers filtering for relevance" },
                  { d: "Privacy flag (District Ready / Teacher Use Only / Use Caution)", v: "Signals trust level to risk-averse buyers" },
                  { d: "District Readiness Score (0-10)", v: "Independent credibility" },
                  { d: "Community visibility, comparisons", v: "Organic discovery" },
                ].map((item, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2 px-4 font-semibold text-navy">{item.d}</td>
                    <td className="py-2 px-4 text-charcoal">{item.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">Your Cost to Deliver</h4>
              <p className="text-sm text-charcoal">~2 editorial hours × $75/hr = <strong>~$150 one-time</strong> + $0.05/mo hosting. Annual re-review adds 2 hours.</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">What They Don&apos;t Get (= Why They Upgrade)</h4>
              <p className="text-sm text-charcoal">No priority placement, no rich media, no lead routing, no vendor right-of-reply, no analytics.</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 3: FEATURED ($299/mo) */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 3: Featured Listing — <span className="text-accent-blue">$299/month</span>
          </h2>

          <div className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-5 mb-4">
            <p className="text-sm font-bold text-navy mb-1">Core value proposition:</p>
            <p className="text-sm text-charcoal italic">
              &ldquo;Pay $299/mo so district CTOs and instructional coaches see your tool FIRST when they&apos;re evaluating AI for their schools.&rdquo;
            </p>
          </div>

          <h3 className="text-sm font-bold text-navy mb-3">Line-by-line breakdown:</h3>
          <div className="space-y-3">
            {[
              {
                feature: "① Everything in Basic",
                value: "$0 (baseline)",
                explanation: "Table stakes.",
              },
              {
                feature: "② Featured placement in directory",
                value: "~$800/mo worth",
                explanation: "Tool appears in Featured Tools section on homepage + top slots in category pages with gold badge. At 5,000 visitors/month × 3 featured slots = ~1,667 impressions per tool. Industry B2B education CPM: $50–$150. 1,667 × $100 CPM = $167 raw value × 3-5x trust multiplier = $500-$800/mo.",
              },
              {
                feature: "③ Enhanced profile with rich media",
                value: "~$200/mo worth",
                explanation: "Demo videos, screenshots, case studies, testimonials. Video content increases B2B conversion 80-95%. Equivalent vendor landing page with hosting+CMS: $200-$500/mo.",
              },
              {
                feature: "④ Priority editorial evaluation",
                value: "~$42/mo worth",
                explanation: "Pushed to front of review queue. Days not weeks. When vendors release new features they want scores updated ASAP. Paid editorial review services charge $500-$2,000 per review.",
              },
              {
                feature: "⑤ Category spotlight inclusion",
                value: "~$150/mo worth",
                explanation: "2x per month, featured in category browse spotlight. Category pages have highest buyer intent (actively shopping). Conversion 3-5x general directory placement.",
              },
              {
                feature: "⑥ Dashboard recommendation eligibility",
                value: "~$100/mo worth",
                explanation: "Recommended on district dashboard to logged-in admins. Ad placement DIRECTLY in workflow of decision-makers.",
              },
              {
                feature: "⑦ Monthly performance analytics email",
                value: "~$100/mo worth",
                explanation: "Profile views, CTR on Visit Tool button, comparison inclusions, search queries. Similar analytics from G2/Capterra/SaaSworthy: $200-$500/mo standalone.",
              },
              {
                feature: "⑧ Vendor response to reviews",
                value: "~$100/mo worth",
                explanation: "Official response section on profile if they disagree with editorial. Reputation management is a line item in every B2B marketing budget.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-sm font-bold text-navy">{item.feature}</h4>
                  <span className="text-xs font-bold text-success bg-success-bg rounded-full px-2 py-0.5 whitespace-nowrap">{item.value}</span>
                </div>
                <p className="text-xs text-charcoal leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border-2 border-success/30 bg-success-bg/30 p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Perceived Value</p>
                <p className="text-2xl font-bold text-navy">~$1,500-$2,000/mo</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Your Price</p>
                <p className="text-2xl font-bold text-success">$299/mo</p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-navy mt-6 mb-3 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-accent-blue" aria-hidden="true" /> ROI Math for the Vendor
          </h3>
          <div className="rounded-xl border border-border p-5">
            <p className="text-sm font-semibold text-navy mb-3">Scenario: They close ONE new district from your directory this year</p>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="py-1 text-muted-foreground">Annual contract value (typical district)</td><td className="py-1 text-right font-semibold text-navy">$15,000</td></tr>
                <tr><td className="py-1 text-muted-foreground">Your annual fee ($299 × 12)</td><td className="py-1 text-right font-semibold text-navy">$3,588</td></tr>
                <tr className="border-t border-border"><td className="py-1 font-bold text-success">Net gain</td><td className="py-1 text-right font-bold text-success">+$11,412</td></tr>
                <tr><td className="py-1 font-bold text-success">ROI</td><td className="py-1 text-right font-bold text-success">318%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-xl border border-warning/30 bg-warning-bg/30 p-4">
            <h4 className="text-xs font-bold text-warning uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Your Margin</h4>
            <p className="text-sm text-charcoal"><strong>Before automation:</strong> $299 rev - $300 editorial cost = break-even. <strong>After Claude/n8n automation</strong> (editorial drops from 4h to 1h/mo): <strong>margin becomes ~$220/mo (74%)</strong>. That&apos;s the play — Featured is a loss-leader that funnels into Verified until you automate.</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 4: VERIFIED ($599/mo) */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break" aria-labelledby="verified-heading">
          <h2 id="verified-heading" className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 4: Verified District Ready — <span className="text-success">$599/month</span>
          </h2>

          <div className="rounded-xl border-2 border-success/30 bg-success-bg/30 p-5 mb-4">
            <p className="text-sm font-bold text-navy mb-1">Core value proposition:</p>
            <p className="text-sm text-charcoal italic">
              &ldquo;Pay $599/mo to get the gold-standard &lsquo;Verified District Ready&rsquo; badge that signals to risk-averse CTOs that you&apos;re safe to adopt — removing the #1 friction in district sales cycles.&rdquo;
            </p>
          </div>

          <div className="rounded-xl border border-border p-5 mb-4">
            <h4 className="text-sm font-bold text-navy mb-2">Why this tier exists</h4>
            <p className="text-sm text-charcoal leading-relaxed">
              Districts have a specific fear: <strong>&ldquo;What if we buy this AI tool and it violates FERPA?&rdquo;</strong> Superintendents have been fired, districts have been sued, and CTOs have been blamed for compliance failures. The Verified District Ready badge is your <strong>answer to that fear</strong>. It says: <em>&ldquo;The District AI Index editorial team has independently verified this vendor&apos;s privacy documentation, DPA availability, accessibility conformance, and admin controls. This is safe to buy.&rdquo;</em> That single sentence is worth $599/mo to any serious EdTech vendor.
            </p>
          </div>

          <h3 className="text-sm font-bold text-navy mb-3">Line-by-line breakdown:</h3>
          <div className="space-y-3">
            {[
              { f: "① Everything in Featured", v: "$299 baseline", e: "Baseline." },
              { f: "② Verified District Ready badge", v: "~$1,000+/mo worth", e: "Distinctive badge on profile, directory, comparison tables. They can display 'Verified by District AI Index' on their own marketing site. G2 Leader badge: $12-30K/year for equivalent. Common Sense Privacy Seal: $5K/year. B2B trust badges measurably lift conversion 15-30%." },
              { f: "③ Premium /verified page placement", v: "~$400/mo worth", e: "Top-of-page on /verified — highest-intent page for district buyers specifically wanting compliance-reviewed tools. Conversion 10-20x general directory." },
              { f: "④ Compliance documentation showcase", v: "~$300/mo worth", e: "FERPA/COPPA/SOC 2/DPA docs prominently displayed with clickable links. The SINGLE biggest driver of district purchase decisions. Used as primary vendor-vetting checklist." },
              { f: "⑤ DPA availability badge", v: "~$200/mo worth", e: "Specific 'DPA Available' badge. Required by law in 22 US states (CA, CO, CT, VA, etc.). Saves district legal teams 10-20 hours of back-and-forth per deal." },
              { f: "⑥ Accessibility documentation highlight", v: "~$200/mo worth", e: "VPAT/ACR prominently featured with direct download. Section 508 required for federally-funded schools. ADA lawsuits rising. VPATs cost $5-15K to commission." },
              { f: "⑦ Direct demo request routing", v: "~$800+/mo worth", e: "Demo requests sent DIRECTLY to vendor sales team with district name, email, role. B2B EdTech qualified leads cost $50-$300 each through paid channels. 3-5 district leads/mo = $150-$1,500 value. These aren't cold — they're decision-makers requesting demos." },
              { f: "⑧ Quarterly editorial re-evaluation", v: "~$33/mo worth", e: "Score refreshed every 3 months. Keeps listing accurate as they ship new features. Annual reviews (Featured tier) let 12 months go by with stale info." },
              { f: "⑨ Priority support + account management", v: "~$500/mo worth", e: "Direct line for questions, listing updates, dispute resolution, strategic advice. Dedicated account management from any B2B SaaS: $500-$2,000/mo. They get 24-hour response, not contact forms." },
              { f: "⑩ Conference/webinar co-marketing", v: "~$500/mo worth", e: "When you present at ISTE/FETC or host webinars they get speaking slots or case study mentions. Single ISTE slot valued at $3-10K. Co-marketing is how EdTech vendors build credibility fast." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="text-sm font-bold text-navy">{item.f}</h4>
                  <span className="text-xs font-bold text-success bg-success-bg rounded-full px-2 py-0.5 whitespace-nowrap">{item.v}</span>
                </div>
                <p className="text-xs text-charcoal leading-relaxed">{item.e}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border-2 border-success/30 bg-success-bg/30 p-5">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Perceived Value</p>
                <p className="text-2xl font-bold text-navy">~$4,000-$5,000/mo</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Your Price</p>
                <p className="text-2xl font-bold text-success">$599/mo</p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-navy mt-6 mb-3 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-accent-blue" aria-hidden="true" /> ROI Math for the Vendor
          </h3>
          <div className="rounded-xl border border-border p-5">
            <p className="text-sm font-semibold text-navy mb-3">Scenario: They close TWO new districts per year</p>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="py-1 text-muted-foreground">2 district contracts at $25K ACV</td><td className="py-1 text-right font-semibold text-navy">$50,000</td></tr>
                <tr><td className="py-1 text-muted-foreground">Your annual fee ($599 × 12)</td><td className="py-1 text-right font-semibold text-navy">$7,188</td></tr>
                <tr className="border-t border-border"><td className="py-1 font-bold text-success">Net gain</td><td className="py-1 text-right font-bold text-success">+$42,812</td></tr>
                <tr><td className="py-1 font-bold text-success">ROI</td><td className="py-1 text-right font-bold text-success">595%</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-3 italic">Verified-tier vendors typically have larger deal sizes ($25-$100K+ ACV). Just one sale pays for 3-14 years of your fee.</p>
          </div>

          <div className="mt-4 rounded-xl border border-warning/30 bg-warning-bg/30 p-4">
            <h4 className="text-xs font-bold text-warning uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Your Margin</h4>
            <p className="text-sm text-charcoal"><strong>Before automation:</strong> $599 rev - $600 editorial = break-even. <strong>After automation</strong> (editorial drops from 8h to 2h/mo): <strong>margin becomes ~$450/mo (75%)</strong>. Verified is where you make real money.</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 5: WHY VENDORS PAY YOU (VS. ALTERNATIVES) */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 5: Why Vendors Pay You (vs. Alternatives)
          </h2>
          <p className="text-sm text-charcoal leading-relaxed mb-4">
            Every other way to reach district buyers is worse. This is your moat:
          </p>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50">
                <tr>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Channel</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Cost</th>
                  <th scope="col" className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">Problem</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: "Google Ads", p: "$5-$15 CPC", x: "Low-intent, broad match, no trust signal" },
                  { c: "ISTE / FETC booth", p: "$15-50K/event", x: "One-time, no ongoing exposure" },
                  { c: "Sales team cold outreach", p: "$8K+/rep/mo", x: "Districts screen these aggressively" },
                  { c: "LinkedIn ads", p: "$10-$30 CPC", x: "Generic B2B, not education-specific" },
                  { c: "Common Sense Media review", p: "$5K/year", x: "One review, no ongoing marketing" },
                  { c: "G2 / Capterra listings", p: "$12-30K/year", x: "Not education-focused" },
                ].map((item, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2 px-4 font-semibold text-navy">{item.c}</td>
                    <td className="py-2 px-4 text-charcoal">{item.p}</td>
                    <td className="py-2 px-4 text-xs text-muted-foreground">{item.x}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-success bg-success-bg/30">
                  <td className="py-2 px-4 font-bold text-navy">Your directory</td>
                  <td className="py-2 px-4 font-bold text-success">$299-$599/mo</td>
                  <td className="py-2 px-4 text-xs font-semibold text-success">Education-specific + high-intent + independently credible + recurring</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-charcoal leading-relaxed mt-4 italic">
            You&apos;re not selling a listing. You&apos;re selling <strong>the most cost-effective, highest-intent, most-credible channel to reach K–12 district decision-makers</strong> — a channel that doesn&apos;t exist anywhere else at this combination of focus, trust, and price.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 6: DAY 1 WITH $0 — THE BOOTSTRAP PLAN */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Rocket className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 6: Day 1 with $0 — The Bootstrap Plan
          </h2>

          <div className="rounded-xl border-2 border-success/30 bg-success-bg/30 p-5 mb-6">
            <p className="text-sm text-navy font-bold mb-2">Good news: You&apos;re already Day 1 ready.</p>
            <p className="text-sm text-charcoal">
              Your stack costs <strong>$0/month</strong> right now. Vercel free tier, Firebase free tier, GitHub free, Claude pay-per-use (&lt;$3/mo at current scale), no domain yet. You can run this business with zero cash outflow for 6-12 months.
            </p>
          </div>

          <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent-blue" aria-hidden="true" /> First 30 Days — Revenue Generation with Zero Spend
          </h3>

          <div className="space-y-3">
            {[
              {
                week: "Week 1: Foundation",
                tasks: [
                  "Buy the domain districtaiindex.com (~$12/year — cheapest expense, pay from next paycheck)",
                  "Write 3 LinkedIn posts about what you're building. Post one to your feed, share in K-12 EdTech groups",
                  "Create a free Twitter/X account: @DistrictAIIndex, post about the launch",
                  "Email 10 school district CTOs you have connections to (or LinkedIn-search). Tell them the directory exists, ask for feedback",
                ],
                outcome: "50-200 early visitors, 5-10 district CTO signups to newsletter",
              },
              {
                week: "Week 2: Vendor Outreach",
                tasks: [
                  "List the 64 tools you already have with their contact emails (find via website 'Contact Sales' pages)",
                  "Send personalized email to each: 'Your tool is listed on District AI Index with a score of X. Here's the link. If you want to upgrade to Featured for more visibility, it's $299/mo.'",
                  "Offer a 30-day free Featured trial to the first 5 that respond — they become case studies",
                  "Follow up after 3 days with a second email",
                ],
                outcome: "Expected conversion rate: 2-5%. From 64 vendors: 1-3 paid Featured subscribers = $299-$897 MRR",
              },
              {
                week: "Week 3: Content Marketing",
                tasks: [
                  "Write 3 LinkedIn articles: 'The Hidden Cost of AI Tools in Your District', 'What VPAT Actually Means for K-12', 'How to Evaluate AI for Student Safety'",
                  "Each article links back to the directory",
                  "Post to r/education, r/Teachers on Reddit (check rules first)",
                  "Start a weekly newsletter with 3 tool picks + 1 compliance tip",
                ],
                outcome: "500-2,000 additional organic visitors, 30-50 newsletter signups",
              },
              {
                week: "Week 4: Close First Deals",
                tasks: [
                  "For every free trial vendor, schedule a 20-minute check-in. Show them their analytics: page views, clicks. If positive: offer to continue at $299/mo",
                  "Ask for 2 testimonials from happy vendors",
                  "Add those testimonials to /pricing page as social proof",
                  "Send a second outreach wave to the other 60+ vendors referencing the testimonials",
                ],
                outcome: "Target: 3-5 paid Featured subscribers by end of Day 30 = $897-$1,495 MRR",
              },
            ].map((w, i) => (
              <div key={i} className="rounded-xl border border-border p-5">
                <h4 className="text-sm font-bold text-navy mb-3">{w.week}</h4>
                <ul className="space-y-1.5 mb-3">
                  {w.tasks.map((t, j) => (
                    <li key={j} className="text-xs text-charcoal flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg bg-success-bg/50 p-2 text-xs text-success font-semibold">
                  Expected outcome: {w.outcome}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-5">
            <h4 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent-blue" aria-hidden="true" /> The 30-Day Cash-Flow-Free Sales Script
            </h4>
            <div className="text-xs text-charcoal space-y-3">
              <p className="font-semibold">Subject: Your tool is listed on District AI Index</p>
              <div className="rounded-lg bg-white p-3 border border-border font-mono text-[11px] leading-relaxed">
                <p>Hi [Vendor Name],</p>
                <p className="mt-2">I run District AI Index — an independent K–12 AI tools directory used by district CTOs and instructional coaches evaluating tools for adoption.</p>
                <p className="mt-2">[Your Tool] is currently listed at districtaiindex.com/tool/[slug] with a District Readiness Score of [X]/10.</p>
                <p className="mt-2">I wanted to let you know it&apos;s there, and that we offer two premium tiers:</p>
                <p className="mt-2"><strong>Featured ($299/mo)</strong> — priority placement, dashboard recommendations, monthly analytics<br /><strong>Verified District Ready ($599/mo)</strong> — trust badge, lead routing, quarterly re-review</p>
                <p className="mt-2">I&apos;m offering the first 5 vendors who upgrade a <strong>30-day free Featured trial</strong> — you get the placement, I get a case study.</p>
                <p className="mt-2">Interested? Reply to this email.</p>
                <p className="mt-2">— Rachel, District AI Index</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 7: REINVESTMENT STRATEGY */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 7: Reinvestment Strategy by Revenue Milestone
          </h2>

          <p className="text-sm text-charcoal leading-relaxed mb-4">
            Your rule: <strong>reinvest after overhead</strong>. Here&apos;s exactly what to spend money on at each revenue milestone, in priority order.
          </p>

          <div className="space-y-4">
            {/* Milestone 1 */}
            <div className="rounded-xl border-2 border-navy-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-navy">$0 – $500 MRR (Months 0-2)</h3>
                <span className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-bold text-navy">Phase: Survive</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3"><strong>Overhead:</strong> Domain ($1/mo), Vercel free, Firebase free. Total: ~$1/mo.</p>
              <p className="text-xs font-semibold text-navy mb-2">Reinvest every dollar above overhead into:</p>
              <ol className="space-y-1.5 text-xs text-charcoal list-decimal pl-5">
                <li><strong>Domain</strong> ($12/year) — own the brand</li>
                <li><strong>Claude API credits</strong> ($10/mo) — wire up automated social posting + content generation</li>
                <li><strong>n8n cloud</strong> ($20/mo) OR self-host on free tier — activate workflows</li>
                <li><strong>Stripe account</strong> (free) — start collecting payments properly</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-3"><strong>Leave in bank:</strong> Everything else. You have no margin yet.</p>
            </div>

            {/* Milestone 2 */}
            <div className="rounded-xl border-2 border-navy-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-navy">$500 – $2,000 MRR (Months 2-6)</h3>
                <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-xs font-bold text-accent-blue">Phase: Validate</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3"><strong>Overhead:</strong> ~$50/mo (domain + Claude + n8n + hosting buffer). Take ~20% as owner draw ($100-$400), reinvest rest.</p>
              <p className="text-xs font-semibold text-navy mb-2">Reinvest priorities (in order):</p>
              <ol className="space-y-1.5 text-xs text-charcoal list-decimal pl-5">
                <li><strong>LinkedIn Ads</strong> ($300-$500/mo) — retarget district CTOs; aim for 3-5 new Featured subscribers</li>
                <li><strong>Plausible Analytics</strong> ($9/mo) — so you actually know what&apos;s working</li>
                <li><strong>Resend email</strong> ($20/mo) — proper newsletter at scale</li>
                <li><strong>Virtual assistant</strong> ($200-$400/mo for 10-20 hours) — doing outreach, processing submissions</li>
                <li><strong>VPAT/compliance researcher</strong> ($200/mo contractor) — adds 5-10 VPATs to listings per month</li>
              </ol>
            </div>

            {/* Milestone 3 */}
            <div className="rounded-xl border-2 border-navy-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-navy">$2,000 – $5,000 MRR (Months 6-12)</h3>
                <span className="rounded-full bg-[#EEF2F7] px-2 py-0.5 text-xs font-bold text-accent-blue">Phase: Growth</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3"><strong>Overhead:</strong> ~$400-$800/mo. Take 30% as owner draw ($600-$1,500), reinvest rest.</p>
              <p className="text-xs font-semibold text-navy mb-2">Reinvest priorities:</p>
              <ol className="space-y-1.5 text-xs text-charcoal list-decimal pl-5">
                <li><strong>Content contractor</strong> ($500-$800/mo) — weekly blog posts, SEO content</li>
                <li><strong>Part-time editorial reviewer</strong> ($600/mo) — can do 20+ reviews/mo</li>
                <li><strong>Paid ads scaled</strong> ($500-$1,000/mo) — Google Ads for district buyers</li>
                <li><strong>Conference booth at ISTE</strong> ($5K saved over 6 mo from this milestone) — huge vendor pipeline event</li>
                <li><strong>Vercel Pro</strong> ($20/mo) — if you hit free tier limits</li>
                <li><strong>Supabase Pro</strong> ($25/mo) — if Firestore doesn&apos;t scale</li>
              </ol>
            </div>

            {/* Milestone 4 */}
            <div className="rounded-xl border-2 border-success/30 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-navy">$5,000 – $15,000 MRR (Year 2)</h3>
                <span className="rounded-full bg-success-bg px-2 py-0.5 text-xs font-bold text-success">Phase: Scale</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3"><strong>Overhead:</strong> ~$2-3K/mo. Take 40% as owner draw ($2-6K), reinvest rest.</p>
              <p className="text-xs font-semibold text-navy mb-2">Reinvest priorities:</p>
              <ol className="space-y-1.5 text-xs text-charcoal list-decimal pl-5">
                <li><strong>First full-time hire: Editorial Director</strong> ($60-80K/year) — takes over reviews, frees you for sales</li>
                <li><strong>Paid conference sponsorships</strong> (ISTE, FETC — $15-30K each) — drives high-intent vendor signups</li>
                <li><strong>Sales/partnership contractor</strong> ($2-4K/mo) — closes Verified deals on commission</li>
                <li><strong>Custom report product</strong> — build a $500-$2,000 report offering (districts pay per-report)</li>
                <li><strong>LLC / S-Corp setup</strong> ($1-2K) — proper business structure</li>
                <li><strong>Liability insurance</strong> (~$800/year) — essential at this revenue</li>
              </ol>
            </div>

            {/* Milestone 5 */}
            <div className="rounded-xl border-2 border-success/30 bg-success-bg/20 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-navy">$15,000+ MRR (Year 3+)</h3>
                <span className="rounded-full bg-success px-2 py-0.5 text-xs font-bold text-white">Phase: Real Business</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3"><strong>Overhead:</strong> $5-10K/mo. Take 40-50% as owner salary. Reinvest difference.</p>
              <p className="text-xs font-semibold text-navy mb-2">Reinvest priorities:</p>
              <ol className="space-y-1.5 text-xs text-charcoal list-decimal pl-5">
                <li><strong>Second hire: Sales rep</strong> ($80-120K base + commission)</li>
                <li><strong>Build enterprise product</strong> — custom district RFP/procurement tools</li>
                <li><strong>National expansion</strong> — state-by-state compliance guides</li>
                <li><strong>Acquisition runway</strong> — consider acquiring small competitor EdTech directories</li>
                <li><strong>International expansion</strong> — UK/Canada K-12 markets</li>
              </ol>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════ */}
        {/* PART 8: DAY 1 PRIORITY CHECKLIST */}
        {/* ═══════════════════════════════════════════════════ */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 8: Day 1 — What To Do RIGHT NOW
          </h2>

          <div className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-5">
            <p className="text-sm text-charcoal leading-relaxed mb-4">
              You have a live, fully functional product at <strong>district-ai-index.vercel.app</strong> with 64 tools, compliance tracking, admin console, and a complete directory. Everything below can be done this week with $0.
            </p>

            <ol className="space-y-3">
              {[
                { priority: "Today", task: "Buy domain districtaiindex.com ($12 from Namecheap/Cloudflare) + point to Vercel", time: "30 min" },
                { priority: "Today", task: "Update your admin password (currently DAIAdmin2026ChangeMe) via Vercel env var", time: "5 min" },
                { priority: "Today", task: "Post on LinkedIn: 'Just launched District AI Index — 64 AI tools for K-12 with privacy ratings. Check it out at [url]'", time: "15 min" },
                { priority: "This Week", task: "Write your first 3 vendor outreach emails and send them (template in Part 6)", time: "2 hours" },
                { priority: "This Week", task: "Create Twitter/X account + LinkedIn page for the brand", time: "30 min" },
                { priority: "This Week", task: "Set up Stripe (free) and add checkout flow to /pricing — I can build this next", time: "15 min signup, I build rest" },
                { priority: "Next Week", task: "Send the full 64-vendor outreach batch", time: "1 day" },
                { priority: "Next Week", task: "Write first 3 LinkedIn articles from Part 6", time: "4 hours" },
                { priority: "Month 1", task: "Close 3-5 Featured subscribers → $897-$1,495 MRR", time: "Ongoing" },
                { priority: "Month 2", task: "Close your first Verified subscriber → +$599 MRR", time: "Ongoing" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase shrink-0",
                    item.priority === "Today" ? "bg-danger text-white" :
                    item.priority === "This Week" ? "bg-warning text-white" :
                    item.priority === "Next Week" ? "bg-accent-blue text-white" :
                    "bg-navy text-white"
                  )}>{item.priority}</span>
                  <div className="flex-1">
                    <p className="text-sm text-charcoal">{item.task}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Footer */}
        <section className="rounded-xl border border-border bg-navy-50/30 p-6 text-center">
          <p className="text-xs font-bold text-navy uppercase tracking-widest mb-1">Private Document</p>
          <p className="text-xs text-muted-foreground">
            This playbook is accessible only from the admin console at /admin/playbook.
            <br />
            It contains business-sensitive strategy information and should not be shared publicly.
          </p>
        </section>

      </div>
    </div>
  );
}
