import Link from "@/app/components/link";

type Props = { ctaLink: string; cta: string; guarantee: string };

export function HowItWorksCTA({ ctaLink, cta, guarantee }: Props) {
  return (
    <div
      className="flex flex-col items-center gap-3.5"
      style={{ animation: "fadeUp .5s .4s ease both", opacity: 0 }}
    >
      <Link
        href={ctaLink}
        className="
          group relative overflow-hidden
          inline-flex items-center gap-2.5
          rounded-full bg-primary px-12 py-4
          text-base font-black text-primary-foreground
          shadow-[0_4px_28px_color-mix(in_oklch,var(--primary)_28%,transparent),0_1px_0_color-mix(in_oklch,var(--primary)_90%,transparent)_inset]
          transition-all duration-200
          hover:shadow-[0_10px_40px_color-mix(in_oklch,var(--primary)_40%,transparent)] hover:-translate-y-0.5
          w-full justify-center sm:w-auto
        "
      >
        <span
          aria-hidden
          className="absolute inset-0 translate-x-[110%] bg-linear-to-r from-transparent via-primary-foreground/15 to-transparent group-hover:animate-shimmer"
        />
        <span className="relative">{cta}</span>
        <span
          aria-hidden
          className="relative text-[18px] transition-transform duration-200 group-hover:-translate-x-1"
        >
          ←
        </span>
      </Link>
      <p className="text-xs text-muted-foreground">{guarantee}</p>
    </div>
  );
}
