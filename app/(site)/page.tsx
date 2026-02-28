import type { Metadata } from "next";
import { headers } from "next/headers";
import Hero from "@/app/components/landing/Hero";
import WhyNow from "@/app/components/landing/WhyNow";
import HowItWorks from "@/app/components/landing/HowItWorks";
import Outcomes from "@/app/components/landing/Outcomes";
import SocialProof from "@/app/components/landing/SocialProof";
import PricingTeaser from "@/app/components/landing/PricingTeaser";
import FAQ from "@/app/components/landing/FAQ";
import FinalCTA from "@/app/components/landing/FinalCTA";
import LandingJsonLd from "@/app/components/landing/LandingJsonLd";
import { SectionReveal } from "@/app/components/landing/SectionReveal";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";

function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  return pathOrUrl.startsWith("/") ? `${base}${pathOrUrl}` : `${base}/${pathOrUrl}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);
  const { seo: s } = content;
  const ogImageUrl = s.ogImage ? toAbsoluteUrl(s.ogImage) : "";
  const twitterImageUrl = s.twitterImage ? toAbsoluteUrl(s.twitterImage) : ogImageUrl;
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: parseInt(s.ogImageWidth, 10) || 1200, height: parseInt(s.ogImageHeight, 10) || 630, alt: s.ogTitle || s.title }]
    : undefined;
  const twitterImages = twitterImageUrl ? [twitterImageUrl] : undefined;
  return {
    title: s.title,
    description: s.description,
    alternates: s.canonical ? { canonical: s.canonical } : undefined,
    openGraph: {
      title: s.ogTitle || s.title,
      description: s.ogDescription || s.description,
      url: s.canonical,
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

export default async function Home() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);
  return (
    <>
      <LandingJsonLd content={content} />
      <SectionReveal>
        <Hero content={content} />
      </SectionReveal>
      <SectionReveal>
        <WhyNow content={content} />
      </SectionReveal>
      <SectionReveal>
        <HowItWorks content={content} />
      </SectionReveal>
      <SectionReveal>
        <Outcomes content={content} />
      </SectionReveal>
      <SectionReveal>
        <SocialProof content={content} />
      </SectionReveal>
      <SectionReveal>
        <PricingTeaser content={content} country={country} />
      </SectionReveal>
      <SectionReveal>
        <FAQ content={content} />
      </SectionReveal>
      <SectionReveal>
        <FinalCTA content={content} />
      </SectionReveal>
    </>
  );
}

