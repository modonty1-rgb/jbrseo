import type { ReactNode } from "react";
import { headers } from "next/headers";
import { AnnouncementBar } from "@/app/components/layout/AnnouncementBar";
import { Footer } from "@/app/components/layout/footer/Footer";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { StickyMobileCTA } from "@/app/components/layout/StickyMobileCTA";
import { getMeta } from "@/app/actions/pricing-meta";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";

// Foundation-layer creation: /features previously had NO layout file and rendered chrome (Announcement+Navbar+
// Footer+Sticky) inside page.tsx. This layout now owns the chrome AND wraps everything in .marketing-surface
// so the page can be simplified later to return only its own content. The data it fetches mirrors the
// (marketingShell)/page.tsx chrome — plans stay in features/page.tsx because only the page renders them.
export default async function FeaturesLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const countrySlug = country === "EG" ? "eg" : "sa";

  const [content, staticLanding, meta] = await Promise.all([
    getLandingContent(country),
    getStaticLandingWithOverrides(),
    getMeta(country),
  ]);

  const basePath = `/${countrySlug}`;
  const pricingHref = `${basePath}#pricing`;
  const whatsappLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || DEFAULT_CTA_LABEL;

  return (
    <div dir="rtl" className="marketing-surface text-foreground overflow-x-clip max-[880px]:pb-[calc(76px+env(safe-area-inset-bottom))]" lang="ar">
      <AnnouncementBar message={meta?.announcement ?? ""} />
      <LandingHeader
        content={content}
        staticLanding={staticLanding}
        country={country}
        basePath={basePath}
        pricingHref={pricingHref}
        whatsappNumber={content.siteSettings?.whatsappNumber}
      />
      <main id="main-content">{children}</main>
      <Footer
        content={content}
        staticLanding={staticLanding}
        country={country}
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
