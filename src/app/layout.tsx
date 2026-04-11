import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "District AI Index — K–12 AI Tools Directory & Evaluation Platform",
    template: "%s | District AI Index",
  },
  description:
    "Discover, compare, and evaluate AI tools for K–12 school and district adoption. Enterprise-grade directory for teachers, principals, and district technology leaders.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://districtaiindex.com"),
  openGraph: {
    title: "District AI Index",
    description: "The enterprise-grade K–12 AI tools directory. Discover, compare, and evaluate AI tools with privacy ratings, readiness scores, and editorial reviews.",
    siteName: "District AI Index",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Plausible Analytics — privacy-friendly, no cookies, GDPR compliant */}
        {/* Uncomment and replace domain when ready to deploy: */}
        {/* <script defer data-domain="districtaiindex.com" src="https://plausible.io/js/script.js" /> */}
      </head>
      <body className="min-h-full">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
