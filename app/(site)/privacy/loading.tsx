import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Mirrors app/(site)/privacy/page.tsx structure 1:1 to eliminate layout shift
 * between skeleton → content. Every section, container, and spacing token
 * matches the real page.
 */
export default function Loading() {
  return (
    <main className="bg-background text-foreground" dir="rtl" lang="ar">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        {/* HERO — pill badge + H1 + date + intro paragraph */}
        <section className="text-center mb-12">
          <Skeleton className="mx-auto mb-4 h-7 w-40 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-9 w-72 rounded-md sm:h-10 sm:w-96 md:h-11 md:w-[28rem]" />
          <Skeleton className="mx-auto h-4 w-32 rounded-full" />
          <div className="mx-auto mt-6 max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="mx-auto h-4 w-11/12 rounded-md" />
            <Skeleton className="mx-auto h-4 w-4/5 rounded-md" />
          </div>
        </section>

        {/* TABLE OF CONTENTS — label + grid of links (icon + text) */}
        <nav className="mb-12 rounded-2xl border border-border bg-card p-5">
          <Skeleton className="mb-3 h-3 w-28 rounded-md" />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2"
              >
                <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
                <Skeleton className="h-3.5 flex-1 rounded-md" />
              </div>
            ))}
          </div>
        </nav>

        {/* SECTIONS — icon square + title + prose body */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <section
              key={i}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <div className="mb-4 flex items-start gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                <Skeleton className="mt-1.5 h-5 w-56 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-11/12 rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
                <Skeleton className="h-3.5 w-3/4 rounded-md" />
              </div>
            </section>
          ))}
        </div>

        {/* CONTACT — icon square + paragraph */}
        <div className="mt-12 rounded-2xl border-2 border-success/30 bg-gradient-to-b from-success/10 to-transparent px-6 py-8 text-center">
          <Skeleton className="mx-auto mb-3 h-12 w-12 rounded-xl" />
          <div className="mx-auto max-w-lg space-y-2">
            <Skeleton className="mx-auto h-4 w-full rounded-md" />
            <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
          </div>
        </div>
      </div>
    </main>
  );
}
