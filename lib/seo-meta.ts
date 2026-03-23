/** Google SERP snippet — aim ≤ ~160 characters (Arabic counts per character). */
export const META_DESCRIPTION_MAX_CHARS = 160;

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
  if (!t || !isAbsoluteHttpUrl(t)) return fallback;
  try {
    return new URL(t).href;
  } catch {
    return fallback;
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
  const base = envFallback.replace(/\/$/, "");
  const t = (seoCanonical ?? "").trim();
  if (!t || !isAbsoluteHttpUrl(t)) return base;
  try {
    return new URL(t).origin;
  } catch {
    return base;
  }
}
