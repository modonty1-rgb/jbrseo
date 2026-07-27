import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getAllPlans } from "@/app/actions/pricing";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { isAnnualFromBillingParam } from "@/lib/billing-search-param";
import {
  displayMainTotalFromMoYr,
  formatPlanTotalDisplay,
} from "@/lib/pricing-plan-amounts";
import { resolveReason, MAX_INLINE_RETRIES } from "@/lib/checkout-reasons";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import { CheckoutHeader } from "./_components/CheckoutHeader";

const NGENIUS_HOSTED_KEY = process.env.NEXT_PUBLIC_NGENIUS_HOSTED_SESSION_API_KEY ?? "";
const NGENIUS_OUTLET_REF = process.env.NGENIUS_OUTLET_ID ?? "";
import { CheckoutSummary } from "./_components/CheckoutSummary";
import { CheckoutForm } from "./_components/CheckoutForm";

export const metadata: Metadata = {
  title: { absolute: "الدفع — JBRSEO" },
  description: "أكمل بياناتك واختر باقتك.",
  robots: { index: false, follow: false },
  // Renders <meta name="google" content="notranslate"> — stops Google Translate
  // from re-parenting text nodes during the payment flow (removeChild crash).
  other: { google: "notranslate" },
};

type CheckoutPageProps = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ plan?: string; billing?: string; error?: string; attempt?: string; order?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";

  // Decision 4 (payment plan): Egypt has no payment surface.
  if (countrySlug === "eg") notFound();

  const country = getCountryCodeFromSlug(countrySlug);
  const { plan: planParam, billing: billingParam, error: errorParam, attempt: attemptParam, order: orderParam } = await searchParams;

  // Q2.1: no ?plan= → redirect to pricing selector.
  if (!planParam || !planParam.trim()) {
    redirect(`/${countrySlug}#pricing`);
  }

  // Inline retry policy — recoverable errors show a banner and let the user
  // retry in-place. After MAX_INLINE_RETRIES attempts, escalate to /failed
  // so the user gets a support escape valve instead of a doom loop.
  const attemptNumber = Math.max(1, Number.parseInt(attemptParam ?? "1", 10) || 1);
  const paymentError = errorParam ? resolveReason(errorParam) : null;

  // If unrecoverable OR too many attempts → hand off to /failed
  if (paymentError && (!paymentError.recoverable || attemptNumber >= MAX_INLINE_RETRIES)) {
    const q = new URLSearchParams({ reason: errorParam!, plan: planParam.trim(), billing: billingParam ?? "annual" });
    if (orderParam) q.set("order", orderParam);
    redirect(`/${countrySlug}/checkout/failed?${q.toString()}`);
  }

  const plans = await getAllPlans(country);
  const plan = plans.find((p) => p.slug === planParam.trim().toLowerCase());

  // Invalid or hidden plan slug → back to pricing rather than crashing.
  if (!plan) {
    redirect(`/${countrySlug}#pricing`);
  }

  const annual = isAnnualFromBillingParam(billingParam ?? null);
  const billing: "monthly" | "annual" = annual ? "annual" : "monthly";
  const totalNumber = displayMainTotalFromMoYr(plan.priceMonthly, plan.priceYearly, annual);
  const totalDisplay = formatPlanTotalDisplay(totalNumber, country);
  const billingLabel = annual ? "سنوي" : "شهري";

  return (
    <>
      <CheckoutHeader backHref={`/${countrySlug}#pricing`} />
      {/* Single-column layout — matches Stripe Checkout / Apple Pay Sheet UX
          where the entire flow reads top-to-bottom as one coherent form. Cleaner
          than a summary sidebar because the "trust boundary" panel now has room
          to breathe and dominates the eye. Max width ~ 620px keeps line-length
          comfortable for reading + touch targets natural on mobile. */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            أكمل اشتراكك
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            خطوة واحدة تفصلك عن إطلاق منظومة السيو الخاصة بنشاطك.
          </p>
        </div>

        <div className="space-y-5">
          <CheckoutSummary
            planName={plan.name}
            planTagline={plan.tagline}
            totalDisplay={totalDisplay}
            billingLabel={billingLabel}
          />

          <CheckoutForm
            country={country}
            planSlug={plan.slug}
            planName={plan.name}
            billing={billing}
            totalDisplay={totalDisplay}
            paymentError={paymentError}
            attemptNumber={paymentError ? attemptNumber : undefined}
            turnstileSiteKey={getTurnstileSiteKey()}
            ngeniusHostedSessionKey={NGENIUS_HOSTED_KEY}
            ngeniusOutletRef={NGENIUS_OUTLET_REF}
          />
        </div>
      </main>
    </>
  );
}
