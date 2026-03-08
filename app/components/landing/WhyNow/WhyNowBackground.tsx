export function WhyNowBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -start-20 h-[500px] w-[500px] rounded-full blur-[80px]"
        style={{ background: "color-mix(in oklch, var(--accent) 5%, transparent)" }}
      />
    </>
  );
}
