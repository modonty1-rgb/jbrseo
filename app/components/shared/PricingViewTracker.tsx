"use client";

import { useEffect } from "react";
import { GTMEvents } from "@/lib/gtm";

export function PricingViewTracker() {
  useEffect(() => {
    GTMEvents.pricingView();
  }, []);
  return null;
}
