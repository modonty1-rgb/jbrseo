import { Suspense, type ReactElement, type ReactNode } from "react";
import type { Metadata } from "next";
import { isSupportedCountrySlug } from "@/lib/country-config";
import CountryThankYouLoading from "./loading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return { title: "شكراً — JBRSEO" };
  }
  return {
    title: "شكراً لتسجيلك",
    description: "استلمنا بياناتك وسيتواصل معك فريقنا خلال ٢٤ ساعة.",
    robots: { index: false, follow: false },
  };
}

export default function CountrySignupThankYouLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <Suspense fallback={<CountryThankYouLoading />}>{children}</Suspense>
  );
}
