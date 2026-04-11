export type Category =
  | "Lesson Planning"
  | "Admin Tasks"
  | "Tutoring"
  | "Student Support"
  | "Feedback & Grading"
  | "Differentiation"
  | "Engagement"
  | "Content Creation"
  | "General AI"
  | "Assessment"
  | "Study Tools"
  | "Writing Support"
  | "Accessibility & Notes"
  | "ELA & Language"
  | "Video Learning"
  | "Productivity"
  | "Student Interaction";

export type GradeBand = "K-2" | "3-5" | "6-8" | "9-12";

export type Audience =
  | "Teachers"
  | "Students"
  | "Administrators"
  | "Instructional Coaches"
  | "Curriculum Leaders";

export type PricingType = "Free" | "Freemium" | "Paid";

export type PrivacyLevel = "High" | "Medium" | "Low";

export type AccessibilityLevel = "Strong" | "Moderate" | "Basic";

export type PrivacyFlag = "District Ready" | "Teacher Use Only" | "Use Caution";

export type ListingTier = "basic" | "featured" | "verified";

export type SubmissionStatus = "pending" | "in_review" | "approved" | "rejected" | "published";

export interface ToolScores {
  ease_of_use: number;           // out of 10
  instructional_value: number;   // out of 10
  data_privacy: number;          // out of 10
  accessibility: number;         // out of 10
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  website: string;
  affiliate_url: string;
  logo_url: string;
  description: string;
  overview: string;
  why_it_matters: string;
  best_for: string[];
  not_ideal_for: string[];
  key_features: string[];
  instructional_fit: string;
  implementation_notes: string;
  privacy_notes: string;
  accessibility_notes: string;
  admin_integration_notes: string;
  editorial_verdict: string;
  categories: Category[];
  grade_bands: GradeBand[];
  audiences: Audience[];
  pricing_type: PricingType;
  pricing_details: string;
  privacy_level: PrivacyLevel;
  accessibility_level: AccessibilityLevel;
  privacy_flag: PrivacyFlag;
  scores: ToolScores;
  overall_score: number;         // weighted average out of 10
  tags: string[];
  integrations: string[];
  compliance_signals: ComplianceSignal[];
  vpat_status: "available" | "on_request" | "not_available" | "unknown";
  vpat_url: string | null;
  vpat_notes: string;
  last_reviewed: string;
  reviewer_notes: string;
  listing_tier: ListingTier;
  is_featured: boolean;
  featured_rank: number | null;
  is_sponsored: boolean;
  status: SubmissionStatus;
  similar_tools: string[];
}

export interface ComplianceSignal {
  label: string;
  status: "available" | "partial" | "unavailable" | "unknown";
  url: string | null;
}

export interface Submission {
  id: string;
  tool_name: string;
  website: string;
  contact_name: string;
  contact_email: string;
  category: Category;
  use_cases: string;
  pricing: PricingType;
  privacy_docs: boolean;
  accessibility_docs: boolean;
  requested_tier: ListingTier;
  submitted_at: string;
  status: SubmissionStatus;
}

export interface SavedView {
  id: string;
  label: string;
  filters: Record<string, string | number | boolean>;
}

export interface DirectoryFilters {
  search: string;
  category: Category | "";
  grade_band: GradeBand | "";
  audience: Audience | "";
  pricing: PricingType | "";
  privacy_flag: PrivacyFlag | "";
  min_score: number;
}
