import { redirect } from "next/navigation";
import { Suspense, type ReactElement, type ReactNode } from "react";
import { FooterRouteGate } from "@/app/components/layout/footer/FooterRouteGate";
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
      {children}
      <FooterRouteGate
        content={content}
        staticLanding={staticLanding}
        country={countryCode}
        basePath={basePath}
      />
      <ChatWidgetLazy />
    </>
  );
}

function CountryLayoutSuspenseFallback(): ReactElement {
  return <div className="min-h-screen bg-background" aria-hidden />;
}

export default function CountryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" lang="ar">
      <Suspense fallback={<CountryLayoutSuspenseFallback />}>
        <CountryLayoutContent params={params}>{children}</CountryLayoutContent>
      </Suspense>
    </div>
  );
}
