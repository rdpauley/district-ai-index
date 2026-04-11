"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToolLogoProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: { container: "h-9 w-9", text: "text-xs", px: 36 },
  md: { container: "h-11 w-11", text: "text-sm", px: 44 },
  lg: { container: "h-14 w-14", text: "text-lg", px: 56 },
  xl: { container: "h-16 w-16", text: "text-2xl", px: 64 },
};

// Deterministic color from tool name — same name always gets same color
const COLORS = [
  "bg-[#0B1F3A]", "bg-[#1D3C5C]", "bg-[#3A6EA5]", "bg-[#2E2E2E]",
  "bg-[#1B7340]", "bg-[#8B6914]", "bg-[#7C3AED]", "bg-[#B91C1C]",
  "bg-[#0369A1]", "bg-[#4338CA]", "bg-[#0F766E]", "bg-[#A16207]",
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, "").split(/\s+/);
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function ToolLogo({ name, logoUrl, size = "md", className }: ToolLogoProps) {
  const [imgError, setImgError] = useState(false);
  const s = sizes[size];

  // If we have a valid logo URL and it hasn't errored, show the image
  if (logoUrl && !logoUrl.startsWith("/logos/") && !imgError) {
    return (
      <div className={cn(s.container, "rounded-xl overflow-hidden shrink-0 bg-navy-50", className)}>
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={s.px}
          height={s.px}
          className="h-full w-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Letter avatar fallback
  const color = getColorForName(name);
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        s.container,
        "flex items-center justify-center rounded-xl text-white font-bold shrink-0",
        color,
        s.text,
        className
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
