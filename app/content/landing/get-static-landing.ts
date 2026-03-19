import type { SupportedCountry } from "@/lib/landing-content.types";
import { sanitizeUserFacingString } from "@/lib/sanitize-user-facing";
import { landingEG } from "./landing-eg";
import { landingSA } from "./landing-sa";
import type { StaticLanding } from "./types";
import type { Plan } from "./price-section-types";
import {
  STATIC_ONLY_KEYS,
  getLandingSectionOverride,
  mergeStaticWithOverrides,
  type LandingSectionKey,
} from "@/lib/landing-sections";

export function getStaticLanding(country: SupportedCountry): StaticLanding {
  return country === "EG" ? landingEG : landingSA;
}

function sanitizePricingPlanNames(landing: StaticLanding): StaticLanding {
  const plans = landing.pricing?.PLANS;
  if (!Array.isArray(plans) || plans.length === 0) return landing;
  const sanitized: Plan[] = plans.map((p) => ({
    ...p,
    name: sanitizeUserFacingString(p.name),
  }));
  return { ...landing, pricing: { ...landing.pricing, PLANS: sanitized } };
}

export async function getStaticLandingWithOverrides(
  country: SupportedCountry,
): Promise<StaticLanding> {
  const base = getStaticLanding(country);

  const overridesEntries = await Promise.all(
    STATIC_ONLY_KEYS.map(async (section) => {
      const data = await getLandingSectionOverride(country, section);
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

  const merged = hasOverride ? mergeStaticWithOverrides(base, overrides) : base;
  return sanitizePricingPlanNames(merged);
}

