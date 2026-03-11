"use client";

import type { PricingUI } from "@/app/content/landing/price-section-types";

interface PriceSectionHeaderProps {
  UI: PricingUI;
  annual: boolean;
  setAnnual: (v: boolean) => void;
}

export function PriceSectionHeader({ UI, annual, setAnnual }: PriceSectionHeaderProps) {
  return (
    <div className="text-center mb-14">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 gap-1 shadow-sm">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-sm font-bold border-0 cursor-pointer font-tajawal transition-all duration-200
              ${!annual ? "bg-violet-700 text-white shadow-md shadow-violet-600/30" : "bg-transparent text-gray-500"}`}
          >
            {UI.monthly}
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-sm font-bold border-0 cursor-pointer font-tajawal flex items-center gap-2 transition-all duration-200
              ${annual ? "bg-violet-700 text-white shadow-md shadow-violet-600/30" : "bg-transparent text-gray-500"}`}
          >
            {UI.yearly}
            <span className={`text-xs rounded-lg px-2 py-0.5 font-extrabold ${annual ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
              {UI.save20}
            </span>
          </button>
        </div>

        <div className="inline-flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-6 py-3 shadow-sm shadow-amber-100">
          <span className="text-xl">🎁</span>
          <div className="text-right">
            <div className="text-sm font-extrabold text-amber-900 leading-snug">{UI.banner12Title}</div>
            <div className="text-xs text-amber-700 mt-0.5 font-medium">{UI.banner12Sub}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
