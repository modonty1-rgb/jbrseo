// Shows while the admin segment resolves (before the dashboard layout renders).
// Must include the full shell since the layout hasn't mounted yet.
import { Skeleton } from "@/app/components/ui/skeleton";

export default function AdminRootLoading() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background">
      {/* Top navbar — mirrors AdminTopNavbar structure */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-6 py-3 backdrop-blur">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Logo square */}
          <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
          {/* Brand name */}
          <Skeleton className="hidden h-4 w-14 rounded-md sm:block" />
          {/* Divider */}
          <div className="hidden h-6 w-px shrink-0 bg-border sm:block" aria-hidden />
          {/* Page title */}
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        {/* Right actions: kbd hint + divider + subscribers + refresh + country toggle */}
        <div className="flex shrink-0 items-center gap-3">
          <Skeleton className="hidden h-5 w-16 rounded-md md:block" />
          <div className="hidden h-6 w-px bg-border sm:block" aria-hidden />
          <Skeleton className="h-7 w-24 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="sticky top-13 flex min-h-[calc(100vh-52px)] w-60 shrink-0 flex-col border-e border-border bg-muted/30 px-3 py-4">
          <div className="space-y-4">
            {/* Sidebar groups */}
            {[3, 6, 1, 2, 4, 1].map((count, g) => (
              <div key={g} className="space-y-1">
                <Skeleton className="mb-2 h-3 w-20 rounded-md" />
                {Array.from({ length: count }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main content placeholder */}
        <main className="min-w-0 flex-1 p-6">
          <Skeleton className="h-7 w-36 rounded-md" />
        </main>
      </div>
    </div>
  );
}
