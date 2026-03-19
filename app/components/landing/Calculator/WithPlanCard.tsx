"use client";

import { CALCULATOR_WITH_CARD } from "./calculatorCopy";

export default function WithPlanCard({
  goodItems,
  subM,
  subY,
  formatMoney,
}: {
  goodItems: string[];
  subM: number;
  subY: number;
  formatMoney: (n: number) => string;
}) {
  return (
    <div className="rounded-2xl border border-success/20 bg-success/5 p-4">
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.08em] text-success">
        {CALCULATOR_WITH_CARD.title}
      </p>
      <p className="mb-3 text-[10px] font-bold text-success/80">
        {CALCULATOR_WITH_CARD.subtitle}
      </p>
      {goodItems.map((n, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-black/5 py-1.5 last:border-none"
        >
          <span className="text-xs text-muted-foreground">{n}</span>
          <span className="text-xs font-extrabold text-success">
            {CALCULATOR_WITH_CARD.includedTag}
          </span>
        </div>
      ))}
      <div className="mt-3 grid grid-cols-[1fr_1px_1fr] items-center border-t-2 border-black/10 pt-3">
        <div className="text-center">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {CALCULATOR_WITH_CARD.monthly}
          </p>
          <p className="text-lg font-black text-success">
            {formatMoney(subM)}
          </p>
        </div>
        <div className="self-stretch bg-black/10" />
        <div className="text-center">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {CALCULATOR_WITH_CARD.yearly}
          </p>
          <p className="text-lg font-black text-success">
            {formatMoney(subY)}
          </p>
        </div>
      </div>
    </div>
  );
}

