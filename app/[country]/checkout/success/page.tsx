import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, MailOpen, ExternalLink } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import {
  displayMainTotalFromMoYr,
  formatPlanTotalDisplay,
} from "@/lib/pricing-plan-amounts";
import { CheckoutHeader } from "../_components/CheckoutHeader";

export const metadata: Metadata = {
  title: { absolute: "تم الدفع — JBRSEO" },
  robots: { index: false, follow: false },
};

const prisma = new PrismaClient();

// URL to Modonty client console
const MODONTY_CONSOLE = "https://console.modonty.com";
const MODONTY_SENDER = "modonty@modonty.com";

type Props = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({ params, searchParams }: Props) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";
  if (countrySlug === "eg") notFound();

  const { order } = await searchParams;
  if (!order || !order.trim()) {
    redirect(`/${countrySlug}#pricing`);
  }

  const country = getCountryCodeFromSlug(countrySlug);
  const subscriber = await prisma.subscriber.findUnique({
    where: { id: order.trim() },
  }).catch(() => null);

  // Missing subscriber → treat as tampering, back to pricing
  if (!subscriber) {
    redirect(`/${countrySlug}#pricing`);
  }

  // State-based routing
  if (subscriber.paymentStatus === "pending") {
    redirect(`/${countrySlug}/checkout/processing?order=${order}`);
  }
  if (subscriber.paymentStatus === "failed") {
    const reason = subscriber.failReason ? `&reason=${encodeURIComponent(subscriber.failReason)}` : "";
    redirect(`/${countrySlug}/checkout/failed?order=${order}${reason}`);
  }
  if (subscriber.paymentStatus !== "paid") {
    // abandoned / refunded — no success page for those
    redirect(`/${countrySlug}#pricing`);
  }

  // Fetch plan for display (name + amount)
  const plan = await prisma.plan.findFirst({
    where: { country, slug: subscriber.plan },
  });
  if (!plan) {
    // Data inconsistency — plan not found for a paid subscriber. Shouldn't happen.
    redirect(`/${countrySlug}#pricing`);
  }

  const annual = subscriber.billing === "annual";
  const totalNumber = displayMainTotalFromMoYr(plan.priceMonthly, plan.priceYearly, annual);
  const totalDisplay = formatPlanTotalDisplay(totalNumber, country);
  const billingLabel = annual ? "سنوي" : "شهري";
  // Invoice ref: paymentRef (from N-Genius) if set, else short subscriber id
  const invoiceRef = subscriber.paymentRef || `JBR-${subscriber.id.slice(-8).toUpperCase()}`;

  return (
    <>
      <CheckoutHeader backHref={`/${countrySlug}#pricing`} />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        {/* Success icon with pulse */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
            <div className="relative h-20 w-20 rounded-full bg-success/15 border-2 border-success/40 flex items-center justify-center shadow-lg shadow-success/20">
              <CheckCircle2 className="h-11 w-11 text-success" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            تم الدفع بنجاح
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
            تم إرسال بريد إلكتروني إلى بريدك يحتوي بيانات الدخول إلى حسابك في مدونتي.
          </p>
        </div>

        {/* Invoice block */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 mb-6">
          <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[2px] text-muted-foreground">
            تفاصيل الفاتورة
          </p>
          <dl className="space-y-3">
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <dt className="text-muted-foreground">رقم الفاتورة</dt>
              <dd className="font-mono text-foreground" dir="ltr">{invoiceRef}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <dt className="text-muted-foreground">الباقة</dt>
              <dd className="font-semibold text-foreground">{plan.name} · {billingLabel}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 pt-3 border-t border-border text-[15px]">
              <dt className="font-semibold text-foreground">الإجمالي المدفوع</dt>
              <dd className="font-mono text-lg font-black text-success" dir="ltr">{totalDisplay}</dd>
            </div>
            <p className="text-xs text-muted-foreground/80 mt-0.5">
              السعر شامل ضريبة القيمة المضافة ١٥٪
            </p>
          </dl>
        </div>

        {/* Primary CTA: open modonty console */}
        <a
          href={MODONTY_CONSOLE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-success text-success-foreground text-[15px] font-black shadow-lg shadow-success/25 hover:bg-success/90 transition-colors mb-4"
        >
          <span>افتح حسابك في مدونتي</span>
          <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
        </a>

        {/* Email notice */}
        <div className="flex items-start gap-3 rounded-xl border border-info/25 bg-info/5 px-4 py-3.5">
          <MailOpen className="mt-0.5 h-4 w-4 shrink-0 text-info" />
          <div className="text-xs leading-relaxed">
            <p className="text-foreground font-semibold mb-0.5">
              راجع صندوق بريدك
            </p>
            <p className="text-muted-foreground">
              يصلك خلال دقائق إيميل ترحيبي من{" "}
              <span className="font-mono text-foreground" dir="ltr">{MODONTY_SENDER}</span>
              {" "}فيه بيانات الدخول. إذا لم تجده، افحص مجلد "الرسائل غير المرغوبة".
            </p>
          </div>
        </div>

        {/* Delivery commitment reminder */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ⏱️ نُنشئ حسابك عادةً خلال ٧٢ ساعة (أقصى ١٤ يوم). تابع{" "}
          <a href="/billing-policy" className="underline underline-offset-2 hover:text-foreground">
            سياسة الفوترة
          </a>
          {" "}للتفاصيل.
        </p>
      </main>
    </>
  );
}
