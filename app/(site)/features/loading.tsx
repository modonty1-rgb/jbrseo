import type { ReactNode } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";

export default function FeaturesLoading(): ReactNode {
  return (
    <main dir="rtl" lang="ar" aria-busy="true">
      <section className="border-b border-border bg-background px-5 pb-6 pt-20 text-center">
        <div className="mx-auto max-w-[640px] space-y-3">
          <Skeleton className="mx-auto h-3 w-40 rounded-full" />
          <Skeleton className="mx-auto h-10 w-full max-w-[420px] rounded-full" />
          <Skeleton className="mx-auto h-8 w-full max-w-[260px] rounded-full" />
          <Skeleton className="mx-auto h-3 w-full max-w-[320px] rounded-full" />
        </div>
      </section>
    </main>
  );
}

