import { Suspense } from "react";
import { getSiteSettings } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { SeoForm } from "../../components/SeoForm";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminSettingsSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const settings = await getSiteSettings(country);
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">SEO وبطاقات التواصل</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <SeoForm country={country} seo={settings.seo} redirect={`/admin/settings/seo?country=${country}`} />
      </div>
    </div>
  );
}
