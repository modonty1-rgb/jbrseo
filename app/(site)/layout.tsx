import { headers } from "next/headers";
import type { ReactNode } from "react";
import Script from "next/script";
import { LandingHeader } from "@/app/components/layout/LandingHeader";
import { Footer } from "@/app/components/layout/Footer";
import { ChatWidgetLazy } from "@/app/components/layout/ChatWidgetLazy";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const [content, staticLanding] = await Promise.all([
    getLandingContent(country),
    getStaticLandingWithOverrides(country),
  ]);
  const { gtmId, hotjarId, fbPixelId } = content.tracking;

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" lang="ar">
      {/* GTM noscript fallback (App Router: placed at top of layout div; no bare <body> access) */}
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

      {/* GTM — afterInteractive: tag managers load after hydration per Next.js docs */}
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
        `}</Script>
      )}

      {/* Hotjar — lazyOnload: deferred to browser idle to protect LCP/INP */}
      {hotjarId && (
        <Script id="hotjar" strategy="lazyOnload">{`
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

      {/* Facebook (Meta) Pixel — afterInteractive: official base code, self-loads fbevents.js async */}
      {fbPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
          n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
          }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${fbPixelId}');fbq('track','PageView');
        `}</Script>
      )}

      <LandingHeader content={content} staticLanding={staticLanding} country={country} />
      <main id="main-content">{children}</main>
      <Footer content={content} staticLanding={staticLanding} country={country} />
      <ChatWidgetLazy />
    </div>
  );
}

