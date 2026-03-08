"use client";

import { useState } from "react";
import { updateSiteSettingsFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { SubmitButton, inputBase, labelClass } from "./AdminFormShared";

function LogoPreview({ src }: { src: string }) {
  if (!src?.trim()) return null;
  return (
    <div className="mt-1.5 flex min-h-[60px] items-center justify-center rounded-md border border-border bg-muted/40 p-2">
      <img
        src={src}
        alt=""
        className="max-h-20 max-w-full object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
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
    <form action={updateSiteSettingsFormData} className="flex flex-col gap-4">
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
      <SubmitButton>حفظ</SubmitButton>
    </form>
  );
}
