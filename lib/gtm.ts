"use client";

import { sendGTMEvent } from "@next/third-parties/google";

export function trackEvent(event: string, payload?: Record<string, unknown>): void {
  sendGTMEvent({ event, ...payload });
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export const GTMEvents = {
  signupStart: () => trackEvent("signup_start"),
  signupComplete: (country?: string) => {
    if (typeof window === "undefined") return;
    const w = window as DataLayerWindow;
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({
      event: "signup_complete",
      event_category: "conversion",
      event_label: country ?? "unknown",
      value: 1,
    });
  },
  pricingView: () => trackEvent("pricing_view"),
  whatsappClick: () => trackEvent("whatsapp_click"),
};
