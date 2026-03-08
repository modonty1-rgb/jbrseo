import { Suspense } from "react";
import { getSiteSettings } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { TrackingForm } from "../../components/TrackingForm";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminSettingsTrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const settings = await getSiteSettings(country);
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">التتبع</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <TrackingForm country={country} tracking={settings.tracking} redirect={`/admin/settings/tracking?country=${country}`} />
      </div>
    </div>
  );
}
