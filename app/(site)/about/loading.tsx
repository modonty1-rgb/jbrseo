import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <section className="space-y-4 text-center">
        <Skeleton className="mx-auto h-3 w-28 rounded-md" />
        <Skeleton className="mx-auto h-8 w-64 max-w-full rounded-md sm:h-9" />
        <Skeleton className="mx-auto h-4 w-full max-w-2xl rounded-md" />
      </section>

      <section className="space-y-6 rounded-2xl border border-border/60 bg-card/40 px-5 py-6 sm:px-7 sm:py-7">
        <Skeleton className="h-4 w-32 rounded-md" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 rounded-xl bg-background/40 p-4">
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-3 w-4/5 rounded-md" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-4 w-48 rounded-md" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-4 w-40 rounded-md" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40">
              <Skeleton className="aspect-square w-full max-w-56 rounded-none sm:max-w-64" />
              <div className="flex flex-col items-start p-4 space-y-2">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-4 w-28 rounded-md" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </section>

      <section className="space-y-3 rounded-2xl border border-border/60 bg-card/40 px-5 py-6 sm:px-7">
        <Skeleton className="h-4 w-48 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-1 rounded-xl bg-background/40 p-3">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/60 px-5 py-6 text-center sm:px-7">
        <Skeleton className="mx-auto mb-2 h-4 w-40 rounded-md" />
        <Skeleton className="mx-auto mb-4 h-4 w-64 rounded-md" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
      </section>
    </div>
  );
}
