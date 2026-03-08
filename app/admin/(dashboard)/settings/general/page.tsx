import { Suspense } from "react";
import { getSiteSettings, getGlobalLogos } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { GeneralForm } from "../../components/GeneralForm";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";
import { landingImages } from "@/app/content/landing-images";

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminSettingsGeneralPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const [settings, globalLogos] = await Promise.all([
    getSiteSettings(country),
    getGlobalLogos(),
  ]);
  const logoWhite = globalLogos.logoWhite || landingImages.logoWhite;
  const logoLight = globalLogos.logoLight || landingImages.logoLight;
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">عام</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <GeneralForm
          country={country}
          site={settings.site}
          globalLogoWhite={logoWhite}
          globalLogoLight={logoLight}
          redirect={`/admin/settings/general?country=${country}`}
        />
      </div>
    </div>
  );
}
