import type { Metadata } from "next";

const SITE_NAME = "District AI Index";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://districtaiindex.com";
const DEFAULT_DESCRIPTION = "Discover, compare, and evaluate AI tools for K–12 education. Enterprise-grade directory trusted by district technology leaders, instructional coaches, and curriculum directors.";

export function buildMetadata(options: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = `${options.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${options.path}`;

  return {
    title: fullTitle,
    description: options.description,
    openGraph: {
      title: fullTitle,
      description: options.description,
      url,
      siteName: SITE_NAME,
      type: options.type || "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: options.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildToolJsonLd(tool: {
  name: string;
  vendor: string;
  description: string;
  overall_score: number;
  pricing_type: string;
  slug: string;
  categories: string[];
  last_reviewed: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Organization",
      name: tool.vendor,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.overall_score.toString(),
      bestRating: "10",
      worstRating: "0",
      ratingCount: "1",
    },
    offers: {
      "@type": "Offer",
      price: tool.pricing_type === "Free" ? "0" : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/OnlineOnly",
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      datePublished: tool.last_reviewed,
      reviewRating: {
        "@type": "Rating",
        ratingValue: tool.overall_score.toString(),
        bestRating: "10",
      },
    },
  };
}

export { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION };
