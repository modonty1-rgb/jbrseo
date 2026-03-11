import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <section className="space-y-3 text-center">
        <Skeleton className="mx-auto h-3 w-24 rounded-md" />
        <Skeleton className="mx-auto h-8 w-full max-w-2xl rounded-md sm:h-9" />
        <Skeleton className="mx-auto h-4 w-full max-w-2xl rounded-md" />
      </section>

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40">
              <Skeleton className="aspect-square w-full max-w-56 rounded-none sm:max-w-64" />
              <div className="flex flex-col items-start p-4 space-y-2">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40">
              <Skeleton className="aspect-square w-full max-w-56 rounded-none sm:max-w-64" />
              <div className="flex flex-col items-start p-4 space-y-2">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
