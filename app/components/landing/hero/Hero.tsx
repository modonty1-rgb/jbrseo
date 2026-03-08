import type { StaticLanding } from "@/app/content/landing/types";
import type { LandingContent } from "@/lib/landing-content.types";
import { SectionImage } from "@/app/components/landing/SectionImage";
import { HeroBackground } from "./HeroBackground";
import { HeroBenefits } from "./HeroBenefits";
import { HeroCTASection } from "./HeroCTASection";
import { HeroEyebrow } from "./HeroEyebrow";
import { HeroHeadline } from "./HeroHeadline";
import { HeroImageBlock } from "./HeroImageBlock";
import { HeroSlogan } from "./HeroSlogan";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771979297/modonatyAvatar_scfhac.png";

export default function Hero({
  content,
  staticLanding,
}: {
  content: LandingContent;
  staticLanding: StaticLanding;
}) {
  const h = staticLanding.hero;
  const contactAvatar = content.landingImages?.contactAvatar ?? DEFAULT_AVATAR;

  return (
    <section
      id="hero"
      data-reveal-section
      aria-labelledby="hero-title"
      className="
        landing-grain relative overflow-hidden bg-background
        px-5 pt-16 pb-24
        sm:px-8 sm:pt-20 sm:pb-32
        lg:px-12 lg:pt-[92px] lg:pb-[160px]
      "
    >
      <HeroBackground />

      <SectionImage src={h.sectionImage} alt={h.heroImageAlt} slot="hero" priority />

      <div className="
        relative z-10 mx-auto max-w-6xl
        grid grid-cols-1 items-center gap-10
        md:grid-cols-[1fr_360px] md:gap-14
        lg:grid-cols-[1fr_440px] lg:gap-20
      ">
        <div className="order-2 lg:order-1">
          <HeroEyebrow proof={h.proof} />
          <HeroHeadline line1={h.h1Line1} line2={h.h1Line2} />
          <HeroSlogan tagline={staticLanding.footer.tagline} />
          <p className="landing-reveal-content mt-0 mb-7 max-w-[490px] text-base leading-[1.85] text-muted-foreground sm:text-[17.5px]">
            {h.sub}
          </p>
          <HeroBenefits benefits={h.benefits} />
          <HeroCTASection
            cta={h.cta}
            ctaLink={h.ctaLink}
            trust={h.trust}
            seatsTotal={h.seatsTotal}
            seatsTaken={h.seatsTaken}
            socialLine={h.socialLine}
          />
        </div>

        <HeroImageBlock avatarSrc={contactAvatar} stats={h.stats} alt={h.heroImageAlt} />
      </div>
    </section>
  );
}
