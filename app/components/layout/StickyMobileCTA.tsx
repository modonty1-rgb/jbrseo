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
 * Visibility model (evidence-backed):
 *  - Two IntersectionObserver sentinels (NOT a scroll listener) — MDN:
 *    "sites no longer need to do anything on the main thread to watch for this
 *    kind of element intersection". Zero getBoundingClientRect(), zero scroll
 *    handling, zero per-frame React setState.
 *  - Show when we leave the top-of-page sentinel behind (past ~50vh of hero).
 *  - Hide again when we approach the bottom-of-page sentinel (near footer / final CTA).
 *
 * Paint model (evidence-backed):
 *  - Solid background — NO backdrop-filter. web.dev "Stick to compositor-only
 *    properties": only `transform` and `opacity` are compositor-only; blur is
 *    a paint operation re-computed every frame during scroll = the mobile jank
 *    we hit on 2026-07-13.
 *  - Enter/exit uses only `transform` + `opacity` — compositor-only path.
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

    const apply = () => {
      // Show when the hero-height sentinel has scrolled OUT of view AND we
      // aren't yet near the footer sentinel.
      setVisible(!topVisible && !bottomVisible);
    };

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
      {/* Sentinel at 50vh from the top of <main>. When it exits viewport, we
          know user has scrolled past the hero and the CTA should appear. */}
      <div
        ref={topSentinelRef}
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          height: "50vh",
          pointerEvents: "none",
        }}
      />
      <style>{`
        .prev-sticky-mobile-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
          background: var(--background);
          border-top: 1px solid var(--border);
          display: none;
          gap: 8px;
          align-items: stretch;
          box-shadow: 0 -10px 24px -16px color-mix(in oklch, var(--foreground) 18%, transparent);
          /* Compositor-only transition — web.dev "Stick to compositor-only
             properties": only transform + opacity avoid layout AND paint. */
          transition: transform .25s ease, opacity .2s ease;
          transform: translateY(0);
          opacity: 1;
          will-change: transform, opacity;
        }
        .prev-sticky-mobile-cta.hidden {
          transform: translateY(110%);
          opacity: 0;
          pointer-events: none;
        }
        @media (max-width: 880px) {
          .prev-sticky-mobile-cta { display: flex; }
        }
      `}</style>
      <div className={`prev-sticky-mobile-cta${visible ? "" : " hidden"}`} aria-hidden={!visible}>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب"
          className="w-[52px] h-[52px] rounded-[13px] bg-success text-success-foreground inline-flex items-center justify-center shrink-0 shadow-[0_8px_20px_-10px_color-mix(in oklch, var(--success) 55%, transparent)] no-underline"
        >
          <WhatsAppIcon className="w-[22px] h-[22px]" />
        </a>
        <NextLink
          href={pricingHref}
          className="group flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background px-[18px] rounded-[13px] text-[15px] font-semibold no-underline shadow-[0_12px_26px_-14px_color-mix(in oklch, var(--foreground) 50%, transparent)] min-h-[52px]"
        >
          <Sparkles
            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            strokeWidth={2.5}
            aria-hidden
          />
          {ctaLabel}
        </NextLink>
      </div>
      {/* Sentinel 200px above the bottom of the document. When it enters the
          viewport, hide the CTA (user reached the footer / final CTA). */}
      <div
        ref={bottomSentinelRef}
        aria-hidden
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
