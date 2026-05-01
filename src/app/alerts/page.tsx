import type { Metadata } from "next";
import { AlertsClient } from "./alerts-client";

export const metadata: Metadata = {
  title: "Tool Change Alerts — Get Notified When Things Change",
  description:
    "Subscribe to email alerts when an AI tool's privacy posture, pricing, score, or VPAT status changes. Pick which tools to watch.",
  alternates: { canonical: "/alerts" },
};

export default function AlertsPage() {
  return <AlertsClient />;
}
