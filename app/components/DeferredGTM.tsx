"use client";

import { useEffect, useState } from "react";
import { GoogleTagManager } from "@next/third-parties/google";

/**
 * Defers Google Tag Manager — and everything GTM injects (GA4, Contentsquare) —
 * off the critical load path. GTM mounts only after the first user interaction
 * or once the browser is idle (≤3.5s cap), so its heavy third-party JS no longer
 * inflates TBT. Events fired earlier queue in window.dataLayer (via sendGTMEvent)
 * and are processed once GTM loads, so nothing is lost.
 */
export function DeferredGTM({ gtmId }: { gtmId: string }) {
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

  return ready ? <GoogleTagManager gtmId={gtmId} /> : null;
}
