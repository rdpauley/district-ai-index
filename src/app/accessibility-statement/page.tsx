import type { Metadata } from "next";
import Link from "next/link";
import { Accessibility, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement — District AI Index",
  description: "Our commitment to WCAG 2.1 Level AA accessibility and inclusive design for all educators.",
};

export default function AccessibilityStatementPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Accessibility className="h-10 w-10 text-white mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-white">Accessibility Statement</h1>
          <p className="mt-4 text-base text-navy-200">Last updated: April 10, 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-sm text-charcoal leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Our Commitment</h2>
            <p>The District AI Index is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards to make our directory useful for all educators, regardless of ability.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Conformance Standard</h2>
            <p>We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. WCAG 2.1 defines requirements for designers and developers to improve accessibility for people with disabilities, including visual, auditory, physical, speech, cognitive, language, learning, and neurological disabilities.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Accessibility Features</h2>
            <p>The District AI Index includes the following accessibility features:</p>
            <div className="mt-4 space-y-2">
              {[
                "Skip-to-content navigation link",
                "Semantic HTML structure (header, nav, main, section, article, footer)",
                "ARIA labels on all interactive elements including buttons, links, and form inputs",
                "Visible focus indicators on all keyboard-navigable elements",
                "Color contrast ratios meeting or exceeding 4.5:1 (WCAG AA)",
                "No reliance on color alone to convey information — all status indicators use text and/or icons",
                "All form inputs have associated labels with error messaging",
                "All images include alt text or are marked as decorative",
                "Responsive design that works across screen sizes and zoom levels",
                "Tables include proper scope attributes for screen reader navigation",
                "ARIA roles (status, meter, progressbar, tablist) for dynamic content",
                "Keyboard-navigable throughout — no mouse-only interactions",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Known Limitations</h2>
            <p>While we strive for full accessibility, we acknowledge the following known limitations:</p>
            <div className="mt-4 space-y-2">
              {[
                "Charts on the dashboard page (Recharts library) have limited screen reader support. Data tables providing the same information are available as an alternative.",
                "Some third-party compliance document links (PDFs hosted by vendors) may not meet accessibility standards. We link to them as-is since they are vendor-controlled documents.",
                "The tool comparison table may be complex for screen readers on mobile devices. We recommend using the desktop view for comparison features.",
              ].map((limitation) => (
                <div key={limitation} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{limitation}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Assistive Technology Compatibility</h2>
            <p>The District AI Index is designed to be compatible with the following assistive technologies:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Screen readers (VoiceOver, NVDA, JAWS)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
              <li>Browser text resizing and zoom (up to 200%)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Evaluation Methods</h2>
            <p>We assess the accessibility of the District AI Index through:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Automated testing using accessibility scanning tools</li>
              <li>Manual keyboard navigation testing</li>
              <li>Screen reader testing (VoiceOver on macOS)</li>
              <li>Color contrast analysis</li>
              <li>Semantic HTML validation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Feedback & Reporting Barriers</h2>
            <p>We welcome your feedback on the accessibility of the District AI Index. If you encounter an accessibility barrier, please tell us:</p>
            <div className="mt-4 rounded-xl border border-border bg-navy-50/50 p-5">
              <ul className="space-y-2">
                <li><strong>Email:</strong> accessibility@districtaiindex.com</li>
                <li><strong>Subject line:</strong> Accessibility Issue — [brief description]</li>
                <li><strong>Please include:</strong> URL of the page, description of the issue, your browser and assistive technology used</li>
              </ul>
              <p className="mt-3">We aim to respond to accessibility feedback within <strong>3 business days</strong> and to resolve identified barriers within <strong>30 days</strong> where technically feasible.</p>
            </div>
            <p className="mt-3">You can also use our <Link href="/contact" className="text-accent-blue font-semibold hover:underline">contact form</Link> and select &ldquo;Accessibility Issue&rdquo; as the subject.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">Applicable Standards & Laws</h2>
            <p>This accessibility effort aligns with:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
              <li>Section 508 of the Rehabilitation Act</li>
              <li>Americans with Disabilities Act (ADA) Title III</li>
              <li>EN 301 549 (European accessibility standard)</li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  );
}
