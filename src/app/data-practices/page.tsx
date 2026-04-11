import type { Metadata } from "next";
import Link from "next/link";
import { Database, ShieldCheck, Lock, Eye, Trash2, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Practices — District AI Index",
  description: "How the District AI Index handles data collection, storage, security, and third-party services.",
};

export default function DataPracticesPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Database className="h-10 w-10 text-white mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-white">Data Practices</h1>
          <p className="mt-4 text-base text-navy-200">
            Transparency about how we collect, store, and protect data on this platform.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8 text-sm text-charcoal leading-relaxed">
          <div className="rounded-xl border-2 border-success/20 bg-success-bg/30 p-6">
            <h2 className="text-base font-bold text-navy mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" aria-hidden="true" /> Key Principles
            </h2>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2"><strong className="text-navy shrink-0">No student data.</strong> This platform is for educators and administrators. We never collect, store, or process student PII.</li>
              <li className="flex items-start gap-2"><strong className="text-navy shrink-0">No tracking cookies.</strong> We use Plausible Analytics, which is cookie-free and GDPR-compliant.</li>
              <li className="flex items-start gap-2"><strong className="text-navy shrink-0">No data sales.</strong> We never sell, rent, or trade personal information.</li>
              <li className="flex items-start gap-2"><strong className="text-navy shrink-0">Privacy by design.</strong> Affiliate clicks use hashed IPs, never raw addresses.</li>
            </ul>
          </div>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <Server className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Infrastructure & Third-Party Services
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-border rounded-xl overflow-hidden text-sm">
                <thead className="bg-navy-50/50">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-navy" scope="col">Service</th>
                    <th className="text-left py-2 px-3 font-semibold text-navy" scope="col">Purpose</th>
                    <th className="text-left py-2 px-3 font-semibold text-navy" scope="col">Data Processed</th>
                    <th className="text-left py-2 px-3 font-semibold text-navy" scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { service: "Vercel", purpose: "Website hosting & CDN", data: "Page requests, server logs", location: "US / Global Edge" },
                    { service: "Supabase", purpose: "Database & authentication", data: "Tool data, submissions, newsletter emails", location: "US (AWS)" },
                    { service: "Plausible", purpose: "Privacy-friendly analytics", data: "Aggregate page views only (no cookies, no PII)", location: "EU" },
                    { service: "Resend", purpose: "Transactional email", data: "Email addresses for newsletter delivery", location: "US" },
                    { service: "n8n", purpose: "Workflow automation", data: "Tool metadata for content generation", location: "Self-hosted / US" },
                    { service: "Anthropic (Claude)", purpose: "AI content generation", data: "Tool data (no PII) for generating descriptions", location: "US" },
                  ].map((row) => (
                    <tr key={row.service} className="border-t border-border">
                      <td className="py-2 px-3 font-medium text-navy">{row.service}</td>
                      <td className="py-2 px-3 text-muted-foreground">{row.purpose}</td>
                      <td className="py-2 px-3 text-muted-foreground">{row.data}</td>
                      <td className="py-2 px-3 text-muted-foreground">{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Security Measures
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All data encrypted in transit (TLS 1.2+)</li>
              <li>Database encrypted at rest (AES-256)</li>
              <li>Row-Level Security (RLS) on all database tables</li>
              <li>API routes authenticated via shared secrets for admin/automation operations</li>
              <li>Affiliate click tracking uses SHA-256 hashed IPs — raw IPs are never stored</li>
              <li>Admin operations restricted to service-role authentication</li>
              <li>No public write access to tool data — only read access through RLS policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <Eye className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Affiliate Click Tracking
            </h2>
            <p>When you click &ldquo;Visit Tool&rdquo; on any tool card or detail page, the request is routed through our tracking endpoint before redirecting to the vendor website. Here is exactly what we capture:</p>
            <div className="mt-3 rounded-xl bg-navy-50/50 p-4 font-mono text-xs">
              <p className="text-navy">// What we store per click:</p>
              <p className="text-muted-foreground">tool_id: &ldquo;uuid-of-the-tool&rdquo;</p>
              <p className="text-muted-foreground">ip_hash: &ldquo;sha256(ip + tool_slug)[0:16]&rdquo; // anonymized, not reversible</p>
              <p className="text-muted-foreground">referrer: &ldquo;the page you clicked from&rdquo;</p>
              <p className="text-muted-foreground">user_agent: &ldquo;your browser string&rdquo;</p>
              <p className="text-muted-foreground">clicked_at: &ldquo;timestamp&rdquo;</p>
              <p className="mt-2 text-navy">// What we do NOT store:</p>
              <p className="text-muted-foreground">raw_ip: never stored</p>
              <p className="text-muted-foreground">user_id: we don&apos;t have accounts</p>
              <p className="text-muted-foreground">browsing_history: not tracked</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Data Retention & Deletion
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-border rounded-xl overflow-hidden text-sm">
                <thead className="bg-navy-50/50">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-navy" scope="col">Data Type</th>
                    <th className="text-left py-2 px-3 font-semibold text-navy" scope="col">Retention</th>
                    <th className="text-left py-2 px-3 font-semibold text-navy" scope="col">Deletion Method</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: "Newsletter emails", retention: "Until unsubscribe", deletion: "Automatic on unsubscribe request" },
                    { type: "Tool submissions", retention: "2 years after review", deletion: "Automatic purge" },
                    { type: "Affiliate click logs", retention: "12 months", deletion: "Monthly automated cleanup" },
                    { type: "Contact messages", retention: "1 year", deletion: "Manual review + delete" },
                    { type: "Server logs", retention: "30 days", deletion: "Auto-rotated by hosting provider" },
                  ].map((row) => (
                    <tr key={row.type} className="border-t border-border">
                      <td className="py-2 px-3 font-medium text-navy">{row.type}</td>
                      <td className="py-2 px-3 text-muted-foreground">{row.retention}</td>
                      <td className="py-2 px-3 text-muted-foreground">{row.deletion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3">To request deletion of your personal data, email <strong>privacy@districtaiindex.com</strong>.</p>
          </section>

          <section className="rounded-xl border border-border bg-navy-50/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              For more information, see our <Link href="/privacy-policy" className="text-accent-blue font-semibold hover:underline">Privacy Policy</Link> or <Link href="/contact" className="text-accent-blue font-semibold hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
