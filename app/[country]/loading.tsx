export default function CountryHomeLoading() {
  return (
    <div className="min-h-screen" dir="rtl" aria-hidden>
      <header className="border-b border-border bg-background/95 px-4 py-3" aria-hidden>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="h-8 w-24 rounded-md bg-muted/60" />
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-md bg-muted/60" />
            <div className="h-9 w-24 rounded-md bg-muted/60" />
          </div>
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12"
        aria-busy="true"
        aria-label="جاري التحميل"
      >
        <section className="px-5 pt-16 pb-24 sm:px-8 sm:pt-20 sm:pb-32 lg:px-12 lg:pt-[92px] lg:pb-[160px]">
          <div className="mx-auto max-w-5xl flex flex-col items-center">
            <div className="h-4 w-32 rounded-full bg-muted/60 animate-pulse mb-4" />
            <div className="h-12 w-full max-w-md rounded-lg bg-muted/60 animate-pulse mb-2" />
            <div className="h-12 w-full max-w-sm rounded-lg bg-muted/50 animate-pulse mb-6" />
            <div className="h-4 w-64 rounded bg-muted/50 animate-pulse mb-8" />
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-24 rounded-full bg-muted/50 animate-pulse" />
              ))}
            </div>
            <div className="h-12 w-48 rounded-full bg-muted/60 animate-pulse" />
          </div>
        </section>
        {[1, 2, 3, 4, 5].map((i) => (
          <section key={i} className="border-t border-border px-5 py-16 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="h-4 w-24 rounded bg-muted/50 animate-pulse mb-4" />
              <div className="h-8 w-full max-w-md rounded-lg bg-muted/60 animate-pulse mb-6" />
              <div className="h-4 w-full rounded bg-muted/40 animate-pulse mb-4" />
              <div className="h-4 w-full max-w-[90%] rounded bg-muted/40 animate-pulse" />
            </div>
          </section>
        ))}
        <section className="px-5 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/60 p-6">
                  <div className="h-4 w-20 rounded bg-muted/60 animate-pulse mb-4" />
                  <div className="h-8 w-16 rounded bg-muted/50 animate-pulse mb-4" />
                  <div className="h-3 w-full rounded bg-muted/40 animate-pulse mb-2" />
                  <div className="h-3 w-full max-w-[85%] rounded bg-muted/40 animate-pulse mb-4" />
                  <div className="h-10 w-full rounded-full bg-muted/50 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-5 pt-[100px] pb-20 sm:px-8 sm:pt-[110px] sm:pb-24">
          <div className="mx-auto max-w-[680px] flex flex-col items-center text-center">
            <div className="h-4 w-28 rounded bg-muted/50 animate-pulse mb-6" />
            <div className="h-10 w-64 rounded-lg bg-muted/60 animate-pulse mb-4" />
            <div className="h-6 w-48 rounded-full bg-muted/50 animate-pulse" />
          </div>
        </section>
      </main>
      <footer className="border-t border-border bg-muted/30 px-4 py-8" aria-hidden>
        <div className="mx-auto max-w-6xl">
          <div className="h-4 w-48 rounded bg-muted/60" />
        </div>
      </footer>
    </div>
  );
}
