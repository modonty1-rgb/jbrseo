"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";

type Props = {
  pricingHref: string;
  whatsappLink: string;
  ctaLabel: string;
};

export function StickyMobileCTA({ pricingHref, whatsappLink, ctaLabel }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      // Viewport-relative threshold (was hardcoded 320px). On a short
      // screen (320h) this hides for the first 160px; on a tall one (900h)
      // for 450px — always covers roughly the visible hero.
      const nearTop = y < viewportH * 0.5;
      const nearBottom = y + viewportH > docH - 200;
      setVisible(!nearTop && !nearBottom);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .prev-sticky-mobile-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          /* Below Radix Dialog (z-50) so any modal opened over the landing
             wins the stacking context. Above normal content (z-10..30). */
          z-index: 40;
          padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
          background: color-mix(in oklch, var(--background) 92%, transparent);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid var(--border);
          display: none;
          gap: 8px;
          align-items: stretch;
          box-shadow: 0 -10px 24px -16px color-mix(in oklch, var(--foreground) 18%, transparent);
          transition: transform .25s ease, opacity .2s ease;
        }
        /* Fallback for old Android WebViews / iOS Safari <14 where
           backdrop-filter is unsupported — bump the base opacity to 98% so
           text remains legible over any hero content bleeding underneath. */
        @supports not ((backdrop-filter: blur(14px)) or (-webkit-backdrop-filter: blur(14px))) {
          .prev-sticky-mobile-cta {
            background: color-mix(in oklch, var(--background) 98%, transparent);
          }
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
      <div className={`prev-sticky-mobile-cta${visible ? "" : " hidden"}`}>
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
    </>
  );
}
