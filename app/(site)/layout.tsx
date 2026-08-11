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

/**
 * Chrome placeholder only — it must NOT render `children`.
 *
 * It used to, and the page paid for it twice. A Suspense fallback is streamed into the
 * document before the boundary resolves and the real subtree is streamed after it, so
 * putting the route's own content in both places emitted the entire page body twice in
 * one HTML response: two `<h1>`s, two copies of every section, and — on /faq — two
 * identical FAQPage blocks with the same eighteen questions, which is precisely the
 * duplicate structured data Google treats as a markup violation. Measured on /faq before
 * the fix: 2 ld+json blocks, byte-identical, and 36 `<summary>` tags for 18 questions.
 *
 * The header and footer are the only things waiting on the async data, so the fallback
 * stands in for those alone.
 */
function SiteLayoutFallback() {
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
      {/* whatsappNumber was missing here — the other two layouts pass it, this one did not,
          and the header answered with a placeholder number on every page under (site). */}
      <LandingHeader
        content={content}
        staticLanding={staticLanding}
        country={country}
        basePath={basePath}
        whatsappNumber={content.siteSettings?.whatsappNumber}
      />
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
      {/* The Suspense boundary stays.
          A missing article answers 200 with `<meta robots="noindex">` instead of 404 — a
          soft-404 — and the standing theory was that this boundary committed the response
          head before `notFound()` ran. Tested: removing it entirely still measured 200 on
          /articles/does-not-exist, so the status is fixed somewhere else and the boundary
          was not the cause. Put back, because it does buy the header and footer a head
          start while `getLandingContent` resolves, and removing it cost that for nothing.
          The soft-404 is left as a known, documented condition: `noindex` is emitted, so
          the URL cannot enter the index either way. */}
      <Suspense fallback={<SiteLayoutFallback />}>
        <SiteLayoutContent>{children}</SiteLayoutContent>
      </Suspense>
    </div>
  );
}

