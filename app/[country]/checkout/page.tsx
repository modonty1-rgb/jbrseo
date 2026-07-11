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
import { CheckoutHeader } from "./_components/CheckoutHeader";
import { CheckoutSummary } from "./_components/CheckoutSummary";
import { CheckoutForm } from "./_components/CheckoutForm";

export const metadata: Metadata = {
  title: { absolute: "الدفع — JBRSEO" },
  description: "أكمل بياناتك واختر باقتك.",
  robots: { index: false, follow: false },
};

type CheckoutPageProps = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ plan?: string; billing?: string }>;
};

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";

  // Decision 4 (payment plan): Egypt has no payment surface.
  if (countrySlug === "eg") notFound();

  const country = getCountryCodeFromSlug(countrySlug);
  const { plan: planParam, billing: billingParam } = await searchParams;

  // Q2.1: no ?plan= → redirect to pricing selector.
  if (!planParam || !planParam.trim()) {
    redirect(`/${countrySlug}#pricing`);
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
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            أكمل اشتراكك
          </h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            خطوة واحدة تفصلك عن إطلاق منظومة السيو الخاصة بنشاطك.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-start">
          {/* Form column — appears BELOW summary on mobile (per Q1). */}
          <div className="order-2 lg:order-1">
            <CheckoutForm
              country={country}
              planSlug={plan.slug}
              planName={plan.name}
              billing={billing}
              totalDisplay={totalDisplay}
            />
          </div>

          {/* Summary column — appears ABOVE form on mobile (per Q1). */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-6">
            <CheckoutSummary
              planName={plan.name}
              planTagline={plan.tagline}
              totalDisplay={totalDisplay}
              billingLabel={billingLabel}
            />
          </div>
        </div>
      </main>
    </>
  );
}
