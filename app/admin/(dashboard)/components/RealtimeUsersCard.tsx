"use client";

import { useState, useEffect, useCallback } from "react";
import { getRealtimeUsersAction } from "@/app/actions/analytics";
import { cn } from "@/lib/utils";
import type { RealtimeData } from "@/lib/analytics";

const REFRESH_INTERVAL = 30_000;
const EMPTY: RealtimeData = { total: 0, sa: 0, eg: 0 };

export function RealtimeUsersCard() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setData(await getRealtimeUsersAction());
    } catch {
      // keep previous value
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
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-teal-500/50">
      <div className="absolute inset-y-0 end-0 w-1 rounded-s bg-teal-500" aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">متصلون الآن</p>
          <p className={cn("mt-1 text-3xl font-black text-foreground", isRefreshing && "opacity-60")}>
            {loading ? "…" : total.toLocaleString("ar-SA")}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground/70">
            🇸🇦 {loading ? "…" : sa} &nbsp;·&nbsp; 🇪🇬 {loading ? "…" : eg}
          </p>
        </div>
        <div className="relative shrink-0 rounded-lg p-2 text-xl bg-teal-500/10 text-teal-400" aria-hidden>
          🟢
          {!isRefreshing && (
            <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-teal-400 animate-ping opacity-75" />
          )}
        </div>
      </div>
    </div>
  );
}
