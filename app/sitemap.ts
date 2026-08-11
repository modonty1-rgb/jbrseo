import type { MetadataRoute } from "next";
import { SUPPORTED_COUNTRY_SLUGS } from "@/lib/country-config";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PUBLIC_SITE_ORIGIN } from "@/lib/seo-meta";

/**
 * This file lists the pages this site owns. The articles are NOT here on purpose.
 *
 * Modonty hosts a second sitemap for them and `robots.ts` points at it, which is what
 * Google's own documentation calls for when one party maintains content for another:
 * a `Sitemap:` line in robots.txt "eliminates the parent directory constraint", so a
 * file hosted elsewhere may declare URLs on this domain. Listing the articles in both
 * places would create two sources of truth for the same URLs, and the stale one would
 * be this file — it only rebuilds when we deploy, while theirs is live.
 */

/**
 * The date the copy that lives in code was last rewritten.
 *
 * Google uses `<lastmod>` "if it's consistently and verifiably accurate", so stamping
 * today's date on every deploy is worse than useless — it teaches Google to ignore the
 * field for this whole site. Only pages with no admin section fall back to this line;
 * bump it by hand when their visible text changes. A metadata or styling edit is not a
 * change to the main content.
 */
const CODE_COPY_UPDATED = new Date("2026-07-13T00:00:00.000Z");

/** Which admin section feeds which page — the page's real date is that row's. */
const SECTIONS_BY_PAGE = {
  landing: ["hero", "socialProof", "faq", "finalCta", "header", "footer", "seo", "pricingTeaser"],
  features: ["featuresComparison"],
  about: ["about"],
  team: ["team"],
  privacy: ["privacy"],
  terms: ["terms"],
  // /faq renders the same `faq` section the landing teases, so an admin edit to the
  // questions moves this page's lastModified as well as the landing's.
  faq: ["faq"],
} as const;

function newest(dates: readonly (Date | undefined)[]): Date {
  const times = dates.filter((d): d is Date => d instanceof Date).map((d) => d.getTime());
  return times.length ? new Date(Math.max(...times)) : CODE_COPY_UPDATED;
}

// Re-read hourly. The sitemap is a cached route, and without this an admin edit would
// carry the build date until the next deploy — the very inaccuracy fixed above.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = DEFAULT_PUBLIC_SITE_ORIGIN;

  const [sections, newestPlan] = await Promise.all([
    prisma.landingSection.findMany({ select: { section: true, updatedAt: true }, take: 50 }),
    prisma.plan.findFirst({ select: { updatedAt: true }, orderBy: { updatedAt: "desc" } }),
  ]);
  const bySection = new Map(sections.map((s) => [s.section, s.updatedAt]));
  const dateOf = (page: keyof typeof SECTIONS_BY_PAGE, ...extra: (Date | undefined)[]): Date =>
    newest([...SECTIONS_BY_PAGE[page].map((k) => bySection.get(k)), ...extra]);

  // Prices render on the landings and on /features, so a price edit moves both.
  const planDate = newestPlan?.updatedAt;
  const landingDate = dateOf("landing", planDate);

  const countryEntries: MetadataRoute.Sitemap = SUPPORTED_COUNTRY_SLUGS.flatMap((slug) => [
    {
      url: `${siteUrl}/${slug}`,
      lastModified: landingDate,
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
  ]);

  return [
    ...countryEntries,
    {
      url: `${siteUrl}/features`,
      lastModified: dateOf("features", planDate),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: dateOf("about"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/team`,
      lastModified: dateOf("team"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: dateOf("privacy"),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: dateOf("terms"),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    // No admin section reaches this page — its text lives entirely in code.
    {
      url: `${siteUrl}/billing-policy`,
      lastModified: CODE_COPY_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    // Four routes that were indexable and undeclared.
    // Each sets `robots: { index: true }` in its own metadata, so Google was welcome to
    // index them and had to find them by crawling — while the sitemap, which is the
    // site's own statement of what exists, said they did not. /faq and /clients in
    // particular carry structured data (FAQPage, ItemList) that is worth declaring.
    {
      url: `${siteUrl}/faq`,
      lastModified: dateOf("faq"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      // The roster comes from Modonty's API, not from a LandingSection, so there is no
      // admin edit here for `dateOf` to read.
      url: `${siteUrl}/clients`,
      lastModified: CODE_COPY_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: CODE_COPY_UPDATED,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/cost-comparison`,
      lastModified: CODE_COPY_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];
}
