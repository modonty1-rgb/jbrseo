import { headers } from "next/headers";
import type { ReactNode } from "react";
import { Suspense } from "react";
import Script from "next/script";
import { LandingHeader } from "@/app/components/layout/header/LandingHeader";
import { Footer } from "@/app/components/layout/footer/Footer";
import { ChatWidgetLazy } from "@/app/components/layout/ChatWidget/ChatWidgetLazy";
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
    getStaticLandingWithOverrides(country),
  ]);
  const { gtmId, hotjarId, fbPixelId } = content.tracking;

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
        <Script id="gtm" strategy="lazyOnload">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
        `}</Script>
      )}
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
      {fbPixelId && (
        <Script id="fb-pixel" strategy="lazyOnload">{`
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

