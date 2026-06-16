import type { ReactNode } from "react";
import { headers } from "next/headers";
import { AnnouncementBar } from "@/app/components/landing/AnnouncementBar";
import { Footer } from "@/app/components/landing/Footer";
import { Navbar } from "@/app/components/landing/Navbar";
import { StickyMobileCTA } from "@/app/components/landing/StickyMobileCTA";
import { getMeta } from "@/app/actions/pricing-meta";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { getWhatsAppLink } from "@/lib/site-links";

// Foundation-layer creation: /features previously had NO layout file and rendered chrome (Announcement+Navbar+
// Footer+Sticky) inside page.tsx. This layout now owns the chrome AND wraps everything in .marketing-surface
// so the page can be simplified later to return only its own content. The data it fetches mirrors the
// (marketingShell)/page.tsx chrome — plans stay in features/page.tsx because only the page renders them.
export default async function FeaturesLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const countrySlug = country === "EG" ? "eg" : "sa";

  const [content, meta, socialLinksRaw, footerRaw] = await Promise.all([
    getLandingContent(country),
    getMeta(country),
    getLandingSectionOverride("socialLinks"),
    getLandingSectionOverride("footer"),
  ]);

  const socialLinks = (socialLinksRaw ?? {}) as {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitterX?: string;
    youtube?: string;
    tiktok?: string;
  };
  const footerData = (footerRaw ?? {}) as { tagline?: string; desc?: string };

  const basePath = `/${countrySlug}`;
  const pricingHref = `${basePath}#pricing`;
  const signupHref = `${basePath}/signup`;
  const whatsappLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || "ابدأ الحين";

  return (
    <div dir="rtl" className="marketing-surface text-foreground overflow-x-clip" lang="ar">
      <AnnouncementBar message={meta?.announcement ?? ""} />
      <Navbar
        country={country}
        content={content}
        basePath={basePath}
        pricingHref={pricingHref}
      />
      <main id="main-content">{children}</main>
      <Footer
        country={country}
        basePath={basePath}
        whatsappNumber={content.siteSettings?.whatsappNumber}
        socialLinks={socialLinks}
        footerTagline={footerData.tagline}
        footerDesc={footerData.desc}
      />
      <StickyMobileCTA
        signupHref={signupHref}
        whatsappLink={whatsappLink}
        ctaLabel={ctaLabel}
      />
    </div>
  );
}
