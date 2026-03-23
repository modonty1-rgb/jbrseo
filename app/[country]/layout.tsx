import { redirect } from "next/navigation";
import { Suspense, type ReactElement, type ReactNode } from "react";
import Script from "next/script";
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
  const { gtmId, hotjarId, fbPixelId } = content.tracking;
  const basePath = `/${countrySlug}`;

  return (
    <>
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}
      {gtmId && (
        <Script id="country-gtm" strategy="lazyOnload">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
        `}</Script>
      )}
      {hotjarId && (
        <Script id="country-hotjar" strategy="lazyOnload">{`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjarId},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}</Script>
      )}
      {fbPixelId && (
        <Script id="country-fb-pixel" strategy="lazyOnload">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
          n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
          }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${fbPixelId}');fbq('track','PageView');
        `}</Script>
      )}
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
