"use client";

import { CheckCircle2, Sparkles, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Basic Listing",
    icon: Star,
    price: "Free",
    period: "",
    description: "Get your tool listed in the District AI Index directory with a full evaluation profile.",
    features: [
      "Directory listing with tool profile",
      "Category and grade band classification",
      "Privacy flag assessment",
      "District readiness score",
      "Basic vendor information",
      "Community visibility",
    ],
    cta: "Submit Your Tool",
    ctaStyle: "border border-border text-navy hover:bg-navy-50",
    cardStyle: "border-border",
  },
  {
    name: "Featured Listing",
    icon: Sparkles,
    price: "$299",
    period: "/month",
    description: "Boost visibility with premium placement, enhanced profile, and priority evaluation.",
    features: [
      "Everything in Basic",
      "Featured placement in directory",
      "Enhanced profile with rich media",
      "Priority editorial evaluation",
      "Category spotlight inclusion",
      "Dashboard recommendation eligibility",
      "Monthly performance analytics",
      "Vendor response to reviews",
    ],
    cta: "Get Featured",
    ctaStyle: "bg-navy text-white hover:bg-navy-800",
    cardStyle: "border-accent-blue/30 shadow-md ring-1 ring-accent-blue/10",
    popular: true,
  },
  {
    name: "Verified District Ready",
    icon: Crown,
    price: "$599",
    period: "/month",
    description: "The highest trust level. Verified badge, premium placement, and direct access to district buyers.",
    features: [
      "Everything in Featured",
      "Verified District Ready badge",
      "Premium verified page placement",
      "Compliance documentation showcase",
      "DPA availability badge",
      "Accessibility documentation highlight",
      "Direct demo request routing",
      "Quarterly editorial re-evaluation",
      "Priority support and account management",
      "Conference and webinar co-marketing",
    ],
    cta: "Apply for Verification",
    ctaStyle: "bg-success text-white hover:bg-success/90",
    cardStyle: "border-success/30",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-navy">Listing Plans</h1>
          <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Reach K–12 technology leaders, instructional coaches, and curriculum directors who are actively evaluating AI tools for their districts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.name} className={cn("relative rounded-xl border bg-white p-6 flex flex-col transition-all duration-200 hover:shadow-lg", tier.cardStyle)}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-accent-blue px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="rounded-lg bg-navy-50 p-2"><Icon className="h-5 w-5 text-accent-blue" aria-hidden="true" /></div>
                    <h2 className="text-lg font-bold text-navy">{tier.name}</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-navy">{tier.price}</span>
                    {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tier.description}</p>
                </div>
                <div className="flex-1 space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm text-charcoal">
                      <CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                      {feature}
                    </div>
                  ))}
                </div>
                <button className={cn("w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors", tier.ctaStyle)}>{tier.cta}</button>
              </div>
            );
          })}
        </div>

        {/* Enterprise */}
        <div className="mt-12 rounded-xl border border-border bg-navy-50/50 p-8 text-center">
          <h2 className="text-lg font-bold text-navy mb-2">Enterprise &amp; Consortium Plans</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
            For EdTech companies managing multiple products, or state-level consortium agreements.
          </p>
          <button className="rounded-lg border border-border bg-white px-6 py-2.5 text-sm font-semibold text-navy hover:bg-navy-50 transition-colors">Contact Sales</button>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-navy text-center mb-8">Frequently Asked Questions</h2>
          {[
            { q: "How does the evaluation process work?", a: "Our editorial team evaluates each tool across five dimensions: ease of implementation, teacher usability, student safety, instructional impact, and integration/admin readiness. Each is scored out of 20 for a total of 100." },
            { q: "Can I get a Basic listing without paying?", a: "Yes. Basic listings are free. Submit your tool and our team will evaluate it within 2–3 weeks." },
            { q: "What does Verified District Ready mean?", a: "It indicates our team has verified your privacy documentation, DPA availability, accessibility compliance, and admin controls — signaling to district buyers that your tool meets enterprise requirements." },
            { q: "How often are tools re-evaluated?", a: "Basic and Featured listings annually. Verified District Ready tools receive quarterly re-evaluations." },
          ].map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-border bg-white mb-3">
              <summary className="cursor-pointer p-5 text-sm font-semibold text-navy list-none flex items-center justify-between">
                {faq.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">&#9662;</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
