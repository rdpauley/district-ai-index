import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — District AI Index",
  description: "How the District AI Index collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-4 text-sm text-navy-200">Last updated: April 10, 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose-navy">
        <div className="space-y-8 text-sm text-charcoal leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-navy mb-3">1. Introduction</h2>
            <p>District AI Index (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website at districtaiindex.com. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            <p className="mt-2">We are committed to protecting the privacy of educators, administrators, and all visitors to our platform. We do not sell personal data. We do not use personal data for behavioral advertising.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">2. Information We Collect</h2>
            <h3 className="text-sm font-bold text-navy mt-4 mb-2">Information you provide directly:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Newsletter subscription:</strong> email address</li>
              <li><strong>Tool submission form:</strong> contact name, email, tool name, website URL, and related tool information</li>
              <li><strong>Contact form:</strong> name, email, subject, and message content</li>
            </ul>
            <h3 className="text-sm font-bold text-navy mt-4 mb-2">Information collected automatically:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Analytics:</strong> We use privacy-friendly analytics (Plausible) that do not use cookies and do not track individual users. Aggregate page view data is collected.</li>
              <li><strong>Affiliate click tracking:</strong> When you click &ldquo;Visit Tool,&rdquo; we log a hashed (anonymized) IP address, referrer, and timestamp. We do not store raw IP addresses.</li>
              <li><strong>Server logs:</strong> Standard web server logs including IP address, browser type, and pages visited. These are retained for 30 days for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To send you the newsletter you subscribed to (opt-in only)</li>
              <li>To process tool submissions and respond to inquiries</li>
              <li>To track aggregate affiliate click performance (not individual behavior)</li>
              <li>To improve our website and directory based on aggregate usage patterns</li>
              <li>To detect and prevent abuse of our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">4. Information We Do NOT Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We do not collect student data of any kind</li>
              <li>We do not use tracking cookies or third-party advertising trackers</li>
              <li>We do not create user profiles for behavioral targeting</li>
              <li>We do not sell, rent, or trade personal information to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">5. Data Sharing</h2>
            <p>We share personal information only in these limited circumstances:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Service providers:</strong> We use Supabase (database), Vercel (hosting), and Resend (email) to operate our platform. These providers process data on our behalf under contractual obligations.</li>
              <li><strong>Legal requirements:</strong> If required by law, subpoena, or government request.</li>
              <li><strong>Business transfer:</strong> In connection with a merger, acquisition, or sale of assets, with notice to affected users.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">6. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Newsletter subscribers:</strong> Retained until you unsubscribe</li>
              <li><strong>Submissions:</strong> Retained for 2 years after final review decision</li>
              <li><strong>Affiliate click logs:</strong> Anonymized data retained for 12 months</li>
              <li><strong>Contact form messages:</strong> Retained for 1 year</li>
              <li><strong>Server logs:</strong> 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Unsubscribe from the newsletter at any time</li>
              <li>Object to processing of your information</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, contact us at <strong>privacy@districtaiindex.com</strong>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">8. Children&apos;s Privacy</h2>
            <p>Our website is designed for adult educators and administrators. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child, contact us immediately at privacy@districtaiindex.com and we will delete it.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">9. Security</h2>
            <p>We implement industry-standard security measures including encryption in transit (TLS), encrypted storage, access controls, and regular security reviews. However, no method of electronic transmission or storage is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the site after changes constitutes acceptance of the revised policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3">11. Contact</h2>
            <p>For privacy-related questions or requests:</p>
            <p className="mt-2"><strong>Email:</strong> privacy@districtaiindex.com</p>
            <p className="mt-1">Or use our <Link href="/contact" className="text-accent-blue font-semibold hover:underline">contact form</Link>.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
