import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 sm:px-8 lg:px-12">
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pt-16 pb-24 sm:pt-20 sm:pb-32 lg:pt-[92px] lg:pb-[160px]">
          <div className="relative z-10 mx-auto max-w-5xl flex flex-col items-center">
            <Skeleton className="mb-2 h-4 w-32 rounded-md" />
            <Skeleton className="mb-3 h-10 w-full max-w-md rounded-md" />
            <Skeleton className="mb-3 h-10 w-4/5 max-w-sm rounded-md" />
            <Skeleton className="mb-8 h-5 w-full max-w-[490px] rounded-md" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-28 rounded-md" />
              <Skeleton className="h-11 w-28 rounded-md" />
            </div>
          </div>
        </section>

        {/* Why Now */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-2 h-4 w-20 rounded-md" />
            <Skeleton className="mb-6 h-8 w-64 rounded-md" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full max-w-2xl rounded-md" />
              <Skeleton className="h-4 w-full max-w-xl rounded-md" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-2 h-4 w-16 rounded-md" />
            <Skeleton className="mb-8 h-8 w-40 rounded-md" />
            <div className="grid gap-6 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-2 h-4 w-24 rounded-md" />
            <Skeleton className="mb-8 h-8 w-52 rounded-md" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <Skeleton className="mb-2 h-4 w-24 rounded-md" />
            <Skeleton className="mb-8 h-8 w-48 rounded-md" />
            <Skeleton className="mb-6 h-24 w-full max-w-2xl rounded-xl" />
            <div className="flex flex-wrap gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-24 rounded-md" />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <Skeleton className="mb-2 h-4 w-16 rounded-md" />
            <Skeleton className="mb-8 h-8 w-32 rounded-md" />
            <div className="grid grid-cols-1 gap-4 max-lg:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <Skeleton className="mb-2 h-4 w-20 rounded-md" />
            <Skeleton className="mb-8 h-8 w-40 rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 pb-24 sm:py-16 sm:pb-32">
          <div className="mx-auto max-w-2xl text-center">
            <Skeleton className="mx-auto mb-6 h-9 w-72 rounded-md" />
            <Skeleton className="mx-auto h-12 w-36 rounded-md" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <Skeleton className="h-6 w-24 rounded-md" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-4 w-16 rounded-md" />
              ))}
            </div>
          </div>
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
      </footer>
    </div>
  );
}
