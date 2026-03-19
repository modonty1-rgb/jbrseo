import type { StaticLanding } from "@/app/content/landing/types";
import Calculator from "./Calculator";

const DEFAULT_CTA = "ابدأ مجاناً — بدون بطاقة";

export default function WhyNow({
  staticLanding,
  ctaLabel = DEFAULT_CTA,
  ctaLink = "/signup",
}: {
  staticLanding: StaticLanding;
  ctaLabel?: string;
  ctaLink?: string;
}) {
  void staticLanding;

  return <Calculator ctaLabel={ctaLabel} ctaLink={ctaLink} featuresLink="/features" />;
}
