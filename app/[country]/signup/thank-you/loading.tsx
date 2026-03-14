export default function CountryThankYouLoading() {
  return (
    <div
      className="relative min-h-[80vh] overflow-hidden px-4 py-20 flex justify-center items-center landing-grain"
      dir="rtl"
      aria-hidden
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 start-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 end-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-success/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-xl text-center space-y-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-success/15 border-2 border-success/40 animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-28 rounded-full bg-muted/60 animate-pulse mx-auto" />
          <div className="h-9 w-56 rounded-lg bg-muted/60 animate-pulse mx-auto" />
          <div className="h-4 w-80 max-w-full rounded bg-muted/50 animate-pulse mx-auto" />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 text-start space-y-3">
          <div className="h-4 w-40 rounded bg-muted/50 animate-pulse" />
          <ul className="space-y-2.5">
            {[1, 2].map((i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-5 w-5 shrink-0 rounded-full bg-muted/50 animate-pulse" />
                <div className="h-4 w-full rounded bg-muted/40 animate-pulse" />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <div className="h-12 w-44 rounded-full bg-muted/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
