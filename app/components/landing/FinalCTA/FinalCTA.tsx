import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { sanitizeUserFacingString } from "@/lib/sanitize-user-facing";
import { getWhatsAppLink } from "@/lib/site-links";
import { FinalCTABackground } from "./FinalCTABackground";
import { FinalCTAHeader } from "./FinalCTAHeader";
import { FinalCTAButtons } from "./FinalCTAButtons";
import { FinalCTABenefits } from "./FinalCTABenefits";
import { FinalCTAKeyframes } from "./FinalCTAKeyframes";

const DEFAULT_CTA = "احجز مقعدك — مجاناً";

export default function FinalCTA({ staticLanding, country, ctaLabel = DEFAULT_CTA, ctaLink = "/signup", whatsappNumber }: { staticLanding: StaticLanding; country: SupportedCountry; ctaLabel?: string; ctaLink?: string; whatsappNumber?: string }) {
  const c = staticLanding.finalCta;
  const bannerLine = sanitizeUserFacingString((staticLanding.header.bannerText ?? "").trim());
  const waLink = getWhatsAppLink(country, whatsappNumber);
  return (
    <section
      aria-labelledby="final-cta-title"
      className="final-cta-section relative overflow-hidden border-t border-border px-5 pt-[100px] pb-20 sm:px-8 sm:pt-[110px] sm:pb-24"
    >
      <style>{`
        .final-cta-section {
          --final-cta-accent: var(--accent);
          background: linear-gradient(
            140deg,
            color-mix(in oklch, var(--primary) 100%, black) 0%,
            color-mix(in oklch, var(--primary) 55%, var(--accent)) 55%,
            color-mix(in oklch, var(--accent) 75%, black) 100%
          );
        }
        .dark .final-cta-section {
          --final-cta-accent: var(--accent);
          background: linear-gradient(
            140deg,
            color-mix(in oklch, var(--primary) 85%, black) 0%,
            color-mix(in oklch, var(--primary) 50%, var(--accent)) 55%,
            color-mix(in oklch, var(--accent) 65%, black) 100%
          );
        }
        .dark .final-cta-section .final-cta-eyebrow { color: var(--accent-foreground); }
        .dark .final-cta-section .final-cta-eyebrow-bar { background: var(--accent-foreground); }
        .dark .final-cta-section .final-cta-wa-btn {
          background: color-mix(in oklch, var(--primary-foreground) 10%, transparent);
          border-color: color-mix(in oklch, var(--primary-foreground) 22%, transparent);
          color: var(--primary-foreground);
        }
      `}</style>
      <FinalCTABackground />
      <div className="relative mx-auto flex max-w-[680px] flex-col items-center text-center">
        <div className="relative z-10 w-full">
          <FinalCTAHeader
            eyebrow={c.eyebrow}
            title1={c.title1}
            title2={c.title2}
            subtitle={c.subtitle}
          />
          {bannerLine ? (
            <p
              className="final-cta-banner-line mx-auto mb-8 w-full max-w-md rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 text-[13px] font-bold leading-relaxed text-primary-foreground dark:border-primary-foreground/28 dark:bg-primary-foreground/14"
              style={{ animation: "fadeUp .4s .26s ease both", opacity: 0 }}
            >
              {bannerLine}
            </p>
          ) : null}
          <FinalCTAButtons cta={ctaLabel} ctaLink={ctaLink} wa={c.wa} waLink={waLink} />
          <FinalCTABenefits benefits={c.benefits} />
        </div>
      </div>
      <FinalCTAKeyframes />
    </section>
  );
}
