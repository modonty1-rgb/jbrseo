import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { PricingPageShell } from "@/app/components/pricing/PricingPageShell";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const landing = await getStaticLandingWithOverrides(country);
  const { title, description } = landing.pricingPage;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  const url = `${siteUrl}/pricing`;
  const parentMetadata = await parent;
  const parentOpenGraph = (parentMetadata.openGraph ?? {}) as NonNullable<Metadata["openGraph"]>;
  const parentOgImages = parentOpenGraph.images ?? [];
  const parentTwitter = parentMetadata.twitter ?? {};

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...parentOpenGraph,
      title,
      description,
      url,
      images: parentOgImages,
    },
    twitter: {
      ...parentTwitter,
      title,
      description,
    },
  };
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const h = await headers();
  const { plan } = await searchParams;
  const country = getCountryFromHeaders(h);
  const landing = await getStaticLandingWithOverrides(country);

  return (
    <PricingPageShell
      pricing={landing.pricing}
      pricingPage={landing.pricingPage}
      faq={landing.faq}
      country={country}
      highlightPlanId={plan ?? null}
    />
  );
}
