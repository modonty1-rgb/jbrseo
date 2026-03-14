import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { StaticLanding } from "@/app/content/landing/types";
import Hero from "@/app/components/landing/hero/Hero";
import WhyNow from "@/app/components/landing/WhyNow/WhyNow";
import HowItWorks from "@/app/components/landing/HowItWorks/HowItWorks";
import Outcomes from "@/app/components/landing/Outcomes/Outcomes";
import LandingJsonLd from "@/app/components/shared/LandingJsonLd";
import { SectionReveal } from "@/app/components/shared/SectionReveal";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getLandingContent } from "@/lib/getLandingContent";

const sectionFallback = () => <section className="min-h-[200px]" aria-hidden />;

const SocialProof = dynamic(
  () => import("@/app/components/landing/SocialProof/SocialProof"),
  { loading: sectionFallback }
);
const ModontyPricing = dynamic(
  () => import("@/app/components/landing/price-section/price-section"),
  { loading: sectionFallback }
);
const FAQ = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string }>(
  () => import("@/app/components/landing/FAQ/FAQ"),
  { loading: sectionFallback }
);
const FinalCTA = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string; ctaLink?: string }>(
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  const canonical = `${siteUrl}/${slug}`;
  const ogImageUrl = s.ogImage ? toAbsoluteUrl(s.ogImage) : "";
  const twitterImageUrl = s.twitterImage ? toAbsoluteUrl(s.twitterImage) : ogImageUrl;
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: parseInt(s.ogImageWidth, 10) || 1200, height: parseInt(s.ogImageHeight, 10) || 630, alt: s.ogTitle || s.title }]
    : undefined;
  const twitterImages = twitterImageUrl ? [twitterImageUrl] : undefined;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical },
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
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
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
  const showSectionCounter = content.siteSettings.showSectionCounter;
  const ctaLabel = content.siteSettings.ctaLabel || "ابدأ مجاناً — بدون بطاقة";
  const pricingSA = pricingSALanding.pricing;
  const pricingEG = pricingEGLanding.pricing;
  const initialLocale = countryCode === "EG" ? "eg" : "sa";

  return (
    <>
      <LandingJsonLd content={content} />
      <SectionReveal variant="none" sectionNumber={1} showSectionCounter={showSectionCounter}>
        <Hero content={content} staticLanding={mergedStaticLanding} country={countryCode} ctaLink={ctaLink} />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={2} showSectionCounter={showSectionCounter}>
        <WhyNow staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={3} showSectionCounter={showSectionCounter}>
        <HowItWorks staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={4} showSectionCounter={showSectionCounter}>
        <Outcomes staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={outcomesCtaLink} />
      </SectionReveal>
      <SectionReveal variant="fade-up" sectionNumber={5} showSectionCounter={showSectionCounter}>
        <SocialProof staticLanding={mergedStaticLanding} />
      </SectionReveal>
      <SectionReveal variant="fade-up" delay={80} sectionNumber={6} showSectionCounter={showSectionCounter}>
        <div id="pricing">
          <ModontyPricing
            pricingSA={pricingSA}
            pricingEG={pricingEG}
            initialLocale={initialLocale}
            variant="homepage"
            pricingHrefBase={pricingHrefBase}
            signupHrefBase={signupHrefBase}
          />
        </div>
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={7} showSectionCounter={showSectionCounter}>
        <FAQ staticLanding={mergedStaticLanding} country={countryCode} ctaLabel={ctaLabel} />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={8} showSectionCounter={showSectionCounter}>
        <FinalCTA staticLanding={mergedStaticLanding} country={countryCode} ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </SectionReveal>
    </>
  );
}
