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
    <div className="relative overflow-hidden rounded-xl border border-border bg-card px-3 py-2.5 transition-colors hover:border-teal-500/50">
      <div className="absolute inset-y-0 end-0 w-1 rounded-s bg-teal-500" aria-hidden />
      <p className="text-[11px] font-medium text-teal-400 flex items-center gap-1">
        <span className={cn("h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0", !isRefreshing && "animate-ping")} aria-hidden />
        متصلون الآن
      </p>
      <p className={cn("mt-1 text-2xl font-black text-foreground leading-none", isRefreshing && "opacity-60")}>
        {loading ? "…" : total.toLocaleString("ar-SA")}
      </p>
      <p className="mt-1 text-[11px] font-medium text-muted-foreground">
        🇸🇦 {loading ? "…" : sa} · 🇪🇬 {loading ? "…" : eg}
      </p>
    </div>
  );
}
