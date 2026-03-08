type SocialProofHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function SocialProofHeader({ eyebrow, title, subtitle }: SocialProofHeaderProps) {
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
        id="social-proof-title"
        className="landing-reveal-title mb-2 font-black tracking-[-0.03em] text-foreground"
        style={{ fontSize: "clamp(28px, 3.6vw, 46px)", lineHeight: 1.1 }}
      >
        {title}
      </h2>
      <p className="landing-reveal-content text-[15px] text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
