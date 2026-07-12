import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Mirrors app/(site)/team/page.tsx structure 1:1.
 * Sections: Hero → Core team (2-col of large cards) → Execution team (2/3/4-col
 * of small cards) → CTA card. Same max-w-5xl, same section headers, same
 * round avatar shape as the real page — zero layout shift.
 */
export default function Loading() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8"
    >
      {/* HERO */}
      <section className="mb-16 text-center">
        <Skeleton className="mx-auto mb-4 h-7 w-40 rounded-full" />
        <Skeleton className="mx-auto mb-4 h-9 w-80 rounded-md sm:h-10 sm:w-96 md:h-11 md:w-[30rem]" />
        <div className="mx-auto max-w-2xl space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="mx-auto h-4 w-11/12 rounded-md" />
          <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="mb-16">
        <SectionHeader />
        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {Array.from({ length: 2 }).map((_, i) => (
            <MemberCardLargeSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* EXECUTION TEAM */}
      <section className="mb-16">
        <SectionHeader />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MemberCardSmallSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border-2 border-success/30 bg-gradient-to-b from-success/10 to-transparent px-6 py-10 text-center sm:px-8">
        <Skeleton className="mx-auto mb-3 h-7 w-72 rounded-md" />
        <div className="mx-auto mb-6 max-w-xl space-y-2">
          <Skeleton className="mx-auto h-4 w-full rounded-md" />
          <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
        </div>
        <Skeleton className="mx-auto h-11 w-36 rounded-xl" />
      </section>
    </div>
  );
}

function SectionHeader() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-3 w-56 rounded-md" />
      </div>
    </div>
  );
}

// Core member card: 128px round avatar + name + role + bio (~3 lines).
function MemberCardLargeSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center">
      <Skeleton className="h-32 w-32 rounded-full" />
      <Skeleton className="mt-4 h-4 w-32 rounded-md" />
      <Skeleton className="mt-1 h-3 w-24 rounded-md" />
      <div className="mt-3 w-full space-y-1.5">
        <Skeleton className="mx-auto h-3 w-full rounded-md" />
        <Skeleton className="mx-auto h-3 w-11/12 rounded-md" />
        <Skeleton className="mx-auto h-3 w-4/5 rounded-md" />
      </div>
    </div>
  );
}

// Execution member card: 80px round avatar + name + role + 3-line bio clip.
function MemberCardSmallSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="mt-3 h-3.5 w-24 rounded-md" />
      <Skeleton className="mt-1 h-3 w-20 rounded-md" />
      <div className="mt-2 w-full space-y-1">
        <Skeleton className="mx-auto h-3 w-full rounded-md" />
        <Skeleton className="mx-auto h-3 w-4/5 rounded-md" />
      </div>
    </div>
  );
}
