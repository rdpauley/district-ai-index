import { cn } from "@/lib/utils";
import type { PrivacyFlag, PricingType, ListingTier } from "@/lib/types";
import { ShieldCheck, Shield, AlertTriangle, Sparkles, Crown, Star } from "lucide-react";

interface PrivacyBadgeProps {
  flag: PrivacyFlag;
  className?: string;
}

export function PrivacyBadge({ flag, className }: PrivacyBadgeProps) {
  const config = {
    "District Ready": {
      icon: ShieldCheck,
      bg: "bg-success-bg border-success/20",
      text: "text-success",
    },
    "Teacher Use Only": {
      icon: Shield,
      bg: "bg-warning-bg border-warning/20",
      text: "text-warning",
    },
    "Use Caution": {
      icon: AlertTriangle,
      bg: "bg-danger-bg border-danger/20",
      text: "text-danger",
    },
  }[flag];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.bg,
        config.text,
        className
      )}
      role="status"
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {flag}
    </span>
  );
}

interface PricingBadgeProps {
  model: PricingType;
  className?: string;
}

export function PricingBadge({ model, className }: PricingBadgeProps) {
  const colors: Record<PricingType, string> = {
    Free: "bg-success-bg border-success/20 text-success",
    Freemium: "bg-[#EEF2F7] border-accent-blue/20 text-accent-blue",
    Paid: "bg-warning-bg border-warning/20 text-warning",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
        colors[model],
        className
      )}
    >
      {model}
    </span>
  );
}

interface TierBadgeProps {
  tier: ListingTier;
  className?: string;
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  const config = {
    basic: { icon: Star, label: "Basic", style: "bg-muted border-border text-muted-foreground" },
    featured: { icon: Sparkles, label: "Featured", style: "bg-[#EEF2F7] border-accent-blue/20 text-accent-blue" },
    verified: { icon: Crown, label: "Verified", style: "bg-success-bg border-success/20 text-success" },
  }[tier];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.style,
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {config.label}
    </span>
  );
}

interface ComplianceDotProps {
  status: "available" | "partial" | "unavailable" | "unknown";
  label?: string;
}

export function ComplianceDot({ status, label }: ComplianceDotProps) {
  const colors = {
    available: "bg-success",
    partial: "bg-accent-gold",
    unavailable: "bg-danger",
    unknown: "bg-gray-300",
  };
  const labels = {
    available: "Available",
    partial: "Partial",
    unavailable: "Unavailable",
    unknown: "Unknown",
  };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("inline-block h-2 w-2 rounded-full", colors[status])}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{labels[status]}</span>}
    </span>
  );
}
