import type { Metadata } from "next";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { PricingPageShell } from "@/app/components/pricing/PricingPageShell";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  const canonical = `${siteUrl}/${slug}/pricing`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    twitter: {
      title,
      description,
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
