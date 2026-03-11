"use client";

import type { PricingUI } from "@/app/content/landing/price-section-types";

type BillingToggleProps = {
  annual: boolean;
  onChange: (value: boolean) => void;
  ui: PricingUI;
};

export function BillingToggle({ annual, onChange, ui }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-muted/60 px-2 py-1 text-xs sm:text-sm">
      <span className="text-muted-foreground">{ui.billingMonthly}</span>
      <div
        role="tablist"
        aria-label="تبديل طريقة الدفع"
        className="inline-flex rounded-full bg-background p-1 shadow-sm"
      >
        <button
          type="button"
          role="tab"
          aria-pressed={!annual}
          onClick={() => onChange(false)}
          className={`px-3 py-1 rounded-full font-semibold transition-colors ${
            !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {ui.monthly}
        </button>
        <button
          type="button"
          role="tab"
          aria-pressed={annual}
          onClick={() => onChange(true)}
          className={`px-3 py-1 rounded-full font-semibold transition-colors ${
            annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {ui.yearly}
        </button>
      </div>
      <span className="hidden text-xs text-success font-semibold sm:inline">
        {ui.save20}
      </span>
    </div>
  );
}

