"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";

type Props = {
  pricingHref: string;
  whatsappLink: string;
  ctaLabel: string;
};

/**
 * Mobile-only bottom CTA — WhatsApp + primary action to #pricing.
 *
 * Visibility: two IntersectionObserver sentinels (no scroll listener, no
 * getBoundingClientRect) — MDN-recommended pattern.
 * Paint: solid background, no backdrop-filter, no will-change; enter/exit
 * transitions only transform + opacity (compositor-only per web.dev).
 * Styling: pure Tailwind — visibility driven by data-visible attribute.
 */
export function StickyMobileCTA({ pricingHref, whatsappLink, ctaLabel }: Props) {
  const [visible, setVisible] = useState(false);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const top = topSentinelRef.current;
    const bottom = bottomSentinelRef.current;
    if (!top || !bottom) return;

    let topVisible = true;
    let bottomVisible = false;

    const apply = () => setVisible(!topVisible && !bottomVisible);

    const topObs = new IntersectionObserver((entries) => {
      topVisible = entries[0]?.isIntersecting ?? true;
      apply();
    });
    const bottomObs = new IntersectionObserver((entries) => {
      bottomVisible = entries[0]?.isIntersecting ?? false;
      apply();
    });

    topObs.observe(top);
    bottomObs.observe(bottom);

    return () => {
      topObs.disconnect();
      bottomObs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Top sentinel: spans the hero (~50vh). CTA appears once it scrolls out. */}
      <div
        ref={topSentinelRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-px h-[50vh]"
      />
      <div
        data-visible={visible}
        aria-hidden={!visible}
        className="fixed inset-x-0 bottom-0 z-40 hidden max-[880px]:flex items-stretch gap-2 border-t border-border bg-background px-3.5 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-10px_24px_-16px_color-mix(in_oklch,var(--foreground)_18%,transparent)] transition-[transform,opacity] duration-200 ease-out data-[visible=false]:translate-y-[110%] data-[visible=false]:opacity-0 data-[visible=false]:pointer-events-none"
      >
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب"
          className="w-[52px] h-[52px] rounded-[13px] bg-success text-success-foreground inline-flex items-center justify-center shrink-0 shadow-[0_8px_20px_-10px_color-mix(in_oklch,var(--success)_55%,transparent)] no-underline"
        >
          <WhatsAppIcon className="w-[22px] h-[22px]" />
        </a>
        <NextLink
          href={pricingHref}
          className="group flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background px-[18px] rounded-[13px] text-[15px] font-semibold no-underline shadow-[0_12px_26px_-14px_color-mix(in_oklch,var(--foreground)_50%,transparent)] min-h-[52px]"
        >
          <Sparkles
            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            strokeWidth={2.5}
            aria-hidden
          />
          {ctaLabel}
        </NextLink>
      </div>
      {/* Bottom sentinel: 200px above document end. CTA hides when it enters. */}
      <div
        ref={bottomSentinelRef}
        aria-hidden
        className="pointer-events-none absolute bottom-[200px] left-0 w-px h-px"
      />
    </>
  );
}
