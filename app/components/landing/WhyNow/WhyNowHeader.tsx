type Props = {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
};

export function WhyNowHeader({ eyebrow, title1, title2, subtitle }: Props) {
  return (
    <div className="landing-reveal-eyebrow mb-16 text-center">
      <div
        className="mb-4 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5"
        style={{
          background: "color-mix(in oklch, var(--accent) 8%, transparent)",
          boxShadow: "0 0 12px color-mix(in oklch, var(--accent) 40%, transparent), 0 0 24px color-mix(in oklch, var(--accent) 20%, transparent)",
        }}
      >
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-accent" aria-hidden />
        <span className="text-[12px] font-black uppercase tracking-[.12em] text-accent">{eyebrow}</span>
      </div>
      <h2
        id="why-now-title"
        className="landing-reveal-title font-black tracking-[-0.035em] text-foreground"
        style={{ fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: 1.08 }}
      >
        {title1}{" "}
        <span className="text-accent">{title2}</span>
      </h2>
      <p className="landing-reveal-content mx-auto mt-3 max-w-[480px] text-base leading-[1.7] text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
