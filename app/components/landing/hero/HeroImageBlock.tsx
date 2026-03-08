import Image from "next/image";

type Stat = { icon: string; num: string; label: string };

const STAT_CARD_CLASS =
  "absolute z-20 hidden animate-fade-in-up items-center gap-2.5 rounded-[16px] border border-border bg-card/92 px-4 py-3 shadow-[0_12px_32px_color-mix(in_oklch,var(--foreground)_9%,transparent),0_1px_0_color-mix(in_oklch,var(--background)_90%,transparent)_inset] backdrop-blur-md sm:flex";

function HeroStatCard({
  stat,
  delayClass,
  positionClass,
}: {
  stat: Stat;
  delayClass: string;
  positionClass: string;
}) {
  return (
    <div className={`${STAT_CARD_CLASS} ${delayClass} ${positionClass}`}>
      <span className="text-2xl">{stat.icon}</span>
      <div>
        <p className="text-sm font-black leading-snug text-foreground">{stat.num}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{stat.label}</p>
      </div>
    </div>
  );
}

type Props = {
  avatarSrc: string;
  stats: readonly Stat[];
  alt: string;
};

export function HeroImageBlock({ avatarSrc, stats, alt }: Props) {
  const [s0, s1] = stats;
  return (
    <div className="relative order-1 flex items-center justify-center py-6 md:py-0 lg:order-2">
      <div
        aria-hidden
        className="pointer-events-none absolute hidden rounded-[2.6rem] border border-primary/9 sm:block -inset-[16px] lg:-inset-[22px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute hidden rounded-[3rem] border border-primary/4 sm:block -inset-[32px] lg:-inset-[46px]"
      />

      {s0 && (
        <HeroStatCard
          stat={s0}
          delayClass="delay-500"
          positionClass="-top-3 -end-3 lg:-end-4"
        />
      )}
      {s1 && (
        <HeroStatCard
          stat={s1}
          delayClass="delay-700"
          positionClass="-bottom-1 -start-3 lg:-start-4"
        />
      )}

      <div
        className="relative z-10 animate-float p-7 rounded-[22px] sm:p-9 lg:p-11 lg:rounded-[30px]"
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
          className="pointer-events-none absolute inset-x-0 z-15 h-[40px]"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in oklch, var(--accent) 4%, transparent), transparent)",
            animation: "scanline 4s linear infinite",
          }}
        />

        <Image
          src={avatarSrc}
          alt={alt}
          width={400}
          height={400}
          priority
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 380px"
          className="relative z-10 h-auto w-full object-contain max-w-[220px] sm:max-w-[260px] lg:max-w-[300px]"
        />

        <div
          className="
            absolute left-1/2 z-25 -translate-x-1/2 whitespace-nowrap
            flex items-center gap-1.5 animate-fade-in-up delay-900
            rounded-full bg-primary text-primary-foreground font-extrabold
            text-[10px] px-4 py-1.5 -bottom-3
            sm:text-[11px] sm:px-5 sm:py-2 sm:-bottom-4
            shadow-[0_6px_20px_color-mix(in_oklch,var(--primary)_38%,transparent)]
          "
        >
          🔒 ضمان استرجاع ١٤ يوماً
        </div>
      </div>
    </div>
  );
}
