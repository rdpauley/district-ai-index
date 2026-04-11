/**
 * Data Abstraction Layer
 *
 * Provides a unified API for fetching tool data.
 * - When Supabase is configured: queries the database
 * - When Supabase is NOT configured: falls back to seed data
 *
 * This allows the app to run perfectly with just seed data
 * during development, and switch to Supabase in production
 * by simply setting environment variables.
 */

import { createServerClient } from "./server";
import {
  tools as seedTools,
  getToolBySlug as seedGetToolBySlug,
  getSimilarTools as seedGetSimilarTools,
  getTopToolsThisMonth as seedGetTopToolsThisMonth,
  getBestFreeTools as seedGetBestFreeTools,
  getFeaturedTools as seedGetFeaturedTools,
} from "../seed-data";
import type { Tool, Category, GradeBand, PricingType, PrivacyFlag } from "../types";

// ── Helper: check if Supabase is available ──────────────

function getClient() {
  return createServerClient();
}

function mapSupabaseRowToTool(row: Record<string, unknown>): Tool {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    vendor: row.vendor as string,
    website: row.website_url as string,
    affiliate_url: (row.affiliate_url as string) || "",
    logo_url: (row.logo_url as string) || "",
    description: row.description as string,
    overview: (row.overview as string) || "",
    why_it_matters: (row.why_it_matters as string) || "",
    best_for: (row.best_for as string[]) || [],
    not_ideal_for: (row.not_ideal_for as string[]) || [],
    key_features: (row.key_features as string[]) || [],
    instructional_fit: (row.instructional_fit as string) || "",
    implementation_notes: (row.implementation_notes as string) || "",
    privacy_notes: (row.privacy_notes as string) || "",
    accessibility_notes: (row.accessibility_notes as string) || "",
    admin_integration_notes: (row.admin_integration_notes as string) || "",
    editorial_verdict: (row.editorial_verdict as string) || "",
    categories: (row.categories as Category[]) || [(row.primary_category as Category) || "General AI"],
    grade_bands: (row.grade_levels as GradeBand[]) || [],
    audiences: (row.audiences as Tool["audiences"]) || [],
    pricing_type: row.pricing_type as PricingType,
    pricing_details: (row.pricing_details as string) || "",
    privacy_level: row.privacy_level as Tool["privacy_level"],
    accessibility_level: row.accessibility_level as Tool["accessibility_level"],
    privacy_flag: (row.privacy_flag as PrivacyFlag) || derivePrivacyFlag(row.privacy_level as string),
    scores: {
      ease_of_use: row.ease_of_use_score as number,
      instructional_value: row.instructional_value_score as number,
      data_privacy: row.privacy_score as number,
      accessibility: row.accessibility_score as number,
    },
    overall_score: row.overall_score as number,
    tags: (row.tags as string[]) || [],
    integrations: (row.integrations as string[]) || [],
    compliance_signals: [],
    vpat_status: (row.vpat_status as Tool["vpat_status"]) || "unknown",
    vpat_url: (row.vpat_url as string) || null,
    vpat_notes: (row.vpat_notes as string) || "",
    last_reviewed: (row.last_reviewed_at as string) || "",
    reviewer_notes: (row.reviewer_notes as string) || "",
    listing_tier: (row.listing_tier as Tool["listing_tier"]) || "basic",
    is_featured: (row.featured_flag as boolean) || false,
    featured_rank: (row.featured_rank as number) || null,
    is_sponsored: (row.is_sponsored as boolean) || false,
    status: (row.status as Tool["status"]) || "published",
    similar_tools: (row.similar_tool_slugs as string[]) || [],
  };
}

function derivePrivacyFlag(level: string): PrivacyFlag {
  if (level === "High") return "District Ready";
  if (level === "Medium") return "Teacher Use Only";
  return "Use Caution";
}

// ── Public Query Functions ───────────────────────────────

/**
 * Get all published tools.
 */
export async function getAllTools(): Promise<Tool[]> {
  const client = getClient();
  if (!client) return seedTools;

  const { data, error } = await client
    .from("published_tools")
    .select("*")
    .order("overall_score", { ascending: false });

  if (error || !data) return seedTools;
  return data.map(mapSupabaseRowToTool);
}

/**
 * Get a single tool by slug.
 */
export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  const client = getClient();
  if (!client) return seedGetToolBySlug(slug);

  const { data, error } = await client
    .from("published_tools")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return seedGetToolBySlug(slug);
  return mapSupabaseRowToTool(data);
}

/**
 * Get tools filtered by criteria.
 */
export async function getFilteredTools(filters: {
  search?: string;
  category?: Category;
  gradeBand?: GradeBand;
  pricing?: PricingType;
  privacyFlag?: PrivacyFlag;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}): Promise<Tool[]> {
  const client = getClient();
  if (!client) {
    // Fall back to seed data with in-memory filtering
    let result = [...seedTools];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.vendor.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    if (filters.category) result = result.filter((t) => t.categories.includes(filters.category!));
    if (filters.gradeBand) result = result.filter((t) => t.grade_bands.includes(filters.gradeBand!));
    if (filters.pricing) result = result.filter((t) => t.pricing_type === filters.pricing);
    if (filters.privacyFlag) result = result.filter((t) => t.privacy_flag === filters.privacyFlag);

    const key = filters.sortBy || "overall_score";
    const dir = filters.sortDir === "asc" ? 1 : -1;
    result.sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[key];
      const bv = (b as unknown as Record<string, unknown>)[key];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
      return 0;
    });
    return result;
  }

  let query = client
    .from("published_tools")
    .select("*");

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters.pricing) {
    query = query.eq("pricing_type", filters.pricing);
  }
  if (filters.gradeBand) {
    query = query.contains("grade_levels", [filters.gradeBand]);
  }

  const sortCol = filters.sortBy === "name" ? "name" :
                  filters.sortBy === "last_reviewed" ? "last_reviewed_at" :
                  "overall_score";
  query = query.order(sortCol, { ascending: filters.sortDir === "asc" });

  const { data, error } = await query;
  if (error || !data) return seedTools;
  return data.map(mapSupabaseRowToTool);
}

/**
 * Get featured tools (editorially selected, sorted by rank).
 */
export async function getFeaturedTools(): Promise<Tool[]> {
  const client = getClient();
  if (!client) return seedGetFeaturedTools();

  const { data, error } = await client
    .from("published_tools")
    .select("*")
    .eq("featured_flag", true)
    .order("featured_rank", { ascending: true, nullsFirst: false });

  if (error || !data) return seedGetFeaturedTools();
  return data.map(mapSupabaseRowToTool);
}

/**
 * Get Top Tools This Month from rankings snapshot.
 */
export async function getTopToolsThisMonth(count = 10): Promise<Tool[]> {
  const client = getClient();
  if (!client) return seedGetTopToolsThisMonth(count);

  const { data, error } = await client
    .from("current_top_tools")
    .select("*")
    .limit(count);

  if (error || !data || data.length === 0) return seedGetTopToolsThisMonth(count);
  return data.map(mapSupabaseRowToTool);
}

/**
 * Get Best Free Tools from rankings snapshot.
 */
export async function getBestFreeTools(count = 10): Promise<Tool[]> {
  const client = getClient();
  if (!client) return seedGetBestFreeTools(count);

  const { data, error } = await client
    .from("current_best_free")
    .select("*")
    .limit(count);

  if (error || !data || data.length === 0) return seedGetBestFreeTools(count);
  return data.map(mapSupabaseRowToTool);
}

/**
 * Get similar tools for a given tool.
 */
export async function getSimilarTools(tool: Tool): Promise<Tool[]> {
  const client = getClient();
  if (!client) return seedGetSimilarTools(tool);

  if (tool.similar_tools.length === 0) return [];

  const { data, error } = await client
    .from("published_tools")
    .select("*")
    .in("slug", tool.similar_tools);

  if (error || !data) return seedGetSimilarTools(tool);
  return data.map(mapSupabaseRowToTool);
}

/**
 * Get tools by privacy flag for the Verified page.
 */
export async function getVerifiedTools(): Promise<Tool[]> {
  const client = getClient();
  if (!client) {
    return seedTools.filter((t) => t.is_featured || t.privacy_flag === "District Ready");
  }

  const { data, error } = await client
    .from("published_tools")
    .select("*")
    .or("featured_flag.eq.true,privacy_level.eq.High")
    .order("overall_score", { ascending: false });

  if (error || !data) {
    return seedTools.filter((t) => t.is_featured || t.privacy_flag === "District Ready");
  }
  return data.map(mapSupabaseRowToTool);
}

/**
 * Subscribe an email to the newsletter.
 */
export async function subscribeNewsletter(email: string, source = "website"): Promise<boolean> {
  const client = getClient();
  if (!client) return true; // pretend success in dev

  const { error } = await client
    .from("newsletter_subscribers")
    .upsert({ email, source }, { onConflict: "email" });

  return !error;
}

/**
 * Submit a tool for review.
 */
export async function submitTool(submission: {
  tool_name: string;
  website_url: string;
  contact_name: string;
  contact_email: string;
  category?: string;
  use_cases?: string;
  pricing_type?: string;
  privacy_docs?: boolean;
  accessibility_docs?: boolean;
  requested_tier?: string;
}): Promise<boolean> {
  const client = getClient();
  if (!client) return true; // pretend success in dev

  const { error } = await client
    .from("submissions")
    .insert(submission);

  return !error;
}
