"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { tools } from "@/lib/seed-data";
import { ToolCard } from "@/components/tool-card";
import { Compass, Sparkles, RotateCcw, Link2, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Audience, GradeBand, Category, PricingType, PrivacyFlag } from "@/lib/types";

const ROLES: { value: Audience; label: string; helper: string }[] = [
  { value: "Teachers", label: "Teacher", helper: "Classroom or subject specialist" },
  { value: "Instructional Coaches", label: "Instructional Coach", helper: "Supporting teacher practice" },
  { value: "Curriculum Leaders", label: "Curriculum Leader", helper: "Shaping district-wide content" },
  { value: "Administrators", label: "Administrator", helper: "Principal, IT, or central office" },
  { value: "Students", label: "Student-facing", helper: "Tools used directly by students" },
];

const GRADES: { value: GradeBand; label: string }[] = [
  { value: "K-2", label: "K–2" },
  { value: "3-5", label: "3–5" },
  { value: "6-8", label: "6–8" },
  { value: "9-12", label: "9–12" },
];

const GOALS: { value: Category; label: string }[] = [
  { value: "Lesson Planning", label: "Plan lessons" },
  { value: "Differentiation", label: "Differentiate for learners" },
  { value: "Assessment", label: "Build or grade assessments" },
  { value: "Feedback & Grading", label: "Give feedback faster" },
  { value: "Tutoring", label: "Tutor students" },
  { value: "Student Support", label: "Support struggling students" },
  { value: "Engagement", label: "Increase engagement" },
  { value: "Content Creation", label: "Create content (slides, video, images)" },
  { value: "Writing Support", label: "Help with writing" },
  { value: "Admin Tasks", label: "Handle admin tasks (IEPs, comms)" },
  { value: "Productivity", label: "General productivity" },
  { value: "Accessibility & Notes", label: "Accessibility & note-taking" },
];

const PRIVACY_LEVELS: { value: PrivacyFlag | "any"; label: string; helper: string }[] = [
  { value: "District Ready", label: "Must be District Ready", helper: "DPA + clear FERPA/COPPA posture required" },
  { value: "Teacher Use Only", label: "Teacher Use OK", helper: "Acceptable for individual classroom use" },
  { value: "any", label: "I'll evaluate myself", helper: "Show all options" },
];

const PRICING_LEVELS: { value: PricingType | "any"; label: string }[] = [
  { value: "Free", label: "Free only" },
  { value: "Freemium", label: "Free or Freemium" },
  { value: "any", label: "Any pricing" },
];

interface Answers {
  role: Audience | "";
  grade: GradeBand | "";
  goals: Category[];
  privacy: PrivacyFlag | "any" | "";
  pricing: PricingType | "any" | "";
}

const EMPTY_ANSWERS: Answers = { role: "", grade: "", goals: [], privacy: "", pricing: "" };

function parseAnswers(params: URLSearchParams): Answers {
  return {
    role: (params.get("role") as Audience) || "",
    grade: (params.get("grade") as GradeBand) || "",
    goals: (params.get("goals")?.split(",").filter(Boolean) as Category[]) || [],
    privacy: (params.get("privacy") as PrivacyFlag | "any") || "",
    pricing: (params.get("pricing") as PricingType | "any") || "",
  };
}

function answersAreEmpty(a: Answers): boolean {
  return !a.role && !a.grade && a.goals.length === 0 && !a.privacy && !a.pricing;
}

function hasMinimumAnswers(a: Answers): boolean {
  // Need at least role OR a goal to start ranking.
  return Boolean(a.role) || a.goals.length > 0;
}

interface MatchedTool {
  tool: typeof tools[number];
  matchScore: number;       // 0–1
  matchedCriteria: string[];
}

function scoreMatch(tool: typeof tools[number], answers: Answers): MatchedTool {
  let points = 0;
  let possible = 0;
  const matched: string[] = [];

  if (answers.role) {
    possible += 1;
    if (tool.audiences.includes(answers.role)) {
      points += 1;
      matched.push(answers.role);
    }
  }
  if (answers.grade) {
    possible += 1;
    if (tool.grade_bands.includes(answers.grade)) {
      points += 1;
      matched.push(answers.grade);
    }
  }
  if (answers.goals.length > 0) {
    possible += answers.goals.length;
    for (const goal of answers.goals) {
      if (tool.categories.includes(goal)) {
        points += 1;
        matched.push(goal);
      }
    }
  }
  if (answers.privacy && answers.privacy !== "any") {
    possible += 1;
    if (answers.privacy === "District Ready" && tool.privacy_flag === "District Ready") {
      points += 1;
      matched.push("District Ready");
    } else if (
      answers.privacy === "Teacher Use Only" &&
      (tool.privacy_flag === "District Ready" || tool.privacy_flag === "Teacher Use Only")
    ) {
      points += 1;
      matched.push(tool.privacy_flag);
    }
  }
  if (answers.pricing && answers.pricing !== "any") {
    possible += 1;
    if (answers.pricing === "Free" && tool.pricing_type === "Free") {
      points += 1;
      matched.push("Free");
    } else if (
      answers.pricing === "Freemium" &&
      (tool.pricing_type === "Free" || tool.pricing_type === "Freemium")
    ) {
      points += 1;
      matched.push(tool.pricing_type);
    }
  }

  return {
    tool,
    matchScore: possible === 0 ? 0 : points / possible,
    matchedCriteria: matched,
  };
}

export function FindClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [answers, setAnswers] = useState<Answers>(() => parseAnswers(new URLSearchParams(searchParams.toString())));
  const [copied, setCopied] = useState(false);

  // Sync answers to URL.
  useEffect(() => {
    const params = new URLSearchParams();
    if (answers.role) params.set("role", answers.role);
    if (answers.grade) params.set("grade", answers.grade);
    if (answers.goals.length) params.set("goals", answers.goals.join(","));
    if (answers.privacy) params.set("privacy", answers.privacy);
    if (answers.pricing) params.set("pricing", answers.pricing);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [answers, pathname, router]);

  const updateRole = useCallback((role: Audience) => {
    setAnswers((a) => ({ ...a, role: a.role === role ? "" : role }));
  }, []);

  const updateGrade = useCallback((grade: GradeBand) => {
    setAnswers((a) => ({ ...a, grade: a.grade === grade ? "" : grade }));
  }, []);

  const toggleGoal = useCallback((goal: Category) => {
    setAnswers((a) => ({
      ...a,
      goals: a.goals.includes(goal) ? a.goals.filter((g) => g !== goal) : [...a.goals, goal],
    }));
  }, []);

  const updatePrivacy = useCallback((value: PrivacyFlag | "any") => {
    setAnswers((a) => ({ ...a, privacy: a.privacy === value ? "" : value }));
  }, []);

  const updatePricing = useCallback((value: PricingType | "any") => {
    setAnswers((a) => ({ ...a, pricing: a.pricing === value ? "" : value }));
  }, []);

  const reset = useCallback(() => setAnswers(EMPTY_ANSWERS), []);

  const copyShareLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const ranked: MatchedTool[] = useMemo(() => {
    if (!hasMinimumAnswers(answers)) return [];
    return tools
      .map((t) => scoreMatch(t, answers))
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
        return b.tool.overall_score - a.tool.overall_score;
      })
      .slice(0, 12);
  }, [answers]);

  const showResults = hasMinimumAnswers(answers);

  return (
    <div className="bg-white min-h-screen">
      {/* ============ HEADER ============ */}
      <section className="bg-navy text-white" aria-labelledby="find-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white">
              <Compass className="h-3 w-3" aria-hidden="true" /> Use-Case Finder
            </span>
          </div>
          <h1 id="find-heading" className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
            Find the right AI tool for what you actually need
          </h1>
          <p className="mt-3 text-base text-navy-100 max-w-2xl leading-relaxed">
            Answer the questions below — pick whichever apply. We'll rank tools by how well each one matches.
            Skip what you don't care about.
          </p>
        </div>
      </section>

      {/* ============ FORM ============ */}
      <section className="bg-navy-50/50 border-b border-border" aria-labelledby="questions-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <h2 id="questions-heading" className="sr-only">Tell us about your needs</h2>

          {/* Role */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
              Who's it for?
            </legend>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => {
                const active = answers.role === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => updateRole(r.value)}
                    className={cn(
                      "rounded-xl border px-4 py-2.5 text-left transition-colors",
                      active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-charcoal border-border hover:bg-navy-50 hover:border-navy-200"
                    )}
                    aria-pressed={active}
                  >
                    <span className="block text-sm font-semibold">{r.label}</span>
                    <span className={cn("block text-[11px] mt-0.5", active ? "text-navy-100" : "text-charcoal-light")}>
                      {r.helper}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Grade band */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
              Which grade band?
            </legend>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => {
                const active = answers.grade === g.value;
                return (
                  <button
                    key={g.value}
                    onClick={() => updateGrade(g.value)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-charcoal border-border hover:bg-navy-50 hover:border-navy-200"
                    )}
                    aria-pressed={active}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Goals */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
              What do you want to do? <span className="font-normal normal-case text-charcoal-light">(pick all that apply)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => {
                const active = answers.goals.includes(g.value);
                return (
                  <button
                    key={g.value}
                    onClick={() => toggleGoal(g.value)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "bg-accent-blue text-white border-accent-blue"
                        : "bg-white text-charcoal border-border hover:bg-navy-50 hover:border-navy-200"
                    )}
                    aria-pressed={active}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Privacy */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
              Privacy posture
            </legend>
            <div className="flex flex-wrap gap-2">
              {PRIVACY_LEVELS.map((p) => {
                const active = answers.privacy === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => updatePrivacy(p.value)}
                    className={cn(
                      "rounded-xl border px-4 py-2.5 text-left transition-colors",
                      active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-charcoal border-border hover:bg-navy-50 hover:border-navy-200"
                    )}
                    aria-pressed={active}
                  >
                    <span className="block text-sm font-semibold">{p.label}</span>
                    <span className={cn("block text-[11px] mt-0.5", active ? "text-navy-100" : "text-charcoal-light")}>
                      {p.helper}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Pricing */}
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
              Pricing
            </legend>
            <div className="flex flex-wrap gap-2">
              {PRICING_LEVELS.map((p) => {
                const active = answers.pricing === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => updatePricing(p.value)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-charcoal border-border hover:bg-navy-50 hover:border-navy-200"
                    )}
                    aria-pressed={active}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <button
              onClick={copyShareLink}
              disabled={answersAreEmpty(answers)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-blue px-4 py-2 text-xs font-semibold text-white hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Link copied
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Copy share link
                </>
              )}
            </button>
            {!answersAreEmpty(answers) && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-charcoal hover:bg-navy-50 hover:text-navy transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start over
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" aria-labelledby="matches-heading">
        <h2 id="matches-heading" className="sr-only">Matching tools</h2>

        {!showResults ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="h-10 w-10 text-navy-200 mb-4" aria-hidden="true" />
            <p className="text-base font-semibold text-navy">Pick a role or a goal to see matches</p>
            <p className="text-sm text-charcoal-light mt-1 max-w-md">
              The more you tell us, the more precise the ranking. You can also browse the{" "}
              <Link href="/directory" className="text-accent-blue hover:underline">full directory</Link>.
            </p>
          </div>
        ) : ranked.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-base font-semibold text-navy">No tools match these filters</p>
            <p className="text-sm text-charcoal-light mt-1 max-w-md">
              Try removing the privacy or pricing constraint, or pick a broader goal.
            </p>
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue hover:text-navy transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Start over
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-navy">
                  {ranked.length} {ranked.length === 1 ? "match" : "matches"} for your needs
                </h3>
                <p className="mt-1 text-sm text-charcoal-light">
                  Ranked by how well each tool matches your criteria, with editorial score as tiebreaker.
                </p>
              </div>
              <Link
                href="/directory"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-accent-blue hover:text-navy transition-colors"
              >
                Browse all tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ranked.map(({ tool, matchScore, matchedCriteria }) => (
                <div key={tool.id} className="relative">
                  <div className="absolute -top-2.5 left-4 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-blue px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {Math.round(matchScore * 100)}% match
                    </span>
                  </div>
                  <ToolCard tool={tool} />
                  {matchedCriteria.length > 0 && (
                    <div className="mt-2 px-1">
                      <p className="text-[11px] text-charcoal-light">
                        Matched: <span className="text-navy font-medium">{matchedCriteria.slice(0, 4).join(" · ")}</span>
                        {matchedCriteria.length > 4 && ` +${matchedCriteria.length - 4} more`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
