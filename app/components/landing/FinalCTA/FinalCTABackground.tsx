export function FinalCTABackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--primary-foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, color-mix(in oklch, var(--final-cta-accent) 30%, transparent), transparent)",
          animation: "scan 6s linear infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[120px] -end-[80px] h-[500px] w-[500px] rounded-full blur-[100px]"
        style={{ background: "color-mix(in oklch, var(--final-cta-accent) 10%, transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[100px] -start-[60px] h-[400px] w-[400px] rounded-full blur-[80px]"
        style={{ background: "color-mix(in oklch, var(--final-cta-accent) 6%, transparent)" }}
      />
    </>
  );
}
