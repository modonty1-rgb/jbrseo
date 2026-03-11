"use client";

import { updateSeoFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { inputBase, labelClass } from "./AdminFormShared";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

const SEO_FIELDS: { key: string; label: string; type?: "text" | "url"; placeholder?: string }[] = [
  { key: "title", label: "Meta title" },
  { key: "description", label: "Meta description", type: "text" },
  { key: "canonical", label: "Canonical URL", type: "url", placeholder: "https://..." },
  { key: "ogLocale", label: "OG locale", placeholder: "ar_SA" },
  { key: "ogTitle", label: "OG title" },
  { key: "ogDescription", label: "OG description", type: "text" },
  { key: "ogImage", label: "OG image URL", type: "url", placeholder: "https://..." },
  { key: "ogImageWidth", label: "OG image width", placeholder: "1200" },
  { key: "ogImageHeight", label: "OG image height", placeholder: "630" },
  { key: "ogType", label: "OG type", placeholder: "website" },
  { key: "ogSiteName", label: "OG site name", placeholder: "JBRSEO" },
  { key: "twitterCard", label: "Twitter card", placeholder: "summary_large_image" },
  { key: "twitterTitle", label: "Twitter title" },
  { key: "twitterDescription", label: "Twitter description", type: "text" },
  { key: "twitterImage", label: "Twitter image URL", type: "url", placeholder: "https://..." },
];

export function SeoForm({
  country,
  seo,
  redirect,
}: {
  country: SupportedCountry;
  seo: SiteSettingsJson["seo"];
  redirect?: string;
}) {
  const get = (key: string) => (seo as Record<string, string>)[key] ?? "";
  return (
    <form id="seo-form" action={updateSeoFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SEO_FIELDS.map(({ key, label, type = "text", placeholder }) => (
          <div
            key={key}
            className={
              type === "text" && (key === "description" || key === "ogDescription" || key === "twitterDescription")
                ? "col-span-2 flex flex-col gap-1.5"
                : "flex flex-col gap-1.5"
            }
          >
            <label className={labelClass} htmlFor={`seo-${key}`}>
              {label}
            </label>
            {key === "description" || key === "ogDescription" || key === "twitterDescription" ? (
              <textarea
                id={`seo-${key}`}
                name={key}
                defaultValue={get(key)}
                rows={2}
                className={inputBase}
                placeholder={placeholder}
                dir="ltr"
              />
            ) : (
              <input
                id={`seo-${key}`}
                type={type}
                name={key}
                defaultValue={get(key)}
                className={inputBase}
                placeholder={placeholder}
                dir="ltr"
              />
            )}
          </div>
        ))}
      </div>
      <ConfirmSaveDialog
        formId="seo-form"
        triggerLabel="حفظ SEO وبطاقات التواصل"
        description="سيتم حفظ إعدادات SEO وبطاقات التواصل الحالية. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
