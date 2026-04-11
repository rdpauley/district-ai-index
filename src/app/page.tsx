"use client";

import Link from "next/link";
import { tools } from "@/lib/seed-data";
import { ToolCard } from "@/components/tool-card";
import { ScoreRingInline } from "@/components/score-ring";
import { PrivacyBadge } from "@/components/status-badge";
import {
  Search,
  BookOpen,
  GraduationCap,
  BrainCircuit,
  BarChart3,
  Palette,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  TrendingUp,
  Users,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = [
  { icon: BookOpen, label: "Lesson Planning", count: tools.filter((t) => t.categories.includes("Lesson Planning")).length },
  { icon: BrainCircuit, label: "Tutoring", count: tools.filter((t) => t.categories.includes("Tutoring") || t.categories.includes("Student Support") || t.categories.includes("Student Interaction")).length },
  { icon: BarChart3, label: "Assessment", count: tools.filter((t) => t.categories.includes("Assessment")).length },
  { icon: Palette, label: "Content Creation", count: tools.filter((t) => t.categories.includes("Content Creation")).length },
  { icon: GraduationCap, label: "Engagement", count: tools.filter((t) => t.categories.includes("Engagement")).length },
  { icon: MessageSquare, label: "General AI", count: tools.filter((t) => t.categories.includes("General AI")).length },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredTools = tools.filter((t) => t.listing_tier === "verified" || t.is_featured).slice(0, 3);
  const topRated = [...tools].sort((a, b) => b.overall_score - a.overall_score).slice(0, 6);
  const recentlyReviewed = [...tools].sort((a, b) => new Date(b.last_reviewed).getTime() - new Date(a.last_reviewed).getTime()).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/directory?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative bg-navy overflow-hidden" aria-labelledby="hero-heading">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Trusted by District Leaders
              </span>
            </div>
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Find AI Tools
              <br />
              <span className="text-navy-200">Teachers Actually Use</span>
            </h1>
            <p className="mt-5 text-lg text-navy-200 leading-relaxed max-w-2xl">
              The enterprise-grade directory for K–12 districts. Discover, compare, and evaluate AI tools with privacy ratings, readiness scores, and editorial reviews — so you can make safe, informed adoption decisions.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-8 flex items-center gap-3 max-w-xl" role="search" aria-label="Search AI tools">
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
                <label htmlFor="hero-search" className="sr-only">Search AI tools</label>
                <input
                  id="hero-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by tool name, category, or use case..."
                  className="w-full bg-transparent text-sm text-navy placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-accent-blue px-6 py-3 text-sm font-semibold text-white hover:bg-accent-blue/90 transition-colors shadow-lg"
              >
                Search
              </button>
            </form>

            {/* Quick stats */}
            <div className="mt-8 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-navy-200">
                <CheckCircle2 className="h-4 w-4 text-green-400" aria-hidden="true" />
                <span><strong className="text-white">{tools.length}</strong> Tools Evaluated</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-navy-200">
                <ShieldCheck className="h-4 w-4 text-green-400" aria-hidden="true" />
                <span><strong className="text-white">{tools.filter((t) => t.privacy_flag === "District Ready").length}</strong> District Ready</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-navy-200">
                <Star className="h-4 w-4 text-accent-gold-light" aria-hidden="true" />
                <span><strong className="text-white">5-Dimension</strong> Scoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BROWSE BY CATEGORY ============ */}
      <section className="py-16 bg-white" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="categories-heading" className="text-2xl font-bold text-navy">Browse by Category</h2>
            <p className="mt-2 text-sm text-muted-foreground">Find AI tools organized by how educators use them</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={`/directory?category=${encodeURIComponent(cat.label)}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-5 text-center transition-all duration-200 hover:shadow-md hover:border-navy-200"
              >
                <div className="rounded-xl bg-navy-50 p-3 transition-colors group-hover:bg-navy-100">
                  <cat.icon className="h-6 w-6 text-accent-blue" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} tools</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED TOOLS ============ */}
      <section className="py-16 bg-navy-50/50" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-accent-gold" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-gold">Featured</span>
              </div>
              <h2 id="featured-heading" className="text-2xl font-bold text-navy">Top Recommended Tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">Editorially vetted and verified for district adoption</p>
            </div>
            <Link href="/verified" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-accent-blue hover:text-navy transition-colors">
              View all verified <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} featured />
            ))}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground text-center">
            Featured tools are editorially selected. Sponsored placements are clearly labeled.
          </p>
        </div>
      </section>

      {/* ============ TOP RATED TOOLS ============ */}
      <section className="py-16 bg-white" aria-labelledby="top-rated-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 id="top-rated-heading" className="text-2xl font-bold text-navy">Top Rated by District Readiness</h2>
              <p className="mt-1 text-sm text-muted-foreground">Highest-scoring tools across all five evaluation dimensions</p>
            </div>
            <Link href="/directory" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-accent-blue hover:text-navy transition-colors">
              Browse all tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRated.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW WE EVALUATE — TRUST SECTION ============ */}
      <section className="py-16 bg-navy" id="methodology" aria-labelledby="methodology-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="methodology-heading" className="text-2xl font-bold text-white">How We Evaluate Tools</h2>
            <p className="mt-2 text-sm text-navy-200 max-w-xl mx-auto">
              Every tool is scored across five dimensions by our editorial team using a rigorous, district-level evaluation framework
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { score: "20", label: "Ease of Implementation", desc: "Deployment simplicity, SSO, LMS integration, and IT burden" },
              { score: "20", label: "Teacher Usability", desc: "Learning curve, workflow integration, and time-to-value for educators" },
              { score: "20", label: "Student Safety", desc: "Content moderation, guardrails, monitoring, and age-appropriateness" },
              { score: "20", label: "Instructional Impact", desc: "Alignment to pedagogy, standards, differentiation, and learning outcomes" },
              { score: "20", label: "Integration & Admin", desc: "Admin controls, reporting, rostering, and district-level management" },
            ].map((dim) => (
              <div key={dim.label} className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <div className="text-2xl font-bold text-accent-gold mb-2" aria-hidden="true">/{dim.score}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{dim.label}</h3>
                <p className="text-xs text-navy-200 leading-relaxed">{dim.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-navy-200 mb-4">
              Total score of <strong className="text-white">100 points</strong> determines the District Readiness Rating
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="inline-flex items-center gap-2 text-xs text-navy-200">
                <span className="h-3 w-3 rounded-full bg-green-400" aria-hidden="true" /> 85+ = District Ready
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-navy-200">
                <span className="h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" /> 70–84 = Teacher Use Only
              </span>
              <span className="inline-flex items-center gap-2 text-xs text-navy-200">
                <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" /> Below 70 = Use Caution
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RECENTLY REVIEWED ============ */}
      <section className="py-16 bg-white" aria-labelledby="recent-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="recent-heading" className="text-2xl font-bold text-navy mb-8">Recently Reviewed</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full" role="table">
              <thead>
                <tr className="bg-navy-50/50">
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tool</th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Category</th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Privacy</th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score</th>
                  <th scope="col" className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {recentlyReviewed.map((tool) => (
                  <tr key={tool.id} className="border-t border-border hover:bg-navy-50/30 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/tool/${tool.slug}`} className="group flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-xs font-bold text-navy shrink-0" aria-hidden="true">
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy group-hover:text-accent-blue transition-colors">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">{tool.vendor}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-charcoal-light hidden sm:table-cell">{tool.categories[0]}</td>
                    <td className="py-3 px-4 hidden md:table-cell"><PrivacyBadge flag={tool.privacy_flag} /></td>
                    <td className="py-3 px-4"><ScoreRingInline score={tool.overall_score} /></td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{tool.last_reviewed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============ EMAIL CAPTURE ============ */}
      <section className="py-16 bg-navy-50/50" aria-labelledby="newsletter-heading">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <Mail className="h-8 w-8 text-accent-blue mx-auto mb-4" aria-hidden="true" />
          <h2 id="newsletter-heading" className="text-2xl font-bold text-navy">Get Weekly AI Tools for Teachers</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Join district leaders and instructional coaches who receive our curated picks, new tool reviews, and adoption insights every week.
          </p>
          {subscribed ? (
            <div className="mt-6 rounded-xl bg-success-bg border border-success/20 p-4">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                You&apos;re subscribed! Check your inbox for confirmation.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex items-center gap-3 max-w-md mx-auto">
              <label htmlFor="email-capture" className="sr-only">Email address</label>
              <input
                id="email-capture"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue"
              />
              <button
                type="submit"
                className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="mt-3 text-[11px] text-muted-foreground">No spam. Unsubscribe anytime. We respect your privacy.</p>
        </div>
      </section>

      {/* ============ TOP 10 BANNER ============ */}
      <section className="py-12 bg-white border-t border-border" aria-labelledby="top10-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="top10-heading" className="text-xl font-bold text-navy mb-2">Top 10 AI Tools This Month</h2>
          <p className="text-sm text-muted-foreground mb-6">Based on district readiness scores, editorial reviews, and educator feedback</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {topRated.slice(0, 10).map((tool, i) => (
              <Link
                key={tool.id}
                href={`/tool/${tool.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-sm font-medium text-navy hover:bg-navy-50 hover:border-navy-200 transition-colors"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-50 text-[10px] font-bold text-navy" aria-hidden="true">
                  {i + 1}
                </span>
                {tool.name}
              </Link>
            ))}
          </div>
          <Link href="/directory" className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-accent-blue hover:text-navy transition-colors">
            View full directory <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
