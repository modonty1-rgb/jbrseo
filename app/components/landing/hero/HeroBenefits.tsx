type Benefit = { objection: string; answer: string };

export function HeroBenefits({ benefits }: { benefits: readonly Benefit[] }) {
  return (
    <div className="landing-reveal-content mb-8 overflow-hidden rounded-[18px] border border-border bg-card shadow-sm">
      {benefits.map((b, i) => (
        <div
          key={i}
          className="flex cursor-default items-start gap-3 border-b border-border px-4 py-3.5 transition-colors duration-150 last:border-0 hover:bg-muted/50 sm:gap-3.5 sm:px-[18px]"
        >
          <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
            <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-success/12 text-[10px] font-black text-success ring-1 ring-success/22">
              ✓
            </span>
            <span className="mt-1 whitespace-nowrap text-[10.5px] font-extrabold text-muted-foreground">
              {b.objection}
            </span>
          </div>
          <span className="text-sm leading-relaxed text-foreground/85 sm:text-[14.5px]">
            {b.answer}
          </span>
        </div>
      ))}
    </div>
  );
}
