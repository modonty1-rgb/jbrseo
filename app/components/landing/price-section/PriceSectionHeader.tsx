"use client";

import type { PricingHero, PricingUI } from "@/app/content/landing/price-section-types";

interface PriceSectionHeaderProps {
  HERO: PricingHero;
  UI: PricingUI;
  annual: boolean;
  setAnnual: (v: boolean) => void;
  locale: "sa" | "eg";
  setLocale: (v: "sa" | "eg") => void;
}

export function PriceSectionHeader({ HERO, UI, annual, setAnnual, locale, setLocale }: PriceSectionHeaderProps) {
  return (
    <div className="text-center mb-14">
      <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-2 mb-7 shadow-sm">
        <div className="flex">
          {["#6d28d9", "#2563eb", "#16a34a", "#d97706", "#dc2626"].map((c, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-extrabold text-white"
              style={{ background: c, marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}
            >
              {["ع", "م", "س", "أ", "ر"][i]}
            </div>
          ))}
        </div>
        <span className="text-xs font-bold text-gray-900">
          <span className="text-violet-700">{HERO.socialProof.split(" ")[0]}</span>
          {" " + HERO.socialProof.split(" ").slice(1).join(" ")}
        </span>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs font-bold text-green-600">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          {UI.activeNow}
        </div>
      </div>

      <h1 className="font-amiri text-5xl font-bold text-gray-900 leading-snug mb-4 tracking-tight">
        {HERO.headlineLine1}
        <br />
        <span className="bg-linear-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
          {HERO.headlineLine2}
        </span>
      </h1>

      <p className="text-base text-gray-500 max-w-md mx-auto mb-9 leading-loose">
        {HERO.subheadline}
      </p>

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

      {process.env.NODE_ENV === "development" && (
        <div className="flex items-center justify-center gap-2.5 mt-4">
          <span className="text-xs font-bold text-gray-400">{UI.dialectLabel}</span>
          <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 gap-1 shadow-sm">
            <button
              onClick={() => setLocale("sa")}
              className={`px-5 py-1.5 rounded-full text-xs font-bold border-0 cursor-pointer font-tajawal transition-all duration-200
                ${locale === "sa" ? "bg-violet-700 text-white shadow-sm shadow-violet-600/25" : "bg-transparent text-gray-500"}`}
            >
              {UI.dialectSA}
            </button>
            <button
              onClick={() => setLocale("eg")}
              className={`px-5 py-1.5 rounded-full text-xs font-bold border-0 cursor-pointer font-tajawal transition-all duration-200
                ${locale === "eg" ? "bg-violet-700 text-white shadow-sm shadow-violet-600/25" : "bg-transparent text-gray-500"}`}
            >
              {UI.dialectEG}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
