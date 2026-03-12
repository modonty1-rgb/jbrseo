import Link from "@/app/components/link";

type OutcomesBottomStripProps = {
  ctaLink: string;
  cta: string;
  badgeText: string;
  message: string;
  messageHighlight: string;
};

export function OutcomesBottomStrip({
  ctaLink,
  cta,
  badgeText,
  message,
  messageHighlight,
}: OutcomesBottomStripProps) {
  return (
    <div
      className="
        flex flex-col items-center gap-5 rounded-[20px] border border-border p-6
        sm:flex-row sm:gap-6 sm:px-7 sm:py-5
      "
      style={{
        background: "linear-gradient(135deg, color-mix(in oklch, var(--primary) 4%, transparent), color-mix(in oklch, var(--accent) 3%, transparent))",
        animation: "fadeUp .5s .4s ease both",
        opacity: 0,
      }}
    >
      <div className="flex-1 text-center sm:text-start">
        <div
          className="mb-2.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-black"
          style={{
            background: "color-mix(in oklch, var(--accent) 8%, transparent)",
            border: "1px solid color-mix(in oklch, var(--accent) 20%, transparent)",
            color: "var(--accent)",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-success"
            aria-hidden
          />
          {badgeText}
        </div>
        <p className="text-[15px] font-bold leading-relaxed text-foreground">
          {message}
          <span className="text-accent">{messageHighlight}</span>
        </p>
      </div>
      <div
        className="hidden sm:block h-10 w-px bg-border shrink-0"
        aria-hidden
      />
      <Link
        href={ctaLink}
        className="
          group/btn relative overflow-hidden shrink-0
          inline-flex items-center gap-2.5 rounded-full
          bg-primary px-8 py-3.5
          text-[15px] font-black text-primary-foreground
          shadow-[0_4px_24px_color-mix(in_oklch,var(--primary)_28%,transparent)]
          transition-all duration-200
          hover:shadow-[0_10px_36px_color-mix(in_oklch,var(--primary)_40%,transparent)] hover:-translate-y-0.5
          w-full justify-center sm:w-auto
        "
      >
        <span
          aria-hidden
          className="absolute inset-0 translate-x-[110%] bg-linear-to-r from-transparent via-primary-foreground/15 to-transparent group-hover/btn:animate-shimmer"
        />
        <span className="relative">{cta}</span>
        <span
          aria-hidden
          className="relative text-base transition-transform duration-200 group-hover/btn:-translate-x-1"
        >
          ←
        </span>
      </Link>
    </div>
  );
}
