import { Suspense } from "react";
import { getSiteSettings } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { ImagesForm } from "../../components/ImagesForm";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";

const IMAGE_KEYS = [
  "contactAvatar",
  "sectionHero",
  "sectionWhyNow",
  "sectionHowItWorks",
  "sectionOutcomes",
  "sectionSocialProof",
  "sectionFaq",
  "sectionFinalCta",
] as const;

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminSettingsImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const settings = await getSiteSettings(country);
  const images = IMAGE_KEYS.map((key) => ({
    key,
    url: (settings.images as Record<string, string>)[key] ?? "",
  }));
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">الصور</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <ImagesForm country={country} images={images} redirect={`/admin/settings/images?country=${country}`} />
      </div>
    </div>
  );
}
