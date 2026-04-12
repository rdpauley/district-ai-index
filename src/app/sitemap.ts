import type { MetadataRoute } from "next";
import { tools } from "@/lib/seed-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://districtaiindex.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/directory`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${SITE_URL}/verified`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${SITE_URL}/submit`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/dashboard`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  ];

  const toolPages = tools.map((tool) => ({
    url: `${SITE_URL}/tool/${tool.slug}`,
    lastModified: new Date(tool.last_reviewed),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages];
}
