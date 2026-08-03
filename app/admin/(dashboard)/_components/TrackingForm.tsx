"use client";

import { useState, type ReactElement } from "react";
import { updateTrackingFormData } from "@/app/actions/landing";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const TRACKING_FORM_ID = "tracking-form";

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

export function TrackingForm({
  tracking,
  redirect,
}: {
  tracking: SiteSettingsJson["tracking"];
  redirect?: string;
}): ReactElement {
  const [gtmId, setGtmId] = useState(tracking.gtmId ?? "");

  function handleSave(): void {
    const el = document.getElementById(TRACKING_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <form id={TRACKING_FORM_ID} action={updateTrackingFormData} className="space-y-5">
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <div className={FIELD}>
          <label htmlFor="tracking-gtmId" className={LABEL}>Google Tag Manager ID</label>
          <Input
            id="tracking-gtmId"
            type="text"
            name="gtmId"
            value={gtmId}
            onChange={(e) => setGtmId(e.target.value)}
            dir="ltr"
            className={`${INPUT} font-mono`}
          />
        </div>

        <Button type="button" onClick={handleSave}>
          حفظ
        </Button>
      </form>
    </>
  );
}
