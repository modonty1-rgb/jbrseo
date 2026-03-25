"use client";

import { sendGTMEvent } from "@next/third-parties/google";

export function trackEvent(event: string, payload?: Record<string, unknown>): void {
  sendGTMEvent({ event, ...payload });
}

export const GTMEvents = {
  signupStart: () => trackEvent("signup_start"),
  signupComplete: (plan: string) => trackEvent("signup_complete", { plan }),
  pricingView: () => trackEvent("pricing_view"),
  whatsappClick: () => trackEvent("whatsapp_click"),
};
