import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { cl } from "@/helpers/cloudinary";
import type { LandingContent, SupportedCountry } from "./landing-content.types";
import { prisma } from "./prisma";
import { staticPlansToPricingPlans } from "./static-plans-to-content";
import { getLandingSectionOverride } from "./landing-sections";

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
    siteSettings: { ctaLabel: "ابدأ مجاناً — بدون بطاقة", whatsappNumber: "" },
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
  const [staticLandingRaw, settingsRow, seoOverride, ctaLabelOverride, pricingTeaserOverride] = await Promise.all([
    getStaticLandingWithOverrides(country),
    prisma.siteSettings.findFirst(),
    getLandingSectionOverride(country, "seo"),
    getLandingSectionOverride(country, "ctaLabel"),
    getLandingSectionOverride(country, "pricingTeaser"),
  ]);

  const staticLanding = staticLandingRaw;
  const defaultCta = "ابدأ مجاناً — بدون بطاقة";
  const sectionCta =
    (pricingTeaserOverride && typeof pricingTeaserOverride === "object" && "cta" in pricingTeaserOverride && typeof (pricingTeaserOverride as { cta?: string }).cta === "string"
      ? (pricingTeaserOverride as { cta: string }).cta
      : null) ?? base.landing.pricingTeaser.plans[0]?.cta ?? "ابدأ الآن";
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

  const tracking = settingsRow
    ? { gtmId: settingsRow.gtmId ?? "", hotjarId: settingsRow.hotjarId ?? "", fbPixelId: settingsRow.fbPixelId ?? "" }
    : { gtmId: "", hotjarId: "", fbPixelId: "" };

  const ctaLabel =
    (ctaLabelOverride && typeof ctaLabelOverride === "object" && "ctaLabel" in ctaLabelOverride && typeof (ctaLabelOverride as { ctaLabel?: string }).ctaLabel === "string"
      ? (ctaLabelOverride as { ctaLabel: string }).ctaLabel?.trim()
      : null) ?? defaultCta;

  const whatsappNumber = settingsRow?.whatsappNumber?.trim() ?? "";

  const seo =
    seoOverride && typeof seoOverride === "object" && !Array.isArray(seoOverride)
      ? { ...base.seo, ...(seoOverride as Record<string, string>) }
      : base.seo;

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
    seo: seo as LandingContent["seo"],
    tracking,
    siteSettings: { ctaLabel, whatsappNumber },
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
