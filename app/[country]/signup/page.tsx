import { Suspense } from "react";
import type { Metadata } from "next";
import { getLandingContent } from "@/lib/getLandingContent";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { SignupForm } from "@/app/(site)/signup/SignupForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return { title: "التسجيل — JBRSEO" };
  }
  return {
    title: "التسجيل المبكر",
    description: "سجّل اهتمامك وكن من أوائل المستفيدين عند الإطلاق.",
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
  const content = await getLandingContent(countryCode);
  const serverPlans = content.landing.pricingTeaser.plans ?? [];

  return (
    <Suspense>
      <SignupForm
        serverPlans={serverPlans}
        country={countryCode}
        countrySlug={countrySlug}
      />
    </Suspense>
  );
}
