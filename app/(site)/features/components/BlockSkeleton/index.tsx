import type { ReactNode } from "react";

export function BlockSkeleton(): ReactNode {
  return <div className="mx-auto mb-4 h-[300px] max-w-[960px] animate-pulse rounded-2xl bg-muted" />;
}

