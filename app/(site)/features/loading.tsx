import type { ReactNode } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function FeaturesLoading(): ReactNode {
  return (
    <main dir="rtl" lang="ar" aria-busy="true">
      {/* Hero section */}
      <section className="border-b border-border bg-background px-5 pb-6 pt-20 text-center">
        <div className="mx-auto max-w-160 space-y-3">
          <Skeleton className="mx-auto h-3 w-40 rounded-full" />
          <Skeleton className="mx-auto h-10 w-full max-w-105 rounded-full" />
          <Skeleton className="mx-auto h-7 w-full max-w-85 rounded-full" />
          <Skeleton className="mx-auto h-3 w-full max-w-[320px] rounded-full" />
          {/* CTA buttons */}
          <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="h-4 w-10 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FeaturesStepperSection */}
      <div className="container mx-auto max-w-4xl px-4 py-12 space-y-6">
        {/* Timeline */}
        <div className="space-y-2">
          <Skeleton className="mx-auto h-3 w-28 rounded-md" />
          <div className="relative pt-2">
            <div className="absolute start-0 end-0 top-4.5 h-px bg-border/40" />
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="relative z-10 h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-10 rounded-md" />
                  <Skeleton className="h-3 w-14 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stepper card — 4-tab header + content panel */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          {/* Tab row */}
          <div className="grid grid-cols-4 border-b border-border/60 bg-muted/20">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 px-2 py-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-3 w-14 rounded-md" />
                <Skeleton className="h-2 w-10 rounded-md" />
              </div>
            ))}
          </div>
          {/* Active panel content */}
          <div className="p-6 space-y-4">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-3 w-full max-w-sm rounded-md" />
            <Skeleton className="h-3 w-4/5 rounded-md" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
