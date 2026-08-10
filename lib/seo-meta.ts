import type { Metadata } from "next";

/** Google SERP snippet — aim ≤ ~160 characters (Arabic counts per character). */
export const META_DESCRIPTION_MAX_CHARS = 160;

/**
 * The language cluster for a page that exists once and serves both markets.
 *
 * Both entries point at the SAME url on purpose: there is one Arabic version, and the
 * pair tells Google the page is meant for readers in Saudi Arabia and Egypt alike.
 * Country landings do NOT use this — they have two real URLs and build their own.
 */
export function sharedLanguages(canonical: string): Record<string, string> {
  return { "ar-SA": canonical, "ar-EG": canonical };
}

/**
 * The structured-data card for an ordinary page: what it is, and where it sits.
 *
 * Deliberately two nodes and no more. A legal page or a features page has nothing to
 * declare beyond its identity and its trail — inventing an Organization or a Product
 * here would put a second, drifting copy of facts the country landings already state.
 */
export function buildPageJsonLd(input: {
  url: string;
  name: string;
  description: string;
  breadcrumbName: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": input.url,
        url: input.url,
        name: input.name,
        description: input.description,
        inLanguage: "ar",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${input.url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية",
            item: DEFAULT_PUBLIC_SITE_ORIGIN,
          },
          { "@type": "ListItem", position: 2, name: input.breadcrumbName, item: input.url },
        ],
      },
    ],
  };
}

/**
 * The Open Graph fields every shared page needs but none of them is unique about.
 *
 * They were simply missing on six pages: a page that writes its own `openGraph` object
 * REPLACES the layout's instead of merging into it, so each page that added a title and
 * a url silently dropped the site name, the type and the locale. Spread this first, then
 * add the page's own title / description / url / images.
 */
export const SHARED_OPEN_GRAPH = {
  type: "website",
  siteName: "JBRSEO",
  locale: "ar_SA",
} as const;

/** Public indexable pages — explicit robots + Googlebot preview hints. */
export const PUBLIC_INDEX_FOLLOW_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

/** Normalize apex `jbrseo.com` to `https://www.jbrseo.com` for canonicals and sitemap. */
export function ensureWwwJbrseoUrl(url: string): string {
  return url.replace(/^https?:\/\/jbrseo\.com(?=\/|$)/i, "https://www.jbrseo.com");
}

export const DEFAULT_PUBLIC_SITE_ORIGIN = ensureWwwJbrseoUrl(
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jbrseo.com").replace(/\/$/, ""),
);

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Prefer CMS `seo.canonical` when it is a valid absolute http(s) URL; otherwise `fallback`. */
export function resolveCanonicalForMetadata(seoCanonical: string | undefined, fallback: string): string {
  const t = (seoCanonical ?? "").trim();
  if (!t || !isAbsoluteHttpUrl(t)) return ensureWwwJbrseoUrl(fallback);
  try {
    return ensureWwwJbrseoUrl(new URL(t).href);
  } catch {
    return ensureWwwJbrseoUrl(fallback);
  }
}

/**
 * Site origin for `metadataBase` / OG `siteBase` when CMS stores a full canonical URL;
 * otherwise `envFallback` (no trailing slash).
 */
export function resolveSiteOriginFromSeoCanonical(
  seoCanonical: string | undefined,
  envFallback: string,
): string {
  const base = ensureWwwJbrseoUrl(envFallback.replace(/\/$/, ""));
  const t = (seoCanonical ?? "").trim();
  if (!t || !isAbsoluteHttpUrl(t)) return base;
  try {
    return ensureWwwJbrseoUrl(new URL(t).origin);
  } catch {
    return base;
  }
}
