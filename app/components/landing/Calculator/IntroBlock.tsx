"use client";

import { CALCULATOR_INTRO, CALCULATOR_SLIDER_LABELS } from "./calculatorCopy";

export default function IntroBlock({ pct }: { pct: number }) {
  return (
    <div className="mb-12 text-center">
      <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5">
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-accent animate-pulse" />
        <span className="text-[11px] font-black uppercase tracking-[.12em] text-accent">
          {CALCULATOR_INTRO.pillText}
        </span>
      </div>
      <h2
        className="mb-3 text-foreground"
        style={{
          fontSize: "clamp(26px, 4.2vw, 48px)",
          lineHeight: 1.12,
        }}
      >
        {CALCULATOR_INTRO.titlePrefix}
        <em className="not-italic text-accent">{CALCULATOR_INTRO.titleEmphasis}</em>
      </h2>
      <p className="mx-auto max-w-[460px] text-sm leading-relaxed text-muted-foreground">
        {CALCULATOR_INTRO.description}
      </p>
      <p className="mx-auto mt-4 max-w-[460px] text-[12px] leading-relaxed text-muted-foreground">
        عشان تظهر في جوجل وتبني أصل رقمي قوي، غالبًا تحتاج{" "}
        <span className="font-black text-foreground">فريق كامل من ٦ وظائف</span> يشتغلون معًا على نفس الهدف:
        {" "}
        {CALCULATOR_SLIDER_LABELS.writer},{" "}
        {CALCULATOR_SLIDER_LABELS.designer},{" "}
        {CALCULATOR_SLIDER_LABELS.seo},{" "}
        {CALCULATOR_SLIDER_LABELS.social},{" "}
        {CALCULATOR_SLIDER_LABELS.video}،{" "}
        {CALCULATOR_SLIDER_LABELS.dev}.
      </p>
      <p className="mx-auto mt-3 max-w-[460px] text-sm font-black text-accent">
        {CALCULATOR_INTRO.savingsPercentPrefix}
        {pct}%
      </p>
    </div>
  );
}

