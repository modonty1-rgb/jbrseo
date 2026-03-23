import Link from "@/app/components/link";
import type { PricingUI } from "@/app/content/landing/price-section-types";
import { Icon } from "@/app/components/Icon";
import { Gift } from "lucide-react";

interface PriceSectionHeaderProps {
  UI: PricingUI;
  annual: boolean;
  basePath: string;
}

export function PriceSectionHeader({ UI, annual, basePath }: PriceSectionHeaderProps) {
  const monthlyHref = `${basePath}?billing=monthly`;
  const annualHref = `${basePath}?billing=annual`;

  return (
    <div className="text-center mb-14">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex bg-card border border-border rounded-full p-1 gap-1 shadow-sm" role="group" aria-label="طريقة الدفع">
          <Link
            href={monthlyHref}
            scroll={false}
            aria-current={!annual ? "page" : undefined}
            className={`px-5 py-2 rounded-full text-sm font-bold border-0 cursor-pointer font-tajawal transition-all duration-200
              ${!annual ? "bg-primary text-primary-foreground shadow-md" : "bg-transparent text-muted-foreground"}`}
          >
            {UI.monthly}
          </Link>
          <Link
            href={annualHref}
            scroll={false}
            aria-current={annual ? "page" : undefined}
            className={`px-5 py-2 rounded-full text-sm font-bold border-0 cursor-pointer font-tajawal flex items-center gap-2 transition-all duration-200
              ${annual ? "bg-primary text-primary-foreground shadow-md" : "bg-transparent text-muted-foreground"}`}
          >
            {UI.yearly}
            <span className={`text-xs rounded-lg px-2 py-0.5 font-extrabold ${annual ? "bg-primary-foreground/20 text-primary-foreground" : "bg-success/15 text-success-foreground"}`}>
              {UI.save20}
            </span>
          </Link>
        </div>

        {(annual ? UI.pricingBelowHintAnnual : UI.pricingBelowHintMonthly) ? (
          <p className="text-xs text-muted-foreground font-medium max-w-md leading-relaxed">
            {annual ? UI.pricingBelowHintAnnual : UI.pricingBelowHintMonthly}
          </p>
        ) : null}

        <div className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 shadow-sm border-2 border-(--pricing-banner-border) bg-(--pricing-banner-bg)">
          <span className="text-xl text-primary"><Gift size={24} strokeWidth={2.5} /></span>
          <div className="text-right">
            <div className="text-sm font-extrabold text-foreground leading-snug">{UI.banner12Title}</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-medium">{UI.banner12Sub}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
