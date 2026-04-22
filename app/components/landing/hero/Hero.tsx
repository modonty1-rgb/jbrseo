import Link from "@/app/components/link";
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
        px-5 pt-6 pb-10
        sm:px-8 sm:pt-8 sm:pb-14
        lg:px-12 lg:pt-10 lg:pb-15
      "
    >
      <HeroBackground />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="hero-content-reveal w-full">
          <HeroEyebrow proof={h.proof} />
          <div className="mt-2 grid w-full grid-cols-1 gap-8 lg:mt-0 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="order-1 flex w-full flex-col items-center gap-4 lg:order-1 lg:items-start lg:gap-5">
              <HeroHeadline line1={h.h1Line1} line2={h.h1Line2} />
              <HeroSlogan tagline={staticLanding.footer.tagline} />
              <div className="mt-3 flex flex-col items-center gap-3 lg:items-start">
                <Link
                  href={ctaLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-violet-700 hover:shadow-xl"
                >
                  ابدأ مجاناً — بدون بطاقة ←
                </Link>
                <p className="text-xs text-foreground/55">✓ بدون بطاقة · ✓ ١٤ يوم ضمان كامل</p>
              </div>
            </div>
            <div className="order-2 flex w-full justify-center lg:order-2">
              <HeroBrandTag />
            </div>
          </div>
          <p
            id="hero-description"
            className="landing-hero-sub landing-reveal-content mx-auto mt-4 mb-4 max-w-[490px] text-base font-normal leading-[1.85] text-foreground/75 sm:text-[17.5px] lg:mt-6"
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
