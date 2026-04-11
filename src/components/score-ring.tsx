"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function ScoreRing({ score, max = 100, size = "md", label, className }: ScoreRingProps) {
  const pct = Math.round((score / max) * 100);
  const dims = { sm: 48, md: 64, lg: 88 };
  const strokes = { sm: 4, md: 5, lg: 6 };
  const fonts = { sm: "text-xs", md: "text-sm", lg: "text-xl" };
  const labelFonts = { sm: "text-[8px]", md: "text-[10px]", lg: "text-xs" };

  const d = dims[size];
  const s = strokes[size];
  const r = (d - s) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const color =
    pct >= 85 ? "text-success stroke-success" :
    pct >= 70 ? "text-warning stroke-warning" :
    "text-danger stroke-danger";

  return (
    <div className={cn("relative flex flex-col items-center gap-1", className)} role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={max} aria-label={label ? `${label}: ${score} out of ${max}` : `Score: ${score} out of ${max}`}>
      <svg width={d} height={d} className="transform -rotate-90">
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={s}
          className="text-gray-100"
        />
        <circle
          cx={d / 2}
          cy={d / 2}
          r={r}
          fill="none"
          strokeWidth={s}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-700", color)}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden="true"
      >
        <span className={cn("font-bold", fonts[size], color.split(" ")[0])}>
          {score}
        </span>
      </div>
      {label && (
        <span className={cn("text-muted-foreground font-medium", labelFonts[size])}>
          {label}
        </span>
      )}
    </div>
  );
}

interface ScoreRingInlineProps {
  score: number;
  max?: number;
}

export function ScoreRingInline({ score, max = 10 }: ScoreRingInlineProps) {
  const pct = Math.round((score / max) * 100);
  const color =
    pct >= 84 ? "text-success" : pct >= 75 ? "text-warning" : "text-danger";
  const bg =
    pct >= 84 ? "bg-success-bg" : pct >= 75 ? "bg-warning-bg" : "bg-danger-bg";

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold", bg, color)} role="status" aria-label={`Score: ${score} out of ${max}`}>
      {score}/{max}
    </span>
  );
}
