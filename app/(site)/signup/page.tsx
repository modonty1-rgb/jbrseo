import { Suspense } from "react";
import { headers } from "next/headers";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { SignupForm } from "./SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التسجيل المبكر",
  description: "سجّل اهتمامك وكن من أوائل المستفيدين عند الإطلاق.",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);
  const serverPlans = content.landing.pricingTeaser.plans ?? [];

  return (
    <Suspense>
      <SignupForm serverPlans={serverPlans} country={country} />
    </Suspense>
  );
}
