import Link from "@/app/components/link";

type Props = {
  ctaText: string;
  ctaBtn: string;
  ctaLink: string;
  highlightText: string;
};

export function WhyNowBottomBar({ ctaText, ctaBtn, ctaLink, highlightText }: Props) {
  return (
    <div
      className="
        flex flex-col items-center gap-4 rounded-[18px] border border-border px-6 py-5 text-center
        sm:flex-row sm:justify-between sm:text-start
        mt-2
      "
      style={{
        background: "linear-gradient(135deg, color-mix(in oklch, var(--primary) 4%, transparent), color-mix(in oklch, var(--accent) 3%, transparent))",
        animation:  "fadeUp .5s .5s ease both",
        opacity: 0,
      }}
    >
      <p className="text-[15px] font-bold leading-relaxed text-foreground">
        {ctaText} —{" "}
        <span style={{ color: "var(--accent)" }}>{highlightText}</span>
      </p>
      <Link
        href={ctaLink}
        className="
          inline-flex shrink-0 items-center gap-2 rounded-full
          bg-primary px-7 py-3 text-[14px] font-black text-primary-foreground
          shadow-[0_4px_20px_color-mix(in_oklch,var(--primary)_25%,transparent)]
          transition-all duration-200
          hover:shadow-[0_8px_32px_color-mix(in_oklch,var(--primary)_38%,transparent)] hover:-translate-y-0.5
          w-full justify-center sm:w-auto
        "
      >
        {ctaBtn} ←
      </Link>
    </div>
  );
}
