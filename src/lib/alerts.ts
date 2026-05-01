/**
 * Tool change alert helpers.
 *
 * Detects which fields on a tool we consider "interesting" for alert subscribers,
 * and produces human-readable diffs.
 */

import type { Tool } from "./types";

export interface ToolSnapshot {
  privacy_flag: Tool["privacy_flag"];
  pricing_type: Tool["pricing_type"];
  overall_score: number;
  last_reviewed: string;
  listing_tier: Tool["listing_tier"];
  vpat_status: Tool["vpat_status"];
  is_featured: boolean;
}

export interface ToolChange {
  field: keyof ToolSnapshot;
  label: string;
  oldValue: string;
  newValue: string;
}

const FIELD_LABELS: Record<keyof ToolSnapshot, string> = {
  privacy_flag: "Privacy posture",
  pricing_type: "Pricing model",
  overall_score: "Overall score",
  last_reviewed: "Reviewed",
  listing_tier: "Listing tier",
  vpat_status: "VPAT status",
  is_featured: "Featured status",
};

export function snapshotTool(tool: Tool): ToolSnapshot {
  return {
    privacy_flag: tool.privacy_flag,
    pricing_type: tool.pricing_type,
    overall_score: tool.overall_score,
    last_reviewed: tool.last_reviewed,
    listing_tier: tool.listing_tier,
    vpat_status: tool.vpat_status,
    is_featured: tool.is_featured,
  };
}

function fmt(field: keyof ToolSnapshot, value: unknown): string {
  if (field === "overall_score") return `${value}/10`;
  if (field === "is_featured") return value ? "Featured" : "Not featured";
  return String(value);
}

export function diffSnapshots(prev: ToolSnapshot | null, curr: ToolSnapshot): ToolChange[] {
  if (!prev) return []; // first observation is not a "change"
  const changes: ToolChange[] = [];
  for (const key of Object.keys(curr) as (keyof ToolSnapshot)[]) {
    if (prev[key] !== curr[key]) {
      changes.push({
        field: key,
        label: FIELD_LABELS[key],
        oldValue: fmt(key, prev[key]),
        newValue: fmt(key, curr[key]),
      });
    }
  }
  return changes;
}
