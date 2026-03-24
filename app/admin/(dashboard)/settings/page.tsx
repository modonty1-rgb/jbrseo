import { Suspense } from "react";
import { getGlobalSiteSettings } from "@/app/actions/landing";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { GeneralSettingsForm } from "../components/GeneralSettingsForm";
import { TrackingForm } from "../components/TrackingForm";
import { AdminCountryPill } from "../components/AdminCountryPill";
import { AdminFormFeedback } from "../components/AdminFormFeedback";

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const [globalRow, ctaLabelOverride] = await Promise.all([
    getGlobalSiteSettings(),
    getLandingSectionOverride(country, "ctaLabel"),
  ]);
  const ctaLabel =
    (ctaLabelOverride && typeof ctaLabelOverride === "object" && "ctaLabel" in ctaLabelOverride && typeof (ctaLabelOverride as { ctaLabel?: string }).ctaLabel === "string"
      ? (ctaLabelOverride as { ctaLabel: string }).ctaLabel
      : null) ?? "ابدأ مجاناً — بدون بطاقة";
  const redirect = `/admin/settings?country=${country}`;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">الإعدادات</h1>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
          البلد: {country === "SA" ? "السعودية" : "مصر"}
        </span>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        إعدادات عامة للموقع مثل نص زر الدعوة ورقم التواصل، بالإضافة لرموز التتبع والتحليلات.
      </p>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>

      <div className="space-y-6">
        <GeneralSettingsForm
          country={country}
          site={{ showSectionCounter: false, ctaLabel, whatsappNumber: globalRow?.whatsappNumber ?? "" }}
          redirect={redirect}
        />
        <TrackingForm
          country={country}
          tracking={{
            gtmId: globalRow?.gtmId ?? "",
            hotjarId: globalRow?.hotjarId ?? "",
            fbPixelId: globalRow?.fbPixelId ?? "",
          }}
          redirect={redirect}
        />
      </div>
    </div>
  );
}
