import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { Footer } from "@/app/components/layout/footer/Footer";
import { StickyMobileCTA } from "@/app/components/layout/StickyMobileCTA";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";

function SiteLayoutFallback({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b border-border bg-background/95 px-4 py-3" aria-hidden>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="h-8 w-24 rounded-md bg-muted/60" />
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-md bg-muted/60" />
            <div className="h-9 w-24 rounded-md bg-muted/60" />
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="border-t border-border bg-muted/30 px-4 py-8" aria-hidden>
        <div className="mx-auto max-w-6xl">
          <div className="h-4 w-48 rounded bg-muted/60" />
        </div>
      </footer>
    </>
  );
}

async function SiteLayoutContent({ children }: { children: ReactNode }) {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const [content, staticLanding] = await Promise.all([
    getLandingContent(country),
    getStaticLandingWithOverrides(),
  ]);
  // Country-scoped links so a /privacy visitor from an ad gets routed back to
  // /sa#pricing (or /eg#pricing) — not just /#pricing.
  //
  // `basePath` was reaching the sticky CTA only. Without it the header and footer kept
  // the raw "/#pricing", and "/" redirects to "/sa" — a redirect drops the fragment, so
  // "الأسعار" in the main navigation landed the reader at the top of the home page
  // instead of the prices. Same for قصص نجاح · الشهادات · الأسئلة, on all six pages.
  const countrySlug = country.toLowerCase();
  const basePath = `/${countrySlug}`;
  const pricingHref = `${basePath}#pricing`;
  const whatsappLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || DEFAULT_CTA_LABEL;
  return (
    <>
      <LandingHeader content={content} staticLanding={staticLanding} country={country} basePath={basePath} />
      <main id="main-content">{children}</main>
      <Footer content={content} staticLanding={staticLanding} country={country} basePath={basePath} />
      <StickyMobileCTA
        pricingHref={pricingHref}
        whatsappLink={whatsappLink}
        ctaLabel={ctaLabel}
      />
    </>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground max-[880px]:pb-[calc(76px+env(safe-area-inset-bottom))]" lang="ar">
      <Suspense fallback={<SiteLayoutFallback>{children}</SiteLayoutFallback>}>
        <SiteLayoutContent>{children}</SiteLayoutContent>
      </Suspense>
    </div>
  );
}

