export function HeroBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div
        aria-hidden
        className="hero-glow-pulse pointer-events-none absolute -top-[200px] -end-[120px] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,_hsl(var(--primary)/0.07)_0%,_transparent_70%)]"
      />
      <div
        aria-hidden
        className="hero-glow-pulse-delay pointer-events-none absolute -bottom-[60px] -start-[80px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,_hsl(var(--accent)/0.05)_0%,_transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[1.5px] bg-linear-to-r from-transparent via-accent/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] bg-linear-to-t from-background to-transparent"
      />
    </>
  );
}
