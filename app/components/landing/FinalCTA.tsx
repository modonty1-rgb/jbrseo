import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import type { LandingContent } from "@/lib/landing-content.types";

export default function FinalCTA({ content }: { content: LandingContent }) {
  const { finalCta } = content.landing;
  const ctaLink = content.landing.pricingTeaser.plans[0]?.ctaLink ?? "/pricing";
  return (
    <section
      data-reveal-section
      className="relative overflow-hidden border-t border-border/50 bg-[conic-gradient(at_top_right,hsl(var(--primary)),hsl(var(--accent)),hsl(var(--primary)))] px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="final-cta-title"
    >
      {/* glow orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <h2
          id="final-cta-title"
          className="landing-reveal-title mb-6 text-3xl font-extrabold tracking-tight text-primary-foreground drop-shadow-lg sm:text-4xl"
        >
          {finalCta.headline}
        </h2>
        <div className="landing-reveal-content">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-white px-8 font-semibold text-primary shadow-xl shadow-white/20 transition-transform duration-200 hover:scale-105 hover:bg-white/90 hover:text-primary"
        >
          <Link href={ctaLink}>{finalCta.cta}</Link>
        </Button>
        </div>
      </div>
    </section>
  );
}
