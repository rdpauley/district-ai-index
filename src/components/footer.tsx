import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const footerLinks = {
  Directory: [
    { href: "/directory", label: "Browse All Tools" },
    { href: "/verified", label: "Verified Tools" },
    { href: "/compare", label: "Compare Tools" },
    { href: "/submit", label: "Submit a Tool" },
  ],
  Resources: [
    { href: "/reports", label: "Reports" },
    { href: "/pricing", label: "Listing Plans" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/editorial-policy", label: "Our Methodology" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  Compliance: [
    { href: "/accessibility-statement", label: "Accessibility Statement" },
    { href: "/data-practices", label: "Data Practices" },
    { href: "/editorial-policy", label: "Editorial Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-50/50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:gap-12">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-navy">
                {heading}
              </h3>
              <ul className="mt-3 space-y-2" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-navy transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Accessibility statement banner */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent-blue" aria-hidden="true" />
              <p className="text-xs text-muted-foreground">
                <strong className="font-semibold text-charcoal">Accessibility Commitment:</strong>{" "}
                District AI Index is designed to meet WCAG 2.1 Level AA standards. We are committed
                to providing an inclusive experience for all educators. If you encounter any
                accessibility barriers,{" "}
                <Link href="/contact" className="text-accent-blue underline hover:text-navy">
                  please contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded bg-navy text-white text-[9px] font-bold"
              aria-hidden="true"
            >
              AI
            </div>
            <span className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} District AI Index. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-navy transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-navy transition-colors">
              Terms
            </Link>
            <Link href="/accessibility-statement" className="text-xs text-muted-foreground hover:text-navy transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
