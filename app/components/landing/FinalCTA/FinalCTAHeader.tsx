type FinalCTAHeaderProps = {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
};

export function FinalCTAHeader({ eyebrow, title1, title2, subtitle }: FinalCTAHeaderProps) {
  return (
    <>
      <div
        className="final-cta-eyebrow mb-6 inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[12px] font-black uppercase tracking-[.12em]"
        style={{
          animation: "fadeUp .4s ease both",
          color: "var(--final-cta-accent)",
          background: "color-mix(in oklch, var(--final-cta-accent) 12%, transparent)",
          boxShadow: "0 0 12px color-mix(in oklch, var(--final-cta-accent) 35%, transparent), 0 0 24px color-mix(in oklch, var(--final-cta-accent) 18%, transparent)",
        }}
      >
        <span className="h-[6px] w-[6px] shrink-0 rounded-full final-cta-eyebrow-bar" style={{ background: "var(--final-cta-accent)" }} aria-hidden />
        {eyebrow}
      </div>
      <h2
        id="final-cta-title"
        className="landing-reveal-title mb-2 font-bold leading-[1.1] tracking-[-0.02em] text-primary-foreground"
        style={{
          fontFamily: "'Amiri', serif",
          fontSize: "clamp(38px, 6vw, 72px)",
          animation: "fadeUp .4s .08s ease both",
          opacity: 0,
        }}
      >
        {title1}
      </h2>
      <p
        className="mb-5 font-bold leading-snug text-primary-foreground/90 dark:text-primary-foreground"
        style={{
          fontSize: "clamp(18px, 2.8vw, 28px)",
          animation: "fadeUp .4s .14s ease both",
          opacity: 0,
        }}
      >
        {title2}
      </p>
      <p
        className="mx-auto mb-9 max-w-[480px] leading-[1.8] text-primary-foreground/70"
        style={{ fontSize: 15, animation: "fadeUp .4s .2s ease both", opacity: 0 }}
      >
        {subtitle}
      </p>
    </>
  );
}
