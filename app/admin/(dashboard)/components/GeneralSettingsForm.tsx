"use client";

import { useState, type ReactElement } from "react";
import { updateSiteSettingsFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { cn } from "@/lib/utils";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const GENERAL_FORM_ID = "general-settings-form";

function isValidWhatsappDigits(val: string): boolean {
  if (!val.trim()) return true;
  return /^\+?[0-9]{10,15}$/.test(val.trim());
}

export function GeneralSettingsForm({
  country,
  site,
  redirect,
}: {
  country: SupportedCountry;
  site: { showSectionCounter: boolean; whatsappNumber?: string };
  redirect?: string;
}): ReactElement {
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
                الرقم يجب أن يحتوي أرقاماً فقط (١٠–١٥ رقماً) — مثال: 966554113107 أو +966554113107
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
