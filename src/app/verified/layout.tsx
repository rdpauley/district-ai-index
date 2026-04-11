import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verified District Ready AI Tools",
  description: "AI tools independently verified for district-wide adoption. Privacy documented, DPA available, accessibility confirmed.",
};

export default function VerifiedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
