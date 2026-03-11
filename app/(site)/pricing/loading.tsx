import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="bg-background text-foreground" dir="rtl" lang="ar">
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Skeleton className="mb-3 h-3 w-24 rounded-md" />
          <Skeleton className="mb-4 h-10 w-72 max-w-full rounded-md sm:h-12" />
          <Skeleton className="mb-6 h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="mb-6 h-3 w-56 rounded-md" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 text-right">
          <Skeleton className="mb-1 h-4 w-48 rounded-md" />
          <Skeleton className="h-3 w-64 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 max-lg:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
        <div className="mt-10 grid gap-4 border-t border-border/60 pt-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-card/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-3 w-32 rounded-md" />
            <div className="mt-2 flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-8 w-40 rounded-md" />
        </div>
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      </section>
    </main>
  );
}
