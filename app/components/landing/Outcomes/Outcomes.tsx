import type { CSSProperties } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import { SectionImage } from "@/app/components/landing/SectionImage";
import { OutcomesBackground } from "./OutcomesBackground";
import { OutcomesHeader } from "./OutcomesHeader";
import { OutcomeCard } from "./OutcomeCard";
import { OutcomesBottomStrip } from "./OutcomesBottomStrip";

export default function Outcomes({ staticLanding }: { staticLanding: StaticLanding }) {
  const o = staticLanding.outcomes;
  return (
    <section
      id="outcomes"
      data-reveal-section
      aria-labelledby="outcomes-title"
      className="
        relative overflow-hidden border-t border-border bg-card
        px-5 pt-24 pb-20
        sm:px-8
        lg:px-10 lg:pt-[96px] lg:pb-[88px]
      "
    >
      <OutcomesBackground />
      <div className="relative mx-auto max-w-[1100px]">
        <SectionImage src={o.sectionImage} alt={o.eyebrow} slot="outcomes" />
        <div className="relative z-10">
          <OutcomesHeader
            eyebrow={o.eyebrow}
            title={o.title}
            subtitle={o.subtitle}
          />
          <div
            className="
              mb-14 grid gap-5
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {o.outcomes.map((item, i) => (
              <div
                key={i}
                data-reveal="scale-pop"
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
              >
                <OutcomeCard item={item} index={i} />
              </div>
            ))}
          </div>
          <OutcomesBottomStrip
            ctaLink={o.ctaLink}
            cta={o.cta}
            badgeText={o.badgeText}
            message={o.message}
            messageHighlight={o.messageHighlight}
          />
        </div>
      </div>
    </section>
  );
}
