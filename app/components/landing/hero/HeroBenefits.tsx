import Link from "@/app/components/link";

type Benefit = { objection: string; answer: string };

export function HeroBenefits({ benefits }: { benefits: readonly Benefit[] }) {
  return (
    <div className="landing-reveal-content mb-8 overflow-hidden rounded-[18px] border border-border bg-card shadow-sm">
      {benefits.map((b, i) => (
        <div
          key={i}
          className="flex cursor-default flex-col gap-2 border-b border-border px-4 py-3.5 transition-colors duration-150 last:border-0 hover:bg-muted/50 sm:gap-2.5 sm:px-[18px]"
        >
          {i === 0 ? (
            <Link
              href="#how-it-works"
              className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20 transition-colors hover:bg-primary/15"
            >
              {b.objection}
            </Link>
          ) : (
            <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
              {b.objection}
            </span>
          )}
          <span className="text-sm leading-relaxed text-foreground/85 sm:text-[14.5px]">
            {b.answer}
          </span>
        </div>
      ))}
    </div>
  );
}
