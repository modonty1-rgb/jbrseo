"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1500);
  }, [isRefreshing, router]);

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isRefreshing}
      title="تحديث البيانات"
      className={cn(
        "flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-all duration-200",
        isRefreshing
          ? "cursor-not-allowed bg-muted text-muted-foreground"
          : "cursor-pointer bg-background text-foreground hover:border-foreground/20 hover:bg-muted",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isRefreshing ? "animate-spin" : ""}
        aria-hidden
      >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
      </svg>
      <span>{isRefreshing ? "جاري..." : "تحديث"}</span>
    </button>
  );
}
