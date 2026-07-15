"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CALC_ROLES } from "../calc-roles";
import { Skeleton } from "@/app/components/ui/skeleton";

// Overlay skeleton shaped like LandingCalcModal — shown only while the modal
// chunk is loading, so the click feels instant. Mirrors the modal frame: header,
// dark result strip, the 6-role slider grid, and the CTA.
function CalcModalSkeleton() {
  return (
    <div className="fixed inset-0 z-[70] bg-foreground/50 flex items-center justify-center p-[18px]" aria-hidden>
      <div className="bg-card rounded-[18px] max-w-[620px] w-full max-h-[88vh] overflow-hidden">
        <div className="pt-[18px] px-[22px] pb-[14px] border-b border-b-muted flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-44" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-11 w-14 rounded-lg" />
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
        </div>
        <div className="pt-4 px-[22px] pb-[18px] bg-foreground flex items-center justify-between gap-[18px]">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 bg-background/20" />
            <Skeleton className="h-6 w-40 bg-background/20" />
            <Skeleton className="h-3 w-24 bg-background/20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-12 bg-background/20" />
            <Skeleton className="h-6 w-16 bg-background/20" />
          </div>
        </div>
        <div className="pt-[14px] px-[22px] pb-1">
          <div className="grid grid-cols-2 gap-x-[22px] gap-y-[14px]">
            {CALC_ROLES.map((r) => (
              <div key={r.key} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-11 w-11 rounded-[10px]" />
                  <Skeleton className="h-2 flex-1 rounded-full" />
                  <Skeleton className="h-11 w-11 rounded-[10px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 px-[22px] pb-[22px]">
          <Skeleton className="h-11 w-full rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}

// The calculator modal (motion + sliders) is code-split and client-only; its
// chunk isn't fetched until the visitor clicks, and CalcModalSkeleton covers the
// load. ssr:false is valid here because this is a Client Component.
const LandingCalcModal = dynamic(
  () => import("../LandingCalcModal").then((m) => m.LandingCalcModal),
  { ssr: false, loading: () => <CalcModalSkeleton /> },
);

type Props = {
  mathPlanAnnual: number;
  mathPlanName: string;
  currency: string;
};

/**
 * The one interactive leaf of the (Server Component) math section: the "calculate
 * your savings" button plus its lazy calculator modal. Owns the salary state the
 * modal's sliders mutate, so MathCompare itself ships no client JS.
 */
export function CalcSavingsButton({ mathPlanAnnual, mathPlanName, currency }: Props) {
  const [salaries, setSalaries] = useState<Record<string, number>>(
    () => Object.fromEntries(CALC_ROLES.map((r) => [r.key, r.def])),
  );
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcMounted, setCalcMounted] = useState(false);

  const teamAnnual = Object.values(salaries).reduce((a, b) => a + b, 0) * 12;

  return (
    <>
      <button
        type="button"
        onClick={() => { setCalcMounted(true); setCalcOpen(true); }}
        aria-label="حاسبة التوفير"
        className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer px-5 py-2.5 rounded-xl text-[14px] font-semibold md:shadow-[0_16px_36px_-14px_color-mix(in_oklch,var(--foreground)_50%,transparent)]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
          <rect x="4" y="2.5" width="16" height="19" rx="2.5" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <circle cx="8.5" cy="12" r=".6" fill="currentColor" />
          <circle cx="12" cy="12" r=".6" fill="currentColor" />
          <circle cx="15.5" cy="12" r=".6" fill="currentColor" />
        </svg>
        <span>احسب توفيرك بنفسك</span>
        <span aria-hidden>←</span>
      </button>

      {calcMounted && (
        <LandingCalcModal
          open={calcOpen}
          onClose={() => setCalcOpen(false)}
          salaries={salaries}
          setSalaries={setSalaries}
          mathPlanAnnual={mathPlanAnnual}
          teamAnnual={teamAnnual}
          mathPlanName={mathPlanName}
          currency={currency}
        />
      )}
    </>
  );
}
