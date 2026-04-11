import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listing Plans — Get Your AI Tool Listed",
  description: "List your AI education tool in the District AI Index. Basic (free), Featured ($299/mo), and Verified District Ready ($599/mo) tiers.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
