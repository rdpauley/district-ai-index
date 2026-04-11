import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/seed-data";
import { buildMetadata, buildToolJsonLd } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return buildMetadata({
      title: "Tool Not Found",
      description: "The AI tool you're looking for is not in our directory.",
      path: `/tool/${slug}`,
    });
  }

  return buildMetadata({
    title: `${tool.name} — AI Tool Review for K–12`,
    description: `${tool.description} Scored ${tool.overall_score}/10. ${tool.privacy_flag}. ${tool.pricing_type}. Reviewed by District AI Index.`,
    path: `/tool/${tool.slug}`,
    type: "article",
  });
}

export default async function ToolLayout({ params, children }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  return (
    <>
      {tool && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildToolJsonLd({
              name: tool.name,
              vendor: tool.vendor,
              description: tool.description,
              overall_score: tool.overall_score,
              pricing_type: tool.pricing_type,
              slug: tool.slug,
              categories: tool.categories,
              last_reviewed: tool.last_reviewed,
            })),
          }}
        />
      )}
      {children}
    </>
  );
}
