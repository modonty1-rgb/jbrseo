import { Suspense } from "react";
import type { Metadata } from "next";
import { getLandingContent } from "@/lib/getLandingContent";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { SignupForm } from "./component/SignupForm";

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
  const [content, staticLanding] = await Promise.all([
    getLandingContent(countryCode),
    getStaticLandingWithOverrides(countryCode),
  ]);
  const serverPlans = content.landing.pricingTeaser.plans ?? [];
  const planPrices = staticLanding.pricing.PLANS.map((p) => ({ mo: p.price.mo, yr: p.price.yr }));
  const planIds = staticLanding.pricing.PLANS.map((p) => p.id);

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
