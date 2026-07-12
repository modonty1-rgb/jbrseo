import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import {
  isSupportedCountrySlug,
  SUPPORTED_COUNTRY_SLUGS,
} from "@/lib/country-config";

export function generateStaticParams() {
  return SUPPORTED_COUNTRY_SLUGS.map((country) => ({ country }));
}

async function CountryLayoutContent({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    redirect("/sa");
  }
  return <>{children}</>;
}

// Generic fallback — every route under /[country]/* shares this while the
// slug-validation promise resolves. We used to render a full marketing
// skeleton here, which flickered incorrectly on /[country]/checkout where the
// real chrome is different. Now: a neutral empty surface — children own their
// own skeleton via their nested layout / loading.tsx.
export default function CountryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CountryLayoutContent params={params}>{children}</CountryLayoutContent>
    </Suspense>
  );
}
