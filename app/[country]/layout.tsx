import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { Footer } from "@/app/components/layout/footer/Footer";
import { ChatWidgetLazy } from "@/app/components/layout/ChatWidget/ChatWidgetLazy";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getLandingContent } from "@/lib/getLandingContent";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
  SUPPORTED_COUNTRY_SLUGS,
} from "@/lib/country-config";

export function generateStaticParams() {
  return SUPPORTED_COUNTRY_SLUGS.map((country) => ({ country }));
}

async function CountryLayoutContent({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    redirect("/sa");
  }
  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);

  const [content, staticLanding] = await Promise.all([
    getLandingContent(countryCode),
    getStaticLandingWithOverrides(countryCode),
  ]);
  const basePath = `/${countrySlug}`;

  return (
    <>
      <LandingHeader
        content={content}
        staticLanding={staticLanding}
        country={countryCode}
        basePath={basePath}
        pricingHref={`${basePath}/signup`}
      />
      <main id="main-content">{children}</main>
      <Footer
        content={content}
        staticLanding={staticLanding}
        country={countryCode}
        basePath={basePath}
      />
      <ChatWidgetLazy />
    </>
  );
}

export default async function CountryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" lang="ar">
      <CountryLayoutContent params={params}>{children}</CountryLayoutContent>
    </div>
  );
}
