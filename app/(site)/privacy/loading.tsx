import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="bg-background text-foreground" dir="rtl" lang="ar">
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8 text-right">
          <Skeleton className="h-9 w-64 rounded-md sm:h-10" />
          <Skeleton className="mt-2 h-3 w-32 rounded-md" />
        </header>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-4 w-full rounded-md" />
          ))}
        </div>
      </section>
    </main>
  );
}
