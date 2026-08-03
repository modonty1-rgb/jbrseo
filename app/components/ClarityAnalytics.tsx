"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

/**
 * Microsoft Clarity — behavioural analytics (heatmaps + session insights) that
 * feeds the UX-Insights dashboard via the Data Export API.
 *
 * Mirrors DeferredGTM: mounts only after the first user interaction or once the
 * browser is idle (≤3.5s cap), so Clarity's third-party tag stays off the
 * critical path and doesn't inflate TBT.
 *
 * Excluded from /admin (login + dashboard) so internal staff sessions never
 * pollute the friction signals the dashboard ranks pages on.
 *
 * The project ID is read from NEXT_PUBLIC_CLARITY_ID, which is set ONLY in the
 * Vercel Production environment — never dev/preview — so localhost and preview
 * traffic never lands in the live Clarity project.
 */
export function ClarityAnalytics() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => setReady(true);
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));

    let idleId = 0;
    let timeoutId = 0;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load, { timeout: 3500 });
    } else {
      timeoutId = window.setTimeout(load, 3500);
    }

    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!CLARITY_ID) return null;
  if (pathname?.startsWith("/admin")) return null;
  if (!ready) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
    </Script>
  );
}
