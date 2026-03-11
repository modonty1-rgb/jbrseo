import type { StaticLanding } from "@/app/content/landing/types";
import { SocialProofBackground } from "./SocialProofBackground";
import { SocialProofHeader } from "./SocialProofHeader";
import { SocialProofCarousel } from "./SocialProofCarousel";
import { SocialProofFounding } from "./SocialProofFounding";

export default function SocialProof({ staticLanding }: { staticLanding: StaticLanding }) {
  const s = staticLanding.socialProof;
  return (
    <section
      id="social-proof"
      aria-labelledby="social-proof-title"
      className="
        relative overflow-hidden border-t border-border bg-muted/40
        px-5 pt-24 pb-20
        sm:px-8
        lg:px-10 lg:pt-[96px] lg:pb-[88px]
      "
    >
      <SocialProofBackground />
      <div className="relative mx-auto max-w-[1000px]">
        <div className="relative z-10">
          <SocialProofHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
          <SocialProofCarousel testimonials={s.testimonials} />
          <SocialProofFounding text={s.founding} />
        </div>
      </div>
    </section>
  );
}
