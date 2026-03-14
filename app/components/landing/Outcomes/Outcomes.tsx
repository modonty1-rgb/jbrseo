import type { StaticLanding } from "@/app/content/landing/types";
import { OutcomesBackground } from "./OutcomesBackground";
import { OutcomesHeader } from "./OutcomesHeader";
import { OutcomeCard } from "./OutcomeCard";
import { OutcomesBottomStrip } from "./OutcomesBottomStrip";

const DEFAULT_CTA = "احجز مقعدك بسعر التأسيس";

export default function Outcomes({ staticLanding, ctaLabel = DEFAULT_CTA, ctaLink = "#pricing" }: { staticLanding: StaticLanding; ctaLabel?: string; ctaLink?: string }) {
  const o = staticLanding.outcomes;
  return (
    <section
      id="outcomes"
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
              <div key={i}>
                <OutcomeCard item={item} index={i} />
              </div>
            ))}
          </div>
          <OutcomesBottomStrip
            ctaLink={ctaLink}
            cta={ctaLabel}
            badgeText={o.badgeText}
            message={o.message}
            messageHighlight={o.messageHighlight}
          />
        </div>
      </div>
    </section>
  );
}
