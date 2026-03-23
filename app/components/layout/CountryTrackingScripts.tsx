"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type Props = {
  gtmId?: string | null;
  hotjarId?: string | null;
  fbPixelId?: string | null;
};

export function CountryTrackingScripts({ gtmId, hotjarId, fbPixelId }: Props) {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    // Delay heavy tracking scripts until user interacts or 5s pass
    const loadScripts = () => setInteracted(true);
    const timeoutId = setTimeout(loadScripts, 5000);
    const events = ["scroll", "mousemove", "keydown", "touchstart"];
    
    const handleEvent = () => {
      loadScripts();
      events.forEach(e => window.removeEventListener(e, handleEvent));
      clearTimeout(timeoutId);
    };

    events.forEach(e => window.addEventListener(e, handleEvent, { once: true, passive: true }));

    return () => {
      events.forEach(e => window.removeEventListener(e, handleEvent));
      clearTimeout(timeoutId);
    };
  }, []);

  if (!interacted) return null;

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
        <Script id="gtm" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');
        `}
        </Script>
      )}

      {hotjarId && (
        <Script id="hotjar" strategy="afterInteractive">
          {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjarId},hjsv=6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
        </Script>
      )}

      {fbPixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
          n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
          }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${fbPixelId}');fbq('track','PageView');
        `}
        </Script>
      )}
    </>
  );
}

