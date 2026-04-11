import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Scale, ShieldCheck, TrendingUp, Star, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy & Methodology — District AI Index",
  description: "How we evaluate, score, and rank AI tools for K–12 education. Our methodology, scoring formula, and editorial independence standards.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-10 w-10 text-white mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-white">Editorial Policy &amp; Methodology</h1>
          <p className="mt-4 text-base text-navy-200">
            How we evaluate tools, compute scores, and maintain editorial independence.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10 text-sm text-charcoal leading-relaxed">

          {/* Scoring Model */}
          <section>
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Scoring Model
            </h2>
            <p>Every tool in the District AI Index is evaluated across four dimensions. Each dimension is scored from <strong>0 to 10</strong> by our editorial team.</p>

            <div className="mt-6 space-y-4">
              {[
                {
                  name: "Ease of Use",
                  weight: "20%",
                  desc: "How quickly can a teacher start using this tool productively? We evaluate onboarding friction, interface clarity, learning curve, and whether the tool fits into existing workflows without significant training.",
                  factors: ["Time to first productive use", "Interface clarity and navigation", "SSO / LMS integration simplicity", "Quality of onboarding materials"],
                },
                {
                  name: "Instructional Value",
                  weight: "40% (highest weight)",
                  desc: "Does this tool genuinely improve teaching and learning outcomes? We evaluate alignment with pedagogical best practices, standards support, differentiation capabilities, and whether the tool enhances or replaces teacher judgment.",
                  factors: ["Alignment to learning science / pedagogy", "Standards and curriculum alignment", "Differentiation and scaffolding support", "Assessment and feedback quality", "Student engagement and active learning"],
                },
                {
                  name: "Data Privacy",
                  weight: "20%",
                  desc: "How responsibly does this tool handle data? We evaluate FERPA and COPPA compliance, data collection minimization, DPA availability, transparency of privacy policies, and whether student data is used for model training.",
                  factors: ["FERPA compliance documentation", "COPPA compliance (especially for K–8 tools)", "Data Processing Agreement availability", "SOC 2 Type II certification", "Student data used for AI model training (red flag if yes)", "Clarity and accessibility of privacy policy"],
                },
                {
                  name: "Accessibility",
                  weight: "20%",
                  desc: "Can all educators and students use this tool effectively? We evaluate WCAG conformance, screen reader compatibility, keyboard navigation, and VPAT/ACR publication.",
                  factors: ["WCAG 2.1 AA conformance", "VPAT/ACR availability", "Keyboard navigation support", "Screen reader compatibility", "Mobile responsiveness", "Language/translation support"],
                },
              ].map((dim) => (
                <div key={dim.name} className="rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-navy">{dim.name}</h3>
                    <span className="text-xs font-semibold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full">{dim.weight}</span>
                  </div>
                  <p className="text-sm text-charcoal">{dim.desc}</p>
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Specific factors evaluated:</p>
                    <ul className="list-disc pl-5 space-y-0.5 text-xs text-muted-foreground">
                      {dim.factors.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Overall Score */}
          <section>
            <h2 className="text-xl font-bold text-navy mb-4">Overall Score Calculation</h2>
            <div className="rounded-xl bg-navy-50/50 p-5 font-mono text-sm">
              <p className="text-navy font-bold">Overall Score =</p>
              <p className="text-muted-foreground ml-4">(Ease of Use × 0.20)</p>
              <p className="text-muted-foreground ml-4">+ (Instructional Value × 0.40)</p>
              <p className="text-muted-foreground ml-4">+ (Data Privacy × 0.20)</p>
              <p className="text-muted-foreground ml-4">+ (Accessibility × 0.20)</p>
            </div>
            <p className="mt-3">Instructional Value carries the highest weight because our primary audience — educators and district leaders — prioritize tools that genuinely improve teaching and learning outcomes.</p>
          </section>

          {/* Privacy Flag Logic */}
          <section>
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Privacy Flag Logic
            </h2>
            <p>Each tool receives a privacy classification based on its privacy level assessment:</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-success/20 bg-success-bg/30 p-4">
                <span className="h-3 w-3 rounded-full bg-success shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-bold text-navy">District Ready</p>
                  <p className="text-xs text-muted-foreground">Privacy Level = &ldquo;High&rdquo; — Tool has strong, verified privacy protections suitable for district-wide deployment. FERPA compliant, DPA available, no student data used for model training.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning-bg/30 p-4">
                <span className="h-3 w-3 rounded-full bg-warning shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-bold text-navy">Teacher Use Only</p>
                  <p className="text-xs text-muted-foreground">Privacy Level = &ldquo;Medium&rdquo; — Tool has reasonable privacy practices but may lack full compliance documentation or have gaps that require individual teacher judgment rather than district-wide mandated deployment.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger-bg/30 p-4">
                <span className="h-3 w-3 rounded-full bg-danger shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-bold text-navy">Use Caution</p>
                  <p className="text-xs text-muted-foreground">Privacy Level = &ldquo;Low&rdquo; — Tool has significant privacy concerns or insufficient documentation. Not recommended for use with student data without additional district-level review and safeguards.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Monthly Rankings */}
          <section>
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Monthly Rankings Methodology
            </h2>
            <p>&ldquo;Top Tools This Month&rdquo; rankings use a weighted formula:</p>
            <div className="mt-3 rounded-xl bg-navy-50/50 p-5 font-mono text-sm">
              <p className="text-navy font-bold">Monthly Ranking Score =</p>
              <p className="text-muted-foreground ml-4">(Overall Score × 0.50)</p>
              <p className="text-muted-foreground ml-4">+ (Recency Score × 0.25)</p>
              <p className="text-muted-foreground ml-4">+ (Engagement Score × 0.15)</p>
              <p className="text-muted-foreground ml-4">+ (Completeness Score × 0.10)</p>
            </div>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li><strong>Recency:</strong> Recently reviewed tools receive a boost (reviewed today = 1.0, 180+ days = 0.0)</li>
              <li><strong>Engagement:</strong> Percentile rank of click-through volume in the past 30 days</li>
              <li><strong>Completeness:</strong> Percentage of optional profile fields filled (privacy notes, accessibility notes, VPAT, etc.)</li>
            </ul>
          </section>

          {/* Editorial Independence */}
          <section>
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <Scale className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Editorial Independence
            </h2>
            <div className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-6">
              <p className="font-bold text-navy mb-3">Our non-negotiable rules:</p>
              <ul className="space-y-2">
                {[
                  "Editorial scores are never influenced by paid relationships, affiliate partnerships, or listing tier.",
                  "The monthly ranking algorithm explicitly excludes featured_flag and is_sponsored from its computation.",
                  "Sponsored and featured listings are always visually labeled — never disguised as editorial picks.",
                  "Vendors cannot pay to improve their editorial score or ranking position.",
                  "We will decline or remove listings that misrepresent their privacy, compliance, or capabilities.",
                  "All compliance documentation links are independently verified — we link to vendor pages, not vendor claims.",
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-charcoal">
                    <ShieldCheck className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Correction Policy */}
          <section>
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Corrections &amp; Disputes
            </h2>
            <p>If a vendor or reader believes our evaluation contains an error:</p>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>Email <strong>editorial@districtaiindex.com</strong> with the specific claim and supporting evidence.</li>
              <li>Our editorial team will review the claim within 5 business days.</li>
              <li>If the claim is verified, we will update the tool profile and note the correction.</li>
              <li>If the claim is disputed, we will respond with our reasoning.</li>
            </ol>
            <p className="mt-3">We maintain a correction log. All significant changes to tool scores or classifications are documented with dates and reasons.</p>
          </section>

          <section className="rounded-xl border border-border bg-navy-50/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about our methodology? <Link href="/contact" className="text-accent-blue font-semibold hover:underline">Contact our editorial team</Link>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
