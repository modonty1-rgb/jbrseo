import type { Metadata } from "next";

/** Google SERP snippet — aim ≤ ~160 characters (Arabic counts per character). */
export const META_DESCRIPTION_MAX_CHARS = 160;

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
