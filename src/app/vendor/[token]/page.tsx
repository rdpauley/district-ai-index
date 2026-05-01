import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminDb } from "@/lib/firebase/admin";
import { getToolBySlug } from "@/lib/seed-data";
import { ShieldCheck, Eye, GitCompareArrows, FileText, ExternalLink, BarChart3, Bell } from "lucide-react";
import type { VendorEventType } from "@/lib/vendor";

export const metadata: Metadata = {
  title: "Vendor Dashboard",
  robots: { index: false, follow: false },
};

// Always render fresh — analytics shouldn't be cached.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string }>;
}

interface EventCounts {
  tool_view: number;
  compare_add: number;
  rfp_generate: number;
  affiliate_click: number;
  scorecard_view: number;
}

const EMPTY_COUNTS: EventCounts = {
  tool_view: 0,
  compare_add: 0,
  rfp_generate: 0,
  affiliate_click: 0,
  scorecard_view: 0,
};

async function loadClaim(token: string) {
  if (!token || token.length > 64) return null;
  const db = getAdminDb();
  if (!db) return null;
  try {
    const snap = await db
      .collection("vendor_claims")
      .where("dashboard_token", "==", token)
      .where("verified_at", "!=", null)
      .limit(1)
      .get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as {
      id: string;
      tool_id: string;
      tool_slug: string;
      vendor_name: string;
      contact_email: string;
      verified_at: string;
      revoked_at: string | null;
    };
  } catch (err) {
    console.error("[vendor/dashboard] firestore error:", err instanceof Error ? err.message : "unknown");
    return null;
  }
}

async function loadCounts(toolId: string, sinceIso: string): Promise<EventCounts> {
  const db = getAdminDb();
  if (!db) return EMPTY_COUNTS;
  try {
    const snap = await db
      .collection("tool_events")
      .where("tool_id", "==", toolId)
      .where("occurred_at", ">=", sinceIso)
      .get();
    const counts: EventCounts = { ...EMPTY_COUNTS };
    for (const doc of snap.docs) {
      const ev = doc.data().event_type as VendorEventType;
      if (ev in counts) counts[ev as keyof EventCounts] += 1;
    }
    return counts;
  } catch (err) {
    console.error("[vendor/dashboard] event query failed:", err instanceof Error ? err.message : "unknown");
    return EMPTY_COUNTS;
  }
}

export default async function VendorDashboardPage({ params }: Props) {
  const { token } = await params;
  const claim = await loadClaim(token);
  if (!claim || claim.revoked_at) notFound();

  const tool = getToolBySlug(claim.tool_slug);
  if (!tool) notFound();

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const counts = await loadCounts(claim.tool_id, since30);

  const stats = [
    { icon: Eye, label: "Tool page views", value: counts.tool_view, helper: "Times your listing was viewed" },
    { icon: GitCompareArrows, label: "Compare adds", value: counts.compare_add, helper: "Districts added you to a comparison" },
    { icon: FileText, label: "RFP packs generated", value: counts.rfp_generate, helper: "Districts included you in a procurement brief" },
    { icon: ExternalLink, label: "Click-throughs", value: counts.affiliate_click, helper: "Visits to your website from listings" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Verified vendor
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight">{claim.vendor_name}</h1>
          <p className="mt-2 text-sm text-navy-100">
            Managing <Link href={`/tool/${tool.slug}`} className="text-white underline hover:text-accent-gold">{tool.name}</Link> · signed in as {claim.contact_email}
          </p>
        </div>
      </section>

      {/* KPI grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="kpi-heading">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-charcoal" aria-hidden="true" />
          <h2 id="kpi-heading" className="text-sm font-bold text-navy">
            Last 30 days
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-white p-5">
              <s.icon className="h-5 w-5 text-accent-blue mb-3" aria-hidden="true" />
              <p className="text-3xl font-bold text-navy tabular-nums">{s.value.toLocaleString()}</p>
              <p className="text-sm font-semibold text-navy mt-1">{s.label}</p>
              <p className="text-xs text-charcoal-light mt-1 leading-snug">{s.helper}</p>
            </div>
          ))}
        </div>

        {Object.values(counts).every((v) => v === 0) && (
          <div className="mt-4 rounded-xl border border-navy-100 bg-navy-50 p-4 text-xs text-charcoal">
            <p className="font-bold text-navy mb-1">No activity recorded yet</p>
            <p>
              Tracking begins from the moment of your verification. Numbers populate as districts visit your
              listing, add it to comparisons, or generate procurement briefs that include you.
            </p>
          </div>
        )}
      </section>

      {/* Listing snapshot */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-8">
        <h2 className="text-sm font-bold text-navy mb-3">Your current listing snapshot</h2>
        <div className="rounded-xl border border-border bg-white p-6">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal">Privacy posture</dt>
              <dd className="mt-1 text-navy font-bold">{tool.privacy_flag}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal">Pricing model</dt>
              <dd className="mt-1 text-navy font-bold">{tool.pricing_type}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal">Editorial score</dt>
              <dd className="mt-1 text-navy font-bold">{tool.overall_score.toFixed(1)}/10</dd>
            </div>
            <div className="sm:col-span-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-charcoal">Last reviewed</dt>
              <dd className="mt-1 text-charcoal">{tool.last_reviewed}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Right of reply */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-sm font-bold text-navy mb-3">Submit a correction</h2>
        <div className="rounded-xl border border-border bg-white p-6">
          <p className="text-sm text-charcoal leading-relaxed mb-4">
            Found something inaccurate or want to add context? Email{" "}
            <a href="mailto:editorial@districtaiindex.com" className="text-accent-blue hover:underline">
              editorial@districtaiindex.com
            </a>{" "}
            with the change you'd like and any supporting documentation. Our editorial team reviews every
            submission within 5 business days.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/tool/${tool.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-800 transition-colors"
            >
              View public listing
            </Link>
            <Link
              href="/editorial-policy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-charcoal hover:bg-navy-50 hover:text-navy transition-colors"
            >
              Editorial policy
            </Link>
            <Link
              href="/alerts"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-charcoal hover:bg-navy-50 hover:text-navy transition-colors"
            >
              <Bell className="h-3.5 w-3.5" aria-hidden="true" /> Subscribe to your own change alerts
            </Link>
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12 text-xs text-charcoal-light">
        This URL is your persistent dashboard — bookmark it. Anyone with this link can see your analytics, so
        keep it private. To rotate the link, contact editorial@districtaiindex.com.
      </p>
    </div>
  );
}
