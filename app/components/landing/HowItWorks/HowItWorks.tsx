import type { StaticLanding } from "@/app/content/landing/types";
import { HowItWorksBackground } from "./HowItWorksBackground";
import { HowItWorksHeader } from "./HowItWorksHeader";
import { HowItWorksSteps } from "./HowItWorksSteps";
import { HowItWorksCTA } from "./HowItWorksCTA";

const DEFAULT_CTA = "ابدأ مجاناً — بدون بطاقة";

export default function HowItWorks({ staticLanding, ctaLabel = DEFAULT_CTA, ctaLink = "/signup" }: { staticLanding: StaticLanding; ctaLabel?: string; ctaLink?: string }) {
  const h = staticLanding.howItWorks;
  return (
    <section
      id="how-it-works"
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
        <div className="relative z-10">
          <HowItWorksHeader
            eyebrow={h.eyebrow}
            title={h.title}
            subtitle={h.subtitle}
          />
          <HowItWorksSteps steps={h.steps} />
          <HowItWorksCTA
            ctaLink={ctaLink}
            cta={ctaLabel}
            guarantee={h.guarantee}
          />
        </div>
      </div>
    </section>
  );
}
