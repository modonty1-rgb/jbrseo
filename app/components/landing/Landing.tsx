import type { Plan as DBPlan } from "@prisma/client";
import type { StaticLanding } from "@/app/content/landing/types";
import type { ModontyTrustBundle } from "@/app/actions/modonty-client-logos";
import type { ModontyImpactStats, ClientCaseStudyStats } from "@/lib/analytics/ga4";
import { HeroSection } from "./sections/HeroSection";
import { ModontyImpactBar } from "./sections/ModontyImpactBar";
import { GuaranteeSection } from "./sections/GuaranteeSection";
import { SaudiIdentity } from "./sections/SaudiIdentity";
import { FeaturesSection } from "./sections/FeaturesSection";
import { PaymentTrust } from "./sections/PaymentTrust";
import { FinalCtaSection } from "./sections/FinalCtaSection";
import { TeamSection } from "./sections/TeamSection";
import { VoicesSection } from "./sections/VoicesSection";
import { PricingSection } from "./sections/PricingSection";
import { MathCompare } from "./sections/MathCompare";
import { CaseStudiesSlider } from "./sections/CaseStudiesSlider";
import { FaqSection } from "./sections/FaqSection";
import { TrustSectionLazy } from "./TrustSectionLazy";

type Props = {
  countrySlug: "sa" | "eg";
  staticLanding: StaticLanding;
  plans: DBPlan[];
  announcement: string;
  whatsappLink: string;
  ctaLabel: string;
  trustBundle: ModontyTrustBundle;
  modontyImpact: ModontyImpactStats | null;
  caseStats: Record<string, ClientCaseStudyStats> | null;
};

/**
 * Landing shell — a Server Component. It only prepares DB-derived data and
 * composes the sections; every piece of interactivity (billing toggle, voices
 * slider, savings calculator, client-logo grid) is isolated in its own Client
 * island, so the above-the-fold hero ships with zero shell JS.
 */
export function Landing(props: Props) {
  const { countrySlug, staticLanding, plans, whatsappLink, ctaLabel, trustBundle, modontyImpact, caseStats } = props;
  const checkoutHref = `/${countrySlug}/checkout`;

  const country = countrySlug === "eg" ? "EG" : "SA";
  const currency = country === "EG" ? "ج.م" : "ر.س";

  const visiblePlans = [...plans]
    .filter((p) => p.visible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const faqs = staticLanding.faq?.faqs ?? [];
  const finalCtaData = staticLanding.finalCta;

  const coreTeam = (staticLanding.team?.coreTeam ?? []).filter((m) => m.name?.trim());
  const executionTeam = (staticLanding.team?.executionTeam ?? []).filter((m) => m.name?.trim());

  const voices = (staticLanding.socialProof?.testimonials ?? []).filter(
    (t) => t.name?.trim() || t.quote?.trim(),
  );
  const socialProofEyebrow = staticLanding.socialProof?.eyebrow ?? "شهادات";

  return (
    <>
      <HeroSection
        hero={staticLanding.hero}
        clientsTotal={trustBundle.total}
        countrySlug={countrySlug}
        ctaLabel={ctaLabel}
        whatsappLink={whatsappLink}
      />

      <CaseStudiesSlider caseStats={caseStats} clientsCount={trustBundle.total} />

      {modontyImpact && <ModontyImpactBar impact={modontyImpact} />}

      <GuaranteeSection />

      <SaudiIdentity />

      {trustBundle.logos.length > 0 && (
        <TrustSectionLazy bundle={trustBundle} ctaLabel={ctaLabel} />
      )}

      <MathCompare visiblePlans={visiblePlans} currency={currency} />

      <FeaturesSection />

      <PaymentTrust />

      <PricingSection
        visiblePlans={visiblePlans}
        currency={currency}
        countrySlug={countrySlug}
        whatsappLink={whatsappLink}
        checkoutHref={checkoutHref}
      />

      {voices.length > 0 && <VoicesSection voices={voices} socialProofEyebrow={socialProofEyebrow} />}

      {(coreTeam.length > 0 || executionTeam.length > 0) && (
        <TeamSection coreTeam={coreTeam} executionTeam={executionTeam} />
      )}

      <FaqSection faqs={faqs} whatsappLink={whatsappLink} />

      <FinalCtaSection finalCtaData={finalCtaData} ctaLabel={ctaLabel} whatsappLink={whatsappLink} />
    </>
  );
}
