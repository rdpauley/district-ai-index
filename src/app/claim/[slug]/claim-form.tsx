"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  toolSlug: string;
  toolName: string;
  websiteHostname: string;
  defaultVendor: string;
}

export function ClaimForm({ toolSlug, toolName, websiteHostname, defaultVendor }: Props) {
  const [vendorName, setVendorName] = useState(defaultVendor);
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/vendor/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_slug: toolSlug,
          vendor_name: vendorName.trim(),
          contact_email: contactEmail.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResult({ ok: true, message: data.message || "Verification email sent. Check your inbox." });
        setContactEmail("");
      } else {
        setResult({ ok: false, message: data.error || "Could not submit claim." });
      }
    } catch {
      setResult({ ok: false, message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 space-y-4">
      <div>
        <label htmlFor="claim-tool" className="block text-sm font-bold text-navy mb-1">
          Listing
        </label>
        <input
          id="claim-tool"
          type="text"
          value={toolName}
          readOnly
          aria-readonly="true"
          className="w-full rounded-lg border border-border bg-navy-50 px-3 py-2 text-sm text-charcoal cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="claim-vendor" className="block text-sm font-bold text-navy mb-1">
          Vendor / company name
        </label>
        <input
          id="claim-vendor"
          type="text"
          required
          value={vendorName}
          onChange={(e) => setVendorName(e.target.value)}
          maxLength={200}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
        />
      </div>

      <div>
        <label htmlFor="claim-email" className="block text-sm font-bold text-navy mb-1">
          Contact email
        </label>
        <input
          id="claim-email"
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder={`you@${websiteHostname}`}
          maxLength={254}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
          aria-describedby="claim-email-help"
        />
        <p id="claim-email-help" className="mt-1 text-xs text-charcoal-light">
          Must be at <strong className="text-charcoal">@{websiteHostname}</strong> (or a subdomain) to verify ownership.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || !vendorName.trim() || !contactEmail.trim()}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy px-4 py-3 text-sm font-bold text-white hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending verification…" : "Send verification email"}
      </button>

      {result && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "rounded-xl border p-4 text-sm",
            result.ok ? "border-success/30 bg-success-bg text-success" : "border-danger/30 bg-danger-bg text-danger"
          )}
        >
          <div className="flex items-start gap-2">
            {result.ok ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span>{result.message}</span>
          </div>
        </div>
      )}
    </form>
  );
}
