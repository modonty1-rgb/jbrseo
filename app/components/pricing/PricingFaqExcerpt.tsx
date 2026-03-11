import type { StaticLanding } from "@/app/content/landing/types";

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
          <details
            key={idx}
            className="rounded-xl border border-border bg-card/90 px-3 py-2 text-[13px]"
          >
            <summary className="cursor-pointer list-none font-semibold text-foreground flex items-center justify-between gap-2">
              <span>{item.q}</span>
              <span aria-hidden className="text-xs text-muted-foreground">
                +
              </span>
            </summary>
            <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

