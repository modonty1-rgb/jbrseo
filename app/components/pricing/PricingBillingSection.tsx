"use client";

import { useState } from "react";
import type { PricingContent } from "@/app/content/landing/price-section-types";
import { BillingToggle } from "@/app/components/pricing/BillingToggle";
import { TierCard } from "@/app/components/pricing/TierCard";
import { buildSignupHrefWithPlanId } from "@/lib/signup-href";

type Props = {
  plans: PricingContent["PLANS"];
  ui: PricingContent["UI"];
  currency: string;
  signupHrefBase?: string;
};

export function PricingBillingSection({ plans, ui, currency, signupHrefBase = "/signup" }: Props) {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center sm:justify-end">
        <BillingToggle annual={annual} onChange={setAnnual} ui={ui} />
      </div>
      <div className="grid grid-cols-4 gap-4 items-stretch max-lg:grid-cols-2 max-sm:grid-cols-1">
        {plans.map((plan) => (
          <TierCard
            key={plan.id}
            plan={plan}
            annual={annual}
            ui={ui}
            currency={currency}
            href={buildSignupHrefWithPlanId(
              signupHrefBase,
              plan.id,
              annual,
              plan.price.mo,
              plan.price.yr
            )}
          />
        ))}
      </div>
    </div>
  );
}

