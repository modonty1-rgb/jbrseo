"use client";

import { updateSeoFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { inputBase, labelClass } from "./AdminFormShared";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

const SEO_FIELDS: {
  key: string;
  label: string;
  hint: string;
  type?: "text" | "url";
  placeholder?: string;
}[] = [
  { key: "title", label: "Meta title", hint: "العنوان الذي يظهر في نتائج غوغل عند البحث عن موقعك" },
  { key: "description", label: "Meta description", hint: "جملة قصيرة تظهر تحت العنوان في نتائج البحث وتلخص محتوى الصفحة", type: "text" },
  { key: "canonical", label: "Canonical URL", hint: "رابط الصفحة الرسمي (اتركه فارغاً أو ضع رابط الصفحة الأساسي)", type: "url", placeholder: "https://..." },
  { key: "ogLocale", label: "OG locale", hint: "لغة الصفحة: ar_SA للسعودية، ar_EG لمصر", placeholder: "ar_SA" },
  { key: "ogTitle", label: "OG title", hint: "العنوان الذي يظهر عند مشاركة الرابط في واتساب أو فيسبوك" },
  { key: "ogDescription", label: "OG description", hint: "الوصف الذي يظهر عند مشاركة الرابط في واتساب أو فيسبوك", type: "text" },
  { key: "ogImage", label: "OG image URL", hint: "رابط صورة تظهر عند مشاركة الرابط (مثلاً في واتساب أو فيسبوك)", type: "url", placeholder: "https://..." },
  { key: "ogImageWidth", label: "OG image width", hint: "عرض الصورة بالبكسل (مثلاً 1200)", placeholder: "1200" },
  { key: "ogImageHeight", label: "OG image height", hint: "ارتفاع الصورة بالبكسل (مثلاً 630)", placeholder: "630" },
  { key: "ogType", label: "OG type", hint: "نوع الصفحة، عادةً website للموقع", placeholder: "website" },
  { key: "ogSiteName", label: "OG site name", hint: "اسم الموقع كما يظهر عند المشاركة", placeholder: "JBRSEO" },
  { key: "twitterCard", label: "Twitter card", hint: "شكل البطاقة في تويتر (مثلاً summary_large_image لصورة كبيرة)", placeholder: "summary_large_image" },
  { key: "twitterTitle", label: "Twitter title", hint: "العنوان عند مشاركة الرابط في تويتر" },
  { key: "twitterDescription", label: "Twitter description", hint: "الوصف عند مشاركة الرابط في تويتر", type: "text" },
  { key: "twitterImage", label: "Twitter image URL", hint: "رابط صورة تظهر عند مشاركة الرابط في تويتر", type: "url", placeholder: "https://..." },
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
        {SEO_FIELDS.map(({ key, label, hint, type = "text", placeholder }) => (
          <div
            key={key}
            className={
              type === "text" && (key === "description" || key === "ogDescription" || key === "twitterDescription")
                ? "col-span-2 flex flex-col gap-1.5"
                : "flex flex-col gap-1.5"
            }
          >
            <div className="flex flex-row items-center justify-between gap-2">
              <label className={labelClass} htmlFor={`seo-${key}`}>
                {label}
              </label>
              <span className="text-xs text-muted-foreground" role="note">
                {hint}
              </span>
            </div>
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
