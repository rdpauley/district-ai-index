import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, tools } from "@/lib/seed-data";
import { ClaimForm } from "./claim-form";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, BarChart3, Mail, AlertCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool not found" };
  return {
    title: `Claim ${tool.name} — Vendor Listing`,
    description: `Claim your ${tool.name} listing on District AI Index to access view analytics, comparison metrics, and the right of reply.`,
    robots: { index: false, follow: false },
  };
}

export default async function ClaimPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const websiteHostname = (() => {
    try {
      return new URL(tool.website).hostname.replace(/^www\./, "");
    } catch {
      return tool.website;
    }
  })();

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          <nav aria-label="Breadcrumb" className="mb-3">
            <Link href={`/tool/${tool.slug}`} className="inline-flex items-center gap-1 text-xs text-navy-100 hover:text-white transition-colors">
              <ArrowLeft className="h-3 w-3" aria-hidden="true" /> Back to {tool.name}
            </Link>
          </nav>
          <h1 className="text-3xl font-bold leading-tight">Claim your {tool.name} listing</h1>
          <p className="mt-3 text-sm text-navy-100 max-w-2xl">
            Claiming verifies you represent <strong className="text-white">{tool.vendor}</strong> and unlocks
            a private analytics dashboard plus the right to submit corrections to your listing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Benefit icon={BarChart3} title="Analytics dashboard" body="See views, comparison adds, and click-throughs from districts." />
          <Benefit icon={Mail} title="Right of reply" body="Submit corrections or context to be considered by our editorial team." />
          <Benefit icon={ShieldCheck} title="Verified badge" body="Your listing displays a 'Vendor verified' badge to district visitors." />
        </div>

        <div className="rounded-xl border border-navy-100 bg-navy-50 p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-navy shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-charcoal leading-relaxed">
            <p className="font-bold text-navy mb-1">Verification step</p>
            <p>
              Your contact email must be at <strong className="text-navy">@{websiteHostname}</strong> (or a
              subdomain). We email a one-time link to that address — no password setup, no support tickets.
            </p>
          </div>
        </div>

        <ClaimForm toolSlug={tool.slug} toolName={tool.name} websiteHostname={websiteHostname} defaultVendor={tool.vendor} />

        <p className="mt-6 text-xs text-charcoal-light">
          Claiming a listing does not affect editorial scoring or rankings. See our{" "}
          <Link href="/editorial-policy" className="text-accent-blue hover:underline">editorial policy</Link>.
        </p>
      </section>
    </div>
  );
}

function Benefit({ icon: Icon, title, body }: { icon: typeof ShieldCheck; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <Icon className="h-5 w-5 text-accent-blue mb-2" aria-hidden="true" />
      <p className="text-sm font-bold text-navy">{title}</p>
      <p className="text-xs text-charcoal-light mt-1 leading-relaxed">{body}</p>
    </div>
  );
}
