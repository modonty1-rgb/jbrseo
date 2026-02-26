import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <div className="border-b border-border bg-background/95 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4 max-w-md rounded-md" />
            <Skeleton className="h-5 w-full max-w-sm rounded-md" />
          </div>
          <Skeleton className="h-48 w-48 shrink-0 rounded-2xl sm:h-64 sm:w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          <Skeleton className="h-4 w-4/5 max-w-lg rounded-md" />
          <Skeleton className="h-4 w-3/4 max-w-md rounded-md" />
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
