"use client";

import { Card } from "@/app/components/ui/card";
import { CALCULATOR_WITHOUT_CARD } from "./calculatorCopy";
import type { MoneyPair } from "./calculatorTypes";

export default function WithoutPlanCard({
  badItems,
  totalM,
  totalY,
  formatMoney,
}: {
  badItems: MoneyPair[];
  totalM: number;
  totalY: number;
  formatMoney: (n: number) => string;
}) {
  return (
    <Card className="flex h-full min-h-0 flex-col rounded-2xl border-destructive/20 bg-destructive/5 p-4 shadow-sm">
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.08em] text-destructive">
        {CALCULATOR_WITHOUT_CARD.title}
      </p>
      <p className="mb-3 text-[10px] font-bold text-destructive/80">
        {CALCULATOR_WITHOUT_CARD.subtitle}
      </p>
      <div className="min-h-0 min-w-0 flex-1">
        {badItems.map(([n, v], i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-black/5 py-1.5 last:border-none"
          >
            <span className="text-xs text-muted-foreground">{n}</span>
            <span className="text-xs font-extrabold tabular-nums text-destructive">
              {v}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-auto grid shrink-0 grid-cols-[1fr_1px_1fr] items-center border-t-2 border-black/10 pt-3">
        <div className="text-center">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {CALCULATOR_WITHOUT_CARD.monthly}
          </p>
          <p className="text-lg font-black tabular-nums text-destructive">
            {formatMoney(totalM)}
          </p>
        </div>
        <div className="self-stretch bg-black/10" />
        <div className="text-center">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {CALCULATOR_WITHOUT_CARD.yearly}
          </p>
          <p className="text-lg font-black tabular-nums text-destructive">
            {formatMoney(totalY)}
          </p>
        </div>
      </div>
    </Card>
  );
}
