import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent } from "@/lib/landing-content.types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { getWhatsAppLink } from "@/lib/site-links";
import { HeroBackground } from "./HeroBackground";
import { HeroBenefits } from "./HeroBenefits";
import { HeroCTASection } from "./HeroCTASection";
import { HeroEyebrow } from "./HeroEyebrow";
import { HeroBrandTag } from "./HeroBrandTag";
import { HeroHeadline } from "./HeroHeadline";
import { HeroSlogan } from "./HeroSlogan";

export default function Hero({
  content,
  staticLanding,
  country,
  ctaLabel,
  ctaLink = "/signup",
}: {
  content: LandingContent;
  staticLanding: StaticLanding;
  country?: SupportedCountry;
  ctaLabel?: string;
  ctaLink?: string;
}) {
  const h = staticLanding.hero;
  const resolvedCtaLabel = ctaLabel || content.siteSettings?.ctaLabel || "ابدأ مجاناً — بدون بطاقة";
  const waLink = country ? getWhatsAppLink(country, content.siteSettings?.whatsappNumber) : "";
  const secondaryCta =
    waLink && staticLanding.finalCta?.wa
      ? { label: staticLanding.finalCta.wa, href: waLink }
      : undefined;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      aria-describedby="hero-description"
      className="
        landing-grain relative overflow-hidden bg-background
        px-5 pt-10 pb-16
        sm:px-8 sm:pt-14 sm:pb-20
        lg:px-12 lg:pt-[64px] lg:pb-[100px]
      "
    >
      <HeroBackground />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="hero-content-reveal w-full">
          <HeroEyebrow proof={h.proof} />
          <div className="mt-2 grid w-full grid-cols-1 gap-8 lg:mt-0 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="order-2 flex w-full flex-col items-center gap-4 lg:order-1 lg:items-start lg:gap-5">
              <HeroHeadline line1={h.h1Line1} line2={h.h1Line2} />
              <HeroSlogan tagline={staticLanding.footer.tagline} />
            </div>
            <div className="order-1 flex w-full justify-center lg:order-2">
              <HeroBrandTag />
            </div>
          </div>
          <p
            id="hero-description"
            className="landing-hero-sub landing-reveal-content mx-auto mt-8 mb-8 max-w-[490px] text-base font-normal leading-[1.85] text-muted-foreground sm:text-[17.5px] lg:mt-10"
          >
            {h.sub}
          </p>
          <HeroBenefits benefits={h.benefits} />
          <HeroCTASection
            cta={resolvedCtaLabel}
            ctaLink={ctaLink}
            secondaryCta={secondaryCta}
          />
        </div>
      </div>
    </section>
  );
}
