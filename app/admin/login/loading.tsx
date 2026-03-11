import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div dir="ltr" className="flex min-h-screen items-center justify-center bg-background px-4" lang="en">
      <div className="w-full max-w-sm space-y-4">
        <Skeleton className="h-8 w-40 rounded-md" />
        <div>
          <Skeleton className="mb-1 h-4 w-16 rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
