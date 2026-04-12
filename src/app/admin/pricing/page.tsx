"use client";

import { tools } from "@/lib/seed-data";
import Link from "next/link";
import {
  DollarSign, TrendingUp, Users, CheckCircle2, AlertCircle,
  ArrowLeft, Star, Crown, Sparkles, Calculator, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Basic Listing",
    slug: "basic",
    icon: Star,
    price: 0,
    priceLabel: "Free",
    description: "Entry-level listing in the directory",
    inclusions: [
      "Directory listing with full tool profile",
      "Category and grade band classification",
      "Privacy flag assessment",
      "District readiness score (editorial)",
      "Basic vendor information",
      "Community visibility",
    ],
    deliveryCost: {
      editorial_hours: 2,
      hosting_monthly: 0.05,
      review_frequency: "Annual",
    },
    targetCount: "100+ tools",
    conversionGoal: "Lead generation for featured upgrades",
  },
  {
    name: "Featured Listing",
    slug: "featured",
    icon: Sparkles,
    price: 299,
    priceLabel: "$299/month",
    description: "Boosted visibility with priority placement",
    inclusions: [
      "Everything in Basic",
      "Featured placement in directory (rotating slots)",
      "Enhanced profile with rich media support",
      "Priority editorial evaluation and re-review",
      "Category spotlight inclusion (2x per month)",
      "Dashboard recommendation eligibility",
      "Monthly performance analytics email",
      "Vendor right-of-reply to editorial reviews",
    ],
    deliveryCost: {
      editorial_hours: 4,
      hosting_monthly: 0.15,
      review_frequency: "Semi-annual",
    },
    targetCount: "20-30 tools",
    conversionGoal: "Recurring MRR",
  },
  {
    name: "Verified District Ready",
    slug: "verified",
    icon: Crown,
    price: 599,
    priceLabel: "$599/month",
    description: "Highest trust tier with compliance verification",
    inclusions: [
      "Everything in Featured",
      "Verified District Ready badge",
      "Premium placement on /verified page",
      "Compliance documentation showcase",
      "DPA availability badge",
      "Accessibility documentation highlight",
      "Direct demo request routing (leads sent to vendor)",
      "Quarterly editorial re-evaluation (4x/year)",
      "Priority support and dedicated account management",
      "Conference and webinar co-marketing opportunities",
    ],
    deliveryCost: {
      editorial_hours: 8,
      hosting_monthly: 0.25,
      review_frequency: "Quarterly",
    },
    targetCount: "10-15 tools",
    conversionGoal: "Premium MRR + strategic partnerships",
  },
];

const vendorHourlyRate = 75;

export default function AdminPricingPage() {
  // Simulated subscriber counts by tier (in production, from Firestore)
  const subscribers = {
    basic: tools.filter((t) => t.listing_tier === "basic").length,
    featured: tools.filter((t) => t.listing_tier === "featured").length,
    verified: tools.filter((t) => t.listing_tier === "verified").length,
  };

  // Revenue assumes only featured+verified pay (basic is free)
  // For demo, assume 20% of featured and 50% of verified are actually paying
  const paidFeatured = Math.floor(subscribers.featured * 0.2);
  const paidVerified = Math.floor(subscribers.verified * 0.5);
  const mrr = paidFeatured * 299 + paidVerified * 599;
  const arr = mrr * 12;

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-navy mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to Admin
          </Link>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-accent-blue" aria-hidden="true" /> Pricing Operations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tier economics, MRR tracking, and subscriber management
          </p>
        </div>

        {/* Revenue KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "MRR (Monthly Recurring)", value: `$${mrr.toLocaleString()}`, icon: DollarSign, color: "text-success" },
            { label: "ARR (Annual Run Rate)", value: `$${arr.toLocaleString()}`, icon: TrendingUp, color: "text-accent-blue" },
            { label: "Paid Subscribers", value: paidFeatured + paidVerified, icon: Users, color: "text-[#7C3AED]" },
            { label: "Total Listings", value: tools.length, icon: FileText, color: "text-warning" },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2"><k.icon className={cn("h-4 w-4", k.color)} aria-hidden="true" /><span className="text-xs font-semibold text-muted-foreground">{k.label}</span></div>
              <p className="text-2xl font-bold text-navy">{k.value}</p>
            </div>
          ))}
        </div>

        {/* Tier Details */}
        <div>
          <h2 className="text-lg font-bold text-navy mb-4">Tier Economics & Inclusions</h2>
          <div className="space-y-4">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const count = subscribers[tier.slug as keyof typeof subscribers];
              const paidCount = tier.slug === "basic" ? 0 : tier.slug === "featured" ? paidFeatured : paidVerified;
              const tierMRR = tier.price * paidCount;
              const deliveryCostPerMonth = tier.deliveryCost.editorial_hours * vendorHourlyRate + tier.deliveryCost.hosting_monthly;
              const grossMarginPerSub = tier.price - deliveryCostPerMonth;
              const marginPct = tier.price > 0 ? Math.round((grossMarginPerSub / tier.price) * 100) : 0;

              return (
                <div key={tier.slug} className="rounded-xl border border-border p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: tier info */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-lg bg-navy-50 p-2"><Icon className="h-5 w-5 text-accent-blue" aria-hidden="true" /></div>
                        <h3 className="text-base font-bold text-navy">{tier.name}</h3>
                      </div>
                      <p className="text-2xl font-bold text-navy">{tier.priceLabel}</p>
                      <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Target vendor count</span><span className="font-semibold text-navy">{tier.targetCount}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Current subscribers</span><span className="font-semibold text-navy">{count}</span></div>
                        {tier.price > 0 && (
                          <>
                            <div className="flex justify-between"><span className="text-muted-foreground">Assumed paying</span><span className="font-semibold text-navy">{paidCount}</span></div>
                            <div className="flex justify-between pt-1 border-t border-border"><span className="text-muted-foreground">Tier MRR</span><span className="font-bold text-success">${tierMRR}</span></div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Middle: inclusions */}
                    <div>
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2">What's Included</h4>
                      <ul className="space-y-1.5">
                        {tier.inclusions.map((item) => (
                          <li key={item} className="text-xs text-charcoal flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right: unit economics */}
                    <div>
                      <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Calculator className="h-3 w-3" /> Unit Economics
                      </h4>
                      <div className="rounded-lg bg-navy-50/50 p-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Editorial hours/mo</span>
                          <span className="text-navy font-medium">{tier.deliveryCost.editorial_hours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Labor cost (@$75/h)</span>
                          <span className="text-navy font-medium">${tier.deliveryCost.editorial_hours * vendorHourlyRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hosting/compute</span>
                          <span className="text-navy font-medium">${tier.deliveryCost.hosting_monthly.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-1.5">
                          <span className="text-muted-foreground">Total cost/sub</span>
                          <span className="text-navy font-bold">${deliveryCostPerMonth.toFixed(2)}</span>
                        </div>
                        {tier.price > 0 && (
                          <>
                            <div className="flex justify-between border-t border-border pt-1.5">
                              <span className="text-muted-foreground">Gross margin/sub</span>
                              <span className={cn("font-bold", grossMarginPerSub > 0 ? "text-success" : "text-danger")}>
                                ${grossMarginPerSub.toFixed(0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Margin %</span>
                              <span className={cn("font-bold", marginPct > 50 ? "text-success" : marginPct > 30 ? "text-warning" : "text-danger")}>
                                {marginPct}%
                              </span>
                            </div>
                          </>
                        )}
                        <div className="pt-1.5 border-t border-border">
                          <p className="text-[10px] text-muted-foreground italic">Review frequency: {tier.deliveryCost.review_frequency}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Rules */}
        <div className="rounded-xl border-2 border-accent-blue/20 bg-accent-blue/5 p-6">
          <h2 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-accent-blue" aria-hidden="true" /> Business Rules &amp; Non-Negotiables
          </h2>
          <ul className="space-y-2 text-sm text-charcoal">
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />Paid tiers never influence editorial scores or rankings</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />Featured and Sponsored placements are visibly labeled on the site</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />Monthly ranking algorithm excludes `featured_flag` and `is_sponsored` from computation</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />Verified tier requires valid FERPA/COPPA/DPA documentation — no exceptions</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />Vendors can purchase tier upgrade but cannot purchase a higher score</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" aria-hidden="true" />Refund policy: prorated refund within 14 days of purchase if editorial conflict arises</li>
          </ul>
        </div>

        {/* Growth Scenarios */}
        <div>
          <h2 className="text-lg font-bold text-navy mb-4">Revenue Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Conservative (Year 1)", featured: 10, verified: 3, desc: "Realistic first-year assumptions" },
              { name: "Target (Year 2)", featured: 25, verified: 8, desc: "With content marketing + SEO" },
              { name: "Aggressive (Year 3)", featured: 50, verified: 20, desc: "Market leader positioning" },
            ].map((s) => {
              const scenarioMRR = s.featured * 299 + s.verified * 599;
              const scenarioARR = scenarioMRR * 12;
              return (
                <div key={s.name} className="rounded-xl border border-border p-5">
                  <h3 className="text-sm font-bold text-navy">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between"><span>Featured</span><span className="font-semibold text-navy">{s.featured} × $299</span></div>
                    <div className="flex justify-between"><span>Verified</span><span className="font-semibold text-navy">{s.verified} × $599</span></div>
                    <div className="flex justify-between pt-1 border-t border-border"><span className="text-muted-foreground">MRR</span><span className="font-bold text-success">${scenarioMRR.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">ARR</span><span className="font-bold text-success">${scenarioARR.toLocaleString()}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
