import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { getWhatsAppLink } from "@/lib/site-links";
import { FinalCTABackground } from "./FinalCTABackground";
import { FinalCTAHeader } from "./FinalCTAHeader";
import { FinalCTASeatsBar } from "./FinalCTASeatsBar";
import { FinalCTAButtons } from "./FinalCTAButtons";
import { FinalCTABenefits } from "./FinalCTABenefits";
import { FinalCTAKeyframes } from "./FinalCTAKeyframes";

const DEFAULT_CTA = "احجز مقعدك — مجاناً";

export default function FinalCTA({ staticLanding, country, ctaLabel = DEFAULT_CTA, ctaLink = "/signup", whatsappNumber }: { staticLanding: StaticLanding; country: SupportedCountry; ctaLabel?: string; ctaLink?: string; whatsappNumber?: string }) {
  const c = staticLanding.finalCta;
  const waLink = getWhatsAppLink(country, whatsappNumber);
  return (
    <section
      aria-labelledby="final-cta-title"
      className="final-cta-section relative overflow-hidden px-5 pt-[100px] pb-20 sm:px-8 sm:pt-[110px] sm:pb-24"
    >
      <style>{`
        .final-cta-section {
          --final-cta-accent: var(--accent);
          background: linear-gradient(160deg, color-mix(in oklch, var(--primary) 95%, black) 0%, color-mix(in oklch, var(--primary) 88%, black) 40%, color-mix(in oklch, var(--primary) 97%, black) 100%);
        }
        .dark .final-cta-section {
          --final-cta-accent: var(--success);
          background: linear-gradient(160deg, color-mix(in oklch, var(--success) 92%, black) 0%, color-mix(in oklch, var(--success) 85%, black) 40%, color-mix(in oklch, var(--success) 94%, black) 100%);
        }
        .dark .final-cta-section .final-cta-eyebrow { color: var(--success-foreground); }
        .dark .final-cta-section .final-cta-eyebrow-bar { background: var(--success-foreground); }
        .dark .final-cta-section .final-cta-seats-bar {
          background: color-mix(in oklch, var(--primary-foreground) 14%, transparent);
          border-color: color-mix(in oklch, var(--primary-foreground) 28%, transparent);
        }
        .dark .final-cta-section .final-cta-wa-btn {
          background: color-mix(in oklch, var(--success-foreground) 12%, transparent);
          border-color: var(--success-foreground);
          color: var(--success-foreground);
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
          <FinalCTASeatsBar total={c.seats.total} taken={c.seats.taken} />
          <FinalCTAButtons cta={ctaLabel} ctaLink={ctaLink} wa={c.wa} waLink={waLink} />
          <FinalCTABenefits benefits={c.benefits} />
        </div>
      </div>
      <FinalCTAKeyframes />
    </section>
  );
}
