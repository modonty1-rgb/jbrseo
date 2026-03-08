import type { StaticLanding } from "@/app/content/landing/types";
import { SectionImage } from "@/app/components/landing/SectionImage";
import { FinalCTABackground } from "./FinalCTABackground";
import { FinalCTAHeader } from "./FinalCTAHeader";
import { FinalCTASeatsBar } from "./FinalCTASeatsBar";
import { FinalCTAButtons } from "./FinalCTAButtons";
import { FinalCTABenefits } from "./FinalCTABenefits";
import { FinalCTAKeyframes } from "./FinalCTAKeyframes";

export default function FinalCTA({ staticLanding }: { staticLanding: StaticLanding }) {
  const c = staticLanding.finalCta;
  return (
    <section
      data-reveal-section
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
        <SectionImage src={c.sectionImage} alt={c.eyebrow} slot="finalCta" />
        <div className="relative z-10 w-full">
          <FinalCTAHeader
            eyebrow={c.eyebrow}
            title1={c.title1}
            title2={c.title2}
            subtitle={c.subtitle}
          />
          <FinalCTASeatsBar total={c.seats.total} taken={c.seats.taken} />
          <FinalCTAButtons cta={c.cta} ctaLink={c.ctaLink} wa={c.wa} waLink={c.waLink} />
          <FinalCTABenefits benefits={c.benefits} />
        </div>
      </div>
      <FinalCTAKeyframes />
    </section>
  );
}
