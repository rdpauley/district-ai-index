/**
 * State-specific student data privacy compliance overlays.
 *
 * Each state has a small set of requirements derived from its statute(s).
 * We map those to signal patterns we can detect from a tool's
 * `compliance_signals` (label substring match). Status:
 *   - "pass"     — all required signals present and available
 *   - "partial"  — some required signals present
 *   - "missing"  — required signals not present in tool's documentation
 *
 * IMPORTANT: This is informational. Districts must independently verify
 * compliance with their state's requirements before procurement — the data
 * here reflects publicly available vendor documentation only.
 */

import type { Tool, ComplianceSignal } from "./types";

export interface StateRequirement {
  /** Display name of the requirement, e.g. "Signed Data Privacy Agreement" */
  label: string;
  /** Substrings to look for in the tool's compliance_signals labels (case-insensitive). Any match counts. */
  signalPatterns: string[];
  /** Plain-English description shown in tooltips / per-state guides */
  description: string;
}

export interface StateProfile {
  slug: string;          // URL slug, e.g. "new-york"
  name: string;          // Display name, e.g. "New York"
  abbreviation: string;  // "NY"
  statute: string;       // Citation, e.g. "Education Law §2-d"
  summary: string;       // 1-2 sentence description for the state guide
  requirements: StateRequirement[];
}

export const STATE_PROFILES: StateProfile[] = [
  {
    slug: "new-york",
    name: "New York",
    abbreviation: "NY",
    statute: "Education Law §2-d & Part 121",
    summary:
      "New York requires a signed Data Privacy Agreement, a Parents' Bill of Rights, and that vendors maintain reasonable administrative, technical, and physical safeguards for student PII.",
    requirements: [
      {
        label: "Signed Data Privacy Agreement",
        signalPatterns: ["DPA"],
        description: "Vendor publishes or signs a binding district DPA before student data is collected.",
      },
      {
        label: "FERPA-aligned data handling",
        signalPatterns: ["FERPA"],
        description: "Vendor self-certifies FERPA compliance and discloses subprocessor relationships.",
      },
      {
        label: "Independent security attestation",
        signalPatterns: ["SOC 2", "SOC2", "ISO 27001"],
        description: "Independent third-party security audit (SOC 2 Type II or ISO 27001) covering relevant controls.",
      },
    ],
  },
  {
    slug: "california",
    name: "California",
    abbreviation: "CA",
    statute: "SOPIPA, AB 1584 & CCPA/CPRA",
    summary:
      "California's Student Online Personal Information Protection Act prohibits targeted advertising and selling student data; AB 1584 governs district-vendor contracts; CCPA/CPRA adds consumer-data rights for parents.",
    requirements: [
      {
        label: "FERPA-aligned data handling",
        signalPatterns: ["FERPA"],
        description: "Vendor self-certifies FERPA compliance, a baseline for SOPIPA pupil-record protections.",
      },
      {
        label: "COPPA compliance (under-13 users)",
        signalPatterns: ["COPPA"],
        description: "If the tool serves students under 13, COPPA-compliant operating procedures are required.",
      },
      {
        label: "Signed Data Privacy Agreement",
        signalPatterns: ["DPA"],
        description: "AB 1584 requires written contracts that meet specific data-protection clauses.",
      },
    ],
  },
  {
    slug: "texas",
    name: "Texas",
    abbreviation: "TX",
    statute: "SB 820 / Texas Education Code §32",
    summary:
      "Texas requires school districts to ensure vendors handling student data have a signed Data Sharing Agreement and adequate cybersecurity safeguards. The Texas Student Privacy Alliance maintains a model DPA used statewide.",
    requirements: [
      {
        label: "Signed Data Privacy Agreement",
        signalPatterns: ["DPA"],
        description: "Texas Student Privacy Alliance model DPA or equivalent must be executed.",
      },
      {
        label: "FERPA-aligned data handling",
        signalPatterns: ["FERPA"],
        description: "FERPA compliance is the baseline expectation for any vendor handling Texas student records.",
      },
      {
        label: "Independent security attestation",
        signalPatterns: ["SOC 2", "SOC2", "ISO 27001"],
        description: "SB 820 requires districts to verify cybersecurity practices; independent attestation simplifies vendor review.",
      },
    ],
  },
  {
    slug: "illinois",
    name: "Illinois",
    abbreviation: "IL",
    statute: "Student Online Personal Protection Act (SOPPA)",
    summary:
      "Illinois SOPPA requires school districts to have written agreements with vendors that handle student data, publish those agreements, and notify parents of any breach within 30 days.",
    requirements: [
      {
        label: "Signed Data Privacy Agreement",
        signalPatterns: ["DPA"],
        description: "SOPPA mandates a written contract published on the district's website.",
      },
      {
        label: "FERPA-aligned data handling",
        signalPatterns: ["FERPA"],
        description: "Baseline for SOPPA's protection-of-covered-information requirements.",
      },
      {
        label: "COPPA compliance (under-13 users)",
        signalPatterns: ["COPPA"],
        description: "Required if the product is directed at or knowingly used by students under 13.",
      },
    ],
  },
  {
    slug: "connecticut",
    name: "Connecticut",
    abbreviation: "CT",
    statute: "Public Act 16-189 (as amended)",
    summary:
      "Connecticut requires a written contract for any 'website operator' processing student records, with specific clauses covering data ownership, breach notification, and parent access rights.",
    requirements: [
      {
        label: "Signed Data Privacy Agreement",
        signalPatterns: ["DPA"],
        description: "Required contractual document defining data ownership, breach response, and access rights.",
      },
      {
        label: "FERPA-aligned data handling",
        signalPatterns: ["FERPA"],
        description: "Foundational alignment with federal student-records protections.",
      },
    ],
  },
  {
    slug: "colorado",
    name: "Colorado",
    abbreviation: "CO",
    statute: "Student Data Transparency & Security Act (SDTSA)",
    summary:
      "Colorado's SDTSA requires public posting of all on-school-service contracts and a transparent inventory of student personally identifiable information collected by each vendor.",
    requirements: [
      {
        label: "Signed Data Privacy Agreement",
        signalPatterns: ["DPA"],
        description: "Contract required and published; SDTSA directs districts to maintain a public list.",
      },
      {
        label: "FERPA-aligned data handling",
        signalPatterns: ["FERPA"],
        description: "Baseline federal compliance expected of all on-school-service providers.",
      },
      {
        label: "Independent security attestation",
        signalPatterns: ["SOC 2", "SOC2", "ISO 27001"],
        description: "Reasonable security safeguards are required; third-party attestation provides verification.",
      },
    ],
  },
  {
    slug: "virginia",
    name: "Virginia",
    abbreviation: "VA",
    statute: "Va. Code § 22.1-289.01",
    summary:
      "Virginia requires school divisions to ensure educational technology vendors handling student PII follow specified data-protection practices and maintain breach-notification procedures.",
    requirements: [
      {
        label: "Signed Data Privacy Agreement",
        signalPatterns: ["DPA"],
        description: "Written contract required defining permitted uses, retention, and incident response.",
      },
      {
        label: "FERPA-aligned data handling",
        signalPatterns: ["FERPA"],
        description: "Foundational baseline for compliant handling of Virginia student records.",
      },
    ],
  },
];

export type RequirementStatus = "pass" | "partial" | "missing";
export type ToolStateStatus = "pass" | "partial" | "missing";

export interface RequirementResult {
  requirement: StateRequirement;
  status: RequirementStatus;
  matchedSignal: string | null;
}

export interface ToolStateAssessment {
  tool: Tool;
  state: StateProfile;
  status: ToolStateStatus;
  requirementResults: RequirementResult[];
  passCount: number;
  totalCount: number;
}

function findMatchingSignal(signals: ComplianceSignal[], patterns: string[]): ComplianceSignal | null {
  const norm = patterns.map((p) => p.toLowerCase());
  for (const sig of signals) {
    const label = sig.label.toLowerCase();
    if (norm.some((p) => label.includes(p))) return sig;
  }
  return null;
}

function classifyRequirement(signals: ComplianceSignal[], req: StateRequirement): RequirementResult {
  const match = findMatchingSignal(signals, req.signalPatterns);
  if (!match) return { requirement: req, status: "missing", matchedSignal: null };
  if (match.status === "available") return { requirement: req, status: "pass", matchedSignal: match.label };
  if (match.status === "partial") return { requirement: req, status: "partial", matchedSignal: match.label };
  // "unavailable" or "unknown" — treat as missing for assessment purposes
  return { requirement: req, status: "missing", matchedSignal: match.label };
}

export function assessToolForState(tool: Tool, state: StateProfile): ToolStateAssessment {
  const results = state.requirements.map((req) => classifyRequirement(tool.compliance_signals, req));
  const passCount = results.filter((r) => r.status === "pass").length;
  const partialCount = results.filter((r) => r.status === "partial").length;
  const totalCount = results.length;

  let status: ToolStateStatus;
  if (passCount === totalCount) status = "pass";
  else if (passCount + partialCount === 0) status = "missing";
  else status = "partial";

  return {
    tool,
    state,
    status,
    requirementResults: results,
    passCount,
    totalCount,
  };
}

export function getStateBySlug(slug: string): StateProfile | undefined {
  return STATE_PROFILES.find((s) => s.slug === slug);
}
