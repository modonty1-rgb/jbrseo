"use client";

import { updateSiteSettingsFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { inputBase, labelClass } from "./AdminFormShared";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

export function GeneralForm({
  country,
  site,
  redirect,
}: {
  country: SupportedCountry;
  site: SiteSettingsJson["site"];
  redirect?: string;
}) {
  return (
    <form
      id="general-settings-form"
      action={updateSiteSettingsFormData}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="country" value={country} />
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="ctaLabel">
          نص زر الدعوة الرئيسي
        </label>
        <input
          id="ctaLabel"
          type="text"
          name="ctaLabel"
          defaultValue={site.ctaLabel ?? "ابدأ مجاناً — بدون بطاقة"}
          placeholder="ابدأ مجاناً — بدون بطاقة"
          className={inputBase}
          dir="rtl"
        />
        <p className="mt-1 text-xs text-muted-foreground">يُستخدم في الهيدر، البطل، وأزرار الدعوة في كل الأقسام.</p>
      </div>
      <div className="flex flex-col gap-1.5 border-t border-border pt-4">
        <label className={labelClass} htmlFor="whatsappNumber">
          رقم واتساب (اختياري)
        </label>
        <input
          id="whatsappNumber"
          type="text"
          name="whatsappNumber"
          defaultValue={site.whatsappNumber ?? ""}
          placeholder="966500000000 أو 201000000000"
          className={inputBase}
          dir="ltr"
        />
        <p className="mt-1 text-xs text-muted-foreground">يُستخدم في روابط واتساب في الموقع. اتركه فارغاً لاستخدام الرقم الافتراضي.</p>
      </div>
      <ConfirmSaveDialog
        formId="general-settings-form"
        triggerLabel="حفظ الإعدادات العامة"
        description="سيتم حفظ الإعدادات العامة للموقع (نص زر الدعوة والإعدادات المرتبطة). هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
