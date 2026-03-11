"use client";

import { updateTrackingFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { inputBase, labelClass } from "./AdminFormShared";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

const TRACKING_FIELDS = [
  { key: "gtmId" as const, label: "Google Tag Manager ID", placeholder: "GTM-XXXXXX" },
  { key: "hotjarId" as const, label: "Hotjar site ID", placeholder: "1234567" },
  { key: "fbPixelId" as const, label: "Facebook Pixel ID", placeholder: "123456789012345" },
] as const;

export function TrackingForm({
  country,
  tracking,
  redirect,
}: {
  country: SupportedCountry;
  tracking: SiteSettingsJson["tracking"];
  redirect?: string;
}) {
  return (
    <form id="tracking-form" action={updateTrackingFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TRACKING_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor={`tracking-${key}`}>
              {label}
            </label>
            <input
              id={`tracking-${key}`}
              type="text"
              name={key}
              defaultValue={tracking[key]}
              placeholder={placeholder}
              className={inputBase}
              dir="ltr"
            />
          </div>
        ))}
      </div>
      <ConfirmSaveDialog
        formId="tracking-form"
        triggerLabel="حفظ التتبع"
        description="سيتم حفظ إعدادات التتبع (GTM, Hotjar, Facebook Pixel) الحالية. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
