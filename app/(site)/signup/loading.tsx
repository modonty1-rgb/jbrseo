import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="relative min-h-[70vh] px-4 py-20 flex justify-center items-start">
      <div className="relative z-10 w-full max-w-md lg:max-w-4xl rounded-2xl border border-border/60 bg-card/80 p-6 lg:p-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-5">
          <header className="space-y-3">
            <Skeleton className="h-3 w-32 rounded-md" />
            <div className="inline-flex flex-wrap gap-1 rounded-full bg-muted/60 p-1">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-16 rounded-full" />
              ))}
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </header>
          <div className="space-y-4">
            <div>
              <Skeleton className="mb-2 h-3 w-16 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="mb-2 h-3 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="hidden lg:block space-y-4">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      </div>
    </div>
  );
}
