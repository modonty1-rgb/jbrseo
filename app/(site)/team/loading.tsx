import { Skeleton } from "@/app/components/ui/skeleton";

function TeamCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-sm">
      <div className="aspect-square w-full shrink-0">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <div className="flex flex-col items-start p-4">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="mt-1 h-3 w-20 rounded-md" />
        <Skeleton className="mt-2 h-3 w-full rounded-md" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">

      {/* Hero */}
      <section className="space-y-3 text-center">
        <Skeleton className="mx-auto h-3 w-24 rounded-md" />
        <Skeleton className="mx-auto h-8 w-full max-w-2xl rounded-md sm:h-9" />
        <Skeleton className="mx-auto h-4 w-full max-w-2xl rounded-md" />
      </section>

      {/* Core team */}
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => <TeamCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Execution team */}
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => <TeamCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <Skeleton className="h-4 w-48 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

    </div>
  );
}
