import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { XCircle, RotateCcw } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getWhatsAppLink } from "@/lib/site-links";
import { resolveReason } from "@/lib/checkout-reasons";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";
import { CheckoutHeader } from "../_components/CheckoutHeader";

export const metadata: Metadata = {
  title: { absolute: "الدفع لم يكتمل — JBRSEO" },
  robots: { index: false, follow: false },
};

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ order?: string; reason?: string; plan?: string; billing?: string }>;
};

export default async function CheckoutFailedPage({ params, searchParams }: Props) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";
  if (countrySlug === "eg") notFound();

  const { order, reason, plan: planParam, billing: billingParam } = await searchParams;
  const country = getCountryCodeFromSlug(countrySlug);

  // Two modes:
  //   1. Order-based failure (subscriber row exists) — full details from DB
  //   2. Escalation from /checkout after N retries (no subscriber yet) — reason-only
  let subscriber: Awaited<ReturnType<typeof prisma.subscriber.findUnique>> | null = null;
  if (order && order.trim()) {
    subscriber = await prisma.subscriber.findUnique({ where: { id: order.trim() } }).catch(() => null);

    // Guard against inconsistent state
    if (subscriber?.paymentStatus === "paid") {
      redirect(`/${countrySlug}/checkout/success?order=${order}`);
    }
  }

  // Reason precedence: URL → DB → default
  const reasonKey = reason || subscriber?.failReason;
  const resolved = resolveReason(reasonKey);

  // Retry URL: prefer subscriber's plan+billing, fall back to URL params
  const retryPlan = subscriber?.plan || planParam;
  const retryBilling = subscriber?.billing || billingParam;
  const retryQuery = new URLSearchParams();
  if (retryPlan) retryQuery.set("plan", retryPlan);
  if (retryBilling) retryQuery.set("billing", retryBilling);
  const canRetry = retryQuery.toString().length > 0;
  const retryHref = canRetry
    ? `/${countrySlug}/checkout?${retryQuery.toString()}`
    : `/${countrySlug}#pricing`;

  const waHref = getWhatsAppLink(country);
  const refShort = subscriber?.paymentRef
    || (subscriber ? `JBR-${subscriber.id.slice(-8).toUpperCase()}` : null);

  return (
    <>
      <CheckoutHeader backHref={`/${countrySlug}#pricing`} />
      <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

        {/* Fail icon */}
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/12 border-2 border-destructive/40 shadow-lg shadow-destructive/20">
            <XCircle className="h-11 w-11 text-destructive" strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            الدفع لم يكتمل
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
            <strong className="text-foreground">لم يُخصم أي مبلغ من بطاقتك.</strong>{" "}
            {canRetry
              ? "يمكنك المحاولة مرة أخرى أو التواصل معنا للمساعدة."
              : "تواصل معنا على واتساب وسنساعدك فوراً."}
          </p>
        </div>

        {/* Reason block */}
        <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-5 sm:p-6 mb-6">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[2px] text-destructive/80">
            سبب الفشل
          </p>
          <p className="text-[15px] font-semibold text-destructive mb-2">
            {resolved.title}
          </p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {resolved.hint}
          </p>
          {refShort && (
            <div className="mt-4 pt-3 border-t border-destructive/20 flex items-baseline justify-between gap-3 text-xs">
              <span className="text-muted-foreground">رقم المحاولة</span>
              <span className="font-mono text-muted-foreground" dir="ltr">{refShort}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Retry — primary (only if we have plan+billing to construct link) */}
          {canRetry && (
            <a
              href={retryHref}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-background text-[15px] font-black shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--foreground)_45%,transparent)] hover:bg-foreground/90 transition-colors no-underline"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
              <span>أعد المحاولة</span>
            </a>
          )}

          {/* WhatsApp — always shown; primary on the escalation path (no retry) */}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={canRetry
              ? "flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors no-underline"
              : "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-success text-success-foreground text-[15px] font-black shadow-lg shadow-success/25 hover:bg-success/90 transition-colors no-underline"
            }
          >
            <WhatsAppIcon className={canRetry ? "h-4 w-4 text-success" : "h-5 w-5"} />
            <span>تواصل معنا على واتساب</span>
          </a>
        </div>

        {/* Reassurance note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {canRetry
            ? "بياناتك محفوظة — لا داعي لإعادة إدخالها. الضغط على \"أعد المحاولة\" يرجعك للصفحة السابقة مع نفس الباقة."
            : "فريقنا سيراجع المشكلة معك ويكمل الدفع يدوياً إذا لزم الأمر."}
        </p>
      </main>
    </>
  );
}
