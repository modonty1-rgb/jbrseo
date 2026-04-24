import type { MetadataRoute } from "next";
import { SUPPORTED_COUNTRY_SLUGS } from "@/lib/country-config";
import { DEFAULT_PUBLIC_SITE_ORIGIN } from "@/lib/seo-meta";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = DEFAULT_PUBLIC_SITE_ORIGIN;
  const now = new Date();

  const countryEntries: MetadataRoute.Sitemap = SUPPORTED_COUNTRY_SLUGS.flatMap((slug) => [
    {
      url: `${siteUrl}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1,
      alternates: {
        languages: {
          "ar-SA": `${siteUrl}/sa`,
          "ar-EG": `${siteUrl}/eg`,
          "x-default": `${siteUrl}/sa`,
        },
      },
    },
    {
      url: `${siteUrl}/${slug}/pricing`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          "ar-SA": `${siteUrl}/sa/pricing`,
          "ar-EG": `${siteUrl}/eg/pricing`,
          "x-default": `${siteUrl}/sa/pricing`,
        },
      },
    },
    {
      url: `${siteUrl}/${slug}/signup`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          "ar-SA": `${siteUrl}/sa/signup`,
          "ar-EG": `${siteUrl}/eg/signup`,
          "x-default": `${siteUrl}/sa/signup`,
        },
      },
    },
  ]);

  return [
    ...countryEntries,
    {
      url: `${siteUrl}/features`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
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
