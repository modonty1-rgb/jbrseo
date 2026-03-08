export function SocialProofBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full blur-[80px]"
        style={{ background: "color-mix(in oklch, var(--accent) 4%, transparent)" }}
      />
    </>
  );
}
