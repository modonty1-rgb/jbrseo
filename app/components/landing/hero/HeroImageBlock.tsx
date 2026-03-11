import Image from "next/image";

const DEFAULT_GUARANTEE_BADGE = "🔒 ضمان استرجاع ١٤ يوماً";

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

type Props = {
  avatarSrc: string;
  alt: string;
  guaranteeBadge?: string;
};

export function HeroImageBlock({ avatarSrc, alt, guaranteeBadge }: Props) {
  const badgeText = guaranteeBadge?.trim() || DEFAULT_GUARANTEE_BADGE;
  return (
    <div className="relative order-1 flex w-full items-center justify-center py-6 md:py-0 lg:order-2">
      <div
        className="relative z-10 w-full animate-float rounded-[22px] p-7 sm:max-w-[260px] sm:p-9 sm:mx-auto lg:max-w-[300px] lg:p-11 lg:rounded-[30px] lg:hover:-translate-y-[2px] lg:hover:shadow-[0_40px_80px_color-mix(in_oklch,var(--primary)_40%,transparent)] transition duration-200"
        style={{
          background:
            "linear-gradient(150deg, color-mix(in oklch, var(--primary) 40%, transparent), color-mix(in oklch, var(--primary) 25%, transparent), color-mix(in oklch, var(--accent) 20%, transparent))",
          border: "1.5px solid color-mix(in oklch, var(--accent) 35%, transparent)",
          boxShadow:
            "0 0 0 1px color-mix(in oklch, var(--accent) 15%, transparent), 0 36px 88px color-mix(in oklch, var(--primary) 30%, transparent)",
        }}
      >
        <div
          aria-hidden
          className="hero-scanline pointer-events-none absolute inset-x-0 z-15 h-[40px]"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in oklch, var(--accent) 4%, transparent), transparent)",
          }}
        />

        <div className="relative z-10 mx-auto aspect-square w-full max-w-[280px] sm:max-w-[260px] lg:max-w-[300px] lg:aspect-4/5 overflow-hidden rounded-[18px]">
          <Image
            src={avatarSrc}
            alt={alt}
            width={400}
            height={400}
            preload
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 300px"
            className="h-full w-full object-contain lg:object-cover"
          />
        </div>

        <div
          className="
            absolute left-1/2 z-25 -translate-x-1/2 whitespace-nowrap
            flex items-center gap-1.5 animate-fade-in-up delay-900
            rounded-full bg-primary text-primary-foreground font-extrabold
            text-[9px] px-4 py-1 -bottom-4
            sm:text-[10px] sm:px-5 sm:py-2 sm:-bottom-5
            border border-primary/40
            shadow-[0_6px_20px_color-mix(in_oklch,var(--primary)_30%,transparent)]
          "
        >
          {badgeText}
        </div>
      </div>
    </div>
  );
}
