"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";

type Props = {
  signupHref: string;
  whatsappLink: string;
  ctaLabel: string;
};

export function StickyMobileCTA({ signupHref, whatsappLink, ctaLabel }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const nearTop = y < 320;
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
          z-index: 55;
          padding: 10px 14px calc(10px + env(safe-area-inset-bottom));
          background: color-mix(in oklch, var(--background) 92%, transparent);
          backdrop-filter: blur(14px);
          border-top: 1px solid var(--border);
          display: none;
          gap: 8px;
          align-items: stretch;
          box-shadow: 0 -10px 24px -16px color-mix(in oklch, var(--foreground) 18%, transparent);
          transition: transform .25s ease, opacity .2s ease;
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
          className="w-[52px] h-[52px] rounded-[13px] bg-success text-card-foreground inline-flex items-center justify-center shrink-0 shadow-[0_8px_20px_-10px_color-mix(in oklch, var(--success) 55%, transparent)] no-underline"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
        <NextLink
          href={signupHref}
          className="flex-1 inline-flex items-center justify-center bg-foreground text-card-foreground px-[18px] rounded-[13px] text-[15px] font-semibold no-underline shadow-[0_12px_26px_-14px_color-mix(in oklch, var(--foreground) 50%, transparent)] min-h-[52px]"
        >
          {ctaLabel}
        </NextLink>
      </div>
    </>
  );
}
