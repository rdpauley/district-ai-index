import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Tool for Review",
  description: "Submit your AI education tool for evaluation and inclusion in the District AI Index directory.",
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
