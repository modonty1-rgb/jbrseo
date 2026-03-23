export default function CountryPricingLoading() {
  return (
    <div className="bg-background text-foreground" dir="rtl" aria-hidden>
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-4xl flex flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="h-3 w-24 rounded-full bg-muted/60 animate-pulse mb-3" />
          <div className="h-10 w-72 max-w-full rounded-lg bg-muted/60 animate-pulse mb-4" />
          <div className="h-4 w-96 max-w-full rounded bg-muted/50 animate-pulse mb-6" />
          <div className="h-3 w-64 rounded bg-muted/40 animate-pulse mb-6" />
          <div className="flex flex-wrap justify-center gap-3">
            <div className="h-10 w-36 rounded-full bg-muted/50 animate-pulse" />
            <div className="h-10 w-44 rounded-full bg-muted/50 animate-pulse" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 text-right">
          <div className="h-4 w-48 rounded bg-muted/50 animate-pulse mb-1" />
          <div className="h-3 w-64 rounded bg-muted/40 animate-pulse" />
        </div>
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="h-10 w-32 rounded-full bg-muted/50 animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-4 items-stretch max-lg:grid-cols-2 max-sm:grid-cols-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card/80 p-6">
              <div className="h-4 w-20 rounded bg-muted/60 animate-pulse mb-3" />
              <div className="h-8 w-14 rounded bg-muted/50 animate-pulse mb-4" />
              <div className="space-y-2 mb-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-3 w-full rounded bg-muted/40 animate-pulse" />
                ))}
              </div>
              <div className="h-11 w-full rounded-full bg-muted/50 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-4 border-t border-border/60 pt-6">
          <div className="h-4 w-32 rounded bg-muted/40 animate-pulse" />
          <div className="h-3 w-full rounded bg-muted/30 animate-pulse" />
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-card/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-24 rounded bg-muted/50 animate-pulse" />
          <div className="h-4 w-40 rounded bg-muted/40 animate-pulse" />
        </div>
      </section>
    </div>
  );
}
