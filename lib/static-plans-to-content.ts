import { PRICING_CTA_LINK } from "./constants";
import type { PricingPlan, SupportedCountry } from "./landing-content.types";
import type { Plan } from "@/app/content/landing/price-section-types";

function formatPrice(value: number, country: SupportedCountry): string {
  if (value === 0) return "مجاناً";
  return country === "SA" ? `${value} ر.س` : `${value} ج.م`;
}

export function staticPlansToPricingPlans(
  plans: Plan[],
  sectionCta: string,
  country: SupportedCountry
): PricingPlan[] {
  return plans.map((p) => ({
    name: p.name,
    forWho: p.persona,
    cta: p.cta || sectionCta,
    ctaLink: PRICING_CTA_LINK,
    ...(p.price.mo > 0 || p.price.yr > 0
      ? {
          price: formatPrice(p.price.mo, country),
          annualPrice: p.price.yr > 0 ? formatPrice(p.price.yr * 12, country) : undefined,
        }
      : {}),
    ...(p.badge ? { badge: p.badge } : {}),
    ...(p.featured ? { highlight: true as const } : {}),
    features: p.highlights ?? [],
  }));
}
