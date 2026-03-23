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
  const [showAllPlanFeatures, setShowAllPlanFeatures] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    <div className="relative min-h-[70vh] overflow-hidden px-4 py-20 flex justify-center items-start landing-grain">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-16 start-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-20 end-1/4 h-64 w-64 rounded-full bg-accent/12 blur-3xl" />
      </div>

      <div
        className={cn(
          "relative z-10 flex w-full max-w-md flex-col lg:max-w-4xl",
          reveal
        )}
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
            خطوة ١ من ٢ — بياناتك الأساسية
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            ابدأ اليوم — مضمون أو نرد لك فلوسك كاملة
          </h1>
          <p className="text-sm text-muted-foreground">
            أول مقالك جاهز خلال ٧ أيام — وإذا ما عجبك نرد لك كل ريال
          </p>
        </div>

        <Card
          className={cn(
            "w-full rounded-2xl border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/8 p-6 lg:p-8 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 bg-linear-to-br from-primary/3 via-transparent to-accent/3 transition-all duration-700 ease-out border"
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
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                اسمك
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="مثال: محمد العمري"
                className="rounded-lg py-2.5 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent"
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
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@company.com"
                className="rounded-lg py-2.5 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent"
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
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                رقم الجوال
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="rounded-lg py-2.5 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder={country === "SA" ? "5XXXXXXXXX" : "01XXXXXXXXX"}
                />
                <span className="inline-flex items-center rounded-lg border border-input bg-muted px-3 text-xs font-semibold text-muted-foreground shrink-0">
                  {countryCode}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                اكتب رقم جوالك فقط بدون مفتاح الدولة، وسنضيفه تلقائياً.
              </p>
              {errors.phone?.[0] && (
                <p className="mt-1 text-xs text-destructive">{errors.phone[0]}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="businessName" className="text-sm font-medium text-foreground">
                اسم النشاط التجاري (اختياري)
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                className="rounded-lg py-2.5 focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent"
                placeholder="مثال: متجر كلمات"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="businessType" className="text-sm font-medium text-foreground">
                نوع النشاط (اختياري)
              </Label>
              <Textarea
                id="businessType"
                name="businessType"
                className="rounded-lg py-2.5 min-h-[80px] focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:border-accent"
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
              {submitButtonLabel}
            </Button>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground w-full">
              <span>بدون عقد</span>
              <span aria-hidden>·</span>
              <span>بيانات آمنة</span>
              <span aria-hidden>·</span>
              <span>إلغاء وقت ما تبي</span>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              بالتسجيل أنت توافق على{" "}
              <Link href="/privacy" className="underline transition-colors hover:text-foreground">
                سياسة الخصوصية
              </Link>
            </p>
          </form>
        </div>

        <section
          key={planIndex}
          className={`mt-6 pt-6 border-t border-border/60 lg:mt-0 lg:pt-0 lg:border-t-0 lg:border-s lg:border-border/60 lg:ps-8 flex flex-col rounded-xl bg-muted/10 p-5 lg:p-6 transition-all duration-700 delay-300 ease-out ${reveal}`}
          aria-labelledby="plan-detail-heading"
        >
          <h2 id="plan-detail-heading" className="mb-2 text-xs font-bold uppercase tracking-widest text-accent shrink-0">
            ما تحصل عليه مع {serverPlan?.name ?? `الخطة ${planIndex + 1}`}
          </h2>
          <div className="mb-4 min-h-14 rounded-xl border-2 border-accent/30 bg-primary/10 px-4 py-3 text-center">
            <p className="text-xs font-bold text-muted-foreground mb-1">
              {isAnnual ? "فوترة سنوية — إجمالي سنوي" : "فوترة شهرية"}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl tabular-nums">
              {priceRow.mo > 0 ? <CurrencyIcon country={country} /> : null}
              {formattedTotal}
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 list-none">
            {detailsToShow.slice(0, 3).map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span className="min-w-0 wrap-break-word">{item}</span>
              </li>
            ))}
          </ul>
          {detailsToShow.length > 3 && (
            <button
              type="button"
              className={cn(
                "text-xs text-muted-foreground underline lg:hidden mt-2 text-start",
                showAllPlanFeatures && "hidden"
              )}
              onClick={() => setShowAllPlanFeatures(true)}
            >
              شوف كل المميزات
            </button>
          )}
          {detailsToShow.length > 3 && (
            <div
              className={cn(
                "mt-2 hidden lg:block",
                showAllPlanFeatures && "block"
              )}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {detailsToShow.slice(3, 6).map((item, i) => (
                  <div
                    key={`${planIndex}-more-${i}-${item.slice(0, 24)}`}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span className="min-w-0 wrap-break-word">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {detailsToShow.length > 6 && (
            <div className="mt-2 hidden lg:block">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 list-none">
                {detailsToShow.slice(6).map((item, i) => (
                  <li
                    key={`${planIndex}-rest-${i}-${item.slice(0, 24)}`}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    <span className="min-w-0 wrap-break-word">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="text-sm font-medium">ضمان استرداد كامل خلال ١٤ يوم — بدون أسئلة</p>
          </div>
          <div className="mt-4 border-r-2 border-primary pr-3 text-sm text-muted-foreground italic">
            <p>كنا نصرف على إعلانات بدون نتيجة — اشتركنا وأول شهر جاب عملاء جدد</p>
            <p className="mt-1 not-italic">— صاحب متجر إلكتروني، الرياض</p>
          </div>
        </section>
      </Card>
      </div>
    </div>
  );
}
