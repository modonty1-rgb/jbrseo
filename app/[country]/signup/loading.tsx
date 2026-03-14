export default function CountrySignupLoading() {
  return (
    <div
      className="relative min-h-[70vh] overflow-hidden px-4 py-20 flex justify-center items-start landing-grain"
      dir="rtl"
      aria-hidden
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 start-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-20 end-1/4 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md lg:max-w-4xl rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl p-6 lg:p-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-5">
          <div className="h-3 w-32 rounded-full bg-muted/60 animate-pulse" />
          <div className="inline-flex gap-2 p-1 rounded-full bg-muted/60 w-fit">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-16 rounded-full bg-muted/50 animate-pulse" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-20 rounded-full bg-muted/50 animate-pulse" />
            <div className="h-6 w-24 rounded bg-muted/40 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-3 w-16 rounded bg-muted/40 animate-pulse mb-2" />
                <div className="h-10 w-full rounded-lg bg-muted/50 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-12 w-full rounded-full bg-muted/60 animate-pulse mt-2" />
        </div>
        <div className="hidden lg:block space-y-4">
          <div className="h-4 w-48 rounded bg-muted/50 animate-pulse" />
          <div className="h-3 w-full rounded bg-muted/40 animate-pulse" />
          <div className="h-3 w-full max-w-[85%] rounded bg-muted/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
