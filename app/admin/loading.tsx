import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background/95 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-64 w-full rounded-xl" />
      </main>
    </div>
  );
}
