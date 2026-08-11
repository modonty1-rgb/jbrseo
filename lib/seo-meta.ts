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
  // `x-default` added. A page that serves both countries from one URL still needs the
  // fallback entry: without it a visitor whose locale matches neither ar-SA nor ar-EG —
  // an Arabic speaker in the Gulf, or any en-* browser — has no annotated target, and
  // Google's own hreflang guidance names x-default as the row that covers exactly that
  // case. The country landings already emit it; these shared pages did not.
  return { "ar-SA": canonical, "ar-EG": canonical, "x-default": canonical };
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
            // `/sa`, not the bare origin. `proxy.ts` 307-redirects "/" to a country
            // landing, so position 1 of every breadcrumb on the site pointed at a URL
            // that does not serve a page. A breadcrumb item is a URL Google follows and
            // may display; it should resolve 200. `/sa` is also the x-default target, so
            // the trail and the hreflang cluster now name the same home.
            item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/sa`,
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

// `resolveCanonicalForMetadata` lived here with zero call sites across app/ and lib/. It
// was the only helper that would have honoured a CMS-stored canonical; every page builds
// its canonical from its own route instead, which is the safer of the two designs.

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

/**
 * JSON-LD serialised safely for `dangerouslySetInnerHTML`.
 *
 * `JSON.stringify` escapes what JSON needs and nothing HTML needs. Inside a `<script>`
 * element the parser is still looking for `</script`, so one such sequence anywhere in
 * the data closes the tag early: the structured data is destroyed and whatever follows is
 * parsed as markup. Every string in these graphs comes from somewhere a person can type —
 * FAQ answers and plan copy from our own admin, client names and article titles from
 * Modonty's API — so this is reachable, not theoretical.
 *
 * `<` and `>` become `\u003c` / `\u003e`, which JSON decodes back to the same characters,
 * so the data a crawler reads is unchanged. `&` is escaped for the same reason inside
 * attribute-adjacent contexts. U+2028 and U+2029 are valid in JSON strings but are line
 * terminators in JavaScript, and this markup ends up inside a `<script>`.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
