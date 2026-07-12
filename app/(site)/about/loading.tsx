import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Mirrors app/(site)/about/page.tsx structure 1:1.
 * Sections: Hero → Mission → Story (3 cards) → Values (2×2 grid) →
 *           Team (3 cards) → Fit/NotFit (2 cols) → Legal (2×3 grid) → CTA.
 * Same max-w-5xl container, same gutters, same card shapes — zero CLS.
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
        <Skeleton className="mx-auto mb-4 h-9 w-72 rounded-md sm:h-10 sm:w-96 md:h-11 md:w-[28rem]" />
        <div className="mx-auto max-w-2xl space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="mx-auto h-4 w-11/12 rounded-md" />
          <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
        </div>
      </section>

      {/* MISSION STRIP */}
      <section className="mb-16 rounded-2xl border border-success/30 bg-gradient-to-b from-success/6 to-transparent p-6 sm:p-7">
        <div className="mb-3 flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-11/12 rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
      </section>

      {/* STORY */}
      <section className="mb-16">
        <SectionHeader />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <Skeleton className="mb-3 h-6 w-20 rounded-md" />
              <Skeleton className="mb-2 h-5 w-full rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-11/12 rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="mb-16">
        <SectionHeader />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-border bg-card p-5"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-3.5 w-full rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="mb-16">
        <SectionHeader />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center"
            >
              <Skeleton className="mb-4 h-28 w-28 rounded-full" />
              <Skeleton className="mb-1 h-4 w-32 rounded-md" />
              <Skeleton className="mb-3 h-3 w-24 rounded-md" />
              <div className="w-full space-y-1.5">
                <Skeleton className="mx-auto h-3 w-full rounded-md" />
                <Skeleton className="mx-auto h-3 w-4/5 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FIT / NOT FIT */}
      <section className="mb-16">
        <SectionHeader />
        <div className="grid gap-4 sm:grid-cols-2">
          {["success", "destructive"].map((tone) => (
            <div
              key={tone}
              className={`rounded-2xl border p-5 ${
                tone === "success"
                  ? "border-success/30 bg-success/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <ul className="flex flex-col gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-sm" />
                    <Skeleton className="h-3.5 flex-1 rounded-md" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* LEGAL */}
      <section className="mb-16">
        <SectionHeader />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-sm" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border-2 border-success/30 bg-gradient-to-b from-success/10 to-transparent px-6 py-10 text-center sm:px-8">
        <Skeleton className="mx-auto mb-3 h-7 w-56 rounded-md" />
        <div className="mx-auto mb-6 max-w-xl space-y-2">
          <Skeleton className="mx-auto h-4 w-full rounded-md" />
          <Skeleton className="mx-auto h-4 w-3/4 rounded-md" />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Skeleton className="h-11 w-36 rounded-xl" />
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </section>
    </div>
  );
}

// Section header shell — icon square + title + subtitle. Every page section
// past the hero opens with this. Extracted so all headers line up perfectly.
function SectionHeader() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-6 w-56 rounded-md" />
        <Skeleton className="h-3 w-40 rounded-md" />
      </div>
    </div>
  );
}
