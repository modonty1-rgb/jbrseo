import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { StaticLanding } from "@/app/content/landing/types";
import Hero from "@/app/components/landing/hero/Hero";
import { HeroTrustBar } from "@/app/components/landing/hero/HeroTrustBar";
import WhyNowCalculator from "@/app/components/landing/Calculator/Calculator";
import HowItWorks from "@/app/components/landing/HowItWorks/HowItWorks";
import Outcomes from "@/app/components/landing/Outcomes/Outcomes";
import LandingJsonLd from "@/app/components/shared/LandingJsonLd";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { isAnnualFromBillingParam } from "@/lib/billing-search-param";
import { getLandingContent } from "@/lib/getLandingContent";
import { buildLandingOgMetadata } from "@/lib/landing-open-graph";
import { resolveCanonicalForMetadata, resolveSiteOriginFromSeoCanonical } from "@/lib/seo-meta";
import { getWhatsAppLink } from "@/lib/site-links";

const sectionFallback = () => <section className="min-h-[200px]" aria-hidden />;

const SocialProof = dynamic(
  () => import("@/app/components/landing/SocialProof/SocialProof"),
  { loading: sectionFallback }
);
const ModontyPricing = dynamic(
  () => import("@/app/components/landing/price-section/price-section"),
  { loading: sectionFallback }
);
const FAQ = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string; whatsappNumber?: string }>(
  () => import("@/app/components/landing/FAQ/FAQ"),
  { loading: sectionFallback }
);
const FinalCTA = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string; ctaLink?: string; whatsappNumber?: string }>(
  () => import("@/app/components/landing/FinalCTA/FinalCTA"),
  { loading: sectionFallback }
);

const HOME_SA_DESCRIPTION =
  "مدونتي — منصة المحتوى العربي. مقالات تتصدر جوجل، صفحة شركتك في الشبكة، وقاعدة Leads مصنّفة — بدون كتابة حرف واحد.";

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
  const envSiteBase =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "").trim() || "https://www.jbrseo.com";
  const siteBase = resolveSiteOriginFromSeoCanonical(s.canonical, envSiteBase);
  const fallbackCanonical = `${siteBase}/${slug}`;
  const canonical = resolveCanonicalForMetadata(s.canonical, fallbackCanonical);
  const baseMeta = buildLandingOgMetadata({
    seo: s,
    canonical,
    siteBase,
    documentTitle: s.title,
  });
  if (slug !== "sa") {
    return baseMeta;
  }
  return {
    ...baseMeta,
    description: HOME_SA_DESCRIPTION,
    openGraph: baseMeta.openGraph
      ? { ...baseMeta.openGraph, description: HOME_SA_DESCRIPTION }
      : baseMeta.openGraph,
    twitter: baseMeta.twitter
      ? { ...baseMeta.twitter, description: HOME_SA_DESCRIPTION }
      : baseMeta.twitter,
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
  const annual = isAnnualFromBillingParam(sp?.billing);
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return null;
  }
  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);
  const basePath = `/${countrySlug}`;
  const ctaLink = `${basePath}/signup`;
  const pricingCtaLink = `${basePath}#pricing`;
  const pricingCtaLabel = "شوف الأسعار والخطة المناسبة";
  const pricingHrefBase = `${basePath}/pricing`;
  const signupHrefBase = ctaLink;
  const outcomesCtaLink = pricingCtaLink;

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
        <Hero content={content} staticLanding={mergedStaticLanding} country={countryCode} ctaLink={pricingCtaLink} ctaLabel={pricingCtaLabel} />
        <HeroTrustBar hero={mergedStaticLanding.hero} />
      </section>
      <section className="relative">
        <HowItWorks staticLanding={mergedStaticLanding} ctaLabel={pricingCtaLabel} ctaLink={pricingCtaLink} />
      </section>
      <section className="relative">
        <WhyNowCalculator ctaLabel={pricingCtaLabel} ctaLink={pricingCtaLink} />
      </section>
      <section className="relative">
        <Outcomes staticLanding={mergedStaticLanding} ctaLabel={pricingCtaLabel} ctaLink={outcomesCtaLink} />
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
