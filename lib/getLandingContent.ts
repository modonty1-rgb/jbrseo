import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { cl } from "@/helpers/cloudinary";
import type { LandingContent, PricingPlan, SocialLinks, SupportedCountry } from "./landing-content.types";
import { prisma } from "./prisma";
import { PRICING_CTA_LINK } from "./constants";
import { getLandingSectionOverride } from "./landing-sections";
import { DEFAULT_CTA_LABEL } from "./site-settings.types";

function formatPriceForCountry(value: number, country: SupportedCountry): string {
  if (value === 0) return "مجاناً";
  return country === "SA" ? `${value} ر.س` : `${value} ج.م`;
}

function dbPlansToPricingTeaserPlans(
  dbPlans: Array<{
    name: string;
    tagline: string;
    priceMonthly: number;
    priceYearly: number;
    highlights: string[];
    ctaText: string;
    badge: string | null;
    featuredBadge: string | null;
    visible: boolean;
    displayOrder: number;
  }>,
  sectionCta: string,
  country: SupportedCountry,
): PricingPlan[] {
  return [...dbPlans]
    .filter((p) => p.visible)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((p) => ({
      name: p.name,
      forWho: p.tagline,
      cta: p.ctaText || sectionCta,
      ctaLink: PRICING_CTA_LINK,
      ...(p.priceMonthly > 0 || p.priceYearly > 0
        ? {
            price: formatPriceForCountry(p.priceMonthly, country),
            annualPrice:
              p.priceYearly > 0
                ? formatPriceForCountry(p.priceYearly * 12, country)
                : undefined,
          }
        : {}),
      ...(p.badge ? { badge: p.badge } : {}),
      ...(p.featuredBadge ? { highlight: true as const } : {}),
      features: p.highlights ?? [],
    }));
}

async function siteSettingsRowSafe(): Promise<Awaited<ReturnType<typeof prisma.siteSettings.findFirst>>> {
  try {
    return await prisma.siteSettings.findFirst();
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.warn("[getLandingContent] siteSettings unreachable; using empty tracking.");
    return null;
  }
}

/** `SiteSettings.gtmId` from admin — use in root layout for GTM only. */
export async function getSiteGtmId(): Promise<string> {
  const row = await siteSettingsRowSafe();
  return row?.gtmId?.trim() ?? "";
}

function mergeLandingSeo(
  base: LandingContent["seo"],
  override: unknown,
): LandingContent["seo"] {
  if (!override || typeof override !== "object" || Array.isArray(override)) {
    return base;
  }
  const o = override as Record<string, unknown>;
  const merged = { ...base };
  for (const key of Object.keys(base) as (keyof LandingContent["seo"])[]) {
    const v = o[key as string];
    if (v === undefined || v === null) continue;
    merged[key] = typeof v === "string" ? v : String(v);
  }
  return merged;
}

function normalizeSocialLinks(input: unknown): SocialLinks {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const raw = input as Record<string, unknown>;
  const toVal = (v: unknown): string | undefined => {
    if (typeof v !== "string") return undefined;
    const s = v.trim();
    return s ? s : undefined;
  };
  return {
    facebook: toVal(raw.facebook),
    instagram: toVal(raw.instagram),
    linkedin: toVal(raw.linkedin),
    twitterX: toVal(raw.twitterX),
    youtube: toVal(raw.youtube),
    tiktok: toVal(raw.tiktok),
    snapchat: toVal(raw.snapchat),
  };
}

async function getStaticFallback(): Promise<LandingContent> {
  const [{ landing, seo }, { landingImages }] = await Promise.all([
    import("@/app/content/landing"),
    import("@/app/content/landing-images"),
  ]);
  const plansWithLink = landing.pricingTeaser.plans.map((p) => ({ ...p, ctaLink: "/signup" }));
  return {
    landing: {
      ...landing,
      socialProof: {
        testimonial: { ...landing.socialProof.testimonial },
        testimonials: [{ ...landing.socialProof.testimonial }],
        stats: landing.socialProof.stats.map((s: { value: string; label: string }) => ({ value: s.value, label: s.label })),
      },
      pricingTeaser: { plans: plansWithLink },
    },
    seo: {
      ...seo,
      ogImage: "",
    },
    landingImages: {
      contactAvatar: landingImages.contactAvatar,
      logoWhite: landingImages.logoWhite,
      logoLight: landingImages.logoLight,
    },
    sectionImages: {
      hero: "",
      socialProof: "",
      faq: "",
      finalCta: "",
    },
    tracking: { gtmId: "" },
    siteSettings: { ctaLabel: DEFAULT_CTA_LABEL, whatsappNumber: "", socialLinks: {} },
    sectionHeadings: {
      socialProof: { eyebrow: "الشهادات", title: "شركاء يثقون بنا" },
      pricingTeaser: { eyebrow: "الخطط", title: "اختر خطتك", highlightBadge: "الأكثر شيوعاً" },
      faq: { eyebrow: "الأسئلة", title: "أسئلة شائعة" },
    },
    footer: { brandName: "JBRSEO", copyright: "© JBRSEO. جميع الحقوق محفوظة." },
    pricingPage: {
      title: "خطة الأسعار — مدونتي",
      description: "اختر الباقة المناسبة: ستارتر، غروث، أو سكيل. ادفع 12، استلم 18 شهراً.",
      h1: "خطة الأسعار — قريباً",
      intro:
        "نعمل على تجهيز صفحة الأسعار. اختر الباقة المناسبة من البطاقات أدناه عند الإطلاق.",
    },
  } as unknown as LandingContent;
}

async function fetchLandingContent(country: SupportedCountry): Promise<LandingContent> {
  const base = await getStaticFallback();
  const [
    staticLandingRaw,
    settingsRow,
    seoOverride,
    ctaLabelOverride,
    pricingTeaserOverride,
    socialLinksOverride,
    dbPlans,
  ] = await Promise.all([
    getStaticLandingWithOverrides(),
    siteSettingsRowSafe(),
    getLandingSectionOverride("seo"),
    getLandingSectionOverride("ctaLabel"),
    getLandingSectionOverride("pricingTeaser"),
    getLandingSectionOverride("socialLinks"),
    prisma.plan.findMany({ where: { country }, orderBy: { displayOrder: "asc" } }),
  ]);

  const staticLanding = staticLandingRaw;
  const defaultCta = DEFAULT_CTA_LABEL;
  const sectionCta =
    (pricingTeaserOverride && typeof pricingTeaserOverride === "object" && "cta" in pricingTeaserOverride && typeof (pricingTeaserOverride as { cta?: string }).cta === "string"
      ? (pricingTeaserOverride as { cta: string }).cta
      : null) ?? base.landing.pricingTeaser.plans[0]?.cta ?? "ابدأ الآن";
  const plans = dbPlansToPricingTeaserPlans(dbPlans, sectionCta, country);

  const socialProofFromStatic = staticLanding.socialProof;
  const landingSocialProof = {
    testimonial: {
      name: socialProofFromStatic.testimonials[0]?.name ?? base.landing.socialProof.testimonial.name,
      role: socialProofFromStatic.testimonials[0]?.role ?? base.landing.socialProof.testimonial.role,
      quote: socialProofFromStatic.testimonials[0]?.quote ?? base.landing.socialProof.testimonial.quote,
      metric: socialProofFromStatic.testimonials[0]?.metric ?? base.landing.socialProof.testimonial.metric,
      image: socialProofFromStatic.testimonials[0]?.avatarImg,
    },
    testimonials: socialProofFromStatic.testimonials.map((t) => ({
      name: t.name,
      role: t.role,
      quote: t.quote,
      metric: t.metric,
      image: t.avatarImg,
    })),
    stats: base.landing.socialProof.stats,
  };

  const landingFaq = staticLanding.faq.faqs.map((item) => ({
    question: item.q,
    answer: item.a,
  }));

  const landingFromStatic = {
    ...base.landing,
    socialProof: landingSocialProof,
    faq: landingFaq,
    pricingTeaser: { plans },
  };

  const tracking = settingsRow
    ? { gtmId: settingsRow.gtmId ?? "" }
    : { gtmId: "" };

  const ctaLabel =
    (ctaLabelOverride && typeof ctaLabelOverride === "object" && "ctaLabel" in ctaLabelOverride && typeof (ctaLabelOverride as { ctaLabel?: string }).ctaLabel === "string"
      ? (ctaLabelOverride as { ctaLabel: string }).ctaLabel?.trim()
      : null) ?? defaultCta;

  const whatsappNumber = settingsRow?.whatsappNumber?.trim() ?? "";
  const socialLinks = normalizeSocialLinks(socialLinksOverride);

  const seo = mergeLandingSeo(base.seo, seoOverride);

  const rawPricingHeadings =
    pricingTeaserOverride &&
    typeof pricingTeaserOverride === "object" &&
    "sectionHeadings" in pricingTeaserOverride &&
    pricingTeaserOverride.sectionHeadings &&
    typeof pricingTeaserOverride.sectionHeadings === "object"
      ? (pricingTeaserOverride as { sectionHeadings: { eyebrow?: string; title?: string; highlightBadge?: string } }).sectionHeadings
      : null;
  const pricingTeaserHeadings = rawPricingHeadings
    ? {
        eyebrow: rawPricingHeadings.eyebrow ?? base.sectionHeadings.pricingTeaser?.eyebrow ?? "الخطط",
        title: rawPricingHeadings.title ?? base.sectionHeadings.pricingTeaser?.title ?? "اختر خطتك",
        highlightBadge: rawPricingHeadings.highlightBadge ?? base.sectionHeadings.pricingTeaser?.highlightBadge ?? "الأكثر شيوعاً",
      }
    : base.sectionHeadings.pricingTeaser;

  const landingImages = {
    ...base.landingImages,
    logoWhite: cl(base.landingImages.logoWhite),
    logoLight: cl(base.landingImages.logoLight),
  };

  return {
    ...base,
    staticLanding,
    seo,
    tracking,
    siteSettings: { ctaLabel, whatsappNumber, socialLinks },
    landingImages,
    sectionImages: base.sectionImages,
    sectionHeadings: {
      ...base.sectionHeadings,
      pricingTeaser: pricingTeaserHeadings,
    },
    landing: landingFromStatic,
  };
}

async function getLandingContentImpl(country: SupportedCountry): Promise<LandingContent> {
  const cached = unstable_cache(
    async () => {
      try {
        return await fetchLandingContent(country);
      } catch {
        return await getStaticFallback();
      }
    },
    ["landing-content", country],
    { revalidate: 60, tags: [`landing-${country}`] }
  );
  return cached();
}

export const getLandingContent = cache(getLandingContentImpl);
