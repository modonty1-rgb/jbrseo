import type { Metadata } from "next";
import { headers } from "next/headers";
import { SectionReveal } from "@/app/components/landing/SectionReveal";
import { PricingBillingToggle } from "@/app/components/landing/PricingBillingToggle";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);
  const { pricingPage } = content;
  return {
    title: pricingPage.title,
    description: pricingPage.description,
  };
}

export default async function PricingPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);
  const { landing, pricingPage, sectionHeadings } = content;
  const sh = sectionHeadings.pricingTeaser;

  return (
    <SectionReveal>
      <section
        className="relative overflow-hidden px-4 py-20 sm:py-28 landing-grain"
        data-reveal-section
      >
        {/* Glow orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-20 start-1/3 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute bottom-10 end-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {sh?.eyebrow && (
            <p className="landing-reveal-eyebrow mb-3 text-xs font-bold uppercase tracking-widest text-accent">
              {sh.eyebrow}
            </p>
          )}
          <h1 className="landing-reveal-title mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {pricingPage.h1}
          </h1>
          <p className="landing-reveal-content mx-auto mb-14 max-w-xl text-muted-foreground leading-relaxed">
            {pricingPage.intro}
          </p>

          <div className="landing-reveal-content">
            <PricingBillingToggle
              plans={landing.pricingTeaser.plans}
              country={country}
              highlightBadge={sh?.highlightBadge ?? "الأكثر شيوعاً"}
              colClass={
                landing.pricingTeaser.plans.length <= 3
                  ? "sm:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-4"
              }
              variant="page"
            />
          </div>
        </div>
      </section>
    </SectionReveal>
  );
}
