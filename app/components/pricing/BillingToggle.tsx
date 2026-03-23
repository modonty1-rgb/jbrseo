"use client";

import type { ReactElement } from "react";
import type { PricingUI } from "@/app/content/landing/price-section-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

type BillingToggleProps = {
  annual: boolean;
  onChange: (value: boolean) => void;
  ui: PricingUI;
};

export function BillingToggle({ annual, onChange, ui }: BillingToggleProps): ReactElement {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-muted/60 px-2 py-1 text-xs sm:text-sm">
      <span className="text-muted-foreground">{ui.billingMonthly}</span>
      <Tabs
        value={annual ? "annual" : "monthly"}
        onValueChange={(v) => onChange(v === "annual")}
        aria-label="تبديل طريقة الدفع"
        className="inline-flex"
      >
        <TabsList className="inline-flex h-auto gap-0 rounded-full bg-background p-1 shadow-sm">
          <TabsTrigger
            value="monthly"
            className="rounded-full px-3 py-1 font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {ui.monthly}
          </TabsTrigger>
          <TabsTrigger
            value="annual"
            className="rounded-full px-3 py-1 font-semibold text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {ui.yearly}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="monthly" className="hidden" tabIndex={-1} aria-hidden />
        <TabsContent value="annual" className="hidden" tabIndex={-1} aria-hidden />
      </Tabs>
      <span className="hidden text-xs font-semibold text-success sm:inline">{ui.save20}</span>
    </div>
  );
}
