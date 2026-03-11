import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-14 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <nav className="flex items-center gap-3">
          <Skeleton className="h-4 w-48 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </nav>
      </header>
      <div className="flex">
        <div className="sticky top-[52px] min-h-[calc(100vh-52px)] w-[240px] shrink-0 border-e border-border bg-muted/30 px-3 py-4">
          <div className="space-y-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        </div>
        <main className="min-w-0 flex-1 p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Skeleton className="h-7 w-28 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <Skeleton className="mb-6 h-4 w-64 rounded-md" />
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <div className="mb-6 rounded-lg border border-border bg-card p-4">
            <Skeleton className="mb-3 h-4 w-40 rounded-md" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-full rounded-full" />
              <Skeleton className="h-6 w-4/5 rounded-full" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="mb-3 h-4 w-36 rounded-md" />
            <Skeleton className="h-6 w-full rounded-full" />
          </div>
        </main>
      </div>
    </div>
  );
}
