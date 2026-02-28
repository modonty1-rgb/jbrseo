import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import type { LandingContent } from "@/lib/landing-content.types";

const HERO_IMAGE_ALT = "مدونتي — شريكك في النمو";

export default function Hero({ content }: { content: LandingContent }) {
  const { hero } = content.landing;
  const contactAvatar = content.landingImages.contactAvatar || "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771979297/modonatyAvatar_scfhac.png";
  return (
    <section
      id="hero"
      data-reveal-section
      className="landing-grain relative overflow-hidden bg-background px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20"
      aria-labelledby="hero-title"
    >
      {/* primary glow top-end */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 end-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-3xl"
      />
      {/* accent glow bottom-start */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 start-0 h-[360px] w-[360px] rounded-full bg-accent/5 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* copy column — asymmetric padding for spatial interest */}
        <div className="order-2 lg:order-1 lg:pe-4 lg:ps-10">
          {/* eyebrow badge */}
          <div className="landing-reveal-eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 shadow-sm ring-1 ring-accent/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden />
            <span className="text-xs font-medium text-muted-foreground">
              {hero.proof}
            </span>
          </div>

          <h1
            id="hero-title"
            className="landing-reveal-title mb-4 text-4xl font-extrabold tracking-tight leading-[1.1] text-foreground sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            {hero.h1}
          </h1>

          <div className="landing-reveal-content">
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {hero.subheadline}
          </p>

          <ul className="mb-8 space-y-3" role="list">
            {hero.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs font-bold text-success"
                  aria-hidden
                >
                  ✓
                </span>
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            className="group rounded-full px-8 shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30"
          >
            <Link href={content.landing.pricingTeaser.plans[0]?.ctaLink ?? "/pricing"}>
              <span>{hero.cta}</span>
              <ArrowLeft className="ms-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" aria-hidden />
            </Link>
          </Button>
          </div>
        </div>

        {/* image column — overlaps into next section on desktop */}
        <div className="relative z-10 order-1 flex justify-center lg:order-2 lg:-mb-24">
          <div className="relative flex items-center justify-center rounded-3xl bg-gradient-to-br from-primary/8 to-accent/5 p-6 shadow-2xl shadow-primary/10 animate-float sm:p-8 lg:p-10">
            <Image
              src={contactAvatar}
              alt={HERO_IMAGE_ALT}
              width={420}
              height={420}
              priority
              sizes="(max-width: 1024px) 80vw, 42vw"
              className="relative z-10 h-auto w-full max-w-[320px] object-contain sm:max-w-[380px] lg:max-w-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
