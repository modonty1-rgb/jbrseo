"use client";

import { useState } from "react";
import { updateSeoFormData } from "@/app/actions/landing";
import { META_DESCRIPTION_MAX_CHARS } from "@/lib/seo-meta";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

export function SeoForm({
  country,
  seo,
  redirect,
}: {
  country: SupportedCountry;
  seo: SiteSettingsJson["seo"];
  redirect?: string;
}): React.JSX.Element {
  const [descLen, setDescLen] = useState(seo.description.length);

  return (
    <form id="seo-form" action={updateSeoFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-row items-center justify-between gap-2">
            <Label htmlFor="seo-title" className="text-xs font-medium text-muted-foreground">
              العنوان
            </Label>
            <span className="text-xs text-muted-foreground" role="note">
              العنوان في نتائج البحث ومشاركات التواصل
            </span>
          </div>
          <Input
            id="seo-title"
            type="text"
            name="title"
            defaultValue={seo.title}
            dir="ltr"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-row items-center justify-between gap-2">
            <Label htmlFor="seo-canonical" className="text-xs font-medium text-muted-foreground">
              Canonical URL
            </Label>
            <span className="text-xs text-muted-foreground" role="note">
              رابط الصفحة الرسمي (اتركه فارغاً أو ضع رابط الصفحة الأساسي)
            </span>
          </div>
          <Input
            id="seo-canonical"
            type="url"
            name="canonical"
            defaultValue={seo.canonical}
            placeholder="https://..."
            dir="ltr"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <div className="flex flex-row items-center justify-between gap-2">
            <Label htmlFor="seo-description" className="text-xs font-medium text-muted-foreground">
              الوصف
            </Label>
            <span className="text-xs text-muted-foreground" role="note">
              الوصف في نتائج البحث — حتى {META_DESCRIPTION_MAX_CHARS} حرفاً
            </span>
          </div>
          <Textarea
            id="seo-description"
            name="description"
            defaultValue={seo.description}
            rows={2}
            dir="ltr"
            maxLength={META_DESCRIPTION_MAX_CHARS}
            onChange={(e) => setDescLen(e.target.value.length)}
            aria-describedby="seo-description-hint"
          />
          <p id="seo-description-hint" className="text-xs text-muted-foreground">
            {descLen}/{META_DESCRIPTION_MAX_CHARS}
          </p>
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <div className="flex flex-row items-center justify-between gap-2">
            <Label htmlFor="seo-ogImage" className="text-xs font-medium text-muted-foreground">
              صورة المشاركة
            </Label>
            <span className="text-xs text-muted-foreground" role="note">
              صورة تظهر عند مشاركة الرابط في واتساب وتويتر وفيسبوك
            </span>
          </div>
          <Input
            id="seo-ogImage"
            type="url"
            name="ogImage"
            defaultValue={seo.ogImage}
            placeholder="https://..."
            dir="ltr"
          />
        </div>
      </div>
      <ConfirmSaveDialog
        formId="seo-form"
        triggerLabel="حفظ SEO وبطاقات التواصل"
        description="سيتم حفظ إعدادات SEO وبطاقات التواصل الحالية. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
