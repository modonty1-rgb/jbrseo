// The dashboard layout already renders the header + sidebar.
// This loading.tsx only needs to fill the <main> content slot.
import { Skeleton } from "@/app/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div dir="rtl" lang="ar" className="p-6">

      {/* Page heading + subscriber count */}
      <div className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-28 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48 rounded-md" />
      </div>

      {/* AnalyticsSection ─────────────────────────────────── */}
      <section className="mb-8">
        {/* Toggle header row */}
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <div className="ms-auto flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-12 rounded-md" />
            ))}
          </div>
        </div>

        {/* Date range hint */}
        <Skeleton className="mb-4 h-3 w-56 rounded-md" />

        {/* 6 metric cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        {/* DashboardCharts — 4 KPI cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        {/* Two charts side by side */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>

        {/* Two more charts */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>

        {/* Per-market breakdown */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
      </section>

      {/* Subscriber stat cards (4) */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>

      {/* Subscriber distribution */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-14 rounded-md" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-full" />
          <Skeleton className="h-5 w-4/5 rounded-full" />
        </div>
      </div>

      {/* Recent signups bar */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full rounded-full" />
        <Skeleton className="mt-2 h-3 w-40 rounded-md" />
      </div>

      {/* Quick links grid */}
      <div className="rounded-lg border border-border bg-card p-4">
        <Skeleton className="mb-3 h-4 w-36 rounded-md" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Skeleton key={i} className="h-9 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
