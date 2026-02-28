import type { LandingContent, SupportedCountry } from "@/lib/landing-content.types";
import { PricingBillingToggle } from "./PricingBillingToggle";

export default function PricingTeaser({
  content,
  country,
}: {
  content: LandingContent;
  country: SupportedCountry;
}) {
  const { pricingTeaser } = content.landing;
  const sh = content.sectionHeadings.pricingTeaser ?? {
    eyebrow: "الخطط",
    title: "اختر خطتك",
    highlightBadge: "الأكثر شيوعاً",
  };
  const highlightBadge =
    "highlightBadge" in sh ? (sh.highlightBadge ?? "الأكثر شيوعاً") : "الأكثر شيوعاً";
  const colClass =
    pricingTeaser.plans.length <= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      id="pricing"
      data-reveal-section
      className="relative overflow-hidden border-t border-border/50 bg-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="pricing-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--accent)/0.12),transparent)]"
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="landing-reveal-eyebrow mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            {sh.eyebrow}
          </p>
          <h2
            id="pricing-title"
            className="landing-reveal-title text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {sh.title}
          </h2>
        </div>
        <div className="landing-reveal-content">
          <PricingBillingToggle
            plans={pricingTeaser.plans}
            country={country}
            highlightBadge={highlightBadge}
            colClass={colClass}
            variant="teaser"
          />
        </div>
      </div>
    </section>
  );
}
