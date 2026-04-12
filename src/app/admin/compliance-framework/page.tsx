"use client";

import Link from "next/link";
import {
  ArrowLeft, Shield, AlertTriangle, CheckCircle2, XCircle,
  FileText, Lock, Printer, Scale, Eye, Database, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComplianceFrameworkPage() {
  return (
    <div className="bg-white min-h-screen">
      <style>{`@media print { nav, footer, .no-print { display: none !important; } body { font-size: 10px; } .print-break { page-break-before: always; } }`}</style>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-10">

        {/* Header */}
        <div className="no-print">
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-lg bg-navy px-2 py-1"><Lock className="h-4 w-4 text-white" aria-hidden="true" /></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy">Compliance Framework — Private</span>
              </div>
              <h1 className="text-3xl font-bold text-navy">How You Verify Compliance (Without a Lawyer)</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Your defensible methodology for determining compliance status. This document protects you legally and operationally.
              </p>
            </div>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-navy-50">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>

        {/* THE CRITICAL REFRAME */}
        <section className="rounded-xl border-4 border-danger/30 bg-danger-bg/30 p-6">
          <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-danger" aria-hidden="true" /> THE MOST IMPORTANT THING TO UNDERSTAND
          </h2>
          <div className="space-y-3 text-sm text-charcoal">
            <p className="font-bold text-danger">You are NOT certifying compliance. You are reviewing whether vendors PUBLISH compliance documentation.</p>
            <p>This single positioning change:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Eliminates 99% of your legal risk</li>
              <li>Removes the need for a lawyer</li>
              <li>Doesn&apos;t require you to be a compliance expert</li>
              <li>Is actually more useful to districts than certification claims</li>
            </ul>
            <p className="font-semibold mt-3">Think of it like Consumer Reports, not UL Labs.</p>
            <p>Consumer Reports doesn&apos;t certify cars are safe. They test them and report findings. If a car manufacturer lies about specs, Consumer Reports is not liable.</p>
          </div>
        </section>

        {/* PART 1: Language Matters */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 1: Language Matters — Say This, Not That
          </h2>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy-50/50">
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">NEVER Say</th>
                  <th className="text-left py-2 px-4 text-xs font-bold uppercase text-muted-foreground">INSTEAD Say</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { bad: "We verified FERPA compliance", good: "Vendor published FERPA compliance documentation at [URL]" },
                  { bad: "This tool is compliant", good: "This tool has documented compliance with [standard]" },
                  { bad: "Certified by District AI Index", good: "Reviewed by District AI Index editorial team" },
                  { bad: "Guaranteed safe for districts", good: "Meets District AI Index's editorial review criteria" },
                  { bad: "Legally compliant", good: "Has published compliance documentation" },
                  { bad: "Audited by us", good: "Publicly-available documentation linked" },
                  { bad: "Approved for K-12 use", good: "Editorially reviewed for K-12 use cases" },
                ].map((item, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2 px-4 text-danger font-semibold">❌ {item.bad}</td>
                    <td className="py-2 px-4 text-success font-semibold">✓ {item.good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-charcoal leading-relaxed mt-4">
            Every piece of language on your site, in your emails, and in conversations should use the &ldquo;reporting what vendors have published&rdquo; framing. This is your legal shield.
          </p>
        </section>

        {/* PART 2: The 4-Status System */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 2: The 4-Status System
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Every compliance signal has exactly four possible statuses. Never invent a fifth. These are defensible, observable facts — not legal opinions.
          </p>

          <div className="space-y-3">
            {[
              {
                status: "available",
                icon: CheckCircle2,
                color: "text-success bg-success-bg border-success",
                title: "Available (Green)",
                meaning: "Vendor has published a compliance document publicly accessible via URL",
                how: "You can click a link on their website and see the document",
                evidence: "The URL itself is the evidence. Screenshot it.",
              },
              {
                status: "partial",
                icon: AlertTriangle,
                color: "text-warning bg-warning-bg border-warning",
                title: "Partial (Yellow)",
                meaning: "Vendor references compliance but documentation is incomplete or gated",
                how: "They mention FERPA on their site but won't link to actual policy OR policy exists but is outdated (>2 years old)",
                evidence: "Screenshot of their mention + note what's missing",
              },
              {
                status: "unavailable",
                icon: XCircle,
                color: "text-danger bg-danger-bg border-danger",
                title: "Unavailable (Red)",
                meaning: "Vendor explicitly states no compliance exists for this standard",
                how: "They told you directly, or their policy explicitly disclaims compliance",
                evidence: "Email or policy text stating 'we do not offer...'",
              },
              {
                status: "unknown",
                icon: FileText,
                color: "text-muted-foreground bg-navy-50 border-border",
                title: "Unknown (Gray)",
                meaning: "You have not been able to find documentation either way",
                how: "You searched their site, contacted them, and got no answer or contradictory info",
                evidence: "Your search history (what pages you checked)",
              },
            ].map((s) => (
              <div key={s.status} className={cn("rounded-xl border-2 p-4", s.color)}>
                <div className="flex items-start gap-3">
                  <s.icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-navy">{s.title}</h3>
                    <p className="text-xs text-charcoal mt-1"><strong>Meaning:</strong> {s.meaning}</p>
                    <p className="text-xs text-charcoal mt-1"><strong>How to identify:</strong> {s.how}</p>
                    <p className="text-xs text-charcoal mt-1"><strong>Evidence to keep:</strong> {s.evidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PART 3: Your 5-Step Review Process */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 3: Your 5-Step Review Process
          </h2>
          <p className="text-sm text-charcoal mb-4">
            Do this exact 5-step process for every tool. It takes 15-20 minutes. It&apos;s defensible in court.
          </p>

          <div className="space-y-3">
            {[
              {
                n: 1,
                title: "Check the vendor's website for a Privacy/Trust/Compliance page",
                tasks: [
                  "Look at their footer — usually linked as 'Privacy', 'Trust Center', 'Security', or 'Compliance'",
                  "Open in a new tab. Take a screenshot.",
                  "Note the exact URL",
                ],
                time: "3 minutes",
              },
              {
                n: 2,
                title: "Search for each of the 6 key signals",
                tasks: [
                  "FERPA Compliance (most important for K-12)",
                  "COPPA Compliance (if tool touches under-13 students)",
                  "DPA (Data Processing Agreement) availability",
                  "SOC 2 Type II audit report",
                  "VPAT / ACR (accessibility)",
                  "GDPR (if they serve EU or have international students)",
                ],
                time: "5 minutes",
              },
              {
                n: 3,
                title: "Use Ctrl+F to search for compliance keywords",
                tasks: [
                  "Search their privacy policy for: 'FERPA', 'COPPA', 'student data', 'training', 'model training'",
                  "Critical: 'used to train' or 'trained on user data' = red flag",
                  "Look for age restrictions (under 13 language)",
                ],
                time: "3 minutes",
              },
              {
                n: 4,
                title: "Check third-party certification databases",
                tasks: [
                  "iKeepSafe: https://ikeepsafe.org/certifications/ — list of certified tools",
                  "Common Sense Privacy Ratings: https://privacy.commonsense.org/",
                  "Student Data Privacy Consortium (SDPC): https://sdpc.a4l.org/",
                  "If they're in ANY of these, it's strong third-party validation",
                ],
                time: "5 minutes",
              },
              {
                n: 5,
                title: "Record your findings with evidence URLs",
                tasks: [
                  "Update the tool's compliance_signals in the admin panel",
                  "For each signal: status + URL to actual documentation",
                  "Add reviewer_notes documenting what you found and what you didn't",
                  "If anything is 'unknown', email the vendor to ask. Their reply is your evidence.",
                ],
                time: "3 minutes",
              },
            ].map((step) => (
              <div key={step.n} className="rounded-xl border border-border p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-sm font-bold shrink-0">{step.n}</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-navy">{step.title}</h4>
                    <ul className="mt-2 space-y-1">
                      {step.tasks.map((t, i) => (
                        <li key={i} className="text-xs text-charcoal flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[10px] text-muted-foreground mt-2"><strong>Time:</strong> {step.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border-2 border-success/30 bg-success-bg/30 p-4">
            <p className="text-sm font-bold text-success mb-1">Total time per tool review: ~20 minutes</p>
            <p className="text-xs text-charcoal">At 2-4 hours/day, you can review 6-12 tools per day. You have 64 tools. That's a one-time deep audit of your entire directory in 5-11 days.</p>
          </div>
        </section>

        {/* PART 4: Automation */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 4: Automated Compliance Scanning
          </h2>
          <p className="text-sm text-charcoal mb-4">
            You have a built-in scanner that can check compliance links across all 64 tools. It answers three questions automatically:
          </p>

          <div className="space-y-3">
            {[
              { q: "Are all our compliance documentation links still live?", a: "Scanner hits every link we've recorded. Returns HTTP status. Broken links = flag for review." },
              { q: "Have any vendor privacy pages changed?", a: "Scanner hashes the page content. If hash changes since last scan = they updated their policy. Flag for editorial review." },
              { q: "Do any tools have third-party certifications we missed?", a: "Scanner checks iKeepSafe, Common Sense Privacy, SDPC for each tool name. Notifies you of matches." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-navy mb-1">Q: {item.q}</p>
                <p className="text-xs text-charcoal">A: {item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-5">
            <h4 className="text-sm font-bold text-navy mb-2">Run the Scanner</h4>
            <p className="text-xs text-charcoal mb-3">The scanner runs at <code className="bg-white px-1.5 py-0.5 rounded text-[11px]">/api/admin/scan-compliance</code>. You can trigger it manually or schedule it weekly.</p>
            <p className="text-xs text-charcoal mb-3"><strong>Manual run:</strong> <Link href="/admin/workflow" className="text-accent-blue hover:underline font-semibold">Go to the Daily Workflow page</Link> and click &ldquo;Run Compliance Scan&rdquo;.</p>
            <p className="text-xs text-charcoal"><strong>Automatic:</strong> Scheduled to run every Monday at 6am UTC via Vercel Cron.</p>
          </div>
        </section>

        {/* PART 5: Legal Protection Layer */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 5: Legal Protection Layer
          </h2>

          <p className="text-sm text-charcoal mb-4">
            These are already on your site. You don&apos;t need a lawyer as long as these remain accurate:
          </p>

          <div className="space-y-3">
            {[
              {
                page: "/editorial-policy",
                role: "Documents that scores are editorial opinions, not legal certifications. States that paid tiers never affect scoring. Lists correction/dispute process.",
                url: "https://districtaiindex.com/editorial-policy",
              },
              {
                page: "/terms",
                role: "Explicit disclaimer that tool reviews are informational, not legal advice. Says districts must conduct their own due diligence. Limits liability.",
                url: "https://districtaiindex.com/terms",
              },
              {
                page: "/data-practices",
                role: "Shows you don't collect student data. Transparent about infrastructure and third-party services. Limits your own liability exposure.",
                url: "https://districtaiindex.com/data-practices",
              },
              {
                page: "/privacy-policy",
                role: "Covers your own data handling. Required for GDPR/CCPA compliance of YOUR site (not what you review).",
                url: "https://districtaiindex.com/privacy-policy",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-sm font-bold text-navy">{item.page}</h4>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-blue hover:underline flex items-center gap-1">
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-xs text-charcoal">{item.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border-2 border-warning/30 bg-warning-bg/30 p-4">
            <p className="text-sm font-bold text-warning mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" /> When You SHOULD Get a Lawyer
            </p>
            <ul className="text-xs text-charcoal space-y-1 list-disc pl-5">
              <li>When you hit $5K+ MRR (reinvest some into a 1-hour consultation, ~$400)</li>
              <li>If a vendor sends a legal threat (rare if you follow this framework)</li>
              <li>Before selling or restructuring the business</li>
              <li>If you hire an employee (not contractor)</li>
            </ul>
            <p className="text-xs text-charcoal mt-2">For now: the framework + your site&apos;s policy pages protect you at the scale you&apos;re operating.</p>
          </div>
        </section>

        {/* PART 6: What Districts Should See */}
        <section className="print-break">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Part 6: How This Appears to Districts (The Public Framing)
          </h2>

          <p className="text-sm text-charcoal mb-4">
            Here&apos;s the exact language that should appear everywhere on the public site regarding compliance:
          </p>

          <div className="rounded-xl border border-border bg-white p-5 font-mono text-xs leading-relaxed space-y-3">
            <p className="font-bold">On every tool page (above compliance signals):</p>
            <p className="border-l-4 border-accent-blue pl-3 text-charcoal">
              &ldquo;The District AI Index editorial team reviews publicly-available vendor documentation to report compliance documentation status. We do not certify compliance — vendors are responsible for their own legal claims. Districts should independently verify all claims as part of their procurement process.&rdquo;
            </p>

            <p className="font-bold mt-4">On the /verified page:</p>
            <p className="border-l-4 border-accent-blue pl-3 text-charcoal">
              &ldquo;Tools listed here have published documentation for FERPA, COPPA, DPA, and accessibility compliance. This reflects vendor documentation as of their last review date, not a legal certification. Districts should request and review current documentation directly from vendors before procurement.&rdquo;
            </p>

            <p className="font-bold mt-4">In all Featured/Verified vendor contracts (when you have them):</p>
            <p className="border-l-4 border-accent-blue pl-3 text-charcoal">
              &ldquo;Vendor represents that all compliance documentation linked in the District AI Index listing is accurate and current. Vendor indemnifies District AI Index against claims arising from inaccurate vendor-provided documentation.&rdquo;
            </p>
          </div>
        </section>

        {/* Footer */}
        <section className="rounded-xl border border-border bg-navy-50/30 p-6 text-center">
          <p className="text-xs font-bold text-navy uppercase tracking-widest mb-1">Your Shield</p>
          <p className="text-xs text-muted-foreground">
            This framework + the public policy pages = your legal protection. Follow the 5-step process. Keep evidence. Use the exact language. You don&apos;t need a lawyer at this stage.
          </p>
        </section>
      </div>
    </div>
  );
}
