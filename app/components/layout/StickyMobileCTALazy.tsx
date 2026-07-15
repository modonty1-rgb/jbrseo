"use client";

import dynamic from "next/dynamic";

type Props = {
  pricingHref: string;
  whatsappLink: string;
  ctaLabel: string;
};

// Scroll-triggered bottom CTA — irrelevant until the visitor scrolls past the
// hero, so it is client-only (ssr:false) and its JS stays off the initial load.
// No loading fallback: the component is invisible until its sentinels fire.
const StickyMobileCTA = dynamic(
  () => import("./StickyMobileCTA").then((m) => m.StickyMobileCTA),
  { ssr: false },
);

export function StickyMobileCTALazy(props: Props) {
  return <StickyMobileCTA {...props} />;
}
