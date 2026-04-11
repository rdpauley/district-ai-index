import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function KpiCard({ title, value, subtitle, icon: Icon, trend, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-white p-6 transition-all duration-200 hover:shadow-md hover:border-navy-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-navy">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p
              className={cn(
                "mt-2 text-xs font-semibold",
                trend.positive ? "text-success" : "text-danger"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-navy-50 p-2.5 transition-colors group-hover:bg-navy-100">
          <Icon className="h-5 w-5 text-accent-blue" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
