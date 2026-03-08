import type { StaticLanding } from "@/app/content/landing/types";
import { SectionImage } from "@/app/components/landing/SectionImage";
import { HowItWorksBackground } from "./HowItWorksBackground";
import { HowItWorksHeader } from "./HowItWorksHeader";
import { HowItWorksSteps } from "./HowItWorksSteps";
import { HowItWorksCTA } from "./HowItWorksCTA";

export default function HowItWorks({ staticLanding }: { staticLanding: StaticLanding }) {
  const h = staticLanding.howItWorks;
  return (
    <section
      id="how-it-works"
      data-reveal-section
      aria-labelledby="how-it-works-title"
      className="
        relative overflow-hidden border-t border-border bg-muted/40
        px-5 pt-24 pb-20
        sm:px-8
        lg:px-10 lg:pt-[96px] lg:pb-[88px]
      "
    >
      <HowItWorksBackground />
      <div className="relative mx-auto max-w-[1080px]">
        <SectionImage src={h.sectionImage} alt={h.eyebrow} slot="howItWorks" />
        <div className="relative z-10">
          <HowItWorksHeader
            eyebrow={h.eyebrow}
            title={h.title}
            subtitle={h.subtitle}
          />
          <HowItWorksSteps steps={h.steps} />
          <HowItWorksCTA
            ctaLink={h.ctaLink}
            cta={h.cta}
            guarantee={h.guarantee}
          />
        </div>
      </div>
    </section>
  );
}
