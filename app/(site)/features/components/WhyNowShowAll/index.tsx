import type { ReactNode } from "react";

import { SliderController } from "../SliderController";
import { WhyNowDistributionBlock } from "../WhyNowDistributionBlock";
import { WhyNowTrustPills } from "../WhyNowTrustPills";

export default function WhyNowShowAll(): ReactNode {
  return (
    <main dir="rtl" className="min-h-screen bg-background px-5 py-12 text-foreground">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-2xl leading-tight text-foreground md:text-3xl lg:text-4xl">
          ٦ موظفين أو{" "}
          <em className="not-italic text-accent">مدونتي؟</em>
        </h2>
        <p className="mx-auto mb-4 max-w-[480px] text-sm leading-relaxed text-muted-foreground">
          لإنتاج محتوى SEO احترافي ونشره وترويجه شهرياً — مدونتي تغني عن توظيف أشخاص إضافيين.
        </p>
      </div>

      <SliderController />
      <WhyNowDistributionBlock />
      <WhyNowTrustPills />
    </main>
  );
}

