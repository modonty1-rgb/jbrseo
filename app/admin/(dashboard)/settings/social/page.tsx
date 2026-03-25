import { Suspense } from "react";
import { getSocialLinksSettings } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";
import { SocialLinksForm } from "../../components/SocialLinksForm";

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminSettingsSocialPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const socialLinks = await getSocialLinksSettings(country);
  const redirect = `/admin/settings/social?country=${country}`;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">السوشال ميديا</h1>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
          البلد: {country === "SA" ? "السعودية" : "مصر"}
        </span>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>

      <p className="mb-5 text-sm text-muted-foreground">
        أدخل روابط منصات التواصل لهذا البلد فقط. أي حقل فارغ لن يظهر كأيقونة في الموقع العام.
      </p>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>

      <SocialLinksForm country={country} socialLinks={socialLinks} redirect={redirect} />
    </div>
  );
}
