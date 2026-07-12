import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Fallback while server-side DB read + plan lookup + status routing complete.
 * Mirrors the success page's four blocks (icon, invoice card, CTA, email
 * notice) so nothing jumps when data arrives.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl" lang="ar">
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Success icon + title + subtitle */}
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto mt-6 h-8 w-52 rounded-md sm:h-9" />
          <div className="mx-auto mt-3 max-w-md space-y-2">
            <Skeleton className="mx-auto h-4 w-full rounded-md" />
            <Skeleton className="mx-auto h-4 w-4/5 rounded-md" />
          </div>
        </div>

        {/* Invoice block */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <Skeleton className="mb-4 h-3 w-28 rounded-md" />
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
            <Skeleton className="h-3 w-52 rounded-md" />
          </div>
        </div>

        {/* Primary CTA */}
        <Skeleton className="mb-4 h-14 w-full rounded-xl" />

        {/* Email notice */}
        <div className="flex items-start gap-3 rounded-xl border border-info/25 bg-info/5 px-4 py-3.5">
          <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
          </div>
        </div>

        {/* Delivery reminder */}
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-3 w-72 rounded-md" />
        </div>
      </main>
    </div>
  );
}
