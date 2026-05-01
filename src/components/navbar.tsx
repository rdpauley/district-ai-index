"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/lib/compare-context";
import { useState } from "react";
import {
  Search,
  GitCompareArrows,
  Menu,
  X,
  ChevronDown,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/directory", label: "Directory" },
  { href: "/find", label: "Find a Tool" },
  { href: "/scorecard", label: "Scorecard" },
  { href: "/compare", label: "Compare" },
  { href: "/verified", label: "Verified" },
  { href: "/pricing", label: "Pricing" },
  { href: "/submit", label: "Submit Tool" },
];

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCompare();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue rounded-md"
          aria-label="District AI Index — Home"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-white font-bold text-sm"
            aria-hidden="true"
          >
            AI
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold text-navy">District AI Index</span>
            <span className="block text-[10px] font-medium text-muted-foreground leading-tight">
              K–12 AI Tools Directory
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-navy-50 text-navy"
                    : "text-charcoal-light hover:bg-navy-50 hover:text-navy"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="relative flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-charcoal-light hover:bg-navy-50 hover:text-navy transition-colors"
            aria-label={`Compare tools, ${count} selected`}
          >
            <GitCompareArrows className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Compare</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-accent-blue text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/admin/login"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-charcoal-light hover:bg-navy-50 hover:text-navy transition-colors"
          >
            <User className="h-4 w-4" aria-hidden="true" />
            <span>Admin</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden rounded-lg p-2 text-charcoal-light hover:bg-navy-50 transition-colors"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t border-border bg-white px-4 pb-4 pt-2"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-navy-50 text-navy"
                        : "text-charcoal-light hover:bg-navy-50 hover:text-navy"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-light hover:bg-navy-50 hover:text-navy"
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
