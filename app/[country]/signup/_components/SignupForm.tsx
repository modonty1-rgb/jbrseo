"use client";

import { useMemo, useState, useEffect, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PricingPlan, SupportedCountry } from "@/lib/landing-content.types";
import { CurrencyIcon } from "@/app/components/shared/PricingBillingToggle";
import { createSubscriber } from "@/app/actions/subscribers";
import { isAnnualFromBillingParam } from "@/lib/billing-search-param";
import {
  displayMainTotalFromMoYr,
  formatPlanTotalDisplay,
} from "@/lib/pricing-plan-amounts";
import { ShieldCheck } from "lucide-react";
import Link from "@/app/components/link";
import { GTMEvents } from "@/lib/gtm";

function planIndexFromParam(
  param: string | null,
  maxIndex: number,
  planIds: readonly string[]
): number {
  if (param == null || param === "") return 0;
  const raw = param.trim();
  const n = Number(raw);
  if (Number.isInteger(n) && n >= 0 && n <= maxIndex) return n;
  const decoded = decodeURIComponent(raw).toLowerCase();
  const idIdx = planIds.findIndex((id) => id.toLowerCase() === decoded);
  if (idIdx >= 0) return Math.min(idIdx, maxIndex);
  return 0;
}

type PlanPriceRow = { mo: number; yr: number };

type SignupFormProps = {
  serverPlans: PricingPlan[];
  planPrices: PlanPriceRow[];
  planIds: string[];
  country: SupportedCountry;
  countrySlug?: string;
};

export function SignupForm({
  serverPlans,
  planPrices,
  planIds,
  country,
  countrySlug,
}: SignupFormProps): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();

  const maxPlanIndex = Math.max(
    0,
    Math.min(serverPlans.length, planPrices.length) - 1
  );

  const planIndex = useMemo(
    () => planIndexFromParam(searchParams.get("plan"), maxPlanIndex, planIds),
    [searchParams, maxPlanIndex, planIds]
  );

  const isAnnual = useMemo(
    () => isAnnualFromBillingParam(searchParams.get("billing")),
    [searchParams]
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    GTMEvents.signupStart({
      plan: serverPlan?.name,
      price: isAnnual ? priceRow.yr : priceRow.mo,
      billing: isAnnual ? "annual" : "monthly",
      country,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countryCode = country === "SA" ? "+966" : "+20";

  const serverPlan = useMemo(
    () => serverPlans[Math.min(planIndex, serverPlans.length - 1)] ?? serverPlans[0],
    [serverPlans, planIndex]
  );

  const priceRow = planPrices[Math.min(planIndex, planPrices.length - 1)] ?? {
    mo: 0,
    yr: 0,
  };

  const displayTotal = useMemo(
    () => displayMainTotalFromMoYr(priceRow.mo, priceRow.yr, isAnnual),
    [priceRow.mo, priceRow.yr, isAnnual]
  );

  const formattedTotal = useMemo(
    () => formatPlanTotalDisplay(displayTotal, country),
    [displayTotal, country]
  );

  const detailsToShow = useMemo(() => serverPlan?.features ?? [], [serverPlan?.features]);

  const submitButtonLabel = useMemo((): string => {
    if (pending) return "جاري الإرسال...";
    const id = planIds[Math.min(planIndex, planIds.length - 1)] ?? "";
    switch (id) {
      case "free":
        return "ابدأ التجربة المجانية — التالي";
      case "starter":
        return "ابدأ مع الانطلاقة — التالي";
      case "growth":
        return "ابدأ مع الزخم — التالي";
      case "scale":
        return "ابدأ مع الريادة — التالي";
      default:
        return "التالي ←";
    }
  }, [pending, planIds, planIndex]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const nextErrors: Record<string, string[]> = {};
    if (!name.trim()) {
      nextErrors.name = ["يرجى إدخال اسمك"];
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = ["يرجى إدخال بريد إلكتروني صالح"];
    }
    const local = phone.replace(/[\s-]/g, "");
    const isValidLocal =
      country === "SA"
        ? /^5\d{8}$/.test(local)
        : /^01\d{8,9}$/.test(local);
    if (!local || !isValidLocal) {
      nextErrors.phone = [
        country === "SA"
          ? "يرجى إدخال رقم جوال سعودي بدون مفتاح الدولة (مثال: 5XXXXXXXX)."
          : "يرجى إدخال رقم جوال مصري بدون مفتاح الدولة (مثال: 01XXXXXXXXX).",
      ];
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
      try {
        sessionStorage.setItem("jbrseo_signup_submitted", "true");
      } catch {
        /* ignore */
      }
      GTMEvents.signupComplete(country);
      router.push(withPreview);
      return;
    }
    if (!result.success && result.fieldErrors) {
      const normalized: Record<string, string[]> = {};
      for (const [key, messages] of Object.entries(result.fieldErrors)) {
        if (messages && messages.length > 0) {
          normalized[key] = messages;
        }
      }
      setErrors(normalized);
      setSubmitError(null);
      return;
    }
    setErrors({});
    setSubmitError(result.error);
  }

  const reveal = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <div
      className="flex justify-center items-start px-4 pt-14 pb-20 min-h-[70vh]"
    >
      <div
        className={cn("w-full max-w-md flex flex-col lg:max-w-4xl", reveal)}
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-border bg-card rounded-full font-['IBM_Plex_Mono',monospace] text-[12.5px] text-muted-foreground mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
            <span>
              <b className="text-foreground">خطوة ١:</b> بياناتك
              <span className="mx-2 opacity-40">·</span>
              <b className="text-foreground">خطوة ٢:</b> اختر خطتك
            </span>
          </div>
          <h1 className="text-[34px] lg:text-[40px] font-semibold tracking-[-1px] text-foreground leading-[1.15] mb-3">
            خطوتك الأولى نحو <span className="text-success">حضور رقمي متكامل</span>
          </h1>
          <p className="text-[16px] text-muted-foreground leading-[1.7] max-w-[600px] mx-auto">
            أكمل بياناتك، اختر الباقة المناسبة، وادخل إلى لوحة تحكّمك مباشرة بعد التفعيل.
          </p>
        </div>

        <Card
          className={cn(
            "w-full rounded-[20px] border border-border bg-card shadow-[0_24px_60px_-32px_color-mix(in_oklch,var(--foreground)_15%,transparent)]",
            "p-6 lg:p-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 transition-all duration-700 ease-out"
          )}
        >
        <div className="flex flex-col gap-5 min-w-0">
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
            <input type="hidden" name="planName" value={serverPlan?.name ?? ""} />
            <input type="hidden" name="country" value={country} />
            <div className="space-y-1">
              <Label htmlFor="name" className="text-[14px] font-semibold text-foreground mb-2 inline-block">
                اسمك
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="مثال: محمد العمري"
                className="bg-card border border-border rounded-[10px] px-[14px] py-[11px] text-[15px] text-foreground shadow-none outline-none h-12 placeholder:text-muted-foreground focus-visible:border-success focus-visible:ring-2 focus-visible:ring-success/15 transition-colors"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
              {errors.name?.[0] && (
                <p className="mt-1 text-xs text-destructive">{errors.name[0]}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[14px] font-semibold text-foreground mb-2 inline-block">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="name@company.com"
                className="bg-card border border-border rounded-[10px] px-[14px] py-[11px] text-[15px] text-foreground shadow-none outline-none h-12 placeholder:text-muted-foreground focus-visible:border-success focus-visible:ring-2 focus-visible:ring-success/15 transition-colors"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email?.[0] && (
                <p className="mt-1 text-xs text-destructive">{errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-[14px] font-semibold text-foreground mb-2 inline-block">
                رقم الجوال
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  className="bg-card border border-border rounded-[10px] px-[14px] py-[11px] text-[15px] text-foreground shadow-none outline-none h-12 placeholder:text-muted-foreground focus-visible:border-success focus-visible:ring-2 focus-visible:ring-success/15 transition-colors"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder={country === "SA" ? "5XXXXXXXXX" : "01XXXXXXXXX"}
                />
                <span className="inline-flex items-center px-4 h-12 bg-muted border border-border rounded-[10px] font-['IBM_Plex_Mono',monospace] text-[13px] font-semibold text-muted-foreground shrink-0">
                  {countryCode}
                </span>
              </div>
              <p className="text-[12.5px] text-muted-foreground mt-1.5">
                اكتب الرقم المحلي فقط — يُضاف مفتاح الدولة تلقائياً.
              </p>
              {errors.phone?.[0] && (
                <p className="mt-1 text-xs text-destructive">{errors.phone[0]}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="businessName" className="text-[14px] font-semibold text-foreground mb-2 inline-block">
                اسم النشاط التجاري (اختياري)
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                autoComplete="organization"
                maxLength={200}
                className="bg-card border border-border rounded-[10px] px-[14px] py-[11px] text-[15px] text-foreground shadow-none outline-none h-12 placeholder:text-muted-foreground focus-visible:border-success focus-visible:ring-2 focus-visible:ring-success/15 transition-colors"
                placeholder="مثال: متجر كلمات"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="businessType" className="text-[14px] font-semibold text-foreground mb-2 inline-block">
                نوع النشاط (اختياري)
              </Label>
              <Textarea
                id="businessType"
                name="businessType"
                maxLength={500}
                rows={3}
                placeholder="مثال: عيادة أسنان، متجر إلكتروني، شركة خدمات B2B..."
                value={businessType}
                onChange={(event) => setBusinessType(event.target.value)}
                className="bg-card border border-border rounded-[10px] px-[14px] py-3 text-[15px] text-foreground min-h-[96px] shadow-none resize-y placeholder:text-muted-foreground focus-visible:border-success focus-visible:ring-2 focus-visible:ring-success/15 transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className={cn(
                "w-full mt-2 bg-foreground hover:bg-foreground/90 text-background rounded-xl px-[22px] h-14 text-[16px] font-semibold border-none shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--foreground)_45%,transparent)] transition-all",
                pending ? "cursor-not-allowed opacity-70" : "cursor-pointer opacity-100"
              )}
            >
              {submitButtonLabel}
            </Button>
            <div className="flex justify-center gap-5 flex-wrap text-[13px] text-muted-foreground mt-1 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5l5 5L20 7"/></svg>
                بدون التزام طويل
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5l5 5L20 7"/></svg>
                خصوصية محفوظة
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5l5 5L20 7"/></svg>
                مرونة في الترقية
              </span>
            </div>
            <p className="mt-2 text-center text-[12.5px] text-muted-foreground">
              بالتسجيل أنت توافق على{" "}
              <Link href="/privacy" className="text-muted-foreground underline hover:text-foreground transition-colors">
                سياسة الخصوصية
              </Link>
            </p>
          </form>
        </div>

        <section
          key={planIndex}
          className={`mt-6 pt-6 border-t border-border/60 lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-s lg:border-border/60 lg:ps-8 flex flex-col transition-all duration-700 delay-300 ease-out ${reveal}`}
          aria-labelledby="plan-detail-heading"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2
              id="plan-detail-heading"
              className="text-[15px] font-semibold text-foreground"
            >
              محتوى باقة {serverPlan?.name ?? `الخطة ${planIndex + 1}`}
            </h2>
            <span className="font-['IBM_Plex_Mono',monospace] text-[10.5px] text-success tracking-[1.5px] font-semibold bg-success/15 border border-success/30 px-2 py-1 rounded-full">
              YOUR PLAN
            </span>
          </div>

          {/* Price card */}
          <div className="relative bg-foreground text-background rounded-[18px] px-6 py-7 mb-5 shadow-[0_24px_48px_-24px_color-mix(in_oklch,var(--foreground)_60%,transparent)] overflow-hidden">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-16 -left-16 w-40 h-40 rounded-full bg-success/15 blur-3xl" aria-hidden />

            <div className="relative flex items-center justify-between gap-4 mb-1">
              <span className="font-['IBM_Plex_Mono',monospace] text-[11px] text-background/60 tracking-[2px] uppercase">
                {isAnnual ? "Annual price" : "Monthly price"}
              </span>
              {priceRow.mo > 0 && (
                <span className="font-['IBM_Plex_Mono',monospace] text-[10px] font-semibold tracking-[1.5px] uppercase text-success bg-success/15 border border-success/30 px-2 py-1 rounded-full">
                  {country === "SA" ? "SAR" : "EGP"}
                </span>
              )}
            </div>

            <div className="relative flex items-baseline gap-2 mt-3">
              <span dir="ltr" className="font-['IBM_Plex_Mono',monospace] text-[48px] font-bold leading-none text-background tracking-[-1.5px]">
                {formattedTotal}
              </span>
              {priceRow.mo > 0 && (
                <span className="font-['IBM_Plex_Mono',monospace] text-[13px] text-background/60 font-medium">
                  {isAnnual ? "/ سنة" : "/ شهر"}
                </span>
              )}
            </div>

            {priceRow.mo > 0 && isAnnual && (
              <div className="relative mt-3 pt-3 border-t border-background/10 font-['IBM_Plex_Mono',monospace] text-[11.5px] text-background/70">
                <span dir="ltr">{(priceRow.yr).toLocaleString("en-US")}</span> {country === "SA" ? "SAR" : "EGP"} / شهر
                <span className="opacity-50 mx-2">·</span>
                <span className="text-success">دفعة سنوية واحدة</span>
              </div>
            )}
          </div>

          {/* Features list */}
          <ul className="list-none flex flex-col gap-3 m-0 p-0 mb-5">
            {detailsToShow.slice(0, 4).map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14.5px] text-foreground leading-[1.55]">
                <span className="shrink-0 mt-[3px] w-5 h-5 rounded-full bg-success/15 inline-flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l5 5L20 7" />
                  </svg>
                </span>
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>

          {/* Flexibility callout */}
          <div className="flex items-start gap-3 px-4 py-3.5 bg-success/8 border border-success/30 rounded-xl">
            <span
              className="w-9 h-9 rounded-full bg-card border border-success/30 inline-flex items-center justify-center text-success shrink-0"
              aria-hidden
            >
              <ShieldCheck size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold text-success mb-1">
                مرونة كاملة في باقتك
              </span>
              <span className="block text-[13px] text-muted-foreground leading-[1.55]">
                ترقية، تغيير، أو تعديل الإعدادات من لوحة التحكم في أي وقت.
              </span>
            </span>
          </div>
        </section>
      </Card>
      </div>
    </div>
  );
}
