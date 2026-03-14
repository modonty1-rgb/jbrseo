"use client";

import { useMemo, useState, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@/app/components/Icon";
import type { PricingPlan, SupportedCountry } from "@/lib/landing-content.types";
import { CurrencyIcon } from "@/app/components/shared/PricingBillingToggle";
import { createSubscriber } from "@/app/actions/subscribers";

const INPUT_CLS =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent";

const ARABIC_NUMERALS = "٠١٢٣٤٥٦٧٨٩";
function parsePriceString(value: string): number | null {
  if (!value || typeof value !== "string") return null;
  const normalized = value
    .replace(/[\u0660-\u0669]/g, (c) => String(ARABIC_NUMERALS.indexOf(c)))
    .replace(/[^\d.,]/g, "")
    .replace(/,/g, "");
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function planIndexFromParam(param: string | null, maxIndex: number): number {
  if (param == null || param === "") return 0;
  const p = param.toLowerCase().trim();
  const n = Number(p);
  if (Number.isInteger(n) && n >= 0 && n <= maxIndex) return n;
  return 0;
}

type SignupFormProps = { serverPlans: PricingPlan[]; country: SupportedCountry; countrySlug?: string };

export function SignupForm({ serverPlans, country, countrySlug }: SignupFormProps) {
  const searchParams = useSearchParams();
  const maxPlanIndex = Math.max(0, serverPlans.length - 1);
  const [planIndex, setPlanIndex] = useState(() =>
    planIndexFromParam(searchParams.get("plan"), maxPlanIndex)
  );
  const [isAnnual, setIsAnnual] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const hasAnnual = serverPlans.some((p) => p.annualPrice);
  useEffect(() => {
    setMounted(true);
  }, []);
  const countryCode = country === "SA" ? "+966" : "+20";

  const serverPlan = useMemo(
    () => serverPlans[Math.min(planIndex, serverPlans.length - 1)] ?? serverPlans[0],
    [serverPlans, planIndex]
  );
  const planIndices = useMemo(
    () => Array.from({ length: Math.max(1, serverPlans.length) }, (_, i) => i),
    [serverPlans.length]
  );
  const detailsToShow = useMemo(() => serverPlan?.features ?? [], [serverPlan?.features]);

  const annualSavings = useMemo(() => {
    if (!isAnnual || !serverPlan?.price || !serverPlan?.annualPrice) return null;
    const monthly = parsePriceString(serverPlan.price);
    const annual = parsePriceString(serverPlan.annualPrice);
    if (monthly == null || annual == null || monthly <= 0) return null;
    const yearlyIfMonthly = monthly * 12;
    const amount = yearlyIfMonthly - annual;
    if (amount <= 0) return null;
    const percent = Math.round((amount / yearlyIfMonthly) * 100);
    return { amount, percent };
  }, [isAnnual, serverPlan?.price, serverPlan?.annualPrice]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) {
      nextErrors.name = "يرجى إدخال اسمك";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح";
    }
    const local = phone.replace(/[\s-]/g, "");
    const isValidLocal =
      country === "SA"
        ? /^5\d{8}$/.test(local)
        : /^01\d{8,9}$/.test(local);
    if (!local || !isValidLocal) {
      nextErrors.phone =
        country === "SA"
          ? "يرجى إدخال رقم جوال سعودي بدون مفتاح الدولة (مثال: 5XXXXXXXX)."
          : "يرجى إدخال رقم جوال مصري بدون مفتاح الدولة (مثال: 01XXXXXXXXX).";
    }
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) return;
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const localDigits = phone.replace(/[^\d]/g, "");
    const phoneWithCode = countryCode + localDigits;
    formData.set("phone", phoneWithCode);
    formData.set("planIndex", String(planIndex));
    formData.set("country", country);
    formData.set("isAnnual", isAnnual ? "true" : "false");
    const result = await createSubscriber(formData);
    setPending(false);
    if (result.success) {
      const thankYouPath = countrySlug ? `/${countrySlug}/signup/thank-you` : "/signup/thank-you";
      const preview = searchParams.get("country")?.toLowerCase();
      const withPreview = preview === "sa" || preview === "eg" ? `${thankYouPath}?country=${preview}` : thankYouPath;
      router.push(withPreview);
      return;
    }
    setSubmitError(result.error);
  }

  const reveal = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <div className="relative min-h-[70vh] overflow-hidden px-4 py-20 flex justify-center items-start landing-grain">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 start-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-20 end-1/4 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div
        className={`relative z-10 w-full max-w-md lg:max-w-4xl rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/8 p-6 lg:p-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 bg-linear-to-br from-primary/3 via-transparent to-accent/3 transition-all duration-700 ease-out ${reveal}`}
      >
        <div className="flex flex-col gap-5 min-w-0">
          <header className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
              خطوة واحدة وتكون معنا
            </p>
            <div className="inline-flex flex-wrap gap-1 rounded-full bg-muted/60 p-1 text-xs">
              {planIndices.map((idx) => {
                const p = serverPlans[idx];
                const isActive = idx === planIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPlanIndex(idx)}
                    className={
                      "px-3.5 py-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card " +
                      (isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:scale-105 hover:bg-muted/80")
                    }
                  >
                    {p?.name ?? `الخطة ${idx + 1}`}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 gap-y-1">
              {hasAnnual && (
                <div role="group" aria-label="دورة الفوترة">
                  <div className="flex rounded-full border border-border bg-muted/60 p-1">
                    <button
                      type="button"
                      onClick={() => setIsAnnual(false)}
                      aria-pressed={!isAnnual}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                        !isAnnual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      شهري
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAnnual(true)}
                      aria-pressed={isAnnual}
                      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                        isAnnual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      سنوي
                    <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                      الأوفر <Icon emoji="✦" />
                    </span>
                    </button>
                  </div>
                </div>
              )}
              {(serverPlan?.price || serverPlan?.annualPrice) && (() => {
                const displayPrice = isAnnual && serverPlan?.annualPrice ? serverPlan.annualPrice : serverPlan?.price ?? "—";
                const periodLabel = isAnnual && serverPlan?.annualPrice ? "/ سنة" : "/ شهر";
                return (
                  <div className="space-y-0.5">
                    <p className="text-lg font-extrabold text-accent tabular-nums">
                      <CurrencyIcon country={country} />
                      {displayPrice}
                      <span className="ms-1 text-sm font-medium text-muted-foreground">{periodLabel}</span>
                    </p>
                    {annualSavings && (
                      <p className="text-xs font-semibold text-success">
                        وفر {annualSavings.amount.toLocaleString("ar-SA")} سنوياً ({annualSavings.percent}%)
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="space-y-1.5 pt-1">
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">
                {serverPlan?.forWho ?? ""}
              </h1>
             
            </div>
          </header>

          {submitError && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive" role="alert">
              {submitError}
            </p>
          )}

          <form
            noValidate
            onSubmit={handleSubmit}
            className={`flex flex-col gap-3.5 transition-all duration-700 delay-150 ease-out ${reveal}`}
          >
            <input type="hidden" name="plan" value={planIndex} />
            <input type="hidden" name="planName" value={serverPlan?.name ?? ""} />
            <input type="hidden" name="country" value={country} />
            <input type="hidden" name="isAnnual" value={isAnnual ? "true" : "false"} />
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                اسمك
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className={INPUT_CLS}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={INPUT_CLS}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                رقم الجوال
              </label>
              <div className="flex gap-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={INPUT_CLS}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={country === "SA" ? "5XXXXXXXXX" : "01XXXXXXXXX"}
                />
                <span className="inline-flex items-center rounded-lg border border-input bg-muted px-3 text-xs font-semibold text-muted-foreground shrink-0">
                  {countryCode}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                اكتب رقم جوالك فقط بدون مفتاح الدولة، وسنضيفه تلقائياً.
              </p>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="businessName" className="block text-sm font-medium text-foreground">
                اسم النشاط التجاري (اختياري)
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                className={INPUT_CLS}
                placeholder="مثال: متجر كلمات"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="businessType" className="block text-sm font-medium text-foreground">
                نوع النشاط (اختياري)
              </label>
              <textarea
                id="businessType"
                name="businessType"
                className={INPUT_CLS}
                rows={3}
                placeholder="مثال: عيادة أسنان، متجر إلكتروني، شركة خدمات B2B..."
                value={businessType}
                onChange={(event) => setBusinessType(event.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="w-full mt-1 rounded-lg transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 font-semibold"
            >
              {pending ? "جاري الإرسال..." : "لنبدأ — ابدأ الآن"}
            </Button>
          </form>
        </div>

        <section
          key={planIndex}
          className={`lg:border-s lg:border-border/60 lg:ps-8 flex flex-col rounded-xl bg-muted/10 p-5 lg:p-6 transition-all duration-700 delay-300 ease-out ${reveal}`}
          aria-labelledby="plan-detail-heading"
        >
          <h2 id="plan-detail-heading" className="mb-2 text-xs font-bold uppercase tracking-widest text-accent shrink-0">
            ما الذي تحصل عليه — {serverPlan?.name ?? `الخطة ${planIndex + 1}`}
          </h2>
          {(serverPlan?.price || serverPlan?.annualPrice) && (() => {
            const displayPrice = isAnnual && serverPlan?.annualPrice ? serverPlan.annualPrice : serverPlan?.price ?? "—";
            const periodLabel = isAnnual && serverPlan?.annualPrice ? "/ سنة" : "/ شهر";
            return (
              <div className="mb-4 min-h-14 rounded-xl border-2 border-accent/30 bg-primary/10 px-4 py-3 text-center">
                <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  <CurrencyIcon country={country} />
                  {displayPrice}
                </p>
                <p className="mt-0.5 text-sm font-medium text-muted-foreground">{periodLabel}</p>
                {annualSavings && (
                  <p className="mt-1.5 text-sm font-semibold text-success">
                    وفر {annualSavings.amount.toLocaleString("ar-SA")} سنوياً ({annualSavings.percent}%)
                  </p>
                )}
              </div>
            );
          })()}
          {serverPlan?.forWho && (
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground shrink-0">
              {serverPlan.forWho}
            </p>
          )}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 list-none">
            {detailsToShow.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span className="min-w-0 wrap-break-word">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
