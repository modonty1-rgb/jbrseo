import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

type Props = {
  cta: string;
  ctaLink: string;
  trust: readonly string[];
  seatsTotal: number;
  seatsTaken: number;
  socialLine: string;
};

export function HeroCTASection({
  cta,
  ctaLink,
  trust,
  seatsTotal,
  seatsTaken,
  socialLine,
}: Props) {
  const seatsLeft = seatsTotal - seatsTaken;

  return (
    <div className="landing-reveal-content">
      <Button
        asChild
        size="lg"
        className="
          group relative w-full overflow-hidden rounded-full
          px-8 py-[17px] text-base font-black
          shadow-[0_4px_30px_color-mix(in_oklch,var(--primary)_30%,transparent),0_1px_0_color-mix(in_oklch,var(--primary)_90%,transparent)_inset,0_-1px_0_color-mix(in_oklch,var(--primary)_40%,transparent)_inset]
          transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-[0_10px_44px_color-mix(in_oklch,var(--primary)_42%,transparent)]
          sm:w-auto
        "
      >
        <Link href={ctaLink}>
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[110%] bg-linear-to-r from-transparent via-primary-foreground/14 to-transparent group-hover:animate-shimmer"
          />
          <span className="relative">{cta}</span>
          <ArrowLeft
            className="relative ms-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1.5"
            aria-hidden
          />
        </Link>
      </Button>

      <div className="mt-3.5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-0">
        {trust.map((t, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && (
              <span className="mx-3.5 hidden h-[3px] w-[3px] rounded-full bg-border sm:block" />
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-success/12 text-[8px] font-black text-success">
                ✓
              </span>
              {t}
            </span>
          </span>
        ))}
      </div>

      <div
        className="mt-5 flex w-full items-center gap-3 rounded-[14px] border border-primary/15 px-4 py-3 sm:w-fit"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--primary) 5%, transparent), color-mix(in oklch, var(--accent) 4%, transparent))",
        }}
      >
        <div className="flex max-w-[160px] flex-wrap gap-[5px] sm:max-w-[180px]">
          {Array.from({ length: seatsTotal }).map((_, i) => (
            <div
              key={i}
              className="h-[9px] w-[9px] rounded-sm transition-colors duration-300"
              style={{
                transform: "rotate(45deg)",
                background:
                  i < seatsTaken
                    ? "color-mix(in oklch, var(--primary) 22%, transparent)"
                    : "var(--primary)",
              }}
            />
          ))}
        </div>
        <div>
          <p className="text-[13px] font-black leading-snug text-primary">
            {seatsLeft} مقعد متبقي من {seatsTotal}
          </p>
          <p className="mt-0.5 text-[10.5px] text-muted-foreground">
            {socialLine} — السعر يرتفع بعد الإغلاق
          </p>
        </div>
      </div>
    </div>
  );
}
