import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { Footer } from "@/app/components/layout/footer/Footer";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";

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
  return (
    <>
      <LandingHeader content={content} staticLanding={staticLanding} country={country} />
      <main id="main-content">{children}</main>
      <Footer content={content} staticLanding={staticLanding} country={country} />
    </>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" lang="ar">
      <Suspense fallback={<SiteLayoutFallback>{children}</SiteLayoutFallback>}>
        <SiteLayoutContent>{children}</SiteLayoutContent>
      </Suspense>
    </div>
  );
}

