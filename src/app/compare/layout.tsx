import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare AI Tools Side-by-Side",
  description: "Compare up to 4 AI education tools across privacy, pricing, instructional fit, accessibility, and compliance.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
