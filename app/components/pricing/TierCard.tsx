"use client";

import type { Plan, PricingUI } from "@/app/content/landing/price-section-types";
import { Icon } from "@/app/components/Icon";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { applyPricingUiPlaceholders } from "@/lib/pricing-ui-placeholders";
import { cn } from "@/lib/utils";

type TierCardProps = {
  plan: Plan;
  annual: boolean;
  ui: PricingUI;
  currency: string;
  href: string;
};

export function TierCard({ plan, annual, ui, currency, href }: TierCardProps) {
  const mo = plan.price.mo;
  const price = annual ? plan.price.yr : plan.price.mo;
  const priceLabel = `${price.toLocaleString("ar-EG")} ${currency}`;
  const annualTotal = annual && mo > 0 ? price * 12 : 0;
  const per18 = annualTotal > 0 ? Math.round(annualTotal / 18) : 0;

  return (
    <Card
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card/95 p-5 shadow-sm",
        plan.featured && "ring-2 ring-primary shadow-md"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="space-y-1 text-right">
          <h3 className="text-sm font-extrabold tracking-tight text-foreground">
            {plan.name}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {plan.persona}
          </p>
        </div>
        {plan.badge &&
          (plan.badgeGold ? (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              {plan.badge}
            </span>
          ) : (
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/15"
            >
              {plan.badge}
            </Badge>
          ))}
      </div>

      <div className="mb-3 border-b border-border/60 pb-3 text-right">
        {annual && annualTotal > 0 ? (
          <>
            <p className="text-[11px] line-through text-muted-foreground tabular-nums">
              {(mo * 12).toLocaleString("ar-EG")} {currency}
            </p>
            {(() => {
              const colon = ui.totalAnnual.indexOf(":");
              const eyebrow = colon > 0 ? ui.totalAnnual.slice(0, colon).trim() : "";
              return eyebrow ? (
                <p className="text-[10px] font-bold text-muted-foreground mt-0.5">{eyebrow}</p>
              ) : null;
            })()}
            <div className="flex items-baseline justify-end gap-1 flex-wrap mt-0.5">
              <span className="text-2xl font-black tracking-tight text-foreground tabular-nums">
                {annualTotal.toLocaleString("ar-EG")}
              </span>
              <span className="text-xs font-bold text-muted-foreground">{currency}</span>
            </div>
            {ui.annualAvgMonthly ? (
              <p className="mt-1 text-[11px] font-semibold text-foreground/90 tabular-nums">
                {applyPricingUiPlaceholders(ui.annualAvgMonthly, {
                  n: price.toLocaleString("ar-EG"),
                  c: currency,
                })}
              </p>
            ) : (
              <p className="mt-1 text-[11px] font-semibold text-foreground/90 tabular-nums">
                {priceLabel}
                <span className="text-muted-foreground font-medium ms-0.5">{ui.perMonth}</span>
              </p>
            )}
            {per18 > 0 && ui.annualEquiv18 ? (
              <p className="mt-0.5 text-[10px] text-muted-foreground leading-snug">
                {applyPricingUiPlaceholders(ui.annualEquiv18, {
                  n: per18.toLocaleString("ar-EG"),
                  c: currency,
                })}
              </p>
            ) : null}
            <p className="mt-1 text-[11px] text-muted-foreground">
              {applyPricingUiPlaceholders(ui.billingAnnual, {
                n: price.toLocaleString("ar-EG"),
                c: currency,
                total: annualTotal.toLocaleString("ar-EG"),
              })}
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-black tracking-tight text-foreground tabular-nums">
                {priceLabel}
              </span>
              <span className="text-[11px] text-muted-foreground">{ui.perMonth}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {applyPricingUiPlaceholders(ui.billingMonthly, {
                n: price.toLocaleString("ar-EG"),
                c: currency,
              })}
            </p>
          </>
        )}
      </div>

      <ul className="mb-4 space-y-1.5 text-[11px] text-muted-foreground leading-relaxed text-right">
        {plan.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span aria-hidden className="mt-[3px] h-[4px] w-[4px] rounded-full bg-accent" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      {plan.sections?.length ? (
        <div className="mb-4 space-y-2 text-right text-[11px]">
          {plan.sections.map((sec, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 space-y-1.5"
            >
              <p className="font-semibold text-foreground flex items-center justify-end gap-1">
                <span>{sec.title}</span>
                {sec.icon && <span aria-hidden>{sec.icon}</span>}
              </p>
              <ul className="space-y-1 text-[11px] text-muted-foreground leading-relaxed">
                {sec.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-1.5">
                    <span aria-hidden className="mt-[3px] h-[3px] w-[3px] rounded-full bg-border" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-auto space-y-2">
        {plan.guarantee && (
          <p className="text-[11px] text-success-foreground flex items-center justify-end gap-1">
            <Icon emoji="🔒" />
            <span>{ui.guarantee}</span>
          </p>
        )}
        <a
          href={href}
          className={`inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-[12px] font-black transition-colors ${
            plan.ctaClass === "btn-featured"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : plan.ctaClass === "btn-gold"
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : plan.ctaClass === "btn-blue"
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          {plan.cta}
        </a>
      </div>
    </Card>
  );
}

