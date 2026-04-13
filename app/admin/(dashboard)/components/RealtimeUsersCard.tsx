"use client";

import { useState, useEffect, useCallback } from "react";
import { getRealtimeUsersAction } from "@/app/actions/analytics";
import { cn } from "@/lib/utils";
import type { RealtimeData } from "@/lib/analytics";

const REFRESH_INTERVAL = 30_000; // 30 seconds

const EMPTY: RealtimeData = { total: 0, sa: 0, eg: 0 };

export function RealtimeUsersCard() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await getRealtimeUsersAction();
      setData(result);
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

  const { total, sa, eg } = data ?? EMPTY;
  const loading = data === null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-teal-500/50 col-span-2 sm:col-span-1">
      <div className="absolute inset-y-0 end-0 w-1 rounded-s bg-teal-500" aria-hidden />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-xs text-muted-foreground">متصلون الآن</p>
        <div className="relative" aria-hidden>
          <span className="text-sm">🟢</span>
          {!isRefreshing && (
            <span className="absolute -top-0.5 -end-0.5 h-2 w-2 rounded-full bg-teal-400 animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* Total */}
      <p className={cn("text-3xl font-black text-foreground mb-3", isRefreshing && "opacity-60")}>
        {loading ? "…" : total.toLocaleString("ar-SA")}
      </p>

      {/* SA / EG breakdown */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-lg bg-muted/30 px-2.5 py-1.5 text-center">
          <p className="text-base mb-0.5" aria-hidden>🇸🇦</p>
          <p className="text-lg font-black text-green-400">
            {loading ? "…" : sa.toLocaleString("ar-SA")}
          </p>
        </div>
        <div className="flex-1 rounded-lg bg-muted/30 px-2.5 py-1.5 text-center">
          <p className="text-base mb-0.5" aria-hidden>🇪🇬</p>
          <p className="text-lg font-black text-blue-400">
            {loading ? "…" : eg.toLocaleString("ar-SA")}
          </p>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-muted-foreground/60">يتحدث كل ٣٠ ثانية</p>
    </div>
  );
}
