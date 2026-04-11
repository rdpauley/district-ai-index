/**
 * District AI Index — Tool Import Script
 *
 * Imports tools from a JSON file into Supabase.
 * - Validates all required fields before insert
 * - Prevents duplicates (upsert on slug)
 * - Creates affiliate_links and compliance_signals
 * - Creates category associations
 *
 * Usage:
 *   npx tsx supabase/seed/import.ts [path-to-json]
 *
 * Default: supabase/seed/tools.json
 *
 * Environment:
 *   NEXT_PUBLIC_SUPABASE_URL — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Service role key (NOT anon key)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Config ────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing environment variables:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL");
  console.error("  SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// ── Types ─────────────────────────────────────────────────
interface ToolInput {
  name: string;
  slug: string;
  vendor: string;
  description: string;
  overview?: string;
  why_it_matters?: string;
  website_url: string;
  affiliate_url?: string;
  logo_url?: string;
  ease_of_use_score: number;
  instructional_value_score: number;
  privacy_score: number;
  accessibility_score: number;
  overall_score: number;
  pricing_type: "Free" | "Freemium" | "Paid";
  pricing_details?: string;
  privacy_level: "High" | "Medium" | "Low";
  accessibility_level: "Strong" | "Moderate" | "Basic";
  grade_levels?: string[];
  audiences?: string[];
  categories: string[];
  best_for?: string[];
  not_ideal_for?: string[];
  key_features?: string[];
  instructional_fit?: string;
  implementation_notes?: string;
  privacy_notes?: string;
  accessibility_notes?: string;
  admin_integration_notes?: string;
  editorial_verdict?: string;
  tags?: string[];
  integrations?: string[];
  similar_tool_slugs?: string[];
  compliance_signals?: { label: string; status: string }[];
  listing_tier?: string;
  featured_flag?: boolean;
  featured_rank?: number | null;
  is_sponsored?: boolean;
  last_reviewed_at?: string;
  status?: string;
}

// ── Validation ────────────────────────────────────────────
const REQUIRED_FIELDS = ["name", "slug", "vendor", "description", "website_url", "ease_of_use_score", "instructional_value_score", "privacy_score", "accessibility_score", "overall_score", "pricing_type", "privacy_level", "accessibility_level", "categories"];

function validate(tool: ToolInput, index: number): string[] {
  const errors: string[] = [];
  for (const field of REQUIRED_FIELDS) {
    const val = (tool as unknown as Record<string, unknown>)[field];
    if (val === undefined || val === null || val === "") {
      errors.push(`Tool #${index + 1} (${tool.name || "unknown"}): missing required field "${field}"`);
    }
  }
  if (tool.overall_score < 0 || tool.overall_score > 10) {
    errors.push(`Tool #${index + 1}: overall_score must be 0-10, got ${tool.overall_score}`);
  }
  for (const field of ["ease_of_use_score", "instructional_value_score", "privacy_score", "accessibility_score"] as const) {
    const val = tool[field];
    if (val < 0 || val > 10) {
      errors.push(`Tool #${index + 1}: ${field} must be 0-10, got ${val}`);
    }
  }
  return errors;
}

// ── Category resolution ───────────────────────────────────
async function ensureCategories(names: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const name of names) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    const { data, error } = await supabase
      .from("categories")
      .upsert({ name, slug }, { onConflict: "slug" })
      .select("id, name")
      .single();
    if (error) {
      console.error(`  Failed to upsert category "${name}":`, error.message);
    } else if (data) {
      map.set(name, data.id);
    }
  }
  return map;
}

// ── Import logic ──────────────────────────────────────────
async function importTools(filePath: string) {
  console.log(`\nDistrict AI Index — Tool Import`);
  console.log(`================================`);
  console.log(`Source: ${filePath}\n`);

  // Read and parse JSON
  const raw = readFileSync(filePath, "utf-8");
  const tools: ToolInput[] = JSON.parse(raw);
  console.log(`Found ${tools.length} tools to import.\n`);

  // Validate all tools first
  const allErrors: string[] = [];
  for (let i = 0; i < tools.length; i++) {
    allErrors.push(...validate(tools[i], i));
  }
  if (allErrors.length > 0) {
    console.error("Validation errors:");
    allErrors.forEach((e) => console.error(`  ✗ ${e}`));
    console.error(`\n${allErrors.length} error(s). Fix and retry.`);
    process.exit(1);
  }
  console.log("✓ All tools passed validation.\n");

  // Collect all unique categories
  const allCategoryNames = [...new Set(tools.flatMap((t) => t.categories))];
  console.log(`Ensuring ${allCategoryNames.length} categories exist...`);
  const categoryMap = await ensureCategories(allCategoryNames);
  console.log(`✓ ${categoryMap.size} categories ready.\n`);

  // Import each tool
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const tool of tools) {
    process.stdout.write(`  Importing "${tool.name}"...`);

    // Upsert tool (slug is unique)
    const { data: toolData, error: toolError } = await supabase
      .from("tools")
      .upsert(
        {
          name: tool.name,
          slug: tool.slug,
          vendor: tool.vendor,
          description: tool.description,
          overview: tool.overview || null,
          why_it_matters: tool.why_it_matters || null,
          website_url: tool.website_url,
          affiliate_url: tool.affiliate_url || null,
          logo_url: tool.logo_url || null,
          ease_of_use_score: tool.ease_of_use_score,
          instructional_value_score: tool.instructional_value_score,
          privacy_score: tool.privacy_score,
          accessibility_score: tool.accessibility_score,
          overall_score: tool.overall_score,
          pricing_type: tool.pricing_type,
          pricing_details: tool.pricing_details || null,
          privacy_level: tool.privacy_level,
          accessibility_level: tool.accessibility_level,
          grade_levels: tool.grade_levels || [],
          audiences: tool.audiences || [],
          best_for: tool.best_for || [],
          not_ideal_for: tool.not_ideal_for || [],
          key_features: tool.key_features || [],
          instructional_fit: tool.instructional_fit || null,
          implementation_notes: tool.implementation_notes || null,
          privacy_notes: tool.privacy_notes || null,
          accessibility_notes: tool.accessibility_notes || null,
          admin_integration_notes: tool.admin_integration_notes || null,
          editorial_verdict: tool.editorial_verdict || null,
          reviewer_notes: null,
          tags: tool.tags || [],
          integrations: tool.integrations || [],
          similar_tool_slugs: tool.similar_tool_slugs || [],
          listing_tier: tool.listing_tier || "basic",
          featured_flag: tool.featured_flag || false,
          featured_rank: tool.featured_rank ?? null,
          is_sponsored: tool.is_sponsored || false,
          status: tool.status || "published",
          last_reviewed_at: tool.last_reviewed_at || null,
          published_at: tool.status === "published" ? new Date().toISOString() : null,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (toolError) {
      console.log(` ✗ ${toolError.message}`);
      failed++;
      continue;
    }

    const toolId = toolData!.id;

    // Upsert category associations
    for (const catName of tool.categories) {
      const catId = categoryMap.get(catName);
      if (catId) {
        const isPrimary = catName === tool.categories[0];
        await supabase
          .from("tool_categories")
          .upsert({ tool_id: toolId, category_id: catId, is_primary: isPrimary }, { onConflict: "tool_id,category_id" });
      }
    }

    // Upsert compliance signals
    if (tool.compliance_signals) {
      for (const signal of tool.compliance_signals) {
        await supabase
          .from("compliance_signals")
          .upsert({ tool_id: toolId, label: signal.label, status: signal.status }, { onConflict: "tool_id,label" });
      }
    }

    // Upsert affiliate link
    if (tool.affiliate_url) {
      await supabase
        .from("affiliate_links")
        .upsert({ tool_id: toolId, url: tool.affiliate_url }, { onConflict: "tool_id" });
    }

    console.log(` ✓`);
    imported++;
  }

  console.log(`\n================================`);
  console.log(`Import complete:`);
  console.log(`  ✓ Imported: ${imported}`);
  if (skipped > 0) console.log(`  ⊘ Skipped:  ${skipped}`);
  if (failed > 0) console.log(`  ✗ Failed:   ${failed}`);
  console.log();
}

// ── Run ───────────────────────────────────────────────────
const inputPath = process.argv[2] || resolve(__dirname, "tools.json");
importTools(resolve(inputPath)).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
