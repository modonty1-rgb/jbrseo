"use client";

import Link from "@/app/components/link";
import { Card } from "@/app/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CALCULATOR_SAVINGS_CARD,
  CALCULATOR_WITH_CARD,
  CALCULATOR_WITHOUT_CARD,
} from "./calculatorCopy";

export default function SavingsCard({
  totalM,
  totalY,
  subM,
  subY,
  saveM,
  saveY,
  pct,
  ctaLink,
  ctaLabel,
  featuresLink,
  formatMoney,
}: {
  totalM: number;
  totalY: number;
  subM: number;
  subY: number;
  saveM: number;
  saveY: number;
  pct: number;
  ctaLink: string;
  ctaLabel: string;
  featuresLink: string;
  formatMoney: (n: number) => string;
}) {
  return (
    <Card className="relative mb-5 rounded-3xl border border-border bg-card p-6 text-foreground shadow-sm sm:p-8">
      <div className="relative mx-auto mb-6 max-w-xl text-center sm:mb-7">
        <h3
          className="font-black leading-tight text-foreground"
          style={{ fontSize: "clamp(22px, 3.5vw, 34px)" }}
        >
          {CALCULATOR_SAVINGS_CARD.title}:{" "}
          <span className="text-success">{pct}%</span>
        </h3>
      </div>

      <div className="relative mb-8 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[280px] border-collapse text-center">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                scope="col"
                className="p-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80"
              />
              <th
                scope="col"
                className="p-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                {CALCULATOR_WITHOUT_CARD.title}
              </th>
              <th
                scope="col"
                className="p-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                {CALCULATOR_WITH_CARD.title}
              </th>
              <th
                scope="col"
                className="p-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"
              >
                {CALCULATOR_SAVINGS_CARD.differenceColumnTitle}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <th
                scope="row"
                className="bg-muted/25 p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                {CALCULATOR_SAVINGS_CARD.yearly}
              </th>
              <td
                className={cn(
                  "p-4 align-middle text-lg font-black tabular-nums text-destructive sm:text-xl",
                  "border-s border-border",
                )}
              >
                {formatMoney(totalY)}
              </td>
              <td
                className={cn(
                  "p-4 align-middle text-lg font-black tabular-nums text-success sm:text-xl",
                  "border-s border-border",
                )}
              >
                {formatMoney(subY)}
              </td>
              <td
                className={cn(
                  "bg-success/10 p-4 align-middle text-lg font-black tabular-nums text-success sm:text-xl",
                  "border-s border-success/25",
                )}
              >
                {formatMoney(saveY)}
              </td>
            </tr>
            <tr>
              <th
                scope="row"
                className="bg-muted/25 p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
              >
                {CALCULATOR_SAVINGS_CARD.monthly}
              </th>
              <td
                className={cn(
                  "p-4 align-middle text-sm font-extrabold tabular-nums text-destructive/90 sm:text-base",
                  "border-s border-border",
                )}
              >
                {formatMoney(totalM)}
              </td>
              <td
                className={cn(
                  "p-4 align-middle text-sm font-extrabold tabular-nums text-success/90 sm:text-base",
                  "border-s border-border",
                )}
              >
                {formatMoney(subM)}
              </td>
              <td
                className={cn(
                  "bg-success/10 p-4 align-middle text-sm font-extrabold tabular-nums text-success sm:text-base",
                  "border-s border-success/25",
                )}
              >
                {formatMoney(saveM)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="relative flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Link
          href={ctaLink}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-[15px] font-black text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
        >
          {ctaLabel}
        </Link>
        <Link
          href={featuresLink}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-6 py-3.5 text-[14px] font-bold text-foreground transition-colors hover:bg-muted"
        >
          {CALCULATOR_SAVINGS_CARD.secondaryCta}
        </Link>
      </div>
    </Card>
  );
}
