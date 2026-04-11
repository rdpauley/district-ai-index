import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Target, Users, BarChart3, BookOpen, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "About — District AI Index",
  description: "Learn about the District AI Index mission, team, and approach to evaluating AI tools for K–12 education.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white">About District AI Index</h1>
          <p className="mt-4 text-base text-navy-200 leading-relaxed">
            We help K–12 districts make safe, informed decisions about AI tools for education.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Mission */}
        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-xl font-bold text-navy flex items-center gap-2">
            <Target className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Our Mission
          </h2>
          <p className="mt-3 text-sm text-charcoal leading-relaxed">
            The District AI Index exists to bridge the gap between the rapid growth of AI education tools and the careful, compliance-driven evaluation process that school districts require. We provide a trusted, independent directory where technology leaders, instructional coaches, and curriculum directors can discover, compare, and evaluate AI tools with the rigor their districts demand.
          </p>
          <p className="mt-3 text-sm text-charcoal leading-relaxed">
            We believe that every district deserves access to clear, honest, and actionable information about the AI tools available to their educators and students — without hype, without bias, and with full transparency about our evaluation methods and business model.
          </p>
        </section>

        {/* What We Do */}
        <section aria-labelledby="what-we-do-heading">
          <h2 id="what-we-do-heading" className="text-xl font-bold text-navy flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent-blue" aria-hidden="true" /> What We Do
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Independent Evaluation", desc: "Every tool is scored across four dimensions by our editorial team: Ease of Use, Instructional Value, Data Privacy, and Accessibility." },
              { title: "Privacy-First Reviews", desc: "We research and link to actual FERPA, COPPA, SOC 2, and DPA documentation — not vendor claims — so districts can verify compliance themselves." },
              { title: "VPAT/ACR Tracking", desc: "We track Voluntary Product Accessibility Template availability for every tool, linking to actual documents where published." },
              { title: "Transparent Methodology", desc: "Our scoring formula, ranking logic, and editorial policies are fully documented and publicly available." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border p-4">
                <h3 className="text-sm font-bold text-navy">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who We Serve */}
        <section aria-labelledby="audience-heading">
          <h2 id="audience-heading" className="text-xl font-bold text-navy flex items-center gap-2">
            <Users className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Who We Serve
          </h2>
          <ul className="mt-4 space-y-3" role="list">
            {[
              { role: "District Technology Directors & CTOs", desc: "Make procurement decisions with verified privacy and compliance documentation." },
              { role: "Instructional Coaches", desc: "Find the right AI tools to recommend to teachers based on instructional fit and usability." },
              { role: "Curriculum Leaders", desc: "Evaluate how AI tools align with standards, pedagogy, and differentiation needs." },
              { role: "School Principals", desc: "Understand what AI tools their teachers are using and whether they meet district requirements." },
              { role: "Teachers", desc: "Discover AI tools vetted for classroom use with clear information about capabilities and limitations." },
            ].map((item) => (
              <li key={item.role} className="flex items-start gap-3 text-sm">
                <ShieldCheck className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-semibold text-navy">{item.role}</span>
                  <span className="text-muted-foreground"> — {item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Business Model Transparency */}
        <section aria-labelledby="business-heading">
          <h2 id="business-heading" className="text-xl font-bold text-navy flex items-center gap-2">
            <Scale className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Business Model Transparency
          </h2>
          <p className="mt-3 text-sm text-charcoal leading-relaxed">
            The District AI Index generates revenue through three channels:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-charcoal" role="list">
            <li className="flex items-start gap-2">
              <span className="font-bold text-navy">1.</span>
              <span><strong>Affiliate links:</strong> When you click "Visit Tool" and make a purchase, we may earn a referral fee. This never affects our editorial scores or rankings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-navy">2.</span>
              <span><strong>Featured & Verified listings:</strong> Vendors can pay for enhanced directory placement. Paid placements are always clearly labeled as "Featured" or "Sponsored" — never disguised as editorial picks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-navy">3.</span>
              <span><strong>Custom reports:</strong> We offer paid evaluation reports tailored to specific district requirements.</span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-charcoal leading-relaxed font-semibold">
            Our editorial scores are never influenced by paid relationships. The ranking algorithm explicitly excludes featured and sponsored status from its computation.
          </p>
        </section>

        {/* Editorial Standards */}
        <section aria-labelledby="standards-heading">
          <h2 id="standards-heading" className="text-xl font-bold text-navy flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent-blue" aria-hidden="true" /> Editorial Standards
          </h2>
          <p className="mt-3 text-sm text-charcoal leading-relaxed">
            For a complete description of how we evaluate tools, our scoring methodology, and our policies on transparency and fairness, see our{" "}
            <Link href="/editorial-policy" className="text-accent-blue font-semibold hover:underline">Editorial Policy</Link>.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-border bg-navy-50/50 p-6 text-center">
          <h2 className="text-lg font-bold text-navy">Get in Touch</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Questions about our directory, methodology, or business? We'd love to hear from you.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 mt-4 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
