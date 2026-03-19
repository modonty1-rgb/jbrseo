import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent } from "@/lib/landing-content.types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { getWhatsAppLink } from "@/lib/site-links";
import { HeroBackground } from "./HeroBackground";
import { HeroBenefits } from "./HeroBenefits";
import { HeroCTASection } from "./HeroCTASection";
import { HeroEyebrow } from "./HeroEyebrow";
import { HeroHeadline } from "./HeroHeadline";
import { HeroSlogan } from "./HeroSlogan";

export default function Hero({
  content,
  staticLanding,
  country,
  ctaLink = "/signup",
}: {
  content: LandingContent;
  staticLanding: StaticLanding;
  country?: SupportedCountry;
  ctaLink?: string;
}) {
  const h = staticLanding.hero;
  const ctaLabel = content.siteSettings?.ctaLabel || "ابدأ مجاناً — بدون بطاقة";
  const waLink = country ? getWhatsAppLink(country, content.siteSettings?.whatsappNumber) : "";
  const secondaryCta =
    waLink && staticLanding.finalCta?.wa
      ? { label: staticLanding.finalCta.wa, href: waLink }
      : undefined;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="
        landing-grain relative overflow-hidden bg-background
        px-5 pt-16 pb-24
        sm:px-8 sm:pt-20 sm:pb-32
        lg:px-12 lg:pt-[92px] lg:pb-[160px]
      "
    >
      <HeroBackground />
      <div className="
        relative z-10 mx-auto max-w-5xl
        flex flex-col items-center
      ">
        <div className="hero-content-reveal w-full">
          <HeroEyebrow proof={h.proof} />
          <HeroHeadline line1={h.h1Line1} line2={h.h1Line2} />
          <HeroSlogan tagline={staticLanding.footer.tagline} />
          <p className="landing-hero-sub landing-reveal-content mt-0 mb-8 max-w-[490px] text-base font-normal leading-[1.85] text-muted-foreground sm:text-[17.5px]">
            {h.sub}
          </p>
          <HeroBenefits benefits={h.benefits} />
          <HeroCTASection
            cta={ctaLabel}
            ctaLink={ctaLink}
            trust={h.trust}
            secondaryCta={secondaryCta}
          />
        </div>
      </div>
    </section>
  );
}
