import type { Metadata } from "next";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { FloatingContact } from "@/app/components/shared/FloatingContact";
import { PricingPageShell } from "@/app/components/pricing/PricingPageShell";
import { PricingPageJsonLd } from "@/app/components/shared/PricingPageJsonLd";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/constants";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getLandingContent } from "@/lib/getLandingContent";
import { getAllPlans } from "@/app/actions/pricing";
import { getMeta } from "@/app/actions/pricing-meta";
import { buildPricingContentFromDb } from "@/lib/admin-pricing-adapter";
import {
  DEFAULT_PUBLIC_SITE_ORIGIN,
  PUBLIC_INDEX_FOLLOW_ROBOTS,
} from "@/lib/seo-meta";
import { getWhatsAppLink } from "@/lib/site-links";

const SA_PRICING_TITLE_ABSOLUTE =
  "أسعار خدمة السيو العربي — اختر خطتك وابدأ | مدونتي";
const SA_PRICING_DESCRIPTION =
  "اكتشف خطط أسعار مدونتي لخدمة السيو بالعربي. مقالات تتصدر جوجل، صفحة نشاطك في محركات البحث، وعملاء جدد كل شهر — اختر خطتك وابدأ مجاناً.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return { title: "الأسعار — JBRSEO" };
  }
  // ROUND-1: content (incl. pricingPage copy) is unified — no country param needed.
  // Per-country currency/whatsapp is handled in the page component below.
  const landing = await getStaticLandingWithOverrides();
  const { title, description } = landing.pricingPage;
  const siteBase = DEFAULT_PUBLIC_SITE_ORIGIN;
  const canonical = `${siteBase}/${slug}/pricing`;
  const isSa = slug === "sa";
  const docTitle = isSa ? { absolute: SA_PRICING_TITLE_ABSOLUTE } : title;
  const docDescription = isSa ? SA_PRICING_DESCRIPTION : description;
  const ogImages = [
    { url: DEFAULT_OG_IMAGE_URL, width: 1200, height: 630, alt: isSa ? SA_PRICING_TITLE_ABSOLUTE : title },
  ];
  const hreflang = {
    "ar-SA": `${siteBase}/sa/pricing`,
    "ar-EG": `${siteBase}/eg/pricing`,
    "x-default": `${siteBase}/sa/pricing`,
  };

  return {
    title: docTitle,
    description: docDescription,
    alternates: { canonical, languages: hreflang },
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    openGraph: {
      title: isSa ? SA_PRICING_TITLE_ABSOLUTE : title,
      description: docDescription,
      url: canonical,
      type: "website",
      locale: "ar_SA",
      siteName: "JBRSEO",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: isSa ? SA_PRICING_TITLE_ABSOLUTE : title,
      description: docDescription,
      images: [DEFAULT_OG_IMAGE_URL],
    },
  };
}

export const revalidate = 300;

export default async function CountryPricingPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ plan?: string; country?: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return null;
  }
  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);
  const sp = await searchParams;
  const { plan } = sp;
  const previewSlug = sp?.country?.toLowerCase();
  const previewQuery = previewSlug === "sa" || previewSlug === "eg" ? `?country=${previewSlug}` : "";

  // Single source of truth: Plan model (per-country rows) + PriceSectionMeta (per-country meta).
  // The legacy `landing.pricing` JSON blob is no longer used.
  const [landing, content, dbPlans, meta] = await Promise.all([
    getStaticLandingWithOverrides(),
    getLandingContent(countryCode),
    getAllPlans(countryCode),
    getMeta(countryCode),
  ]);
  const pricing = buildPricingContentFromDb(dbPlans, meta);
  const whatsappHref = getWhatsAppLink(countryCode, content.siteSettings?.whatsappNumber);

  return (
    <>
      <LandingHeader
        content={content}
        staticLanding={landing}
        country={countryCode}
        basePath={`/${countrySlug}`}
        pricingHref={`/${countrySlug}/signup${previewQuery}`}
        navPrimaryCtaLabel={content.siteSettings?.ctaLabel?.trim() || "ابدأ مجاناً — بدون بطاقة"}
        whatsappNumber={content.siteSettings?.whatsappNumber}
      />
      <PricingPageJsonLd
        countrySlug={countrySlug}
        countryCode={countryCode}
        plans={pricing.PLANS}
        pricingPageTitle={landing.pricingPage.title}
      />
      <PricingPageShell
        pricing={pricing}
        pricingPage={landing.pricingPage}
        faq={landing.faq}
        country={countryCode}
        highlightPlanId={plan ?? null}
        signupHrefBase={`/${countrySlug}/signup${previewQuery}`}
        whatsappHref={whatsappHref}
      />
      <FloatingContact whatsappNumber={content.siteSettings?.whatsappNumber} />
    </>
  );
}
