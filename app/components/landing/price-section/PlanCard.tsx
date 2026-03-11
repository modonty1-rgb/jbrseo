"use client";

import Link from "next/link";
import type { Plan, PricingUI } from "@/app/content/landing/price-section-types";
import { Check, WhatsApp } from "./PriceSectionIcons";
import { DetailsAccordion } from "./DetailsAccordion";

interface PlanCardProps {
  plan: Plan;
  annual: boolean;
  currency: string;
  ui: PricingUI;
  compact?: boolean;
  defaultExpandDetails?: boolean;
  id?: string;
}

export function PlanCard({ plan, annual, currency, ui, compact = false, defaultExpandDetails = false, id }: PlanCardProps) {
  const mo = plan.price.mo;
  const price = annual ? plan.price.yr : mo;
  const savings = mo > 0 ? (mo - plan.price.yr) * 12 : 0;
  const F = plan.featured;

  const cardCls = F
    ? "relative flex flex-col rounded-2xl p-8 featured-lift anim-featured shadow-2xl shadow-purple-600/30 border-0 overflow-visible"
    : "relative flex flex-col rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 anim-card overflow-visible";

  return (
    <div
      id={id}
      className={cardCls}
      style={F ? { background: "linear-gradient(165deg, #1e1b4b 0%, #312e81 55%, #2e1065 100%)" } : {}}
    >
      {plan.badge && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-xs font-extrabold px-4 py-1.5 rounded-full whitespace-nowrap z-10"
          style={{ background: plan.badgeGold ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#a78bfa,#7c3aed)", boxShadow: plan.badgeGold ? "0 4px 14px rgba(217,119,6,.35)" : "0 4px 14px rgba(124,58,237,.4)" }}
        >
          {plan.badge}
        </div>
      )}

      <span
        className="inline-flex items-center text-xs font-extrabold px-3 py-1 rounded-lg mb-3 w-fit"
        style={{ background: plan.accentBg, color: plan.accent }}
      >
        {plan.name}
      </span>

      <p className={`text-sm font-semibold leading-relaxed mb-5 ${F ? "text-purple-200" : "text-gray-500"}`}>
        {plan.persona}
      </p>

      <div className="mb-1">
        {mo === 0 ? (
          <div className={`text-5xl font-black leading-none tracking-tight ${F ? "text-white" : "text-gray-900"}`}>
            {ui.freeLabel}
          </div>
        ) : (
          <>
            {annual && (
              <div className={`text-sm line-through mb-0.5 ${F ? "text-purple-300" : "text-gray-400"}`}>
                {mo.toLocaleString()} {currency}
              </div>
            )}
            <div className="flex items-end gap-1">
              <span className={`text-5xl font-black leading-none tracking-tight ${F ? "text-white" : "text-gray-900"}`}>
                {price.toLocaleString()}
              </span>
              <span className={`text-sm pb-2 ${F ? "text-purple-300" : "text-gray-400"}`}>
                {currency} {ui.perMonth}
              </span>
            </div>

            {annual && savings > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit
                  ${F ? "bg-green-400/20 text-green-300 border border-green-400/25" : "bg-green-50 text-green-700 border border-green-200"}`}>
                  ✓ {ui.savedYearly.replace("{n}", savings.toLocaleString()).replace("{c}", currency)}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit
                  ${F ? "bg-yellow-300/15 text-yellow-200 border border-yellow-300/25" : "bg-amber-50 text-amber-800 border border-amber-300"}`}>
                  {ui.offer12_18}
                </span>
              </div>
            )}
            <p className={`text-xs mt-1.5 ${F ? "text-purple-300" : "text-gray-400"}`}>
              {annual ? ui.billingAnnual.replace("{n}", (price * 12).toLocaleString()).replace("{c}", currency) : ui.billingMonthly}
            </p>
          </>
        )}
      </div>

      <span
        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mt-3 mb-5 w-fit border"
        style={{ background: F ? "rgba(167,139,250,0.18)" : plan.accentBg, color: plan.accent, borderColor: F ? "rgba(167,139,250,0.3)" : plan.accent + "28" }}
      >
        ✦ {plan.articles}
      </span>

      <div className={`h-px w-full mb-4 ${F ? "bg-white/10" : "bg-gray-100"}`} />

      <span
        className={`inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl text-sm font-extrabold border-0 font-tajawal
          ${plan.ctaClass === "btn-ghost"    ? "bg-transparent border-gray-200 text-gray-500"
          : plan.ctaClass === "btn-blue"     ? "bg-slate-800 text-white shadow-md"
          : plan.ctaClass === "btn-featured" ? "text-indigo-900 font-extrabold text-base shadow-lg shadow-violet-400/40"
          : "text-white shadow-md shadow-amber-600/30"}`}
        style={
          plan.ctaClass === "btn-featured" ? { background: "#a78bfa" }
          : plan.ctaClass === "btn-gold"   ? { background: "linear-gradient(135deg,#d97706,#b45309)" }
          : {}
        }
      >
        {plan.cta}
      </span>

      {plan.guarantee && (
        <p className={`text-xs text-center mt-2 mb-4 leading-relaxed ${F ? "text-purple-300/60" : "text-gray-400"}`}>
          {ui.guarantee}
        </p>
      )}
      {!plan.guarantee && <div className="mb-4" />}

      <div className={`h-px w-full mb-4 ${F ? "bg-white/10" : "bg-gray-100"}`} />

      <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${F ? "text-purple-300/50" : "text-gray-300"}`}>
        {ui.youGet}
      </p>
      <div className="flex flex-col gap-2.5">
        {plan.highlights.map((feat, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <Check color={plan.accent} />
            <span className={`text-sm leading-relaxed font-medium ${F ? "text-white/85" : "text-gray-700"}`}>
              {feat}
            </span>
          </div>
        ))}
      </div>

      {plan.sections && plan.sections.length > 0 && (
        <>
          <div className={`h-px w-full mt-4 ${F ? "bg-white/10" : "bg-gray-100"}`} />
          {compact ? (
            <Link
              href={`/pricing?plan=${plan.id}`}
              className={`text-xs font-bold mt-3 inline-block underline underline-offset-2 ${F ? "text-purple-300 hover:text-purple-200" : "text-violet-600 hover:text-violet-700"}`}
            >
              {ui.moreDetails}
            </Link>
          ) : (
            <>
              <p className={`text-xs font-bold mt-3 mb-1 ${F ? "text-purple-300/50" : "text-gray-300"}`}>{ui.moreDetails}</p>
              <DetailsAccordion sections={plan.sections} featured={F} defaultOpenIndex={defaultExpandDetails ? 0 : null} />
            </>
          )}
        </>
      )}

      {plan.id === "scale" && (
        <>
          <div className="h-px w-full bg-gray-100 mt-4 mb-3" />
          <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-xl py-2.5 px-4 text-sm font-bold text-green-700 cursor-pointer">
            <WhatsApp /> {ui.whatsapp}
          </div>
        </>
      )}
    </div>
  );
}
