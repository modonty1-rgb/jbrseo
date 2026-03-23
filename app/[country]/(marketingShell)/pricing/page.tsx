import type { Metadata } from "next";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { PricingPageShell } from "@/app/components/pricing/PricingPageShell";
import { DEFAULT_OG_IMAGE_URL } from "@/lib/constants";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";

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
  const siteBase =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "").trim() || "https://www.jbrseo.com";
  const canonical = `${siteBase}/${slug}/pricing`;
  const ogImages = [{ url: DEFAULT_OG_IMAGE_URL, width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    alternates: { canonical, languages: { ar: canonical } },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "ar_SA",
      siteName: "JBRSEO",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
    <PricingPageShell
      pricing={landing.pricing}
      pricingPage={landing.pricingPage}
      faq={landing.faq}
      country={countryCode}
      highlightPlanId={plan ?? null}
      signupHrefBase={`/${countrySlug}/signup${previewQuery}`}
      whatsappHref={whatsappHref}
    />
  );
}
