"use client";

import Image from "next/image";
import { useState } from "react";
import { updateSiteSettingsFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { inputBase, labelClass } from "./AdminFormShared";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

function LogoPreview({ src }: { src: string }) {
  const [imageError, setImageError] = useState(false);
  if (!src?.trim()) return null;
  return (
    <div className="relative mt-1.5 h-[60px] w-full overflow-hidden rounded-md border border-border bg-muted/40 p-2">
      {!imageError && (
        <Image
          src={src}
          alt=""
          fill
          className="object-contain"
          sizes="160px"
          unoptimized
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

export function GeneralForm({
  country,
  site,
  globalLogoWhite,
  globalLogoLight,
  redirect,
}: {
  country: SupportedCountry;
  site: SiteSettingsJson["site"];
  globalLogoWhite: string;
  globalLogoLight: string;
  redirect?: string;
}) {
  const [logoWhite, setLogoWhite] = useState(globalLogoWhite);
  const [logoLight, setLogoLight] = useState(globalLogoLight);

  return (
    <form
      id="general-settings-form"
      action={updateSiteSettingsFormData}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="country" value={country} />
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="global-logoWhite">
          شعار الوضع الداكن (موحّد لجميع البلدان)
        </label>
        <input
          id="global-logoWhite"
          type="url"
          name="logoWhite"
          value={logoWhite}
          onChange={(e) => setLogoWhite(e.target.value)}
          placeholder="https://..."
          className={inputBase}
          dir="ltr"
        />
        <LogoPreview src={logoWhite} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="global-logoLight">
          شعار الوضع الفاتح (موحّد لجميع البلدان)
        </label>
        <input
          id="global-logoLight"
          type="url"
          name="logoLight"
          value={logoLight}
          onChange={(e) => setLogoLight(e.target.value)}
          placeholder="https://..."
          className={inputBase}
          dir="ltr"
        />
        <LogoPreview src={logoLight} />
      </div>
      <div className="border-t border-border pt-4">
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
      <div className="border-t border-border pt-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="showSectionCounter"
            value="true"
            defaultChecked={site.showSectionCounter}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm text-foreground">إظهار عدادات الأقسام في الموقع (للمرجعية)</span>
        </label>
        <p className="mt-1 text-xs text-muted-foreground">إلغاء التحديد والحفظ لإخفاء العدادات من الموقع.</p>
      </div>
      <ConfirmSaveDialog
        formId="general-settings-form"
        triggerLabel="حفظ الإعدادات العامة"
        description="سيتم حفظ الإعدادات العامة للموقع (الشعار الرئيسي ونص زر الدعوة والإعدادات المرتبطة). هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
