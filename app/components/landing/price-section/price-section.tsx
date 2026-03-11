"use client";

import { useState } from "react";
import type { PricingContent } from "@/app/content/landing/price-section-types";
import { STYLES } from "./price-section-styles";
import { AnnouncementBar } from "./AnnouncementBar";
import { PriceSectionHeader } from "./PriceSectionHeader";
import { PlanCard } from "./PlanCard";
import { TrustBar } from "./TrustBar";
import { PriceSectionBottomCta } from "./PriceSectionBottomCta";

const PLAN_IDS = ["free", "starter", "growth", "scale"] as const;

type ModontyPricingProps = {
  pricingSA: PricingContent;
  pricingEG: PricingContent;
  initialLocale: "sa" | "eg";
  variant?: "homepage" | "full";
  highlightPlanId?: string | null;
};

export default function ModontyPricing({ pricingSA, pricingEG, initialLocale, variant = "full", highlightPlanId = null }: ModontyPricingProps) {
  const [annual, setAnnual] = useState(false);
  const activeLocale = initialLocale;
  const P = activeLocale === "sa" ? pricingSA : pricingEG;
  const { ANNOUNCEMENT, PLANS, TRUST_ITEMS, BOTTOM_CTA, UI } = P;
  const currency = activeLocale === "sa" ? "ر.س" : "ج.م";

  const validHighlight = highlightPlanId && PLAN_IDS.includes(highlightPlanId as (typeof PLAN_IDS)[number]) ? highlightPlanId : null;

  return (
    <div className="font-tajawal bg-stone-50 min-h-screen text-gray-900" dir="rtl">
      <style>{STYLES}</style>
      <AnnouncementBar text={ANNOUNCEMENT} />
      <div className="max-w-6xl mx-auto px-5 py-16 pb-20">
        <PriceSectionHeader UI={UI} annual={annual} setAnnual={setAnnual} />
        <div className="grid grid-cols-4 gap-4 items-start mb-16 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {PLANS.map((p, i) => (
            <div key={p.id} className={["delay-1", "delay-2", "delay-3", "delay-4"][i] + (p.featured ? "" : " anim-card")}>
              <PlanCard
                plan={p}
                annual={annual}
                currency={currency}
                ui={UI}
                compact={variant === "homepage"}
                defaultExpandDetails={validHighlight === p.id}
                id={`plan-${p.id}`}
              />
            </div>
          ))}
        </div>
        <TrustBar items={TRUST_ITEMS} title={UI.trustTitle} />
        <PriceSectionBottomCta BOTTOM_CTA={BOTTOM_CTA} />
      </div>
    </div>
  );
}
