import { Icon } from "@/app/components/Icon";
import { Card } from "@/app/components/ui/card";

type Step = { num: string; icon: string; title: string; line: string; tag: string };

type Props = { step: Step; index: number };

export function HowItWorksStepCard({ step, index }: Props) {
  const isHighlight = index === 1;

  return (
    <Card
      id={`hiw-card-${index}`}
      className="
        group relative flex flex-col overflow-hidden
        rounded-[24px] border border-border bg-card
        px-6 pt-8 pb-7
        shadow-[0_2px_12px_color-mix(in_oklch,var(--foreground)_5%,transparent)]
        transition-all duration-200
        active:scale-[.98] active:shadow-sm
      "
      style={
        isHighlight
          ? {
              borderColor: "color-mix(in oklch, var(--accent) 30%, transparent)",
              boxShadow:   "0 8px 32px color-mix(in oklch, var(--accent) 10%, transparent)",
            }
          : undefined
      }
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[3px] rounded-t-[22px] transition-opacity duration-200 hiw-bar-${index}`}
        style={{
          background: "linear-gradient(to left, var(--accent), var(--primary))",
          opacity:    isHighlight ? 1 : 0,
        }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-8px] start-4 select-none font-black leading-none"
        style={{
          fontSize:      100,
          letterSpacing: "-0.04em",
          color:         "color-mix(in oklch, var(--accent) 6%, transparent)",
        }}
      >
        {step.num}
      </span>

      <div
        className={`hiw-icon-${index} mb-5 flex h-14 w-14 items-center justify-center rounded-[16px] text-[24px] transition-all duration-220`}
        style={{
          background: isHighlight ? "color-mix(in oklch, var(--accent) 16%, transparent)" : "color-mix(in oklch, var(--accent) 10%, transparent)",
          border:     `1.5px solid ${isHighlight ? "color-mix(in oklch, var(--accent) 32%, transparent)" : "color-mix(in oklch, var(--accent) 22%, transparent)"}`,
        }}
      >
        <Icon emoji={step.icon} className="w-7 h-7" />
      </div>

      <p className="mb-2 text-[10.5px] font-black uppercase tracking-[.08em] text-accent">
        الخطوة {step.num}
      </p>
      <h3 className="relative z-10 mb-2.5 text-[17px] font-black leading-snug text-foreground">
        {step.title}
      </h3>
      <p className="relative z-10 flex-1 text-sm leading-[1.75] text-muted-foreground">
        {step.line}
      </p>
      <span
        className="relative z-10 mt-[18px] w-fit rounded-full px-3.5 py-1.5 text-[11.5px] font-black"
        style={{
          background: "color-mix(in oklch, var(--primary) 6%, transparent)",
          border:     "1px solid color-mix(in oklch, var(--primary) 14%, transparent)",
          color:      "var(--primary)",
        }}
      >
        {step.tag}
      </span>
    </Card>
  );
}
