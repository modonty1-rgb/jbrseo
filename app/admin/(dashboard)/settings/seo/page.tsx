import { Suspense } from "react";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { DEFAULT_SITE_SETTINGS_JSON } from "@/lib/site-settings.types";
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
  const override = await getLandingSectionOverride(country, "seo");
  const seo =
    override && typeof override === "object" && !Array.isArray(override)
      ? { ...DEFAULT_SITE_SETTINGS_JSON.seo, ...(override as Record<string, string>) }
      : DEFAULT_SITE_SETTINGS_JSON.seo;
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">SEO وبطاقات التواصل</h1>
          <Suspense fallback={null}>
            <AdminCountryPill />
          </Suspense>
        </div>
        <p className="max-w-md text-end text-sm text-muted-foreground">
          إعدادات ظهور موقعك في محركات البحث (غوغل) وعند مشاركة الرابط في واتساب وفيسبوك وتويتر.
        </p>
      </div>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <SeoForm country={country} seo={seo} redirect={`/admin/settings/seo?country=${country}`} />
      </div>
    </div>
  );
}
