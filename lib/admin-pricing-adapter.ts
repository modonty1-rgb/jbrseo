import type { Plan as DbPlan, PriceSectionMeta as DbMeta } from "@prisma/client";
import type { Plan, PricingContent, PricingUI, TrustItem } from "@/app/content/landing/price-section-types";

export type DbPlanForCard = {
  slug: string;
  name: string;
  hook?: string | null;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  articlesLabel: string;
  ctaText: string;
  highlights: string[];
  badge: string | null;
  featuredBadge: string | null;
};

export const PLAN_STYLES = {
  free: {
    accent: "#64748b",
    accentBg: "#f1f5f9",
    ctaClass: "btn-ghost",
    badgeGold: false,
  },
  starter: {
    accent: "#2563eb",
    accentBg: "#eff6ff",
    ctaClass: "btn-blue",
    badgeGold: false,
  },
  growth: {
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.18)",
    ctaClass: "btn-featured",
    badgeGold: false,
  },
  scale: {
    accent: "#d97706",
    accentBg: "#fffbeb",
    ctaClass: "btn-gold",
    badgeGold: true,
  },
} as const;

export type PlanSlug = keyof typeof PLAN_STYLES;

export function isPlanSlug(s: string): s is PlanSlug {
  return s === "free" || s === "starter" || s === "growth" || s === "scale";
}

export function dbPlanToVisitorPlan(dbPlan: DbPlanForCard): Plan {
  const styles = isPlanSlug(dbPlan.slug) ? PLAN_STYLES[dbPlan.slug] : PLAN_STYLES.free;
  const isFeatured = !!dbPlan.featuredBadge;
  return {
    id: dbPlan.slug,
    name: dbPlan.name,
    hook: dbPlan.hook ?? null,
    persona: dbPlan.tagline,
    price: { mo: dbPlan.priceMonthly, yr: dbPlan.priceYearly },
    cta: dbPlan.ctaText,
    ctaClass: styles.ctaClass,
    featured: isFeatured,
    badge: dbPlan.featuredBadge ?? dbPlan.badge,
    badgeGold: styles.badgeGold,
    accent: styles.accent,
    accentBg: styles.accentBg,
    articles: dbPlan.articlesLabel,
    guarantee: dbPlan.priceMonthly > 0,
    highlights: dbPlan.highlights,
    sections: [],
  };
}

export function dbMetaToPricingUi(dbMeta: DbMeta | null): PricingUI {
  const ui = (dbMeta?.uiStrings as Partial<PricingUI> | undefined) ?? {};
  return {
    freeLabel: ui.freeLabel ?? "مجاني",
    perMonth: ui.perMonth ?? "/ شهر",
    savedYearly: ui.savedYearly ?? "",
    offer12_18: ui.offer12_18 ?? "",
    billingAnnual: ui.billingAnnual ?? "",
    billingMonthly: ui.billingMonthly ?? "",
    guarantee: ui.guarantee ?? "",
    youGet: ui.youGet ?? "ما تحصل عليه",
    moreDetails: ui.moreDetails ?? "",
    whatsapp: ui.whatsapp ?? "",
    monthly: ui.monthly ?? "شهري",
    yearly: ui.yearly ?? "سنوي",
    save20: ui.save20 ?? "",
    totalAnnual: ui.totalAnnual ?? "",
    annualEquiv18: ui.annualEquiv18 ?? "",
    annualAvgMonthly: ui.annualAvgMonthly ?? "",
    banner12Title: ui.banner12Title ?? "",
    banner12Sub: ui.banner12Sub ?? "",
    trustTitle: ui.trustTitle ?? "",
    pricingBelowHintMonthly: ui.pricingBelowHintMonthly ?? "",
    pricingBelowHintAnnual: ui.pricingBelowHintAnnual ?? "",
    priceDetailsToggle: ui.priceDetailsToggle ?? "تفاصيل السعر",
    pricingFullComparisonLabel: ui.pricingFullComparisonLabel ?? "",
    pageOnModonty: ui.pageOnModonty ?? "صفحة نشاطك على مدونتي",
    noPromoBanner: ui.noPromoBanner ?? "",
  };
}

export function currencyFor(country: "SA" | "EG"): string {
  return country === "SA" ? "ر.س" : "ج.م";
}

/**
 * Build the full `PricingContent` shape that `PricingPageShell` (and any other
 * visitor pricing component) expects, from DB rows only — no static fallback.
 *
 * This is the single source of truth that replaces the legacy
 * `LandingSection.pricing` JSON blob.
 */
export function buildPricingContentFromDb(
  dbPlans: DbPlan[],
  meta: DbMeta | null,
): PricingContent {
  const visiblePlans = [...dbPlans]
    .filter((p) => p.visible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const PLANS: Plan[] = visiblePlans.map((p) =>
    dbPlanToVisitorPlan({
      slug: p.slug,
      name: p.name,
      hook: p.hook,
      tagline: p.tagline,
      priceMonthly: p.priceMonthly,
      priceYearly: p.priceYearly,
      articlesLabel: p.articlesLabel,
      ctaText: p.ctaText,
      highlights: p.highlights,
      badge: p.badge,
      featuredBadge: p.featuredBadge,
    }),
  );

  const TRUST_ITEMS: TrustItem[] = Array.isArray(meta?.trustItems)
    ? (meta!.trustItems as Array<{ icon?: string; label?: string }>)
        .map((t) => ({ icon: t.icon ?? "", label: t.label ?? "" }))
        .filter((t) => t.icon || t.label)
    : [];

  const UI = dbMetaToPricingUi(meta);

  return {
    ANNOUNCEMENT: meta?.announcement ?? "",
    PLANS,
    TRUST_ITEMS,
    BOTTOM_CTA: {
      headline: meta?.ctaHeadline ?? "",
      subheadline: meta?.ctaSubheadline ?? "",
      primaryBtn: "",
      secondaryBtn: "",
      footnote: "",
    },
    UI,
  };
}
