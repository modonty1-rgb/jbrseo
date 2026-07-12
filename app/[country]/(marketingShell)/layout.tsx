import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/app/components/layout/AnnouncementBar";
import { Footer } from "@/app/components/layout/footer/Footer";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { StickyMobileCTA } from "@/app/components/layout/StickyMobileCTA";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getLandingContent } from "@/lib/getLandingContent";
import { getMeta } from "@/app/actions/pricing-meta";
import { getWhatsAppLink } from "@/lib/site-links";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";

export default async function MarketingShellLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);

  const [content, staticLanding, meta] = await Promise.all([
    getLandingContent(countryCode),
    getStaticLandingWithOverrides(),
    getMeta(countryCode),
  ]);

  const basePath = `/${countrySlug}`;
  const pricingHref = `${basePath}#pricing`;
  const whatsappLink = getWhatsAppLink(countryCode, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || DEFAULT_CTA_LABEL;

  return (
    <div className="marketing-surface text-foreground">
      <AnnouncementBar message={meta?.announcement ?? "أسعار التأسيس — أول ١٥٠ شركة."} />
      <LandingHeader
        content={content}
        staticLanding={staticLanding}
        country={countryCode}
        basePath={basePath}
        pricingHref={pricingHref}
        whatsappNumber={content.siteSettings?.whatsappNumber}
      />
      <main id="main-content">{children}</main>
      <Footer
        content={content}
        staticLanding={staticLanding}
        country={countryCode}
        basePath={basePath}
      />
      <StickyMobileCTA
        pricingHref={pricingHref}
        whatsappLink={whatsappLink}
        ctaLabel={ctaLabel}
      />
    </div>
  );
}
