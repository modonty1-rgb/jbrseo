import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Fallback while server-side DB read (subscriber) + reason resolution complete.
 * Mirrors the failed page's four blocks (icon+title, reason card, actions,
 * reassurance note). Actions default to the "canRetry" shape (retry + WA) —
 * escalation-only mode will just show one button instead of two, minor shift.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl" lang="ar">
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Fail icon + title + subtitle */}
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto mt-6 h-8 w-52 rounded-md sm:h-9" />
          <div className="mx-auto mt-3 max-w-md space-y-2">
            <Skeleton className="mx-auto h-4 w-full rounded-md" />
            <Skeleton className="mx-auto h-4 w-4/5 rounded-md" />
          </div>
        </div>

        {/* Reason block */}
        <div className="mb-6 rounded-2xl border border-destructive/25 bg-destructive/5 p-5 sm:p-6">
          <Skeleton className="mb-3 h-3 w-20 rounded-md" />
          <Skeleton className="mb-2 h-5 w-3/4 rounded-md" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
          </div>
        </div>

        {/* Actions — retry + WA */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Reassurance note */}
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-3 w-72 rounded-md" />
        </div>
      </main>
    </div>
  );
}
