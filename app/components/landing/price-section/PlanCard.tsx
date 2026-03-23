"use client";
import { useState } from "react";
import Link from "@/app/components/link";
import type { Plan, PricingUI } from "@/app/content/landing/price-section-types";
import { applyPricingUiPlaceholders } from "@/lib/pricing-ui-placeholders";
import { buildSignupHrefWithPlan } from "@/lib/signup-href";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Check, WhatsApp } from "./PriceSectionIcons";

interface PlanCardProps {
  plan: Plan;
  planIndex: number;
  annual: boolean;
  currency: string;
  ui: PricingUI;
  id?: string;
  signupHrefBase?: string;
  whatsappLink?: string;
  className?: string;
}

/** Full primary styles only for `featured`; others use outline so one strong CTA per pricing grid. */
function ctaClassName(plan: Plan, isFeaturedPlan: boolean): string {
  const base =
    "inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl text-sm font-extrabold font-tajawal text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  if (!isFeaturedPlan) {
    return `${base} border-2 border-primary/35 bg-background text-primary shadow-none transition-colors hover:bg-primary/[0.07] hover:border-primary/50`;
  }

  const primaryBase = `${base} border-0 transition-opacity hover:opacity-95`;
  if (plan.ctaClass === "btn-ghost") return `${primaryBase} bg-transparent border border-border text-muted-foreground`;
  if (plan.ctaClass === "btn-blue") return `${primaryBase} bg-primary text-primary-foreground shadow-md`;
  if (plan.ctaClass === "btn-featured") return `${primaryBase} bg-accent text-accent-foreground font-extrabold text-base shadow-lg`;
  return `${primaryBase} text-primary-foreground shadow-md`;
}

export function PlanCard({
  plan,
  planIndex,
  annual,
  currency,
  ui,
  id,
  signupHrefBase = "/signup",
  whatsappLink,
  className,
}: PlanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mo = plan.price.mo;
  const price = annual ? plan.price.yr : mo;
  const savings = mo > 0 ? (mo - plan.price.yr) * 12 : 0;
  const annualTotal = annual && mo > 0 ? price * 12 : 0;
  const perMonthOver18 = annualTotal > 0 ? Math.round(annualTotal / 18) : 0;
  const F = plan.featured;

  const signupHref = buildSignupHrefWithPlan(signupHrefBase, planIndex, annual, mo, plan.price.yr);
  const ctaCls = ctaClassName(plan, F);
  const ctaStyle =
    F && plan.ctaClass === "btn-gold" ? { background: "var(--pricing-badge-gold)" } : undefined;

  const priceCardCls = F
    ? "relative flex flex-col rounded-t-2xl rounded-b-none p-8 shadow-2xl border-0 ring-2 ring-primary z-[1] overflow-visible transition-shadow hover:shadow-2xl"
    : "relative flex flex-col rounded-t-2xl rounded-b-none p-6 bg-background border border-border border-b-0 shadow-sm hover:shadow-md transition-shadow duration-150 overflow-visible";

  const featuresCardCls = F
    ? "flex flex-col rounded-b-2xl rounded-t-none p-6 bg-background border border-t-0 border-primary/25 shadow-sm"
    : "flex flex-col rounded-b-2xl rounded-t-none p-6 bg-background border border-t-0 border-border shadow-sm";

  const totalAnnualEyebrow =
    ui.totalAnnual.includes(":") && ui.totalAnnual.indexOf(":") > 0
      ? ui.totalAnnual.slice(0, ui.totalAnnual.indexOf(":")).trim()
      : "";

  return (
    <div className={className ? `flex flex-col gap-1 ${className}` : "flex flex-col gap-1"} id={id}>
      <Card className={priceCardCls} style={F ? { background: "var(--pricing-featured-bg)" } : {}}>
        {plan.badge && (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-primary-foreground text-xs font-extrabold px-4 py-1.5 rounded-full whitespace-nowrap z-10"
            style={{ background: plan.badgeGold ? "var(--pricing-badge-gold)" : "var(--pricing-badge-featured)" }}
          >
            {plan.badge}
          </div>
        )}

        <span
          className="inline-flex items-center text-xs font-extrabold px-3 py-1 rounded-lg mb-3 w-fit"
          style={{ background: plan.accentBg, color: plan.accent }}
        >
          {plan.name}
        </span>

        <p className={`text-sm font-semibold leading-relaxed mb-5 ${F ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {plan.persona}
        </p>

        <div className="mb-1">
          {mo === 0 ? (
            <div className={`text-5xl font-black leading-none tracking-tight ${F ? "text-primary-foreground" : "text-foreground"}`}>
              {ui.freeLabel}
            </div>
          ) : annual && annualTotal > 0 ? (
            <>
              {totalAnnualEyebrow ? (
                <p className={`text-xs font-bold tracking-wide mb-1 ${F ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                  {totalAnnualEyebrow}
                </p>
              ) : null}
              <div className="flex items-end gap-1.5 flex-wrap">
                <span className={`text-5xl font-black leading-none tracking-tight tabular-nums ${F ? "text-primary-foreground" : "text-foreground"}`}>
                  {annualTotal.toLocaleString()}
                </span>
                <span className={`text-base font-bold pb-2 ${F ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                  {currency}
                </span>
              </div>
              <p className={`text-xs mt-1.5 ${F ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {applyPricingUiPlaceholders(ui.billingAnnual, {
                  n: price.toLocaleString(),
                  c: currency,
                  total: annualTotal.toLocaleString(),
                })}
              </p>

              <details className={`mt-2 group ${F ? "text-primary-foreground/90" : "text-foreground"}`}>
                <summary
                  className={`cursor-pointer text-xs font-bold list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden ${F ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-primary hover:text-primary/90"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                  {ui.priceDetailsToggle ?? "تفاصيل السعر"}
                </summary>
                <div className={`mt-2 pt-2 border-t space-y-2 text-start ${F ? "border-primary-foreground/15" : "border-border"}`}>
                  <div className={`text-sm line-through tabular-nums ${F ? "text-primary-foreground/65" : "text-muted-foreground"}`}>
                    {(mo * 12).toLocaleString()} {currency}
                  </div>
                  {ui.annualAvgMonthly ? (
                    <p className={`text-sm font-semibold tabular-nums ${F ? "text-primary-foreground/90" : "text-foreground/90"}`}>
                      {applyPricingUiPlaceholders(ui.annualAvgMonthly, {
                        n: price.toLocaleString(),
                        c: currency,
                      })}
                    </p>
                  ) : null}
                  {perMonthOver18 > 0 && ui.annualEquiv18 ? (
                    <p className={`text-xs leading-relaxed ${F ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                      {applyPricingUiPlaceholders(ui.annualEquiv18, {
                        n: perMonthOver18.toLocaleString(),
                        c: currency,
                      })}
                    </p>
                  ) : null}
                  {savings > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit
                  ${F ? "bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/25" : "bg-success/15 text-success-foreground border border-success/30"}`}
                      >
                        <Icon emoji="✓" />{" "}
                        {applyPricingUiPlaceholders(ui.savedYearly, {
                          n: savings.toLocaleString(),
                          c: currency,
                        })}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full w-fit
                  ${F ? "bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25" : "bg-(--pricing-banner-bg) text-foreground border border-(--pricing-banner-border)"}`}
                      >
                        {ui.offer12_18}
                      </span>
                    </div>
                  ) : null}
                </div>
              </details>
            </>
          ) : (
            <>
              <div className="flex items-end gap-1">
                <span className={`text-5xl font-black leading-none tracking-tight ${F ? "text-primary-foreground" : "text-foreground"}`}>
                  {price.toLocaleString()}
                </span>
                <span className={`text-sm pb-2 ${F ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {currency} {ui.perMonth}
                </span>
              </div>
              <p className={`text-xs mt-1.5 ${F ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {applyPricingUiPlaceholders(ui.billingMonthly, {
                  n: price.toLocaleString(),
                  c: currency,
                })}
              </p>
            </>
          )}
        </div>

        <span
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mt-3 mb-5 w-fit border ${F ? "bg-primary/20 border-primary-foreground/30" : ""}`}
          style={F ? { color: plan.accent } : { background: plan.accentBg, color: plan.accent, borderColor: `${plan.accent}28` }}
        >
          <Icon emoji="✦" /> {plan.articles}
        </span>

        <div className={`h-px w-full mb-4 ${F ? "bg-primary-foreground/10" : "bg-border"}`} />

        <Link href={signupHref} scroll={false} className={ctaCls} style={ctaStyle}>
          {plan.cta}
        </Link>

        {plan.guarantee && (
          <p className={`text-xs text-center mt-2 mb-2 leading-relaxed ${F ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            {ui.guarantee}
          </p>
        )}

        {plan.id === "scale" && (
          <div className="flex justify-center mt-2">
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors max-w-full ${
                  F
                    ? "border-primary-foreground/25 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10"
                    : "border-success/35 bg-transparent text-success-foreground hover:bg-success/10"
                }`}
              >
                <WhatsApp />
                <span className="text-start leading-snug">{ui.whatsapp}</span>
              </a>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold max-w-full opacity-80 ${
                  F
                    ? "border-primary-foreground/20 text-primary-foreground"
                    : "border-success/30 text-success-foreground"
                }`}
              >
                <WhatsApp />
                <span className="text-start leading-snug">{ui.whatsapp}</span>
              </span>
            )}
          </div>
        )}
      </Card>

      <Card className={featuresCardCls}>
        <p className="text-xs font-bold tracking-widest uppercase mb-3 text-muted-foreground">{ui.youGet}</p>
        <div className="flex flex-col gap-2.5">
          {(expanded ? plan.highlights : plan.highlights.slice(0, 3)).map((feat, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check color={plan.accent} />
              <span className="text-sm leading-relaxed font-medium text-foreground">{feat}</span>
            </div>
          ))}
        </div>
        {plan.highlights.length > 3 && (
          <Button
            type="button"
            variant="link"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 h-auto justify-start gap-1 p-0 text-xs font-bold text-primary hover:text-primary/90"
          >
            {expanded ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6" />
                </svg>
                إخفاء التفاصيل
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
                عرض كل المميزات
              </>
            )}
          </Button>
        )}
        <Link
          href="/features"
          className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors underline mb-3"
        >
          شوف كل ما تشمله الخطة ←
        </Link>
      </Card>
    </div>
  );
}
