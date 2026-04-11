import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — District AI Index",
  description: "Terms and conditions for using the District AI Index website and services.",
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          <p className="mt-4 text-sm text-navy-200">Last updated: April 10, 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-sm text-charcoal leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-navy mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the District AI Index website (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">2. Description of Service</h2>
            <p>The District AI Index is an online directory and evaluation platform that provides reviews, scores, and comparisons of AI tools for K–12 education. The Service includes:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>A searchable and filterable tool directory</li>
              <li>Editorial reviews and scoring of AI education tools</li>
              <li>Compliance and privacy documentation references</li>
              <li>Tool comparison features</li>
              <li>Reports and analysis for district leaders</li>
              <li>Newsletter and email communications (opt-in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">3. Editorial Content Disclaimer</h2>
            <p>Tool reviews, scores, and evaluations represent the editorial opinion of the District AI Index team based on our published methodology. They are provided for informational purposes only and should not be the sole basis for procurement decisions.</p>
            <p className="mt-2">Districts should conduct their own due diligence, including direct verification of vendor privacy policies, compliance certifications, and accessibility conformance, before making purchasing decisions.</p>
            <p className="mt-2 font-semibold">We do not guarantee the accuracy, completeness, or timeliness of any information provided on this site, including vendor compliance claims.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">4. Affiliate Links & Sponsored Content</h2>
            <p>The Service may contain affiliate links. When you click &ldquo;Visit Tool&rdquo; and subsequently purchase a product, we may earn a commission at no additional cost to you. Affiliate relationships do not influence our editorial scores or rankings.</p>
            <p className="mt-2">Sponsored and featured listings are clearly labeled. Our <Link href="/editorial-policy" className="text-accent-blue font-semibold hover:underline">Editorial Policy</Link> details how we separate paid placement from editorial evaluation.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">5. User Submissions</h2>
            <p>By submitting a tool through our submission form, you represent that:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The information provided is accurate to the best of your knowledge</li>
              <li>You have authority to submit the tool on behalf of the vendor</li>
              <li>You consent to our editorial team reviewing and evaluating the tool</li>
              <li>You understand that submission does not guarantee inclusion in the directory</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">6. Intellectual Property</h2>
            <p>All content on the District AI Index, including text, design, logos, scores, reviews, and analysis, is the property of District AI Index or its content suppliers and is protected by copyright law.</p>
            <p className="mt-2">Tool names, logos, and trademarks referenced in the directory belong to their respective owners. Their inclusion in our directory does not imply endorsement by those companies.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">7. Limitation of Liability</h2>
            <p>The District AI Index is provided &ldquo;as is&rdquo; without warranty of any kind. We shall not be liable for any damages arising from the use of or inability to use the Service, including but not limited to damages from procurement decisions made based on our evaluations.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">8. Prohibited Uses</h2>
            <p>You may not:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Scrape, crawl, or systematically extract data from the Service beyond what is permitted by our robots.txt</li>
              <li>Use the Service to generate artificial affiliate clicks or manipulate rankings</li>
              <li>Impersonate District AI Index or misrepresent your relationship with us</li>
              <li>Republish our editorial content without attribution and permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">9. Vendor Listing Terms</h2>
            <p>Vendors who purchase Featured or Verified listing plans are subject to additional terms outlined in their service agreement. Listing plans do not guarantee specific editorial scores or rankings. We reserve the right to decline or remove any listing that does not meet our editorial standards.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes take effect upon posting to this page. Continued use of the Service constitutes acceptance of revised terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">11. Contact</h2>
            <p>Questions about these Terms should be directed to <strong>legal@districtaiindex.com</strong> or our <Link href="/contact" className="text-accent-blue font-semibold hover:underline">contact form</Link>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
