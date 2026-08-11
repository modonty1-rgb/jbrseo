"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/app/components/ui/slider";
import { CALC_ROLES } from "@/app/components/landing/calc-roles";

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

const STEP_BTN =
  "w-11 h-11 rounded-[10px] bg-background border border-border text-muted-foreground text-[20px] font-medium leading-none inline-flex items-center justify-center shrink-0 transition-colors select-none not-disabled:hover:bg-foreground not-disabled:hover:border-foreground not-disabled:hover:text-card not-disabled:active:scale-[0.92]";

type Props = {
  planAnnual: number;
  planName: string;
  currency: string;
  pricingHref: string;
};

/**
 * The salary calculator, on the page instead of behind a button.
 *
 * On the landing it was a modal for a good reason: its sliders and animation library had
 * no business in the initial bundle of a page selling something else. Here that reason is
 * gone — this page exists to answer "what would this cost me", and the calculator is the
 * answer. A dialog would ask the reader to click to reach the thing they came for, then
 * trap it in a layer they have to dismiss.
 *
 * Losing the modal also drops `motion` and the dynamic-import skeleton from this route.
 */
export function InlineCalculator({ planAnnual, planName, currency, pricingHref }: Props) {
  const [salaries, setSalaries] = useState<Record<string, number>>(
    Object.fromEntries(CALC_ROLES.map((r) => [r.key, r.def])),
  );

  const teamAnnual = CALC_ROLES.reduce((sum, r) => sum + (salaries[r.key] ?? r.def), 0) * 12;
  const saveAmount = Math.max(0, teamAnnual - planAnnual);
  const savePct = teamAnnual > 0 ? Math.max(0, Math.round((1 - planAnnual / teamAnnual) * 100)) : 0;
  const isDefault = CALC_ROLES.every((r) => (salaries[r.key] ?? r.def) === r.def);

  return (
    <section className="mx-auto max-w-230 px-4 pb-14 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-b-border px-5 py-4">
          <h2 className="text-base font-bold text-foreground">عدّل الرواتب حسب سوقك</h2>
          <button
            type="button"
            onClick={() => setSalaries(Object.fromEntries(CALC_ROLES.map((r) => [r.key, r.def])))}
            disabled={isDefault}
            className="min-h-11 rounded-lg border border-border bg-transparent px-3 text-[12px] font-medium text-muted-foreground transition-colors not-disabled:cursor-pointer not-disabled:hover:border-foreground/40 not-disabled:hover:text-foreground disabled:opacity-40"
          >
            إعادة للافتراضي
          </button>
        </div>

        {/* The result sits above the controls, not below: the reader's question is the
            number, and a total they have to scroll to find is a total they mistrust. */}
        <div className="bg-foreground px-5 py-4 text-background">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-success" />
                <span className="text-[11.5px] font-semibold text-success">مدونتي · {planName}</span>
              </div>
              {/* `font-mono` moved onto the number, off the wrapper.
                  On the wrapper it was inherited by the unit beside it — «ر.س/سنة» — so
                  the one Arabic string in this block was set in a face with no Arabic
                  glyphs and its letters stopped joining. The figure still gets the fixed
                  pitch it was reached for; the unit gets the text face. */}
              <div className="text-[22px] font-semibold" dir="ltr">
                <span className="font-mono">{formatNum(planAnnual)}</span>{" "}
                <span className="text-xs font-normal text-background/60">{currency}/سنة</span>
              </div>
              <div className="mt-1.5 text-[13px] text-background/60">
                بدلاً من{" "}
                <span className="font-medium text-background/50 line-through decoration-destructive" dir="ltr">
                  {formatNum(teamAnnual)}
                </span>
              </div>
            </div>
            <div className="border-s border-s-background/10 ps-4 text-start">
              <div className="mb-[3px] text-xs text-background/60">التوفير</div>
              <div className="text-[clamp(17px,5vw,26px)] font-semibold leading-none text-success">
                {savePct}٪
              </div>
              <div className="mt-[5px] font-mono text-xs text-background/60" dir="ltr">
                = {formatNum(saveAmount)}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {CALC_ROLES.map((r) => {
              const value = salaries[r.key] ?? r.def;
              const bump = (delta: number) =>
                setSalaries((prev) => {
                  const cur = prev[r.key] ?? r.def;
                  return { ...prev, [r.key]: Math.max(r.min, Math.min(r.max, cur + delta)) };
                });
              const atMin = value <= r.min;
              const atMax = value >= r.max;
              return (
                <div key={r.key}>
                  <div className="mb-1.5 flex items-baseline justify-between text-xs">
                    <span className="font-medium text-muted-foreground">{r.label}</span>
                    <span className="font-mono text-xs text-foreground" dir="ltr">
                      {formatNum(value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`أنقص ${r.label}`}
                      onClick={() => bump(-500)}
                      disabled={atMin}
                      className={cn(STEP_BTN, atMin ? "cursor-not-allowed opacity-35" : "cursor-pointer")}
                    >
                      −
                    </button>
                    <Slider
                      className="flex-1"
                      dir="rtl"
                      min={r.min}
                      max={r.max}
                      step={100}
                      value={[value]}
                      onValueChange={(v) => setSalaries((prev) => ({ ...prev, [r.key]: v[0] }))}
                      aria-label={r.label}
                    />
                    <button
                      type="button"
                      aria-label={`زِد ${r.label}`}
                      onClick={() => bump(500)}
                      disabled={atMax}
                      className={cn(STEP_BTN, atMax ? "cursor-not-allowed opacity-35" : "cursor-pointer")}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-5 pt-4 pb-5">
          <a
            href={pricingHref}
            className="block rounded-[10px] bg-success p-3 text-center text-[14.5px] font-semibold text-success-foreground no-underline"
          >
            شوف الباقة المناسبة لك ←
          </a>
        </div>
      </div>
    </section>
  );
}
