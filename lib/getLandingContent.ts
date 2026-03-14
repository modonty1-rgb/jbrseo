import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { cl } from "@/helpers/cloudinary";
import type { LandingContent, SupportedCountry } from "./landing-content.types";
import type { SiteSettingsJson } from "./site-settings.types";
import { prisma } from "./prisma";
import { staticPlansToPricingPlans } from "./static-plans-to-content";

async function getStaticFallback(): Promise<LandingContent> {
  const [{ landing, seo }, { landingImages }, { footerTexts }] = await Promise.all([
    import("@/app/content/landing"),
    import("@/app/content/landing-images"),
    import("@/lib/texts"),
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
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      ogImageWidth: "1200",
      ogImageHeight: "630",
      ogType: "website",
      ogSiteName: "JBRSEO",
      twitterCard: "summary_large_image",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
    },
    landingImages: {
      contactAvatar: landingImages.contactAvatar,
      logoWhite: landingImages.logoWhite,
      logoLight: landingImages.logoLight,
    },
    sectionImages: {
      hero: "",
      whyNow: "",
      howItWorks: "",
      outcomes: "",
      socialProof: "",
      faq: "",
      finalCta: "",
    },
    tracking: { gtmId: "", hotjarId: "", fbPixelId: "" },
    siteSettings: { showSectionCounter: false, ctaLabel: "ابدأ مجاناً — بدون بطاقة" },
    sectionHeadings: {
      whyNow: { eyebrow: "لماذا الآن", title: "كل شهر تأخير له ثمن" },
      howItWorks: { eyebrow: "الطريقة", title: "كيف نعمل" },
      outcomes: { eyebrow: "النتائج", title: "ما الذي تحصل عليه" },
      socialProof: { eyebrow: "الشهادات", title: "شركاء يثقون بنا" },
      pricingTeaser: { eyebrow: "الخطط", title: "اختر خطتك", highlightBadge: "الأكثر شيوعاً" },
      faq: { eyebrow: "الأسئلة", title: "أسئلة شائعة" },
    },
    footer: { brandName: footerTexts.brandName, copyright: footerTexts.copyright },
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
  const staticLandingRaw = await getStaticLandingWithOverrides(country);
  const [settingsRow, globalRow] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { country } }),
    prisma.siteSettings.findUnique({ where: { country: "GLOBAL" } }),
  ]);
  const settings: SiteSettingsJson | null = settingsRow
    ? (settingsRow as unknown as SiteSettingsJson)
    : null;
  const globalImages = (globalRow as unknown as SiteSettingsJson | null)?.images;
  const globalLogoWhite = globalImages?.logoWhite?.trim() ?? "";
  const globalLogoLight = globalImages?.logoLight?.trim() ?? "";

  const site = settings?.site;
  const totalSeats = site?.totalSeats ?? staticLandingRaw.header.seats.total;
  const takenSeats = site?.takenSeats ?? staticLandingRaw.header.seats.taken;
  const seats = { total: totalSeats, taken: takenSeats };
  const staticLanding: typeof staticLandingRaw = {
    ...staticLandingRaw,
    header: { ...staticLandingRaw.header, seats },
    finalCta: { ...staticLandingRaw.finalCta, seats },
  };

  const sectionCta = settings?.pricingTeaser.cta || base.landing.pricingTeaser.plans[0]?.cta || "ابدأ الآن";
  const plans = staticPlansToPricingPlans(staticLanding.pricing.PLANS, sectionCta, country);

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

  if (!settings) {
    const landingImages = {
      ...base.landingImages,
      logoWhite: globalLogoWhite || base.landingImages.logoWhite,
      logoLight: globalLogoLight || base.landingImages.logoLight,
    };
    return {
      ...base,
      staticLanding,
      landingImages,
      sectionImages: base.sectionImages,
      landing: landingFromStatic,
    };
  }

  const landingImages: LandingContent["landingImages"] = {
    ...settings.images,
    logoWhite: cl(globalLogoWhite || settings.images.logoWhite || base.landingImages.logoWhite),
    logoLight: cl(globalLogoLight || settings.images.logoLight || base.landingImages.logoLight),
    contactAvatar: settings.images.contactAvatar ? cl(settings.images.contactAvatar) : base.landingImages.contactAvatar,
  };
  const sectionImages: NonNullable<LandingContent["sectionImages"]> = {
    hero: cl((settings.images.sectionHero ?? "").trim()),
    whyNow: cl((settings.images.sectionWhyNow ?? "").trim()),
    howItWorks: cl((settings.images.sectionHowItWorks ?? "").trim()),
    outcomes: cl((settings.images.sectionOutcomes ?? "").trim()),
    socialProof: cl((settings.images.sectionSocialProof ?? "").trim()),
    faq: cl((settings.images.sectionFaq ?? "").trim()),
    finalCta: cl((settings.images.sectionFinalCta ?? "").trim()),
  };
  const sectionImageAlts: NonNullable<LandingContent["sectionImageAlts"]> = {
    hero: (settings.images.sectionHeroAlt ?? "").trim(),
    whyNow: (settings.images.sectionWhyNowAlt ?? "").trim(),
    howItWorks: (settings.images.sectionHowItWorksAlt ?? "").trim(),
    outcomes: (settings.images.sectionOutcomesAlt ?? "").trim(),
    socialProof: (settings.images.sectionSocialProofAlt ?? "").trim(),
    faq: (settings.images.sectionFaqAlt ?? "").trim(),
    finalCta: (settings.images.sectionFinalCtaAlt ?? "").trim(),
  };
  const defaultCta = "ابدأ مجاناً — بدون بطاقة";
  return {
    ...base,
    staticLanding,
    seo: settings.seo as LandingContent["seo"],
    tracking: settings.tracking,
    siteSettings: {
      showSectionCounter: settings.site.showSectionCounter,
      ctaLabel: (settings.site as { ctaLabel?: string }).ctaLabel?.trim() || defaultCta,
    },
    landingImages,
    sectionImages,
    sectionImageAlts,
    sectionHeadings: {
      ...base.sectionHeadings,
      pricingTeaser: settings.pricingTeaser.sectionHeadings,
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
