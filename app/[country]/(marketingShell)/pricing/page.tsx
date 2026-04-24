import type { Metadata } from "next";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { PricingPageShell } from "@/app/components/pricing/PricingPageShell";
import { PricingPageJsonLd } from "@/app/components/shared/PricingPageJsonLd";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/constants";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getLandingContent } from "@/lib/getLandingContent";
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
  const countryCode = getCountryCodeFromSlug(slug as "sa" | "eg");
  const landing = await getStaticLandingWithOverrides(countryCode);
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
  const [landing, content] = await Promise.all([
    getStaticLandingWithOverrides(countryCode),
    getLandingContent(countryCode),
  ]);
  const whatsappHref = getWhatsAppLink(countryCode, content.siteSettings?.whatsappNumber);

  return (
    <>
      <PricingPageJsonLd countrySlug={countrySlug} countryCode={countryCode} landing={landing} />
      <PricingPageShell
        pricing={landing.pricing}
        pricingPage={landing.pricingPage}
        faq={landing.faq}
        country={countryCode}
        highlightPlanId={plan ?? null}
        signupHrefBase={`/${countrySlug}/signup${previewQuery}`}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
