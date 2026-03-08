export function OutcomesBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: 0.018,
          backgroundImage:
            "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-1/2 h-[300px] w-[800px] -translate-x-1/2 rounded-full blur-[90px]"
        style={{ background: "color-mix(in oklch, var(--accent) 4%, transparent)" }}
      />
    </>
  );
}
