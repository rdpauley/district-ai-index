"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Status = "loading" | "ok" | "error";

export function ConfirmClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing confirmation token.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/alerts/confirm?token=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) {
          setStatus("ok");
          setMessage(data.email ? `Subscription confirmed for ${data.email}.` : "Subscription confirmed.");
        } else {
          setStatus("error");
          setMessage(data.error || "Could not confirm — the link may have expired.");
        }
      } catch {
        if (cancelled) return;
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-12">
      <div className="rounded-xl border border-border bg-white p-8 max-w-md shadow-sm w-full">
        {status === "loading" && (
          <>
            <Loader2 className="h-10 w-10 text-navy-300 mx-auto mb-4 animate-spin" aria-hidden="true" />
            <h1 className="text-xl font-bold text-navy mb-2">Confirming your subscription…</h1>
            <p className="text-sm text-charcoal-light">This will only take a moment.</p>
          </>
        )}
        {status === "ok" && (
          <>
            <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-xl font-bold text-navy mb-2">You're subscribed</h1>
            <p className="text-sm text-charcoal mb-6">{message}</p>
            <p className="text-xs text-charcoal-light mb-4">
              We'll email you when any of your watched tools change. Every alert includes a one-click unsubscribe.
            </p>
            <Link
              href="/directory"
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
            >
              Browse the directory
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="h-10 w-10 text-danger mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-xl font-bold text-navy mb-2">Confirmation failed</h1>
            <p className="text-sm text-charcoal mb-6">{message}</p>
            <Link
              href="/alerts"
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
            >
              Re-subscribe
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
