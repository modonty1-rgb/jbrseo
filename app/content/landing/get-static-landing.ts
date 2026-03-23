import type { SupportedCountry } from "@/lib/landing-content.types";
import { sanitizeUserFacingString } from "@/lib/sanitize-user-facing";
import { landingEG } from "./landing-eg";
import { landingSA } from "./landing-sa";
import type { StaticLanding } from "./types";
import type { Plan, PricingContent } from "./price-section-types";
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

/** DB overrides can keep old promo copy; align badge + bar with code when still the retired "20% off" line. */
function isStaleAnnualBadge(save20: string): boolean {
  const t = save20.trim();
  if (!t) return false;
  return /و?فّ?ر/.test(t) && (/٢٠\s*٪|20\s*%|20٪/.test(t) || /[٢2][٠0]/.test(t));
}

function isStalePricingAnnouncement(text: string): boolean {
  return text.includes("وفّر ٢٠٪") || text.includes("وفّر 20%") || /\u0648\u0641\u064f\u0631 \u0662\u0660\u066a/.test(text);
}

function reconcilePricingFromBase(base: PricingContent, merged: PricingContent): PricingContent {
  const UI = { ...base.UI, ...merged.UI };
  if (isStaleAnnualBadge(merged.UI?.save20 ?? "")) {
    UI.save20 = base.UI.save20;
  }
  let { ANNOUNCEMENT } = merged;
  if (isStalePricingAnnouncement(ANNOUNCEMENT)) {
    ANNOUNCEMENT = base.ANNOUNCEMENT;
  }
  return { ...merged, ANNOUNCEMENT, UI };
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
  const withPricing =
    hasOverride && merged.pricing && base.pricing
      ? { ...merged, pricing: reconcilePricingFromBase(base.pricing, merged.pricing) }
      : merged;

  // Seats are set in code, not admin — prevent stale/wrong admin overrides from showing bad counts.
  const withSeats =
    hasOverride && base.finalCta?.seats
      ? { ...withPricing, finalCta: { ...withPricing.finalCta, seats: base.finalCta.seats } }
      : withPricing;

  return sanitizePricingPlanNames(withSeats);
}

