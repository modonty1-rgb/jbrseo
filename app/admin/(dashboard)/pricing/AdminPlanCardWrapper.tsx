"use client";

import { useState, useTransition, type ReactElement } from "react";
import Link from "next/link";
import { AdminPreviewCard } from "./AdminPreviewCard";
import { togglePlanVisibility, reorderPlans } from "@/app/actions/pricing";
import { dbPlanToVisitorPlan, currencyFor } from "@/lib/admin-pricing-adapter";
import type { PricingUI } from "@/app/content/landing/price-section-types";
import { cn } from "@/lib/utils";

type Slug = "free" | "starter" | "growth" | "scale";

export type AdminPlanInput = {
  slug: string;
  name: string;
  hook: string | null;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  articlesLabel: string;
  ctaText: string;
  highlights: string[];
  badge: string | null;
  featuredBadge: string | null;
  visible: boolean;
  displayOrder: number;
  updatedAtLabel: string;
};


type Props = {
  country: "SA" | "EG";
  dbPlan: AdminPlanInput;
  ui: PricingUI;
  annual: boolean;
  index: number;
  totalCount: number;
  allSlugs: Slug[];
  /** Name of the previous paid tier — when set, the card shows "يشمل كل مزايا [name] +". */
  previousTierName?: string | null;
};

export function AdminPlanCardWrapper({
  country,
  dbPlan,
  ui,
  annual,
  index,
  totalCount,
  allSlugs,
  previousTierName,
}: Props): ReactElement {
  const slug = dbPlan.slug as Slug;
  const visitorPlan = dbPlanToVisitorPlan(dbPlan);
  const currency = currencyFor(country);

  const [visible, setVisible] = useState(dbPlan.visible);
  const [isPending, startTransition] = useTransition();

  const onToggleVisibility = () => {
    setVisible((v) => !v);
    startTransition(async () => {
      try {
        const r = await togglePlanVisibility(country, slug);
        setVisible(r.visible);
      } catch (err) {
        setVisible(dbPlan.visible);
        console.error(err);
      }
    });
  };

  const onMove = (delta: -1 | 1) => {
    const newIndex = index + delta;
    if (newIndex < 0 || newIndex >= totalCount) return;
    const next = [...allSlugs];
    [next[index], next[newIndex]] = [next[newIndex], next[index]];
    startTransition(async () => {
      try {
        await reorderPlans(country, next);
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-2", isPending && "opacity-90")}>
      {/* Card preview (admin-only copy — does NOT affect visitor homepage) */}
      <div className={cn("relative flex flex-col", !visible && "opacity-50 grayscale")}>
        {!visible && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-start justify-center pt-10">
            <div className="rounded-md border border-border bg-background/95 px-3 py-1.5 text-xs font-bold text-muted-foreground shadow-lg backdrop-blur-sm">
              🔒 مخفية عن الزائر
            </div>
          </div>
        )}
        <AdminPreviewCard
          plan={visitorPlan}
          annual={annual}
          currency={currency}
          ui={ui}
          previousTierName={previousTierName}
        />
      </div>

      {/* Admin toolbar — sits below the card so it doesn't pull attention from the preview. */}
      <div className="rounded-lg border border-border bg-card p-2 text-xs shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-muted/50 px-1.5 py-0.5 font-bold tabular-nums text-foreground">
              #{dbPlan.displayOrder}
            </span>
            <code className="rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {slug}
            </code>
            <div className="inline-flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => onMove(-1)}
                disabled={isPending || index === 0}
                className="flex size-4 items-center justify-center rounded border border-border/60 bg-background text-[10px] hover:bg-muted/40 disabled:opacity-30"
                aria-label={`Move ${slug} up`}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onMove(1)}
                disabled={isPending || index === totalCount - 1}
                className="flex size-4 items-center justify-center rounded border border-border/60 bg-background text-[10px] hover:bg-muted/40 disabled:opacity-30"
                aria-label={`Move ${slug} down`}
              >
                ▼
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              onClick={onToggleVisibility}
              disabled={isPending}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                visible
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50",
              )}
              aria-label={`Toggle ${slug} visibility`}
            >
              {visible ? "👁 ظاهرة" : "🔒 مخفية"}
            </button>
            <Link
              href={`/admin/pricing/${slug}?country=${country}`}
              className="inline-flex items-center rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary hover:bg-primary/20"
            >
              ✏️ تعديل
            </Link>
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-muted-foreground/70">
          <span className="shrink-0">آخر تحديث: {dbPlan.updatedAtLabel}</span>
        </div>
      </div>
    </div>
  );
}
