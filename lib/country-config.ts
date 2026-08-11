import type { SupportedCountry } from "./landing-content.types";

export const COUNTRY_CONFIG = {
  sa: { code: "SA" as const },
  eg: { code: "EG" as const },
} as const;

export type CountrySlug = keyof typeof COUNTRY_CONFIG;

export const SUPPORTED_COUNTRY_SLUGS: CountrySlug[] = Object.keys(COUNTRY_CONFIG) as CountrySlug[];

/**
 * Paths that are NOT country-scoped.
 *
 * The proxy sends every other first segment to /sa or /eg. «articles» belongs here
 * because the articles are written once for the whole audience — a piece about SEO is
 * not Saudi or Egyptian — and because its address is baked into the canonical URL of
 * every article Modonty publishes for us. A country prefix would split one article into
 * two competing URLs.
 */
/**
 * Paths that are NOT a country.
 *
 * Anything not listed here gets rewritten to `/{country}{path}`, so a new country-less
 * page is invisible until its segment is added — the proxy answers 307 to `/sa/faq`,
 * which does not exist, and the page looks broken for a reason nothing in it explains.
 * Add the segment in the same commit that adds the route.
 */
// `"preview"` removed: no `app/preview` route exists, so reserving the segment only meant
// /preview 404'd instead of geo-redirecting like any other unknown path.
export const RESERVED_FIRST_SEGMENTS = ["about", "team", "privacy", "terms", "billing-policy", "admin", "features", "api", "articles", "faq", "cost-comparison", "clients"] as const;

export function getCountrySlugFromParam(param: string | undefined): CountrySlug {
  const slug = param?.toLowerCase();
  if (slug === "sa" || slug === "eg") return slug;
  return "sa";
}

export function getCountryCodeFromSlug(slug: CountrySlug): SupportedCountry {
  return COUNTRY_CONFIG[slug].code;
}

export function isSupportedCountrySlug(param: string | undefined): param is CountrySlug {
  if (param === undefined || param === "") return false;
  const raw = param.toLowerCase();
  return raw === "sa" || raw === "eg";
}
