"use client";

import { useState, useEffect, useCallback } from "react";
import { getRealtimeUsersAction } from "@/app/actions/analytics";
import { cn } from "@/lib/utils";

const REFRESH_INTERVAL = 30_000; // 30 seconds

export function RealtimeUsersCard() {
  const [count, setCount] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const n = await getRealtimeUsersAction();
      setCount(n);
    } catch {
      // keep previous value on error
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [refresh]);

  const displayCount = count ?? 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-teal-500/50">
      <div className="absolute inset-y-0 end-0 w-1 rounded-s bg-teal-500" aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">متصلون الآن</p>
          <p className={cn("mt-1 text-3xl font-black text-foreground", isRefreshing && "opacity-60")}>
            {count === null ? "…" : displayCount.toLocaleString("ar-SA")}
          </p>
        </div>
        <div className="relative rounded-lg p-2 text-xl bg-teal-500/10 text-teal-400" aria-hidden>
          🟢
          <span
            className={cn(
              "absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-teal-400",
              !isRefreshing && "animate-ping opacity-75",
            )}
          />
        </div>
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground/60">يتحدث كل ٣٠ ثانية</p>
    </div>
  );
}
