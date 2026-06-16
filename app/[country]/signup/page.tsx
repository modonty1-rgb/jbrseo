import { Suspense } from "react";
import type { Metadata } from "next";
import { PRICING_CTA_LINK } from "@/lib/constants";
import { getAllPlans } from "@/app/actions/pricing";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import type { PricingPlan } from "@/lib/landing-content.types";
import { SignupForm } from "./_components/SignupForm";

function formatPrice(value: number, country: "SA" | "EG"): string {
  if (value === 0) return "مجاناً";
  return country === "SA" ? `${value} ر.س` : `${value} ج.م`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return { title: { absolute: "التسجيل — مدونتي | JBRSEO" } };
  }
  return {
    title: { absolute: "التسجيل — مدونتي | JBRSEO" },
    description: "أكمل بياناتك واختر خطتك للبدء مع JBRSEO.",
    robots: { index: false, follow: false },
  };
}

export default async function CountrySignupPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return null;
  }
  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);
  const dbPlans = await getAllPlans(countryCode);
  const visibleDbPlans = [...dbPlans]
    .filter((p) => p.visible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const serverPlans: PricingPlan[] = visibleDbPlans.map((p) => ({
    name: p.name,
    forWho: p.tagline,
    cta: p.ctaText || "ابدأ الحين",
    ctaLink: PRICING_CTA_LINK,
    ...(p.priceMonthly > 0 || p.priceYearly > 0
      ? {
          price: formatPrice(p.priceMonthly, countryCode),
          annualPrice: p.priceYearly > 0 ? formatPrice(p.priceYearly * 12, countryCode) : undefined,
        }
      : {}),
    ...(p.badge ? { badge: p.badge } : {}),
    ...(p.featuredBadge ? { highlight: true as const } : {}),
    features: p.highlights ?? [],
  }));
  const planPrices = visibleDbPlans.map((p) => ({ mo: p.priceMonthly, yr: p.priceYearly }));
  const planIds = visibleDbPlans.map((p) => p.slug);

  return (
    <Suspense>
      <SignupForm
        serverPlans={serverPlans}
        planPrices={planPrices}
        planIds={planIds}
        country={countryCode}
        countrySlug={countrySlug}
      />
    </Suspense>
  );
}
