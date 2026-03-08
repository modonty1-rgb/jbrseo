export function HeroEyebrow({ proof }: { proof: string }) {
  return (
    <div className="landing-reveal-eyebrow mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-muted/85 px-[18px] py-2 shadow-sm ring-1 ring-accent/20 backdrop-blur-sm">
      <span
        aria-hidden
        className="h-[9px] w-[9px] shrink-0 bg-success animate-diamond-pulse"
        style={{ transform: "rotate(45deg)" }}
      />
      <span className="text-xs font-bold tracking-wide text-muted-foreground">
        {proof}
      </span>
    </div>
  );
}
