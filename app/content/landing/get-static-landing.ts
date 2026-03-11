import type { SupportedCountry } from "@/lib/landing-content.types";
import { landingEG } from "./landing-eg";
import { landingSA } from "./landing-sa";
import type { StaticLanding } from "./types";
import {
  SECTION_KEYS,
  getLandingSectionOverride,
  mergeStaticWithOverrides,
  type LandingSectionKey,
} from "@/lib/landing-sections";

export function getStaticLanding(country: SupportedCountry): StaticLanding {
  return country === "EG" ? landingEG : landingSA;
}

export async function getStaticLandingWithOverrides(
  country: SupportedCountry,
): Promise<StaticLanding> {
  const base = getStaticLanding(country);

  const overridesEntries = await Promise.all(
    SECTION_KEYS.map(async (section) => {
      const data = await getLandingSectionOverride(country, section as LandingSectionKey);
      return [section, data] as const;
    }),
  );

  const overrides: Partial<Record<LandingSectionKey, unknown>> = {};
  let hasOverride = false;
  for (const [section, value] of overridesEntries) {
    if (value !== null && value !== undefined) {
      overrides[section] = value;
      hasOverride = true;
    }
  }

  if (!hasOverride) return base;
  return mergeStaticWithOverrides(base, overrides);
}

