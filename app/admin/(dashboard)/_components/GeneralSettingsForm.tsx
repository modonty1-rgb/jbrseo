"use client";

import { useState, type ReactElement } from "react";
import { updateSiteSettingsFormData } from "@/app/actions/landing";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/lib/utils";

const GENERAL_FORM_ID = "general-settings-form";

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

function isValidWhatsappDigits(val: string): boolean {
  if (!val.trim()) return true;
  return /^\+?[0-9]{10,15}$/.test(val.trim());
}

export function GeneralSettingsForm({
  site,
  redirect,
}: {
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
      <form id={GENERAL_FORM_ID} action={updateSiteSettingsFormData} className="space-y-5">
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <div className={FIELD}>
          <label htmlFor="whatsappNumber" className={LABEL}>رقم واتساب</label>
          <Input
            id="whatsappNumber"
            type="text"
            name="whatsappNumber"
            value={waVal}
            onChange={(e) => setWaVal(e.target.value)}
            placeholder="966500000000"
            dir="ltr"
            className={cn(
              INPUT,
              "font-mono",
              waVal.trim() !== "" && !waOk && "border-destructive focus-visible:ring-destructive",
            )}
          />
        </div>

        <Button type="button" onClick={handleSave} disabled={!waOk}>
          حفظ
        </Button>
      </form>
    </>
  );
}
