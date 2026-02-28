"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import type { PricingPlan, SupportedCountry } from "@/lib/landing-content.types";
import { EgyptianPoundIcon } from "@/app/components/icons/egyptian-pound-icon";

type Props = {
  plans: PricingPlan[];
  country: SupportedCountry;
  highlightBadge: string;
  colClass: string;
  variant: "teaser" | "page";
};

export function CurrencyIcon({ country }: { country: SupportedCountry }) {
  if (country === "SA") {
    return (
      <span className="me-1 inline-flex items-center align-middle">
        <Image
          src="/curncy/Saudi_Riyal_Symbol-2.svg"
          alt="Saudi Riyal"
          width={20}
          height={20}
          className="h-5 w-5 filter dark:invert"
        />
      </span>
    );
  }
  if (country === "EG") {
    return (
      <span className="me-1 inline-flex items-center align-middle">
        <EgyptianPoundIcon className="h-5 w-5" />
      </span>
    );
  }
  return null;
}

export function PricingBillingToggle({ plans, country, highlightBadge, colClass, variant }: Props) {
  const hasAnnual = plans.some((p) => p.annualPrice);
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div>
      {/* Toggle — only rendered when at least one plan has annual pricing */}
      {hasAnnual && (
        <div className="mb-10 flex justify-center" role="group" aria-label="دورة الفوترة">
          <div className="flex rounded-full border border-border bg-muted/60 p-1">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              aria-pressed={!isAnnual}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
                !isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              شهري
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              aria-pressed={isAnnual}
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
                isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              سنوي
              <span className="inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                الأوفر
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className={`grid gap-6 ${colClass}`}>
        {plans.map((plan, i) => {
          const isHighlighted = plan.highlight ?? i === 1;
          const badgeText = plan.badge ?? highlightBadge;
          const features = plan.features ?? [];
          const displayPrice =
            isAnnual && plan.annualPrice ? plan.annualPrice : plan.price;
          const periodLabel = displayPrice
            ? isAnnual && plan.annualPrice
              ? "/ سنة"
              : "/ شهر"
            : null;

          if (variant === "teaser") {
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 ${
                  isHighlighted
                    ? "bg-linear-to-b from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/20 ring-2 ring-primary"
                    : "border border-border bg-card shadow-sm hover:border-accent/60 hover:shadow-lg"
                }`}
              >
                {isHighlighted && badgeText && (
                  <span className="absolute -top-3 inset-x-0 mx-auto w-fit inline-flex animate-pulse rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-md">
                    {badgeText}
                  </span>
                )}
                <h3
                  className={`mb-2 text-lg font-bold ${
                    isHighlighted ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Price area — fixed height prevents layout shift */}
                <div className="mb-2 min-h-14">
                  {displayPrice && (
                    <div key={`${isAnnual ? "annual" : "monthly"}-${plan.name}`}>
                      <p
                        className={`text-3xl font-black tracking-tight ${
                          isHighlighted ? "text-primary-foreground" : "text-foreground"
                        }`}
                      >
                        <CurrencyIcon country={country} />
                        {displayPrice}
                      </p>
                      {periodLabel && (
                        <p
                          className={`mt-0.5 text-xs ${
                            isHighlighted
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {periodLabel}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <p
                  className={`mb-4 text-sm leading-relaxed ${
                    isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {plan.forWho}
                </p>

                <div className="mb-6 flex-1">
                  {features.length > 0 && (
                    <ul className="list-none space-y-2" aria-label="مميزات الخطة">
                      {features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <Check
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              isHighlighted ? "text-primary-foreground/80" : "text-success"
                            }`}
                            aria-hidden
                          />
                          <span
                            className={
                              isHighlighted
                                ? "text-primary-foreground/90"
                                : "text-foreground/90"
                            }
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  asChild
                  className={`w-full rounded-full ${
                    isHighlighted
                      ? "bg-background text-primary shadow-lg hover:bg-background/90"
                      : ""
                  }`}
                  variant={isHighlighted ? "default" : "outline"}
                >
                  <Link href={`${plan.ctaLink ?? "/signup"}?plan=${i}`}>
                    {plan.cta}
                  </Link>
                </Button>
              </div>
            );
          }

          // variant === "page"
          return (
            <div
              key={plan.name}
              className={
                "group relative flex flex-col rounded-2xl border p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-xl " +
                (isHighlighted
                  ? "border-accent ring-2 ring-accent/20 bg-card shadow-lg shadow-accent/10"
                  : "border-border/60 bg-card/80 backdrop-blur-sm hover:border-accent/40")
              }
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {isHighlighted && badgeText && (
                <span className="absolute -top-3 start-6 rounded-full bg-accent px-3 py-0.5 text-[11px] font-bold text-accent-foreground shadow-md">
                  {badgeText}
                </span>
              )}

              {plan.badge && (
                <span className="mb-3 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  {plan.badge}
                </span>
              )}

              <p className="text-lg font-extrabold text-foreground">{plan.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.forWho}</p>

              {/* Price area — fixed height prevents layout shift */}
              <div className="mt-4 min-h-14">
                {displayPrice && (
                  <div key={`${isAnnual ? "annual" : "monthly"}-${plan.name}`}>
                    <p className="text-3xl font-extrabold tracking-tight text-foreground">
                      <CurrencyIcon country={country} />
                      {displayPrice}
                    </p>
                    {periodLabel && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {periodLabel}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {features.length > 0 && (
                <ul className="mt-5 flex-1 space-y-2.5">
                  {features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <Button
                asChild
                className={
                  "mt-6 w-full rounded-lg transition-all duration-200 hover:scale-[1.02] " +
                  (isHighlighted
                    ? "shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30"
                    : "shadow-md shadow-primary/10 hover:shadow-lg")
                }
                variant={isHighlighted ? "default" : "outline"}
              >
                <Link href={`${plan.ctaLink ?? "/signup"}?plan=${i}`}>{plan.cta}</Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
