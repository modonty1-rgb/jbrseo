import type { MetadataRoute } from "next";
import { SUPPORTED_COUNTRY_SLUGS } from "@/lib/country-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  const now = new Date();

  const countryEntries: MetadataRoute.Sitemap = SUPPORTED_COUNTRY_SLUGS.flatMap((slug) => [
    {
      url: `${siteUrl}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/${slug}/pricing`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/${slug}/signup`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  return [
    ...countryEntries,
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/team`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];
}
