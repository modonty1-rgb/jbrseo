"use client";

import type { Dispatch, SetStateAction } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/app/components/ui/slider";
import { CALC_ROLES } from "./calc-roles";

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

// Stepper button (was .prev-calc-btn) — 44×44 tap target; hover/active only when
// enabled. Merged with per-instance disabled styling via cn().
const CALC_BTN =
  "w-11 h-11 rounded-[10px] bg-background border border-border text-muted-foreground text-[20px] font-medium leading-none inline-flex items-center justify-center shrink-0 transition-colors select-none not-disabled:hover:bg-foreground not-disabled:hover:border-foreground not-disabled:hover:text-card not-disabled:active:scale-[0.92]";

type Props = {
  open: boolean;
  onClose: () => void;
  salaries: Record<string, number>;
  setSalaries: Dispatch<SetStateAction<Record<string, number>>>;
  mathPlanAnnual: number;
  teamAnnual: number;
  mathPlanName: string;
  currency: string;
};

/**
 * "Cost of an in-house team" calculator — a modal that is hidden until the
 * visitor opens it from the math section. Split out of Landing and loaded via
 * `next/dynamic({ ssr: false })` so its JS (motion modal + sliders) stays off
 * the initial mobile bundle. Self-wraps in its own LazyMotion so it does not
 * depend on the parent provider being mounted first.
 */
export function LandingCalcModal({
  open,
  onClose,
  salaries,
  setSalaries,
  mathPlanAnnual,
  teamAnnual,
  mathPlanName,
  currency,
}: Props) {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open && mathPlanAnnual > 0 && (() => {
          const calcModontyAnnual = mathPlanAnnual;
          const calcSaveAmt = Math.max(0, teamAnnual - calcModontyAnnual);
          const calcSavePct = teamAnnual > 0 ? Math.max(0, Math.round((1 - calcModontyAnnual / teamAnnual) * 100)) : 0;
          return (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className="fixed inset-0 z-[70] bg-foreground/50 flex items-center justify-center p-[18px]"
          >
            <m.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", damping: 26, stiffness: 230 }}
              className="bg-card rounded-[18px] max-w-[620px] w-full max-h-[88vh] overflow-auto"
            >
              {/* Header — compact */}
              <div className="pt-[18px] px-[22px] pb-[14px] border-b border-b-muted flex items-center justify-between gap-3">
                <div className="text-base font-semibold">كم يكلّفك البديل فعلاً؟</div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSalaries(Object.fromEntries(CALC_ROLES.map((r) => [r.key, r.def])))}
                    className="bg-transparent border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-foreground/40 cursor-pointer min-h-11 px-3 rounded-lg font-medium transition-colors"
                  >
                    إعادة
                  </button>
                  <button
                    onClick={onClose}
                    aria-label="إغلاق"
                    className="bg-transparent border-none text-muted-foreground hover:text-foreground cursor-pointer inline-flex items-center justify-center w-11 h-11 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Result strip — compact, on top so visible without scroll */}
              <div className="pt-4 px-[22px] pb-[18px] bg-foreground text-background">
                <div className="flex items-center justify-between gap-[18px]">
                  {/* RIGHT (RTL start): Modonty — emphasized */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      <span className="text-[11.5px] text-success font-semibold tracking-[.3px]">
                        مدونتي · {mathPlanName}
                      </span>
                    </div>
                    <div className="font-mono text-[22px] font-semibold text-background">
                      {formatNum(calcModontyAnnual)} <span className="text-xs text-background/60 font-normal">{currency}/سنة</span>
                    </div>
                    <div className="text-[13px] text-background/60 mt-1.5 font-mono">
                      بدلاً من <span className="line-through decoration-destructive text-background/50 font-medium">{formatNum(teamAnnual)}</span>
                    </div>
                  </div>
                  {/* LEFT (RTL end): Saving % */}
                  <div className="text-left ps-[14px] border-s border-s-background/10">
                    <div className="text-[11px] text-background/60 font-mono tracking-[.5px] mb-[3px]">التوفير</div>
                    <div className="font-mono text-[clamp(17px,5.0vw,26px)] font-semibold text-success leading-none">{calcSavePct}٪</div>
                    <div className="text-xs text-background/60 mt-[5px] font-mono">
                      = {formatNum(calcSaveAmt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sliders — 2-col grid desktop, compact */}
              <div className="pt-[14px] px-[22px] pb-1">
                <div className="grid grid-cols-2 gap-x-[22px] gap-y-[14px]">
                  {CALC_ROLES.map((r) => {
                    const value = salaries[r.key] ?? r.def;
                    const STEP = 500;
                    const bump = (delta: number) => {
                      setSalaries((prev) => {
                        const cur = prev[r.key] ?? r.def;
                        const next = Math.max(r.min, Math.min(r.max, cur + delta));
                        return { ...prev, [r.key]: next };
                      });
                    };
                    const atMin = value <= r.min;
                    const atMax = value >= r.max;
                    return (
                      <div key={r.key}>
                        <div className="flex justify-between items-baseline text-xs mb-1.5">
                          <span className="text-muted-foreground font-medium">{r.label}</span>
                          <span className="font-mono text-xs text-foreground">{formatNum(value)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`أنقص ${r.label}`}
                            onClick={() => bump(-STEP)}
                            disabled={atMin}
                            className={cn(CALC_BTN, atMin ? "opacity-35 cursor-not-allowed" : "opacity-100 cursor-pointer")}
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
                            onClick={() => bump(STEP)}
                            disabled={atMax}
                            className={cn(CALC_BTN, atMax ? "opacity-35 cursor-not-allowed" : "opacity-100 cursor-pointer")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 px-[22px] pb-[22px]">
                <a
                  href="#pricing"
                  onClick={onClose}
                  className="block text-center bg-success text-success-foreground p-3 rounded-[10px] text-[14.5px] font-semibold no-underline"
                >
                  شوف الباقة المناسبة لك ←
                </a>
              </div>
            </m.div>
          </m.div>
          );
        })()}
      </AnimatePresence>
    </LazyMotion>
  );
}
