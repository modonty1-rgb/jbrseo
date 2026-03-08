export function HeroHeadline({ line1, line2 }: { line1: string; line2: string }) {
  return (
    <h1
      id="hero-title"
      className="
        landing-reveal-title font-black text-foreground
        text-[36px] leading-[1.08] tracking-[-0.025em]
        sm:text-[48px]
        lg:text-[clamp(52px,5vw,68px)] lg:leading-[1.03] lg:tracking-[-0.035em]
        mb-0
      "
    >
      {line1}
      <br />
      <span className="relative inline-block text-primary">
        {line2}
        <span
          aria-hidden
          className="absolute -bottom-2 inset-x-0 h-1 rounded-full"
          style={{
            background:
              "linear-gradient(to left, transparent, var(--accent) 40%, color-mix(in oklch, var(--accent) 60%, transparent))",
          }}
        />
      </span>
    </h1>
  );
}
