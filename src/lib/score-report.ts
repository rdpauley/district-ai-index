/**
 * Score Report Engine
 *
 * Generates detailed, vendor-facing score breakdowns with
 * specific recommendations for improvement per dimension.
 */

import type { Tool } from "./types";

export interface DimensionReport {
  dimension: string;
  score: number;
  max: number;
  weight: string;
  rating: "Excellent" | "Strong" | "Adequate" | "Needs Improvement" | "Critical Gap";
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export interface ComplianceGap {
  signal: string;
  current_status: string;
  impact: string;
  recommendation: string;
}

export interface ToolReport {
  tool: Tool;
  generated_at: string;
  overall_rating: string;
  dimension_reports: DimensionReport[];
  compliance_gaps: ComplianceGap[];
  vpat_assessment: { status: string; impact: string; recommendation: string };
  priority_actions: string[];
  scoring_methodology: string;
}

function ratingFromScore(score: number): DimensionReport["rating"] {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Strong";
  if (score >= 7) return "Adequate";
  if (score >= 5) return "Needs Improvement";
  return "Critical Gap";
}

function overallRating(score: number): string {
  if (score >= 8.5) return "Highly Recommended";
  if (score >= 8.0) return "Recommended";
  if (score >= 7.0) return "Recommended with Caveats";
  if (score >= 6.0) return "Conditional — Improvements Needed";
  return "Not Recommended for District Use";
}

function getEaseStrengths(tool: Tool): string[] {
  const s: string[] = [];
  if (tool.scores.ease_of_use >= 9) s.push("Exceptionally intuitive interface — minimal training required");
  else if (tool.scores.ease_of_use >= 8) s.push("Clean, well-designed interface that teachers can adopt quickly");
  if (tool.integrations.length >= 3) s.push(`Strong integration ecosystem (${tool.integrations.slice(0, 3).join(", ")})`);
  if (tool.integrations.some(i => i.toLowerCase().includes("google") || i.toLowerCase().includes("clever"))) s.push("Supports common K–12 SSO/rostering (Google or Clever)");
  if (tool.pricing_type === "Free") s.push("No cost barrier to adoption — free for all users");
  if (tool.pricing_type === "Freemium") s.push("Free tier available for individual teacher evaluation");
  return s.length > 0 ? s : ["Basic usability meets minimum standards"];
}

function getEaseGaps(tool: Tool): string[] {
  const g: string[] = [];
  if (tool.scores.ease_of_use < 8) g.push("Interface complexity may require dedicated training for teachers");
  if (tool.integrations.length === 0) g.push("No LMS or rostering integrations listed");
  if (tool.integrations.length > 0 && !tool.integrations.some(i => i.toLowerCase().includes("google") || i.toLowerCase().includes("clever") || i.toLowerCase().includes("classlink"))) g.push("Missing common K–12 SSO integrations (Google Classroom, Clever, ClassLink)");
  if (tool.pricing_type === "Paid") g.push("No free tier for teacher evaluation — creates adoption friction");
  return g;
}

function getEaseRecs(tool: Tool): string[] {
  const r: string[] = [];
  if (tool.integrations.length === 0) r.push("Add LMS integrations (Google Classroom, Canvas, Schoology) to reduce deployment friction");
  if (!tool.integrations.some(i => i.toLowerCase().includes("clever") || i.toLowerCase().includes("classlink"))) r.push("Support Clever and/or ClassLink for district rostering");
  if (tool.scores.ease_of_use < 8) r.push("Invest in UX simplification — first productive use should be under 5 minutes");
  if (tool.pricing_type === "Paid") r.push("Consider a free tier or trial period so teachers can evaluate before district purchase");
  return r;
}

function getInstructionalStrengths(tool: Tool): string[] {
  const s: string[] = [];
  if (tool.scores.instructional_value >= 9) s.push("Exceptional instructional value — directly improves teaching/learning outcomes");
  else if (tool.scores.instructional_value >= 8) s.push("Strong instructional alignment with clear classroom applications");
  if (tool.best_for.length >= 3) s.push(`Versatile use cases: ${tool.best_for.slice(0, 3).join(", ")}`);
  if (tool.key_features.length >= 4) s.push(`Rich feature set with ${tool.key_features.length} documented capabilities`);
  if (tool.instructional_fit) s.push("Clear instructional fit documentation provided");
  return s.length > 0 ? s : ["Provides basic educational value"];
}

function getInstructionalGaps(tool: Tool): string[] {
  const g: string[] = [];
  if (tool.scores.instructional_value < 8) g.push("Instructional impact not fully demonstrated or limited in scope");
  if (tool.not_ideal_for.length >= 3) g.push(`Significant limitations: ${tool.not_ideal_for.slice(0, 2).join(", ")}`);
  if (!tool.instructional_fit || tool.instructional_fit.length < 50) g.push("Insufficient documentation of instructional alignment and pedagogy");
  if (tool.grade_bands.length === 1) g.push(`Limited grade band coverage (${tool.grade_bands[0]} only)`);
  return g;
}

function getInstructionalRecs(tool: Tool): string[] {
  const r: string[] = [];
  if (tool.scores.instructional_value < 8) r.push("Provide case studies or research demonstrating measurable learning outcomes");
  if (!tool.instructional_fit || tool.instructional_fit.length < 100) r.push("Publish detailed alignment documentation to pedagogy, standards, and instructional frameworks (UDL, Bloom's)");
  if (tool.grade_bands.length <= 2) r.push("Expand grade-level coverage or provide grade-specific implementation guides");
  r.push("Consider pursuing alignment documentation with Common Core, NGSS, or state-specific standards");
  return r;
}

function getPrivacyStrengths(tool: Tool): string[] {
  const s: string[] = [];
  if (tool.privacy_level === "High") s.push("High privacy posture — meets district-level requirements");
  const available = tool.compliance_signals.filter(c => c.status === "available");
  if (available.length >= 3) s.push(`${available.length} compliance certifications verified: ${available.map(c => c.label).join(", ")}`);
  available.forEach(c => { if (c.url) s.push(`${c.label} documentation publicly accessible`); });
  if (tool.privacy_notes && tool.privacy_notes.toLowerCase().includes("not used for training")) s.push("Student data confirmed not used for AI model training");
  return s.length > 0 ? s : ["Basic privacy practices in place"];
}

function getPrivacyGaps(tool: Tool): string[] {
  const g: string[] = [];
  const missing = tool.compliance_signals.filter(c => c.status !== "available");
  const absent = ["FERPA Compliant", "COPPA Compliant", "DPA Available", "SOC 2 Type II"];
  const labels = tool.compliance_signals.map(c => c.label);
  absent.forEach(label => {
    const signal = tool.compliance_signals.find(c => c.label === label);
    if (!signal) g.push(`${label}: Not documented — critical gap for district adoption`);
    else if (signal.status === "unavailable") g.push(`${label}: Confirmed unavailable — blocks district deployment`);
    else if (signal.status === "partial") g.push(`${label}: Partially documented — needs completion`);
    else if (signal.status === "unknown") g.push(`${label}: Status unknown — requires vendor clarification`);
  });
  if (tool.privacy_level !== "High") g.push("Overall privacy level assessed as '" + tool.privacy_level + "' — not yet District Ready");
  return g;
}

function getPrivacyRecs(tool: Tool): string[] {
  const r: string[] = [];
  const labels = tool.compliance_signals.map(c => c.label);
  if (!labels.includes("FERPA Compliant") || tool.compliance_signals.find(c => c.label === "FERPA Compliant")?.status !== "available") r.push("Obtain and publish FERPA compliance documentation — this is a gate requirement for most US school districts");
  if (!labels.includes("COPPA Compliant") || tool.compliance_signals.find(c => c.label === "COPPA Compliant")?.status !== "available") r.push("Verify and document COPPA compliance if the tool is used by or collects data from students under 13");
  if (!labels.includes("DPA Available") || tool.compliance_signals.find(c => c.label === "DPA Available")?.status !== "available") r.push("Prepare a standard Data Processing Agreement (DPA) template that districts can sign — many states require this");
  if (!labels.includes("SOC 2 Type II") || tool.compliance_signals.find(c => c.label === "SOC 2 Type II")?.status !== "available") r.push("Pursue SOC 2 Type II certification to demonstrate security controls to enterprise buyers");
  if (tool.privacy_notes && !tool.privacy_notes.toLowerCase().includes("not used for training")) r.push("Explicitly document whether user/student data is used for AI model training — districts will ask");
  return r;
}

function getAccessibilityStrengths(tool: Tool): string[] {
  const s: string[] = [];
  if (tool.accessibility_level === "Strong") s.push("Strong accessibility posture across the platform");
  if (tool.vpat_status === "available") s.push(`VPAT/ACR document publicly available for download`);
  if (tool.accessibility_notes && tool.accessibility_notes.toLowerCase().includes("wcag")) s.push("WCAG compliance referenced in documentation");
  if (tool.accessibility_notes && tool.accessibility_notes.toLowerCase().includes("keyboard")) s.push("Keyboard navigation supported");
  if (tool.accessibility_notes && tool.accessibility_notes.toLowerCase().includes("screen reader")) s.push("Screen reader compatibility noted");
  return s.length > 0 ? s : ["Basic web accessibility practices in place"];
}

function getAccessibilityGaps(tool: Tool): string[] {
  const g: string[] = [];
  if (tool.vpat_status === "not_available") g.push("No VPAT/ACR document published — districts with Section 508 requirements will flag this");
  if (tool.vpat_status === "on_request") g.push("VPAT/ACR only available on request — should be publicly accessible");
  if (tool.accessibility_level !== "Strong") g.push(`Accessibility assessed as '${tool.accessibility_level}' — gaps likely exist in WCAG conformance`);
  if (!tool.accessibility_notes || tool.accessibility_notes.length < 50) g.push("Insufficient accessibility documentation provided");
  return g;
}

function getAccessibilityRecs(tool: Tool): string[] {
  const r: string[] = [];
  if (tool.vpat_status !== "available") r.push("Commission a VPAT 2.5 / Accessibility Conformance Report (ACR) and publish it on your website — this is increasingly a procurement requirement");
  if (tool.accessibility_level !== "Strong") r.push("Conduct a WCAG 2.1 Level AA audit and address identified gaps");
  r.push("Ensure full keyboard navigation throughout the application");
  r.push("Test with screen readers (VoiceOver, NVDA, JAWS) and document compatibility");
  if (tool.accessibility_notes && !tool.accessibility_notes.toLowerCase().includes("wcag")) r.push("Reference specific WCAG success criteria in your accessibility documentation");
  return r;
}

export function generateToolReport(tool: Tool): ToolReport {
  const easeReport: DimensionReport = {
    dimension: "Ease of Use",
    score: tool.scores.ease_of_use,
    max: 10,
    weight: "20%",
    rating: ratingFromScore(tool.scores.ease_of_use),
    strengths: getEaseStrengths(tool),
    gaps: getEaseGaps(tool),
    recommendations: getEaseRecs(tool),
  };

  const instructionalReport: DimensionReport = {
    dimension: "Instructional Value",
    score: tool.scores.instructional_value,
    max: 10,
    weight: "40% (highest)",
    rating: ratingFromScore(tool.scores.instructional_value),
    strengths: getInstructionalStrengths(tool),
    gaps: getInstructionalGaps(tool),
    recommendations: getInstructionalRecs(tool),
  };

  const privacyReport: DimensionReport = {
    dimension: "Data Privacy",
    score: tool.scores.data_privacy,
    max: 10,
    weight: "20%",
    rating: ratingFromScore(tool.scores.data_privacy),
    strengths: getPrivacyStrengths(tool),
    gaps: getPrivacyGaps(tool),
    recommendations: getPrivacyRecs(tool),
  };

  const accessibilityReport: DimensionReport = {
    dimension: "Accessibility",
    score: tool.scores.accessibility,
    max: 10,
    weight: "20%",
    rating: ratingFromScore(tool.scores.accessibility),
    strengths: getAccessibilityStrengths(tool),
    gaps: getAccessibilityGaps(tool),
    recommendations: getAccessibilityRecs(tool),
  };

  // Compliance gaps
  const complianceGaps: ComplianceGap[] = [];
  const critical = ["FERPA Compliant", "COPPA Compliant", "DPA Available", "SOC 2 Type II"];
  critical.forEach(label => {
    const signal = tool.compliance_signals.find(c => c.label === label);
    if (!signal || signal.status !== "available") {
      complianceGaps.push({
        signal: label,
        current_status: signal ? signal.status : "Not documented",
        impact: label === "FERPA Compliant" ? "Blocks adoption by most US school districts" :
                label === "COPPA Compliant" ? "Required for tools used by students under 13" :
                label === "DPA Available" ? "Required by many state privacy laws (e.g., CA, CO, CT, VA)" :
                "Demonstrates enterprise-grade security controls",
        recommendation: signal?.status === "partial"
          ? `Complete ${label} documentation and publish publicly`
          : `Obtain ${label} certification/documentation`,
      });
    }
  });

  // VPAT assessment
  const vpatAssessment = {
    status: tool.vpat_status === "available" ? "Published and accessible" :
            tool.vpat_status === "on_request" ? "Available on request only" :
            "Not published",
    impact: tool.vpat_status === "available"
      ? "Meets Section 508 procurement requirements"
      : "Districts with Section 508 obligations may be unable to procure this tool",
    recommendation: tool.vpat_status === "available"
      ? "Maintain annual updates to your VPAT/ACR"
      : "Commission a VPAT 2.5 ACR and publish it publicly on your accessibility page",
  };

  // Priority actions (top 3-5 most impactful)
  const allRecs = [
    ...privacyReport.recommendations.map(r => ({ text: r, priority: 1 })),
    ...accessibilityReport.recommendations.slice(0, 2).map(r => ({ text: r, priority: 2 })),
    ...instructionalReport.recommendations.slice(0, 1).map(r => ({ text: r, priority: 3 })),
    ...easeReport.recommendations.slice(0, 1).map(r => ({ text: r, priority: 4 })),
  ];
  const priorityActions = allRecs.sort((a, b) => a.priority - b.priority).slice(0, 5).map(r => r.text);

  return {
    tool,
    generated_at: new Date().toISOString(),
    overall_rating: overallRating(tool.overall_score),
    dimension_reports: [easeReport, instructionalReport, privacyReport, accessibilityReport],
    compliance_gaps: complianceGaps,
    vpat_assessment: vpatAssessment,
    priority_actions: priorityActions,
    scoring_methodology: "Scores are assigned by the District AI Index editorial team across four dimensions. Instructional Value carries the highest weight (40%) because our primary audience — educators and district leaders — prioritize tools that genuinely improve teaching and learning. Overall Score = (Ease × 0.20) + (Instructional Value × 0.40) + (Privacy × 0.20) + (Accessibility × 0.20). Scores are not influenced by listing tier, affiliate status, or vendor relationships.",
  };
}
