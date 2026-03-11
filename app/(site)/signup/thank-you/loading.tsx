import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="rtl" lang="ar" className="relative min-h-[80vh] px-4 py-20 flex justify-center items-center">
      <div className="relative z-10 w-full max-w-xl text-center space-y-8">
        <div className="flex justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="mx-auto h-3 w-28 rounded-md" />
          <Skeleton className="mx-auto h-9 w-48 rounded-md" />
          <Skeleton className="mx-auto h-4 w-full max-w-md rounded-md" />
          <Skeleton className="mx-auto h-4 w-4/5 max-w-sm rounded-md" />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 text-start space-y-3">
          <Skeleton className="h-4 w-40 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
