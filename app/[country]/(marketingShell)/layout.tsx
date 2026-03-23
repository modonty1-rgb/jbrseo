import type { ReactNode } from "react";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getLandingContent } from "@/lib/getLandingContent";
import { getCountryCodeFromSlug, isSupportedCountrySlug } from "@/lib/country-config";

export default async function MarketingShellLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return null;
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
        navPrimaryCtaLabel="ابدأ مجاناً"
      />
      <main id="main-content">{children}</main>
    </>
  );
}
