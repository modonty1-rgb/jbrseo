"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReviewItem = { n: number; label: string; value: string };
export type ReviewGroup = { title: string; admin: string; items: ReviewItem[] };

export function ReviewClient({ groups, total }: { groups: ReviewGroup[]; total: number }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const toggle = (t: string) => setCollapsed((c) => ({ ...c, [t]: !c[t] }));
  const allCollapsed = groups.every((g) => collapsed[g.title]);
  const setAll = (v: boolean) => setCollapsed(Object.fromEntries(groups.map((g) => [g.title, v])));

  const refresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <div className="mx-auto max-w-4xl p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">مرجع محتوى اللاندنق</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAll(!allCollapsed)}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {allCollapsed ? "افتح الكل" : "اطوِ الكل"}
          </button>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
          >
            <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} aria-hidden />
            تحديث
          </button>
        </div>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        كل نصوص الموقع في مكان واحد ({total} عنصر). قل لي رقم أي عنصر عشان نعدّله · اضغط عنوان القسم لطيّه · «تحديث» يجيب آخر تعديلات الداتابيس.
      </p>

      <div className="space-y-3">
        {groups.map((g) => {
          const isCollapsed = !!collapsed[g.title];
          return (
            <section key={g.title} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between gap-2 bg-muted/30 px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => toggle(g.title)}
                  className="flex flex-1 items-center gap-2 text-start"
                  aria-expanded={!isCollapsed}
                >
                  <ChevronDown
                    className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isCollapsed && "-rotate-90")}
                    aria-hidden
                  />
                  <h2 className="text-sm font-bold text-foreground">{g.title}</h2>
                  <span className="text-[11px] text-muted-foreground">({g.items.length})</span>
                </button>
                <Link
                  href={`${g.admin}?country=SA`}
                  className="shrink-0 text-xs font-medium text-primary hover:underline"
                >
                  تعديل ←
                </Link>
              </div>

              {!isCollapsed && (
                <div className="divide-y divide-border/60">
                  {g.items.map((it) => (
                    <div key={it.n} className="flex gap-3 px-4 py-2.5">
                      <span className="mt-0.5 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 px-1.5 text-xs font-bold tabular-nums text-primary">
                        {it.n}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-muted-foreground">{it.label}</div>
                        <div className="mt-0.5 break-words whitespace-pre-wrap text-sm text-foreground">
                          {it.value || <span className="text-muted-foreground/50">— فارغ —</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
