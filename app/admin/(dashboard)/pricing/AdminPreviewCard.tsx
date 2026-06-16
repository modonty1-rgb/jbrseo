"use client";

// Admin-only copy of the visitor PlanCard. Iterations on this file do NOT
// affect the homepage. Once a design is approved here, port it to
// app/components/landing/price-section/PlanCard.tsx.

import Link from "next/link";
import { Moon, Shield } from "lucide-react";
import type { Plan, PricingUI } from "@/app/content/landing/price-section-types";
import { applyPricingUiPlaceholders } from "@/lib/pricing-ui-placeholders";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";

interface AdminPreviewCardProps {
  plan: Plan;
  annual: boolean;
  currency: string;
  ui: PricingUI;
  promo?: { active: boolean; label: string; title: string; subtitle: string };
  /** Name of the previous paid tier — when present, the features list opens with "يشمل كل مزايا X +". */
  previousTierName?: string | null;
  className?: string;
}

export function AdminPreviewCard({ plan, annual, currency, ui, promo, previousTierName, className }: AdminPreviewCardProps) {
  const promoOn = promo?.active === true && (promo.label || promo.title || promo.subtitle);
  const mo = plan.price.mo;
  const price = annual ? plan.price.yr : mo;
  // Honors the 12=18 promise: pay 12 months annual, get 18 months service.
  // Real savings = monthly cost over 18 months − annual payment for 12 months.
  const savings = mo > 0 ? mo * 18 - plan.price.yr * 12 : 0;
  const annualTotal = annual && mo > 0 ? price * 12 : 0;
  const F = plan.featured;

  const cardCls = [
    "flex flex-col overflow-hidden rounded-2xl bg-background p-0 transition-shadow hover:shadow-md",
    F ? "border-2 border-foreground/85 shadow-sm" : "border border-border shadow-none",
  ].join(" ");

  const totalAnnualEyebrow =
    ui.totalAnnual.includes(":") && ui.totalAnnual.indexOf(":") > 0
      ? ui.totalAnnual.slice(0, ui.totalAnnual.indexOf(":")).trim()
      : "";

  const quickStats = [plan.articles, ui.pageOnModonty].filter(Boolean);
  const inclusions = plan.highlights;

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <Card className={cardCls}>
        {/* Top strip — single slot shared between promo and badge.
            Priority: promo (when active) > plan.badge > nothing.
            Keeps all four cards in a uniform vertical rhythm. */}
        {promoOn && promo?.label && (
          <div className="relative overflow-hidden border-b border-amber-300/70 dark:border-amber-600/40 bg-linear-to-l from-amber-50 via-amber-100 to-amber-50 dark:from-amber-950/40 dark:via-amber-900/40 dark:to-amber-950/40 px-4 py-2 text-center">
            <span className="relative z-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold tracking-wide text-amber-900 dark:text-amber-100">
              <Moon className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
              <span>{promo.label}</span>
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-l from-transparent via-amber-50/70 to-transparent dark:via-amber-200/10"
              style={{ animation: "shimmer 4s ease-in-out infinite" }}
            />
          </div>
        )}
        {plan.badge && (
          <div className={`border-b px-4 py-2 text-center ${F ? "border-foreground/15 bg-muted/40" : "border-border/60 bg-muted/30"}`}>
            <span className={`text-[11px] font-bold tracking-[0.18em] ${F ? "text-foreground" : "text-muted-foreground/90"}`}>
              {plan.badge}
            </span>
          </div>
        )}

        <CardHeader className="gap-1.5 pb-4 space-y-0">
          <h3 className="text-xl font-extrabold leading-tight text-foreground">
            {plan.name}
          </h3>
          {plan.hook ? (
            <p className="text-base font-semibold leading-snug text-foreground/90">
              {plan.hook}
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {plan.persona}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex flex-col">
          <div className="mb-6">
            {mo === 0 ? (
              <div className="text-5xl font-black leading-none tracking-tight text-foreground">
                {ui.freeLabel}
              </div>
            ) : annual && annualTotal > 0 ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black leading-none tracking-tight tabular-nums text-foreground">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currency} {ui.perMonth}
                  </span>
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  {totalAnnualEyebrow ? `${totalAnnualEyebrow}: ` : ""}
                  {annualTotal.toLocaleString()} {currency}
                  {savings > 0 ? ` · ${applyPricingUiPlaceholders(ui.savedYearly, { n: savings.toLocaleString(), c: currency })}` : ""}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black leading-none tracking-tight text-foreground">
                    {price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currency} {ui.perMonth}
                  </span>
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  {applyPricingUiPlaceholders(ui.billingMonthly, { n: price.toLocaleString(), c: currency })}
                </p>
              </>
            )}
          </div>

          {/* Quick stats — articles count + landing page line, surfaced near the price
              so the visitor sees the headline value before reading the full feature list. */}
          {quickStats.length > 0 && (
            <ul className="mb-5 flex flex-col gap-1.5">
              {quickStats.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-semibold leading-snug text-foreground/90">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/70" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Inline promo slot — keeps cross-card alignment.
              Active promo (DB-driven) wins; otherwise the always-on `noPromoBanner` fills the slot. */}
          {promoOn && (promo?.title || promo?.subtitle) ? (
            <div className="mb-4 rounded-lg border border-amber-300/70 dark:border-amber-600/40 bg-linear-to-br from-amber-50 to-amber-100/70 dark:from-amber-950/30 dark:to-amber-900/20 px-4 py-3 shadow-sm">
              {promo?.title && (
                <p className="text-xl font-black tracking-tight leading-tight text-amber-900 dark:text-amber-100 tabular-nums">
                  {promo.title}
                </p>
              )}
              {promo?.subtitle && (
                <p className="mt-1.5 text-[11px] leading-snug text-amber-800/80 dark:text-amber-200/75">
                  {promo.subtitle}
                </p>
              )}
            </div>
          ) : ui.noPromoBanner ? (
            <div className="mb-4 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
              <p className="text-center text-sm font-semibold leading-snug text-foreground/85">
                {ui.noPromoBanner}
              </p>
            </div>
          ) : null}

          {/* CTA group flows naturally after content (no forced bottom alignment — cards size to content). */}
          <div>
            <Link
              href="#"
              aria-disabled
              tabIndex={-1}
              onClick={(e) => e.preventDefault()}
              className="inline-flex w-full items-center justify-center rounded-lg bg-foreground px-4 py-3 text-sm font-bold text-background transition-colors hover:bg-foreground/90"
            >
              {plan.cta}
            </Link>
            {plan.guarantee && ui.guarantee && (
              <p className="mt-2 inline-flex w-full items-center justify-center gap-1.5 text-center text-xs text-muted-foreground/80">
                <Shield className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
                <span>{ui.guarantee}</span>
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-2.5 border-t border-border/60 pt-5">
          {previousTierName && (
            <p className="mb-1 text-xs font-bold leading-snug text-foreground/95">
              يشمل كل مزايا <span className="text-primary">{previousTierName}</span> + هذي الإضافات:
            </p>
          )}
          <p className="mb-1 text-[11px] font-semibold tracking-wider text-muted-foreground/80">
            {ui.youGet}
          </p>
          {inclusions.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
              <span className="mt-1.5 shrink-0 text-muted-foreground/60" aria-hidden>•</span>
              <span>{item}</span>
            </div>
          ))}
        </CardFooter>
      </Card>
    </div>
  );
}
