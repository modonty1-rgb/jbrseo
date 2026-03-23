"use client";

import { updateSiteSettingsFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
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
        <Label htmlFor="ctaLabel" className="text-xs font-medium text-muted-foreground">
          نص زر الدعوة الرئيسي
        </Label>
        <Input
          id="ctaLabel"
          type="text"
          name="ctaLabel"
          defaultValue={site.ctaLabel ?? "ابدأ مجاناً — بدون بطاقة"}
          placeholder="ابدأ مجاناً — بدون بطاقة"
          dir="rtl"
        />
        <p className="mt-1 text-xs text-muted-foreground">يُستخدم في الهيدر، البطل، وأزرار الدعوة في كل الأقسام.</p>
      </div>
      <Separator className="my-1" />
      <div className="flex flex-col gap-1.5 pt-2">
        <Label htmlFor="whatsappNumber" className="text-xs font-medium text-muted-foreground">
          رقم واتساب (اختياري)
        </Label>
        <Input
          id="whatsappNumber"
          type="text"
          name="whatsappNumber"
          defaultValue={site.whatsappNumber ?? ""}
          placeholder="966500000000 أو 201000000000"
          dir="ltr"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          يُستخدم في روابط واتساب في الموقع. اتركه فارغاً أو عيّن{" "}
          <code className="rounded bg-muted px-1 text-[11px]">NEXT_PUBLIC_WHATSAPP_DEFAULT_SA</code> /{" "}
          <code className="rounded bg-muted px-1 text-[11px]">EG</code> في البيئة.
        </p>
      </div>
      <ConfirmSaveDialog
        formId="general-settings-form"
        triggerLabel="حفظ الإعدادات العامة"
        description="سيتم حفظ الإعدادات العامة للموقع (نص زر الدعوة والإعدادات المرتبطة). هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
