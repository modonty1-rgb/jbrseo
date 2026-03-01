import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { PRICING_CTA_LINK } from "./constants";
import type { LandingContent, SupportedCountry } from "./landing-content.types";

function safeJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function buildContentFromRows(
  textRows: { section: string; key: string; value: string }[],
  imageRows: { key: string; url: string }[],
  pricingPlanRows?: {
    name: string;
    forWho: string;
    price: string | null;
    annualPrice: string | null;
    badge: string | null;
    highlight: boolean;
    features: string[];
  }[]
): LandingContent {
  const by = (section: string, key: string) =>
    textRows.find((r) => r.section === section && r.key === key)?.value ?? "";
  const img = (key: string) => imageRows.find((r) => r.key === key)?.url ?? "";

  const sectionHeadings: LandingContent["sectionHeadings"] = {};
  const sh = (section: string) => {
    const eyebrow = textRows.find(
      (r) => r.section === "sectionHeadings" && r.key === `${section}_eyebrow`
    )?.value;
    const title = textRows.find(
      (r) => r.section === "sectionHeadings" && r.key === `${section}_title`
    )?.value;
    const highlightBadge =
      section === "pricingTeaser"
        ? textRows.find(
            (r) =>
              r.section === "sectionHeadings" && r.key === `${section}_highlightBadge`
          )?.value
        : undefined;
    if (eyebrow || title) {
      (sectionHeadings as Record<string, unknown>)[section] = {
        eyebrow: eyebrow ?? "",
        title: title ?? "",
        ...(highlightBadge && { highlightBadge }),
      };
    }
  };
  ["whyNow", "howItWorks", "outcomes", "socialProof", "pricingTeaser", "faq"].forEach(sh);

  const heroCta = by("hero", "cta");
  const sectionCta = by("pricingTeaser", "cta").trim() || heroCta;
  const plansJson = by("pricingTeaser", "plans");
  const plansRaw = plansJson
    ? safeJson<LandingContent["landing"]["pricingTeaser"]["plans"]>(plansJson, [])
    : [];

  const hasPricingPlanRows = (pricingPlanRows?.length ?? 0) > 0;
  let plans = hasPricingPlanRows
    ? pricingPlanRows!.map((p) => ({
        name: p.name,
        forWho: p.forWho,
        cta: sectionCta,
        ctaLink: PRICING_CTA_LINK,
        ...(p.price && { price: p.price }),
        ...(p.annualPrice && { annualPrice: p.annualPrice }),
        ...(p.badge && { badge: p.badge }),
        ...(p.highlight && { highlight: true }),
        features: Array.isArray(p.features) ? p.features : [],
      }))
    : plansRaw.map((p) => ({
        ...p,
        cta: sectionCta,
        ctaLink: PRICING_CTA_LINK,
      }));

  const firstPlanName = plans[0]?.name?.toLowerCase() ?? "";
  const hasFree = firstPlanName === "free" || firstPlanName === "مجاني";
  if (plans.length === 3 && !hasFree) {
    const defaultFree = {
      name: "Free",
      forWho: "ابدأ مجاناً وتجرب المنصة بدون التزام.",
      cta: sectionCta,
      ctaLink: PRICING_CTA_LINK,
      price: "مجاناً",
      features: [] as string[],
    };
    plans = [defaultFree, ...plans];
  }

  const testimonialJson = by("socialProof", "testimonial");
  const testimonialParsed = testimonialJson
    ? safeJson<unknown>(testimonialJson, { name: "", role: "", quote: "", metric: "" })
    : { name: "", role: "", quote: "", metric: "" };
  const testimonialsArray = Array.isArray(testimonialParsed)
    ? (testimonialParsed as any[]).map((t) => ({
        name: t?.name ?? "",
        role: t?.role ?? "",
        quote: t?.quote ?? "",
        metric: t?.metric ?? "",
        image: (t?.image as string)?.trim() || undefined,
      }))
    : [
        {
          name: (testimonialParsed as any)?.name ?? "",
          role: (testimonialParsed as any)?.role ?? "",
          quote: (testimonialParsed as any)?.quote ?? "",
          metric: (testimonialParsed as any)?.metric ?? "",
          image: ((testimonialParsed as any)?.image as string)?.trim() || undefined,
        },
      ];
  const testimonialObject =
    testimonialsArray[0] ?? { name: "", role: "", quote: "", metric: "" };

  return {
    landing: {
      hero: {
        h1: by("hero", "h1"),
        subheadline: by("hero", "subheadline"),
        benefits: safeJson(by("hero", "benefits"), []),
        proof: by("hero", "proof"),
        cta: heroCta,
      },
      whyNow: { lines: safeJson(by("whyNow", "lines"), []) },
      howItWorks: { steps: safeJson(by("howItWorks", "steps"), []) },
      outcomes: safeJson(by("outcomes", "items"), []),
      socialProof: {
        testimonial: testimonialObject,
        testimonials: testimonialsArray,
        stats: safeJson(by("socialProof", "stats"), []),
      },
      pricingTeaser: { plans },
      faq: safeJson(by("faq", "items"), []),
      finalCta: {
        headline: by("finalCta", "headline"),
        cta: heroCta,
      },
    },
    seo: {
      title: by("seo", "title"),
      description: by("seo", "description"),
      canonical: by("seo", "canonical"),
      ogLocale: by("seo", "ogLocale"),
      ogTitle: by("seo", "ogTitle"),
      ogDescription: by("seo", "ogDescription"),
      ogImage: by("seo", "ogImage"),
      ogImageWidth: by("seo", "ogImageWidth"),
      ogImageHeight: by("seo", "ogImageHeight"),
      ogType: by("seo", "ogType"),
      ogSiteName: by("seo", "ogSiteName"),
      twitterCard: by("seo", "twitterCard"),
      twitterTitle: by("seo", "twitterTitle"),
      twitterDescription: by("seo", "twitterDescription"),
      twitterImage: by("seo", "twitterImage"),
    },
    landingImages: {
      contactAvatar: img("contactAvatar"),
      logoWhite: img("logoWhite"),
      logoLight: img("logoLight"),
    },
    tracking: {
      gtmId: by("tracking", "gtmId"),
      hotjarId: by("tracking", "hotjarId"),
      fbPixelId: by("tracking", "fbPixelId"),
    },
    siteSettings: {
      showSectionCounter: by("settings", "showSectionCounter") === "true",
    },
    sectionHeadings,
    footer: {
      brandName: by("footer", "brandName"),
      copyright: by("footer", "copyright"),
    },
    pricingPage: {
      title: by("pricingPage", "title"),
      description: by("pricingPage", "description"),
      h1: by("pricingPage", "h1"),
      intro: by("pricingPage", "intro"),
    },
  };
}

async function fetchLandingContent(country: SupportedCountry): Promise<LandingContent> {
  const [textRows, imageRows, pricingPlanRows] = await Promise.all([
    prisma.landingText.findMany({ where: { country }, select: { section: true, key: true, value: true } }),
    prisma.landingImage.findMany({ where: { country }, select: { key: true, url: true } }),
    prisma.pricingPlan.findMany({
      where: { country },
      orderBy: { sortOrder: "asc" },
      select: {
        name: true,
        forWho: true,
        price: true,
        annualPrice: true,
        badge: true,
        highlight: true,
        features: true,
      },
    }),
  ]);
  if (textRows.length === 0 && imageRows.length === 0) throw new Error("No content");
  return buildContentFromRows(textRows, imageRows, pricingPlanRows);
}

async function getStaticFallback(): Promise<LandingContent> {
  const [{ landing, seo }, { landingImages }, { footerTexts }] = await Promise.all([
    import("@/app/content/landing"),
    import("@/app/content/landing-images"),
    import("@/app/components/texts"),
  ]);
  const plansWithLink = landing.pricingTeaser.plans.map((p) => ({ ...p, ctaLink: PRICING_CTA_LINK }));
  return {
    landing: {
      ...landing,
      socialProof: {
        testimonial: { ...landing.socialProof.testimonial },
        testimonials: [{ ...landing.socialProof.testimonial }],
        stats: landing.socialProof.stats.map((s) => ({ value: s.value, label: s.label })),
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
    tracking: { gtmId: "", hotjarId: "", fbPixelId: "" },
    siteSettings: { showSectionCounter: false },
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

export async function getLandingContent(country: SupportedCountry): Promise<LandingContent> {
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
