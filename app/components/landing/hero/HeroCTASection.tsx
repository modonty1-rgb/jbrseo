import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@/app/components/Icon";

type Props = {
  cta: string;
  ctaLink: string;
  trust: readonly string[];
  secondaryCta?: { label: string; href: string };
};

export function HeroCTASection({ cta, ctaLink, trust, secondaryCta }: Props) {
  return (
    <div className="landing-reveal-content">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
            <span
              className="relative ms-2 inline-block text-lg transition-transform duration-200 group-hover:-translate-x-1.5"
              aria-hidden
            >
              ←
            </span>
          </Link>
        </Button>
        {secondaryCta?.href && secondaryCta?.label && (
          <a
            href={secondaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-transparent px-6 py-[17px] text-sm font-bold text-muted-foreground
              transition-colors hover:bg-muted/60 hover:text-foreground
              sm:py-[15px]
            "
          >
            {secondaryCta.label}
          </a>
        )}
      </div>

      <div className="mt-3.5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-0">
        {trust.map((t, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && (
              <span className="mx-3.5 hidden h-[3px] w-[3px] rounded-full bg-border sm:block" />
            )}
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-success/12 text-[8px] font-black text-success">
                <Icon emoji="✓" />
              </span>
              {t}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
