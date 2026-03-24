"use client";

import { useState, type ReactElement } from "react";
import { updateSiteSettingsFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const GENERAL_FORM_ID = "general-settings-form";

function isValidWhatsappDigits(val: string): boolean {
  if (!val.trim()) return true;
  return /^[0-9]{10,15}$/.test(val.trim());
}

export function GeneralSettingsForm({
  country,
  site,
  redirect,
}: {
  country: SupportedCountry;
  site: SiteSettingsJson["site"];
  redirect?: string;
}): ReactElement {
  const [ctaVal, setCtaVal] = useState(site.ctaLabel ?? "ابدأ مجاناً — بدون بطاقة");
  const [waVal, setWaVal] = useState(site.whatsappNumber ?? "");

  const waOk = isValidWhatsappDigits(waVal);

  function handleSave(): void {
    if (!waOk) return;
    const el = document.getElementById(GENERAL_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <span className="text-base" aria-hidden>
            ⚙️
          </span>
          <h2 className="text-sm font-semibold text-foreground">عام</h2>
          <span className="ms-auto text-xs text-muted-foreground">مشترك في كل الصفحات</span>
        </div>

        <form id={GENERAL_FORM_ID} action={updateSiteSettingsFormData} className="flex flex-col gap-4">
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
              value={ctaVal}
              onChange={(e) => setCtaVal(e.target.value)}
              dir="rtl"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              يُستخدم في الهيدر، البطل، وأزرار الدعوة في كل الأقسام.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">معاينة:</span>
              <button
                type="button"
                tabIndex={-1}
                className="pointer-events-none inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow"
              >
                {ctaVal.trim() || "نص الزر…"}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">للمعاينة فقط — لا يُرسل أي إجراء.</p>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <Label htmlFor="whatsappNumber" className="text-xs font-medium text-muted-foreground">
              رقم واتساب (اختياري)
            </Label>
            <Input
              id="whatsappNumber"
              type="text"
              name="whatsappNumber"
              value={waVal}
              onChange={(e) => setWaVal(e.target.value)}
              placeholder="966500000000 أو 201000000000"
              dir="ltr"
              className={cn(
                "font-mono text-sm",
                waVal.trim() !== "" && !waOk && "border-destructive focus-visible:ring-destructive",
              )}
            />
            {waVal.trim() !== "" && !waOk ? (
              <p className="mt-1 text-xs text-destructive">
                الرقم يجب أن يحتوي أرقاماً فقط (١٠–١٥ رقماً) — مثال: 966554113107
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                يُستخدم في روابط واتساب. اتركه فارغاً أو عيّن المتغيرات في البيئة إن رغبت.
              </p>
            )}
          </div>

          <Button type="button" className="w-full sm:w-auto" onClick={handleSave} disabled={!waOk}>
            حفظ الإعدادات العامة
          </Button>
        </form>
      </div>

      <UnsavedChangesBar
        formId={GENERAL_FORM_ID}
        message="تغييرات غير محفوظة في الإعدادات العامة"
      />
    </>
  );
}
