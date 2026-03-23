import type { StaticLanding } from "@/app/content/landing/types";
import { Card } from "@/app/components/ui/card";

type Props = {
  faq: StaticLanding["faq"];
};

const PRICING_TAGS = ["التسعير", "الخطة"];

export function PricingFaqExcerpt({ faq }: Props) {
  const items =
    faq.faqs.filter((f) => PRICING_TAGS.includes(f.tag)).slice(0, 4) ||
    faq.faqs.slice(0, 4);

  if (!items.length) return null;

  return (
    <section className="mt-12 space-y-4 text-right">
      <h2 className="text-sm font-extrabold tracking-tight text-foreground">
        أسئلة شائعة عن الأسعار والخطط
      </h2>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <Card key={idx} className="rounded-xl border-border bg-card/90 p-0 shadow-sm">
            <details className="px-3 py-2 text-[13px]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold text-foreground">
                <span>{item.q}</span>
                <span aria-hidden className="text-xs text-muted-foreground">
                  +
                </span>
              </summary>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          </Card>
        ))}
      </div>
    </section>
  );
}

