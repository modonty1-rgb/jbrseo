import type { StaticLanding } from "@/app/content/landing/types";
import dynamic from "next/dynamic";
import { WhyNowBackground } from "./WhyNowBackground";
import { WhyNowHeader } from "./WhyNowHeader";
import { WhyNowReasons } from "./WhyNowReasons";
import { WhyNowBottomBar } from "./WhyNowBottomBar";

const WhyNowInteractive = dynamic(
  () => import("./WhyNowInteractive").then((m) => ({ default: m.WhyNowInteractive })),
  { ssr: true }
);

const DEFAULT_CTA = "ابدأ مجاناً — بدون بطاقة";

export default function WhyNow({ staticLanding, ctaLabel = DEFAULT_CTA }: { staticLanding: StaticLanding; ctaLabel?: string }) {
  const w = staticLanding.whyNow;
  return (
    <section
      id="why-now"
      aria-labelledby="why-now-title"
      className="
        relative overflow-hidden border-t border-border bg-muted/40
        px-5 pt-[88px] pb-20
        sm:px-8
        lg:px-10 lg:pt-[96px] lg:pb-[88px]
      "
    >
      <WhyNowBackground />

      <div className="relative mx-auto max-w-6xl">
        <div className="relative z-10">
          <WhyNowHeader
            eyebrow={w.eyebrow}
            title1={w.title1}
            title2={w.title2}
            subtitle={w.subtitle}
          />

          <WhyNowInteractive costs={w.costs} daysTarget={w.daysTarget}>
            <WhyNowReasons reasons={w.reasons} />
          </WhyNowInteractive>

          <WhyNowBottomBar
            ctaText={w.ctaText}
            ctaBtn={ctaLabel}
            ctaLink="/signup"
            highlightText={w.ctaHighlight}
          />
        </div>
      </div>
    </section>
  );
}
