import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Mirrors app/[country]/checkout/page.tsx: title + summary card + form
 * (name/email/phone/card mount + terms + big pay button + trust badge).
 * Runs while server fetches plan + resolves error state. Container width
 * (max-w-3xl) and vertical rhythm match the real page so no CLS.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl" lang="ar">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Title + subtitle */}
        <div className="mb-6 text-center sm:mb-8">
          <Skeleton className="mx-auto h-8 w-56 rounded-md sm:h-9" />
          <Skeleton className="mx-auto mt-2 h-4 w-72 rounded-md" />
        </div>

        <div className="space-y-5">
          {/* Summary card — plan on right, total on left */}
          <section className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 px-5 py-4">
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-3 w-12 rounded-md" />
              <Skeleton className="h-6 w-40 rounded-md" />
            </div>
            <div className="shrink-0 space-y-1.5 text-end">
              <Skeleton className="ms-auto h-7 w-24 rounded-md" />
              <Skeleton className="ms-auto h-3 w-28 rounded-md" />
            </div>
          </section>

          {/* Form fields */}
          <div className="space-y-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}

            {/* N-Genius card mount placeholder — the real SDK injects an
                iframe here, ~90px tall on average. */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5">
              <Skeleton className="mt-0.5 h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 flex-1 max-w-md rounded-md" />
            </div>

            {/* Big pay button */}
            <Skeleton className="h-14 w-full rounded-xl" />

            {/* Trust badge */}
            <Skeleton className="h-10 w-full rounded-lg" />

            {/* PCI note */}
            <div className="flex justify-center">
              <Skeleton className="h-3 w-64 rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
