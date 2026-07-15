import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingJsonLd } from "@/app/components/landing/LandingJsonLd";
import { Landing } from "@/app/components/landing/Landing";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getLandingContent } from "@/lib/getLandingContent";
import { getAllPlans } from "@/app/actions/pricing";
import { getMeta } from "@/app/actions/pricing-meta";
import { getModontyTrustBundle } from "@/app/actions/modonty-client-logos";
import { getModontyImpactStats, getCaseStudiesStats } from "@/lib/analytics/ga4";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getWhatsAppLink } from "@/lib/site-links";
import { buildLandingOgMetadata } from "@/lib/landing-open-graph";
import {
  DEFAULT_PUBLIC_SITE_ORIGIN,
  PUBLIC_INDEX_FOLLOW_ROBOTS,
  resolveCanonicalForMetadata,
  resolveSiteOriginFromSeoCanonical,
} from "@/lib/seo-meta";

const HOME_SA_DESCRIPTION_FALLBACK =
  "اشتراك محتوى سيو شهري للسوق السعودي والعربي — نكتب وننشر ونحسّن للبحث والذكاء الاصطناعي. من 110 ريال شهرياً.";

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
  const [content, trustBundle] = await Promise.all([
    getLandingContent(countryCode),
    getModontyTrustBundle(),
  ]);
  // Live-interpolate {clientCount} in the SEO description so the count grows
  // automatically as Modonty gains clients — no admin edit needed.
  const s = {
    ...content.seo,
    description: (content.seo.description ?? "").replace(/\{clientCount\}/g, String(trustBundle.total)),
  };
  const siteBase = resolveSiteOriginFromSeoCanonical(s.canonical, DEFAULT_PUBLIC_SITE_ORIGIN);
  const fallbackCanonical = `${siteBase}/${slug}`;
  const canonical = resolveCanonicalForMetadata(s.canonical, fallbackCanonical);
  const baseMeta = buildLandingOgMetadata({
    seo: s,
    canonical,
    siteBase,
    documentTitle: s.title,
  });
  const hreflang = {
    "ar-SA": `${siteBase}/sa`,
    "ar-EG": `${siteBase}/eg`,
    "x-default": `${siteBase}/sa`,
  };
  const merged: Metadata = {
    ...baseMeta,
    alternates: { canonical, languages: hreflang },
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
  };
  if (slug !== "sa") {
    return merged;
  }
  const saDescription = s.description?.trim() || HOME_SA_DESCRIPTION_FALLBACK;
  return {
    ...merged,
    description: saDescription,
    openGraph: merged.openGraph
      ? { ...merged.openGraph, description: saDescription }
      : merged.openGraph,
    twitter: merged.twitter
      ? { ...merged.twitter, description: saDescription }
      : merged.twitter,
  };
}

export const revalidate = 60;

// Pre-render both country landings at build (SSG + ISR every 60s). No request-time
// APIs are read — the billing query param is handled client-side in PricingSection —
// so the page is fully static, served from cache; TTFB/LCP no longer pay for the
// per-request data fetches (DB + GA4).
export function generateStaticParams() {
  return [{ country: "sa" }, { country: "eg" }];
}

export default async function CountryHome({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);

  const [content, staticLanding, plans, meta, trustBundle, modontyImpact, caseStats] = await Promise.all([
    getLandingContent(countryCode),
    getStaticLandingWithOverrides(),
    getAllPlans(countryCode),
    getMeta(countryCode),
    getModontyTrustBundle(),
    getModontyImpactStats(),
    getCaseStudiesStats(),
  ]);
  const socialLinks = content.siteSettings?.socialLinks ?? {};

  // Interpolate {clientCount} across hero copy so any admin-edited string
  // referencing the count auto-updates as Modonty gains clients.
  const interpolatedStaticLanding = {
    ...staticLanding,
    hero: {
      ...staticLanding.hero,
      proof: (staticLanding.hero.proof ?? "").replace(/\{clientCount\}/g, String(trustBundle.total)),
    },
  };

  const whatsappLink = getWhatsAppLink(countryCode, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || DEFAULT_CTA_LABEL;

  return (
    <>
      <Landing
        countrySlug={countrySlug}
        staticLanding={interpolatedStaticLanding}
        plans={plans}
        announcement={meta?.announcement ?? ""}
        whatsappLink={whatsappLink}
        ctaLabel={ctaLabel}
        trustBundle={trustBundle}
        modontyImpact={modontyImpact}
        caseStats={caseStats}
      />
      <LandingJsonLd
        countrySlug={countrySlug}
        siteOrigin={DEFAULT_PUBLIC_SITE_ORIGIN}
        faqs={staticLanding.faq?.faqs ?? []}
        socialLinks={socialLinks}
      />
    </>
  );
}
