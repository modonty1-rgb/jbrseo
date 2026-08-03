"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown, FileText, Gift, ShieldCheck, Star } from "lucide-react";
import type { Plan as DBPlan } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getPlanCardContent } from "@/lib/plan-card-content";
import { GTMEvents } from "@/lib/gtm";
import { toArabicDigits, formatNum } from "../landing-helpers";
import {
  PLAN_DURATIONS,
  RECOMMENDED_DURATION,
  priceForDuration,
  parseDuration,
  type PlanDuration,
} from "@/lib/pricing-durations";

type Props = {
  visiblePlans: DBPlan[];
  currency: string;
  countrySlug: "sa" | "eg";
  whatsappLink: string;
  checkoutHref: string;
};

/** Pricing plans (DB) with the 3/6/12-month duration toggle. Owns duration state
 *  + the GA4 pricing_view IntersectionObserver (both pricing-only). Client component. */
export function PricingSection({ visiblePlans, currency, countrySlug, whatsappLink, checkoutHref }: Props) {
  // Default to the recommended duration (6 months). The ?duration= deep-link is
  // read client-side so the page itself stays static/cacheable.
  const [duration, setDuration] = useState<PlanDuration>(RECOMMENDED_DURATION);

  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("duration");
    if (d) setDuration(parseDuration(d));
  }, []);

  useEffect(() => {
    const pricingEl = document.getElementById("pricing");
    if (!pricingEl) return;
    let fired = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          GTMEvents.pricingView({ country: countrySlug });
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(pricingEl);
    return () => observer.disconnect();
  }, [countrySlug]);

  return (
    <section id="pricing" className="max-w-270 mx-auto px-7 pt-8 pb-12 md:pt-10 md:pb-20 scroll-mt-16">
        <div className="text-center mb-5">
          {/* Founding-offer badge — the free-months incentive is a launch
              concession, not a permanent price. Labelling it "limited" keeps
              the sticker price intact so it can be retracted later without a
              price drop (Khalid 2026-08-03). */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11.5px] font-bold text-amber-600 dark:text-amber-400 mb-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
            <span>عرض تأسيسي — لفترة محدودة</span>
          </div>
          {/* Hook — plain green text + icon, no container at all (Khalid:
              any pill shape reads as a button). */}
          <div className="flex items-center justify-center gap-1.5 text-success text-[13px] font-bold mb-2">
            <Gift className="w-4 h-4" strokeWidth={2.5} aria-hidden />
            <span>ادفع ١٢ شهر — واستلم ١٨</span>
          </div>
          <h2 className="text-balance text-[clamp(20px,5.8vw,32px)] font-semibold tracking-[-1px]">اختر باقتك وابدأ اليوم</h2>
          {/* Segmented control — 3 durations (6 months = الأنسب) */}
          <div
            className="grid grid-cols-3 w-full max-w-80 mx-auto bg-muted rounded-[13px] p-1 mt-6 text-sm font-medium"
            role="tablist"
            aria-label="مدة الاشتراك"
          >
            {PLAN_DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={duration === d}
                onClick={() => setDuration(d)}
                className={cn(
                  "relative rounded-[10px] py-2.5 px-2 min-h-[var(--tap)] text-[13.5px] font-semibold",
                  duration === d ? "bg-card text-foreground shadow-[0_1px_3px_color-mix(in oklch, var(--foreground) 8%, transparent)]" : "bg-transparent text-muted-foreground",
                )}
              >
                {d === 12 ? "١٢ شهر" : d === 6 ? "٦ شهور" : "٣ شهور"}
                {d === RECOMMENDED_DURATION && (
                  <span className="absolute -top-2.5 right-1/2 translate-x-1/2 text-[9px] font-bold text-success-foreground bg-success rounded-full px-1.5 py-px whitespace-nowrap">
                    الأنسب
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Payment methods at the TOP of pricing (Khalid 2026-07-15): the
            client sees how they can pay BEFORE reading prices. Only methods
            the checkout actually offers; SA only (EG has no checkout).
            Tamara joins the day it goes live in the gateway. */}
        {countrySlug === "sa" && (
          <div className="mb-6 md:mb-8 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              {[
                { src: "/logos/mada.svg", alt: "مدى" },
                { src: "/logos/visa.svg", alt: "Visa" },
                { src: "/logos/mastercard.svg", alt: "Mastercard" },
                { src: "/logos/apple-pay.svg", alt: "Apple Pay" },
              ].map((logo) => (
                <div key={logo.alt} className="h-7 w-12 bg-white rounded-md ring-1 ring-black/5 flex items-center justify-center px-1.5">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={200}
                    height={44}
                    unoptimized
                    style={{ height: 14, width: "auto", maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">
              دفع آمن عبر Network International · PCI DSS
            </div>
          </div>
        )}
        {/* Egypt: InstaPay / bank transfer + international cards (the N-Genius
            gateway accepts Visa/Mastercard globally — Khalid 2026-07-15). */}
        {countrySlug === "eg" && (
          <div className="mb-6 md:mb-8 flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-2">
              {[
                { src: "/logos/instapay.svg", alt: "InstaPay" },
                { src: "/logos/visa.svg", alt: "Visa" },
                { src: "/logos/mastercard.svg", alt: "Mastercard" },
                { src: "/logos/saib-bank.png", alt: "SAIB Bank" },
              ].map((logo) => (
                <div key={logo.alt} className="h-7 w-12 bg-white rounded-md ring-1 ring-black/5 flex items-center justify-center px-1.5">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={200}
                    height={44}
                    unoptimized
                    style={{ height: 14, width: "auto", maxWidth: "100%", objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">
              إنستا باي · البطاقات · التحويل البنكي
            </div>
          </div>
        )}

        <div
          className="grid gap-3.5 max-sm:grid-cols-1!"
          style={{ gridTemplateColumns: `repeat(${Math.min(visiblePlans.length, 4)}, 1fr)` }}
        >
          {visiblePlans.map((p) => {
            const featured = !!p.featuredBadge && p.featuredBadge.trim() !== "";
            const dp = priceForDuration(p.priceMonthly, duration);
            const content = getPlanCardContent(p.slug);
            if (!content) return null;
            const PersonaIcon = content.personaIcon;
            const isConsultation = !!content.ctaAsConsultation;
            // Payment is Saudi-only — Egypt visitors go to WhatsApp for pricing plans.
            const isExternalCta = isConsultation || countrySlug === "eg";

            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-[18px] px-5.5 py-6.5 relative border-2 bg-card text-foreground",
                  featured
                    ? "order-first md:order-none border-success ring-2 ring-success/40"
                    : "border-border",
                )}
              >
                {featured && (
                  <span className="absolute -top-[13px] right-6 bg-success text-success-foreground text-[11px] font-black px-3.5 py-1 rounded-full tracking-[.3px] inline-flex items-center gap-1.5 md:shadow-[0_10px_22px_-10px_color-mix(in_oklch,var(--success)_60%,transparent)]">
                    <Star className="w-3 h-3 fill-current" strokeWidth={2.5} />
                    {p.featuredBadge}
                  </span>
                )}

                {/* Persona */}
                <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground mb-1.5">
                  <PersonaIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{content.persona}</span>
                </div>

                {/* Plan name */}
                <div className="text-[20px] font-extrabold text-foreground mb-5 tracking-[-0.3px]">
                  {p.name}
                </div>

                {/* Hero metric — articles/month */}
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 mb-5 rounded-xl border",
                  featured ? "bg-success/10 border-success/30" : "bg-foreground/[.03] border-border",
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    featured ? "bg-success/20 text-success" : "bg-foreground/5 text-muted-foreground",
                  )}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-mono text-[17px] font-extrabold leading-tight",
                      featured ? "text-success" : "text-foreground",
                    )}>
                      {p.articlesLabel || "—"}
                    </div>
                    <div className="text-[11.5px] text-muted-foreground mt-1 leading-tight">
                      {content.heroCaption}
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-4xl font-semibold tracking-[-1.5px] text-foreground">{formatNum(dp.total)}</span>
                  <span className="text-xs text-muted-foreground">{currency} · {toArabicDigits(dp.serviceMonths)} شهر</span>
                </div>
                <div className={cn(
                  "text-[12.5px] mt-2 min-h-5 font-mono font-bold text-success items-center gap-1.5 w-fit",
                  dp.freeMonths > 0 ? "inline-flex" : "hidden",
                  featured && "bg-success/15 px-2.5 py-1 rounded-md",
                )}>
                  {dp.freeMonths > 0 ? `يصير ${formatNum(dp.effectiveMonthly)} ${currency}/شهر · ${toArabicDigits(dp.freeMonths)} ${dp.freeMonths >= 3 ? "شهور" : "شهر"} هدية` : " "}
                </div>
                <Link
                  href={isExternalCta ? whatsappLink : `${checkoutHref}?plan=${p.slug}&duration=${duration}`}
                  prefetch={false}
                  target={isExternalCta ? "_blank" : undefined}
                  rel={isExternalCta ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    if (isExternalCta) GTMEvents.whatsappClick();
                    else
                      GTMEvents.planClick({
                        plan: p.slug,
                        price: dp.total,
                        billing: `${duration}m`,
                        country: countrySlug,
                      });
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-[13px] rounded-[11px] text-[14px] no-underline mt-4.5 mb-2 border font-bold",
                    featured ? "bg-success text-success-foreground border-transparent" : "bg-background text-foreground border-border",
                  )}
                >
                  <span>{isConsultation ? "احجز جلسة استشارة" : countrySlug === "eg" ? "تواصل عبر واتساب" : (p.ctaText || `ابدأ بـ${p.name}`)}</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                {/* Refund guarantee — only for Saudi + featured, matches project_refund_policy.md */}
                {featured && countrySlug === "sa" && !isConsultation && (
                  <div className="flex items-center justify-center gap-1.5 mb-4 text-[11px] text-success/90 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
                    <span>استرداد ١٤ يوم · بدون أسئلة</span>
                  </div>
                )}
                {!featured && <div className="mb-4" />}
                {/* Bullets label */}
                <div className="text-[11.5px] text-muted-foreground mb-3 font-semibold pb-3 border-b border-border">
                  {content.bulletsLabel}
                </div>

                {/* Bullets — mobile shows the top 3 differentiators; the rest
                    live behind a counted collapse ("value stays countable" per
                    Baymard). Desktop always shows the full list. */}
                <div className="flex flex-col gap-3 mb-3 md:mb-5">
                  {content.bullets.slice(0, 3).map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className={cn(
                        "flex gap-2.5 items-start text-[13px] leading-[1.5]",
                        b.highlight ? "text-foreground font-medium" : "text-muted-foreground",
                      )}>
                        <div className={cn(
                          "w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0",
                          b.highlight ? "bg-success/15 text-success" : "bg-foreground/[.04] text-muted-foreground",
                        )}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="pt-0.5">{b.text}</span>
                      </div>
                    );
                  })}
                </div>
                {content.bullets.length > 3 && (
                  <details className="group mb-5 md:hidden">
                    <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-success">
                      <span>كل مميزات الباقة (+{toArabicDigits(content.bullets.length - 3)})</span>
                      <ChevronDown className="w-3.5 h-3.5 animate-bounce group-open:animate-none group-open:rotate-180" strokeWidth={2.5} aria-hidden />
                    </summary>
                    <div className="mt-3 flex flex-col gap-3">
                      {content.bullets.slice(3).map((b, i) => {
                        const Icon = b.icon;
                        return (
                          <div key={i} className={cn(
                            "flex gap-2.5 items-start text-[13px] leading-[1.5]",
                            b.highlight ? "text-foreground font-medium" : "text-muted-foreground",
                          )}>
                            <div className={cn(
                              "w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0",
                              b.highlight ? "bg-success/15 text-success" : "bg-foreground/[.04] text-muted-foreground",
                            )}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="pt-0.5">{b.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
                {content.bullets.length > 3 && (
                  <div className="hidden md:flex flex-col gap-3 mb-5">
                    {content.bullets.slice(3).map((b, i) => {
                      const Icon = b.icon;
                      return (
                        <div key={i} className={cn(
                          "flex gap-2.5 items-start text-[13px] leading-[1.5]",
                          b.highlight ? "text-foreground font-medium" : "text-muted-foreground",
                        )}>
                          <div className={cn(
                            "w-5.5 h-5.5 rounded-md flex items-center justify-center shrink-0",
                            b.highlight ? "bg-success/15 text-success" : "bg-foreground/[.04] text-muted-foreground",
                          )}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="pt-0.5">{b.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Trust chip — featured plan only, motivational (not persona) */}
                {content.trustChip && (
                  <div className="mt-auto p-3 rounded-lg bg-foreground/[.02] border border-border flex gap-2.5 items-start text-[11.5px] leading-[1.5]">
                    <content.trustChip.icon className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <div>
                      <span className="text-success font-bold">{content.trustChip.label}</span>
                      <span className="text-foreground/75"> — {content.trustChip.body}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Escape valve — placed AFTER cards per Baymard 2024 (post-scan fallback for hesitant B2B buyers). */}
        <div className="mt-10 text-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-success transition-colors border-b border-b-transparent hover:border-b-success/40 pb-0.5"
          >
            <span>لسه متردد؟</span>
            <span className="font-semibold text-success">تكلّم معنا على واتساب</span>
            <span>←</span>
          </a>
        </div>
      </section>
  );
}
