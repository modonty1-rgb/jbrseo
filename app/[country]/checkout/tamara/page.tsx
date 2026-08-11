import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getAllPlans } from "@/app/actions/pricing";
import { getCountryCodeFromSlug, isSupportedCountrySlug } from "@/lib/country-config";
import { priceForDuration, parseDuration } from "@/lib/pricing-durations";
import { formatPlanTotalDisplay } from "@/lib/pricing-plan-amounts";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import { tamaraIsConfigured } from "@/lib/tamara/client";
import { CheckoutHeader } from "../_components/CheckoutHeader";
import { toArabicDigits } from "@/app/components/landing/landing-helpers";
import { CheckoutSummary } from "../_components/CheckoutSummary";
import { TamaraForm } from "./_components/TamaraForm";

export const metadata: Metadata = {
  title: { absolute: "الدفع بالتقسيط — JBRSEO" },
  description: "أكمل بياناتك وقسّط اشتراكك مع تمارا.",
  robots: { index: false, follow: false },
  // Same guard as the card checkout: Google Translate re-parents bare text nodes, and
  // React removing one during a submit-state change throws `removeChild` and takes the
  // whole tree down. A payment page is the last place that can happen.
  other: { google: "notranslate" },
};

type Props = {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ plan?: string; duration?: string }>;
};

export default async function TamaraCheckoutPage({ params, searchParams }: Props) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) notFound();

  const countrySlug = slug as "sa" | "eg";

  // Egypt has no payment surface at all, and Tamara additionally refuses it —
  // `400 not_supported_delivery_country`. Either reason alone is enough.
  if (countrySlug === "eg") notFound();

  // Without keys every submit would end at a 503. A 404 is the honest answer: as far as
  // this deployment is concerned, the route does not exist.
  if (!tamaraIsConfigured()) notFound();

  const country = getCountryCodeFromSlug(countrySlug);
  const { plan: planParam, duration: durationParam } = await searchParams;
  const duration = parseDuration(durationParam);

  if (!planParam || !planParam.trim()) {
    redirect(`/${countrySlug}#pricing`);
  }

  const plans = await getAllPlans(country);
  const plan = plans.find((p) => p.slug === planParam.trim().toLowerCase());
  if (!plan) {
    redirect(`/${countrySlug}#pricing`);
  }

  // Same breakdown as the card route: the instalment buyer is buying the same term and
  // the same free months, so this page states them too.
  const dp = priceForDuration(plan.priceMonthly, duration);
  const totalNumber = dp.total;
  const totalDisplay = formatPlanTotalDisplay(totalNumber, country);
  // Service months, matching the plan card and the card-checkout route.
  const serviceMonths = dp.serviceMonths;
  const billingLabel = `${toArabicDigits(serviceMonths)} ${serviceMonths >= 3 && serviceMonths <= 10 ? "شهور" : "شهر"}`;

  return (
    <>
      {/* Back to pricing, not to the card checkout: the customer chose the instalment
          route from the plan card, so that is where changing their mind returns them. */}
      <CheckoutHeader backHref={`/${countrySlug}#pricing`} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-black text-foreground sm:text-3xl">
            قسّط اشتراكك مع تمارا
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            بياناتك، وبعدها تكمّل على صفحة تمارا وترجع لنا.
          </p>
        </div>

        <div className="space-y-5">
          <CheckoutSummary
            planName={plan.name}
            planTagline={plan.tagline}
            totalDisplay={totalDisplay}
            billingLabel={billingLabel}
            freeMonths={dp.freeMonths}
          />

          {/* The split itself is deliberately not spelled out here. Tamara decides the
              number of instalments and any fee from the amount and the customer's own
              account, and their page states the real schedule before anything is
              confirmed. Printing an example here would be a number we cannot stand
              behind, next to one we can. */}
          <TamaraForm
            planSlug={plan.slug}
            planName={plan.name}
            duration={duration}
            totalDisplay={totalDisplay}
            countrySlug={countrySlug}
            turnstileSiteKey={getTurnstileSiteKey()}
          />

          <p className="text-center text-xs text-muted-foreground">
            تفضّل الدفع دفعة واحدة بالبطاقة؟{" "}
            <a
              href={`/${countrySlug}/checkout?plan=${plan.slug}&duration=${duration}`}
              className="text-foreground underline underline-offset-2"
            >
              ارجع لصفحة الدفع بالبطاقة
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
