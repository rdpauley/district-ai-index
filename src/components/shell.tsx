"use client";

import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CompareTray } from "./compare-tray";
import { CompareProvider } from "@/lib/compare-context";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <CompareProvider>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Skip to main content — accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Navbar />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
        <CompareTray />
      </div>
    </CompareProvider>
  );
}
