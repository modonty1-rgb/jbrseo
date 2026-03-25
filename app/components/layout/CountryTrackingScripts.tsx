"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type Props = {
  hotjarId?: string | null;
};

export function CountryTrackingScripts({ hotjarId }: Props) {
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
    </>
  );
}

