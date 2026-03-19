"use client";

import Link from "@/app/components/link";
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
    <div className="relative mb-5 overflow-hidden rounded-2xl bg-linear-to-tr from-primary via-primary/80 to-primary p-8 sm:p-10">
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.55 0.22 275 / 35%), transparent)",
        }}
      />

      {/* Header */}
      <div className="relative mb-8 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[.14em] text-white/50">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          مقارنة التكلفة الفعلية
        </span>
        <h3
          className="mt-2 font-black text-white"
          style={{ fontSize: "clamp(22px,3.5vw,34px)", lineHeight: 1.15 }}
        >
          توفيرك الحقيقي:{" "}
          <span className="text-success">{pct}%</span>
        </h3>
        <p className="mt-1 text-[11px] text-white/30">
          {CALCULATOR_SAVINGS_CARD.percentLabel}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative mx-auto mb-8 max-w-sm">
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-linear-to-l from-success to-success/80 transition-all duration-500"
            style={{
              width: `${Math.min(pct, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* 3-column comparison */}
      <div className="relative mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Without plan */}
        <div className="rounded-xl border border-white/8 bg-white/5 p-5 text-center">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-white/40">
            {CALCULATOR_WITHOUT_CARD.title}
          </p>
          <p className="mb-3 text-[9px] text-white/25">
            {CALCULATOR_SAVINGS_CARD.yearly}
          </p>
          <p
            className="font-black leading-none tabular-nums text-destructive transition-all duration-300"
            style={{ fontSize: "clamp(22px,3.5vw,36px)" }}
          >
            {formatMoney(totalY)}
          </p>
          <div className="mt-3 border-t border-white/8 pt-3">
            <p className="text-[9px] uppercase tracking-wider text-white/30">
              {CALCULATOR_WITHOUT_CARD.monthly}
            </p>
            <p className="text-sm font-extrabold tabular-nums text-destructive/80">
              {formatMoney(totalM)}
            </p>
          </div>
        </div>

        {/* With plan */}
        <div className="rounded-xl border border-white/8 bg-white/5 p-5 text-center">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-white/40">
            {CALCULATOR_WITH_CARD.title}
          </p>
          <p className="mb-3 text-[9px] text-white/25">
            {CALCULATOR_SAVINGS_CARD.yearly}
          </p>
          <p
            className="font-black leading-none tabular-nums text-success transition-all duration-300"
            style={{ fontSize: "clamp(22px,3.5vw,36px)" }}
          >
            {formatMoney(subY)}
          </p>
          <div className="mt-3 border-t border-white/8 pt-3">
            <p className="text-[9px] uppercase tracking-wider text-white/30">
              {CALCULATOR_WITH_CARD.monthly}
            </p>
            <p className="text-sm font-extrabold tabular-nums text-success/80">
              {formatMoney(subM)}
            </p>
          </div>
        </div>

        {/* Savings — highlighted */}
        <div className="relative rounded-xl border border-success/30 bg-success/15 p-5 text-center ring-1 ring-success/20">
          <span className="absolute -top-2.5 inset-x-0 mx-auto w-fit rounded-full bg-success px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-black">
            توفيرك الفعلي
          </span>
          <p className="mb-1 mt-1 text-[10px] font-extrabold uppercase tracking-widest text-white/40">
            الفرق (التوفير)
          </p>
          <p className="mb-3 text-[9px] text-white/25">
            {CALCULATOR_SAVINGS_CARD.yearly}
          </p>
          <p
            className="font-black leading-none tabular-nums text-success transition-all duration-300"
            style={{ fontSize: "clamp(22px,3.5vw,36px)" }}
          >
            {formatMoney(saveY)}
          </p>
          <div className="mt-3 border-t border-[#86efac]/20 pt-3">
            <p className="text-[9px] uppercase tracking-wider text-white/30">
              {CALCULATOR_SAVINGS_CARD.monthly}
            </p>
            <p className="text-sm font-extrabold tabular-nums text-success">
              {formatMoney(saveM)}
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="relative flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={ctaLink}
          className="inline-flex items-center gap-2.5 rounded-[14px] bg-white px-8 py-3.5 text-[15px] font-black text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          {ctaLabel}
        </Link>
        <Link
          href={featuresLink}
          className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/10 px-6 py-3.5 text-[14px] font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white"
        >
          {CALCULATOR_SAVINGS_CARD.secondaryCta}
        </Link>
      </div>

      <p className="relative mt-5 text-center text-[11px] text-white/25">
        {CALCULATOR_SAVINGS_CARD.footnote}
      </p>
    </div>
  );
}
