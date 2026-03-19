import type { PricingContent } from "@/app/content/landing/price-section-types";
import { AnnouncementBar } from "./AnnouncementBar";
import { PriceSectionHeader } from "./PriceSectionHeader";
import { PlanCard } from "./PlanCard";
import { TrustBar } from "./TrustBar";
import { PriceSectionBottomCta } from "./PriceSectionBottomCta";

type ModontyPricingProps = {
  pricingSA: PricingContent;
  pricingEG: PricingContent;
  initialLocale: "sa" | "eg";
  annual: boolean;
  basePath: string;
  pricingHrefBase?: string;
  signupHrefBase?: string;
  whatsappLink?: string;
};

export default function ModontyPricing({ pricingSA, pricingEG, initialLocale, annual, basePath, pricingHrefBase = "/pricing", signupHrefBase = "/signup", whatsappLink }: ModontyPricingProps) {
  const P = initialLocale === "sa" ? pricingSA : pricingEG;
  const { ANNOUNCEMENT, PLANS, TRUST_ITEMS, BOTTOM_CTA, UI } = P;
  const currency = initialLocale === "sa" ? "ر.س" : "ج.م";

  return (
    <div className="bg-background min-h-screen text-foreground" dir="rtl">
      <AnnouncementBar text={ANNOUNCEMENT} />
      <div className="max-w-6xl mx-auto px-5 py-16 pb-20">
        <PriceSectionHeader UI={UI} annual={annual} basePath={basePath} />
        <div className="grid grid-cols-4 gap-4 items-start mb-16 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {PLANS.map((p, i) => (
            <PlanCard
              key={p.id}
              plan={p}
              annual={annual}
              currency={currency}
              ui={UI}
              id={`plan-${p.id}`}
              pricingHrefBase={pricingHrefBase}
              whatsappLink={whatsappLink}
              className={["animate-fade-in-up", "animate-fade-in-up delay-200", "animate-fade-in-up delay-400", "animate-fade-in-up delay-600"][i]}
            />
          ))}
        </div>
        <TrustBar items={TRUST_ITEMS} title={UI.trustTitle} />
        <PriceSectionBottomCta BOTTOM_CTA={BOTTOM_CTA} signupHref={signupHrefBase} whatsappLink={whatsappLink} />
      </div>
    </div>
  );
}
