/**
 * Vendor claim helpers — domain extraction for email-based ownership proof.
 */

export function extractDomain(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function emailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at <= 0 || at === email.length - 1) return null;
  return email.slice(at + 1).toLowerCase();
}

/**
 * Returns true if the email's domain matches the tool's website domain
 * (or a subdomain of it). E.g., "support@magicschool.ai" matches
 * "https://magicschool.ai" or "https://app.magicschool.ai".
 */
export function emailMatchesToolDomain(email: string, toolWebsite: string): boolean {
  const ed = emailDomain(email);
  const td = extractDomain(toolWebsite);
  if (!ed || !td) return false;
  if (ed === td) return true;
  return ed.endsWith("." + td);
}

export type VendorEventType =
  | "tool_view"
  | "compare_add"
  | "rfp_generate"
  | "affiliate_click"
  | "scorecard_view";
