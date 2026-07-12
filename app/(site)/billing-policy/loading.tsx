import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Mirrors app/(site)/billing-policy/page.tsx structure 1:1.
 * The page is synchronous (no async data), so this rarely renders — but it
 * exists to satisfy the "loading.tsx = page.tsx 100%" rule and provide a
 * clean fallback on slow RSC streaming.
 */
export default function Loading() {
  return (
    <main className="bg-background text-foreground" dir="rtl" lang="ar">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* HERO */}
        <section className="text-center mb-12">
          <Skeleton className="mx-auto mb-4 h-7 w-56 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-10 w-72 rounded-md sm:h-12 sm:w-96" />
          <div className="mx-auto max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="mx-auto h-4 w-11/12 rounded-md" />
            <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
          </div>
        </section>

        {/* PROMISE — success-tinted card */}
        <SkeletonCard bullets={2} />

        {/* IF WE DELAY */}
        <SkeletonCard bullets={2} />

        {/* WHAT WE DON'T COMMIT TO */}
        <SkeletonCard bullets={3} taller />

        {/* HOW TO REQUEST — has a CTA button */}
        <section className="mb-10 rounded-2xl border border-info/25 bg-info/5 p-6 sm:p-8">
          <div className="mb-4 flex items-start gap-3">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="h-3 w-56 rounded-md" />
            </div>
          </div>
          <div className="mb-5 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
          <Skeleton className="h-12 w-56 rounded-xl" />
        </section>

        {/* CLOSING NOTE */}
        <section className="rounded-2xl border border-border/60 bg-muted/20 p-6 text-center">
          <div className="space-y-2">
            <Skeleton className="mx-auto h-3 w-full rounded-md" />
            <Skeleton className="mx-auto h-3 w-2/3 rounded-md" />
          </div>
        </section>
      </div>
    </main>
  );
}

// Shared card shell — icon square + title + subtitle + bulleted list.
function SkeletonCard({ bullets, taller = false }: { bullets: number; taller?: boolean }) {
  return (
    <section className="mb-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="mb-4 flex items-start gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-3 w-56 rounded-md" />
        </div>
      </div>
      <ul className="space-y-3">
        {Array.from({ length: bullets }).map((_, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Skeleton className="mt-1 h-3 w-3 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-full rounded-md" />
              {taller && <Skeleton className="h-3.5 w-11/12 rounded-md" />}
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
