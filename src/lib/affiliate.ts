/**
 * District AI Index — Affiliate Link Utilities
 *
 * Handles:
 * - Building tracked affiliate URLs with UTM parameters
 * - Generating the redirect URL that goes through /api/track-click
 * - Client-side click tracking helper
 */

const DEFAULT_UTM_SOURCE = "districtai";
const DEFAULT_UTM_MEDIUM = "directory";

/**
 * Build a tracked redirect URL that goes through our click tracker.
 * The actual redirect happens server-side after logging the click.
 *
 * Example: /api/track-click?tool=magicschool-ai
 * The API route looks up the affiliate_url and redirects.
 */
export function getTrackedUrl(toolSlug: string): string {
  return `/api/track-click?tool=${encodeURIComponent(toolSlug)}`;
}

/**
 * Append UTM parameters to an affiliate URL.
 */
export function appendUtmParams(
  baseUrl: string,
  params?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  }
): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", params?.source || DEFAULT_UTM_SOURCE);
    url.searchParams.set("utm_medium", params?.medium || DEFAULT_UTM_MEDIUM);
    if (params?.campaign) url.searchParams.set("utm_campaign", params.campaign);
    if (params?.content) url.searchParams.set("utm_content", params.content);
    return url.toString();
  } catch {
    // If URL is invalid, return as-is
    return baseUrl;
  }
}

/**
 * Determine if a tool has a monetizable affiliate link.
 */
export function hasAffiliateLink(affiliateUrl: string | null | undefined): boolean {
  return !!affiliateUrl && affiliateUrl.trim() !== "";
}

/**
 * Get the CTA label based on whether the tool has an affiliate link.
 * Affiliate tools get "Visit Tool" (tracked), others get "Visit Website".
 */
export function getCtaLabel(hasAffiliate: boolean): string {
  return hasAffiliate ? "Visit Tool" : "Visit Website";
}
