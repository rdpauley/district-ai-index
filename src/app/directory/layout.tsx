import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tool Directory — Browse & Filter K–12 AI Tools",
  description: "Browse 25+ AI tools for education filtered by category, grade level, pricing, and privacy. Compare scores and find the right tools for your district.",
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
