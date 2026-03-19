import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { StaticLanding } from "@/app/content/landing/types";
import Hero from "@/app/components/landing/hero/Hero";
import WhyNowCalculator from "@/app/components/landing/Calculator/Calculator";
import HowItWorks from "@/app/components/landing/HowItWorks/HowItWorks";
import Outcomes from "@/app/components/landing/Outcomes/Outcomes";
import LandingJsonLd from "@/app/components/shared/LandingJsonLd";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";

const sectionFallback = () => <section className="min-h-[200px]" aria-hidden />;

const SocialProof = dynamic(
  () => import("@/app/components/landing/SocialProof/SocialProof"),
  { loading: sectionFallback }
);
import ModontyPricing from "@/app/components/landing/price-section/price-section";
const FAQ = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string; whatsappNumber?: string }>(
  () => import("@/app/components/landing/FAQ/FAQ"),
  { loading: sectionFallback }
);
const FinalCTA = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string; ctaLink?: string; whatsappNumber?: string }>(
  () => import("@/app/components/landing/FinalCTA/FinalCTA"),
  { loading: sectionFallback }
);

function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  return pathOrUrl.startsWith("/") ? `${base}${pathOrUrl}` : `${base}/${pathOrUrl}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return { title: "JBRSEO" };
  }
  const countryCode = getCountryCodeFromSlug(slug as "sa" | "eg");
  const content = await getLandingContent(countryCode);
  const { seo: s } = content;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jbrseo.com";
  const canonical = `${siteUrl.replace(/\/$/, "")}/${slug}`;
  const ogImageUrl = s.ogImage ? toAbsoluteUrl(s.ogImage) : "";
  const twitterImageUrl = s.twitterImage ? toAbsoluteUrl(s.twitterImage) : ogImageUrl;
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: parseInt(s.ogImageWidth, 10) || 1200, height: parseInt(s.ogImageHeight, 10) || 630, alt: s.ogTitle || s.title }]
    : undefined;
  const twitterImages = twitterImageUrl ? [twitterImageUrl] : undefined;
  return {
    title: s.title,
    description: s.description,
    alternates: {
      canonical,
      languages: { ar: canonical },
    },
    openGraph: {
      title: s.ogTitle || s.title,
      description: s.ogDescription || s.description,
      url: canonical,
      locale: s.ogLocale || "ar_SA",
      type: (s.ogType as "website") || "website",
      siteName: s.ogSiteName || "JBRSEO",
      images: ogImages,
    },
    twitter: {
      card: (s.twitterCard as "summary_large_image") || "summary_large_image",
      title: s.twitterTitle || s.title,
      description: s.twitterDescription || s.description,
      images: twitterImages,
    },
  };
}

export const revalidate = 60;

export default async function CountryHome({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ billing?: string }>;
}) {
  const { country: raw } = await params;
  const sp = await searchParams;
  const annual = sp?.billing === "annual";
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return null;
  }
  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);
  const basePath = `/${countrySlug}`;
  const ctaLink = `${basePath}/signup`;
  const pricingHrefBase = `${basePath}/pricing`;
  const signupHrefBase = ctaLink;
  const outcomesCtaLink = `${basePath}#pricing`;

  const [content, pricingSALanding, pricingEGLanding] = await Promise.all([
    getLandingContent(countryCode),
    getStaticLandingWithOverrides("SA"),
    getStaticLandingWithOverrides("EG"),
  ]);
  const baseLanding = content.staticLanding ?? (await getStaticLandingWithOverrides(countryCode));
  const si = content.sectionImages;
  const mergedStaticLanding: StaticLanding = {
    ...baseLanding,
    hero: { ...baseLanding.hero, sectionImage: si?.hero ?? "" },
    whyNow: { ...baseLanding.whyNow, sectionImage: si?.whyNow ?? baseLanding.whyNow.sectionImage ?? "" },
    howItWorks: { ...baseLanding.howItWorks, sectionImage: si?.howItWorks ?? baseLanding.howItWorks.sectionImage ?? "" },
    outcomes: { ...baseLanding.outcomes, sectionImage: si?.outcomes ?? baseLanding.outcomes.sectionImage ?? "" },
    socialProof: { ...baseLanding.socialProof, sectionImage: si?.socialProof ?? baseLanding.socialProof.sectionImage ?? "" },
    faq: { ...baseLanding.faq, sectionImage: si?.faq ?? baseLanding.faq.sectionImage ?? "" },
    finalCta: { ...baseLanding.finalCta, sectionImage: si?.finalCta ?? baseLanding.finalCta.sectionImage ?? "" },
    pricing: baseLanding.pricing,
    pricingPage: baseLanding.pricingPage,
  };
  const ctaLabel = content.siteSettings.ctaLabel || "ابدأ مجاناً — بدون بطاقة";
  const pricingSA = pricingSALanding.pricing;
  const pricingEG = pricingEGLanding.pricing;
  const initialLocale = countryCode === "EG" ? "eg" : "sa";
  const whatsappLink = getWhatsAppLink(countryCode, content.siteSettings?.whatsappNumber);

  return (
    <>
      <LandingJsonLd content={content} />
      <section className="relative">
        <Hero content={content} staticLanding={mergedStaticLanding} country={countryCode} ctaLink={ctaLink} />
      </section>
      <section className="relative">
        <WhyNowCalculator ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </section>
      <section className="relative">
        <HowItWorks staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </section>
      <section className="relative">
        <Outcomes staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={outcomesCtaLink} />
      </section>
      <section className="relative">
        <SocialProof staticLanding={mergedStaticLanding} />
      </section>
      <section className="relative">
        <div id="pricing">
          <ModontyPricing
            pricingSA={pricingSA}
            pricingEG={pricingEG}
            initialLocale={initialLocale}
            annual={annual}
            basePath={basePath}
            pricingHrefBase={pricingHrefBase}
            signupHrefBase={signupHrefBase}
            whatsappLink={whatsappLink}
          />
        </div>
      </section>
      <section className="relative">
        <FAQ staticLanding={mergedStaticLanding} country={countryCode} ctaLabel="تحدث معنا على واتساب" whatsappNumber={content.siteSettings?.whatsappNumber} />
      </section>
      <section className="relative">
        <FinalCTA staticLanding={mergedStaticLanding} country={countryCode} ctaLabel={ctaLabel} ctaLink={ctaLink} whatsappNumber={content.siteSettings?.whatsappNumber} />
      </section>
    </>
  );
}
