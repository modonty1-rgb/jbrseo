import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { landing } from "@/app/content/landing";

export default function PricingTeaser() {
  const { pricingTeaser } = landing;
  return (
    <section
      id="pricing"
      className="border-t border-border/50 bg-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="pricing-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            الخطط
          </p>
          <h2
            id="pricing-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            اختر خطتك
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {pricingTeaser.plans.map((plan, i) => {
            const isHighlighted = i === 1;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl bg-card p-6 transition-shadow ${
                  isHighlighted
                    ? "ring-2 ring-accent shadow-lg shadow-accent/10"
                    : "border border-border hover:border-accent/40"
                }`}
              >
                {isHighlighted && (
                  <span className="absolute -top-3 start-1/2 -translate-x-1/2 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    الأكثر شيوعاً
                  </span>
                )}

                <h3 className="mb-2 text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {plan.forWho}
                </p>
                <Button
                  asChild
                  variant={isHighlighted ? "default" : "outline"}
                  className="w-full rounded-full"
                >
                  <Link href="/pricing">{plan.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
