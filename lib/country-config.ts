import type { SupportedCountry } from "./landing-content.types";

export const COUNTRY_CONFIG = {
  sa: { code: "SA" as const },
  eg: { code: "EG" as const },
} as const;

export type CountrySlug = keyof typeof COUNTRY_CONFIG;

export const SUPPORTED_COUNTRY_SLUGS: CountrySlug[] = Object.keys(COUNTRY_CONFIG) as CountrySlug[];

export const RESERVED_FIRST_SEGMENTS = ["about", "team", "privacy", "terms", "admin", "features"] as const;

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
