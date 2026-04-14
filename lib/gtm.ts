"use client";

import { sendGTMEvent } from "@next/third-parties/google";

export function trackEvent(event: string, payload?: Record<string, unknown>): void {
  sendGTMEvent({ event, ...payload });
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export const GTMEvents = {
  signupStart: (params?: { plan?: string; price?: number; billing?: string; country?: string }) =>
    trackEvent("signup_start", {
      plan_name: params?.plan,
      plan_price: params?.price,
      billing_mode: params?.billing,
      country: params?.country,
    }),
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
  pricingView: (params?: { country?: string }) =>
    trackEvent("pricing_view", { country: params?.country }),
  whatsappClick: () => trackEvent("whatsapp_click"),
  planClick: (params: { plan: string; price: number; billing: string; country: string }) =>
    trackEvent("plan_click", {
      plan_name: params.plan,
      plan_price: params.price,
      billing_mode: params.billing,
      country: params.country,
    }),
};
