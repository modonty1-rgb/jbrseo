import type { Plan as DBPlan } from "@prisma/client";
import type { StaticLanding } from "@/app/content/landing/types";
import type { ModontyTrustBundle } from "@/app/actions/modonty-client-logos";
import type { ModontyImpactStats, ClientCaseStudyStats } from "@/lib/analytics/ga4";
import { HeroSection } from "./sections/HeroSection";
import { GuaranteeSection } from "./sections/GuaranteeSection";
import { SaudiIdentity } from "./sections/SaudiIdentity";
import { FeaturesSection } from "./sections/FeaturesSection";
import { FinalCtaSection } from "./sections/FinalCtaSection";
import { VoicesSection } from "./sections/VoicesSection";
import { PricingSection } from "./sections/PricingSection";
import { CostHook } from "./sections/CostHook";
import { CaseStudiesSlider } from "./sections/CaseStudiesSlider";
import { FaqSection } from "./sections/FaqSection";
import { ClientsTeaser } from "./sections/ClientsTeaser";
import { tamaraIsConfigured } from "@/lib/tamara/client";

type Props = {
  countrySlug: "sa" | "eg";
  staticLanding: StaticLanding;
  plans: DBPlan[];
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

  /**
   * The refund guarantee, read from the hero's trust chips rather than from a field of
   * its own.
   *
   * One sentence, one place to edit it. A second field would drift the day someone
   * changed the policy in one and not the other, and the two would sit on the same page
   * contradicting each other — which is worse than either wording alone.
   *
   * It is the FIRST chip by convention: the hero row reads guarantee → registration →
   * support, and the pricing card shows only the guarantee. Reorder the chips in the
   * admin and the card follows the new first one, so keep the refund chip first.
   */
  const refundNote = staticLanding.hero.trust?.[0];
  const checkoutHref = `/${countrySlug}/checkout`;

  /**
   * Tamara is offered only where it can actually complete.
   *
   * Two conditions, both checked here on the server: Saudi Arabia, because Tamara answers
   * an Egyptian order with `400 not_supported_delivery_country`; and configured keys,
   * because a button that leads to a 503 is worse than no button. The section receives a
   * URL or nothing — it never learns why.
   */
  const tamaraHref =
    countrySlug === "sa" && tamaraIsConfigured() ? `/${countrySlug}/checkout/tamara` : undefined;

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

      {/* WHAT before PROOF.
          Four proof sections used to run back to back before this one — case studies,
          live numbers, guarantees, client logos — 2,899px arguing that we succeed, at a
          reader who did not yet know what the thing is. Read right-to-left in a mirrored
          F pattern, four blocks carrying the same message scan as one message repeated,
          and the scan stops. The offer comes first now; the evidence lands on a claim
          that has already been made. */}
      <FeaturesSection />

      {/* The price of the alternative, immediately after the offer and immediately before
          the price of ours — the comparison only means something between those two. */}
      <CostHook visiblePlans={visiblePlans} currency={currency} />

      {/* Client stories and the platform totals, under one heading. They were two
          sections whose eyebrows both read "Google Analytics" — the same claim at two
          resolutions, charging the reader twice for one message. */}
      <CaseStudiesSlider
        caseStats={caseStats}
        clientsCount={trustBundle.total}
        impact={modontyImpact}
      />

      {/* Registration proof and the team — who we are, in one strip. */}
      {/* No `teamTotal` any more: the card shows faces instead of a headcount, because a
          number invites a comparison against agencies that claim a bigger one. */}
      <SaudiIdentity team={[...coreTeam, ...executionTeam]} />

      {/* Four logos, not thirty.
          The old section serialised every client's name, sector and URL into this page to
          render four tiles, and shipped framer-motion plus a Radix Select to filter a
          roster hidden behind an expand button. Slicing here is what keeps the other
          twenty-six out of the payload entirely — passing the whole bundle and slicing
          inside the component would still send it. The roster lives on /clients. */}
      {trustBundle.logos.length > 0 && (
        <ClientsTeaser
          logos={trustBundle.logos.slice(0, 6)}
          total={trustBundle.total}
          ctaLabel={ctaLabel}
        />
      )}

      <PricingSection
        visiblePlans={visiblePlans}
        currency={currency}
        countrySlug={countrySlug}
        whatsappLink={whatsappLink}
        checkoutHref={checkoutHref}
        tamaraHref={tamaraHref}
        refundNote={refundNote}
      />

      {/* Guarantees follow the price, not precede it. A guarantee removes a risk, and the
          risk is not felt until the number is seen — above the price it was reassurance
          about a cost the reader had not yet been asked to bear. */}
      <GuaranteeSection />

      {voices.length > 0 && <VoicesSection voices={voices} socialProofEyebrow={socialProofEyebrow} />}


      {/* Three questions and a link, not eighteen. The full set — and the FAQPage
          structured data that belongs with it — lives on /faq. */}
      <FaqSection faqs={faqs} whatsappLink={whatsappLink} limit={3} moreHref="/faq" />

      {/* Gated on "sa" exactly as the pricing cards gate it — one refund promise, shown
          under the same condition in both places it appears. */}
      <FinalCtaSection
        finalCtaData={finalCtaData}
        ctaLabel={ctaLabel}
        whatsappLink={whatsappLink}
        refundNote={countrySlug === "sa" ? refundNote : undefined}
      />
    </>
  );
}
