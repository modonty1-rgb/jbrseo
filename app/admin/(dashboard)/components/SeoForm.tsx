"use client";

import { useState, type ReactElement } from "react";
import { updateSeoFormData } from "@/app/actions/landing";
import { META_DESCRIPTION_MAX_CHARS } from "@/lib/seo-meta";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const SEO_FORM_ID = "seo-form";

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

export function SeoForm({
  seo,
  redirect,
}: {
  seo: SiteSettingsJson["seo"];
  redirect?: string;
}): ReactElement {
  const [titleVal, setTitleVal] = useState(seo.title);
  const [descVal, setDescVal] = useState(seo.description);
  const [canonicalVal, setCanonicalVal] = useState(seo.canonical);
  const [ogImageVal, setOgImageVal] = useState(seo.ogImage);

  function handleSaveClick(): void {
    const el = document.getElementById(SEO_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <form id={SEO_FORM_ID} action={updateSeoFormData} className="space-y-5">
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label htmlFor="seo-title" className={LABEL}>عنوان الصفحة</label>
            <Input
              id="seo-title"
              type="text"
              name="title"
              value={titleVal}
              onChange={(e) => setTitleVal(e.target.value)}
              dir="ltr"
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label htmlFor="seo-canonical" className={LABEL}>الرابط الرسمي</label>
            <Input
              id="seo-canonical"
              type="url"
              name="canonical"
              value={canonicalVal}
              onChange={(e) => setCanonicalVal(e.target.value)}
              placeholder="https://..."
              dir="ltr"
              className={`${INPUT} font-mono text-xs`}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label htmlFor="seo-description" className={LABEL}>الوصف</label>
            <Textarea
              id="seo-description"
              name="description"
              value={descVal}
              onChange={(e) => setDescVal(e.target.value)}
              maxLength={META_DESCRIPTION_MAX_CHARS}
              rows={3}
              dir="ltr"
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label htmlFor="seo-ogImage" className={LABEL}>صورة المشاركة</label>
            <Input
              id="seo-ogImage"
              type="url"
              name="ogImage"
              value={ogImageVal}
              onChange={(e) => setOgImageVal(e.target.value)}
              placeholder="https://..."
              dir="ltr"
              className={`${INPUT} font-mono text-xs`}
            />
          </div>
        </div>

        <Button type="button" onClick={handleSaveClick}>
          حفظ
        </Button>
      </form>
      <UnsavedChangesBar formId={SEO_FORM_ID} />
    </>
  );
}
