"use client";

import { useMemo, useState, type ReactElement } from "react";
import { updateSocialLinksFormData } from "@/app/actions/landing";
import type { SocialLinks, SupportedCountry } from "@/lib/landing-content.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const SOCIAL_FORM_ID = "social-links-form";

type SocialField = {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
};

const FIELDS: SocialField[] = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/..." },
  { key: "twitterX", label: "X (Twitter)", placeholder: "https://x.com/..." },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@..." },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { key: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/..." },
];

export function SocialLinksForm({
  country,
  socialLinks,
  redirect,
}: {
  country: SupportedCountry;
  socialLinks: SocialLinks;
  redirect?: string;
}): ReactElement {
  const [values, setValues] = useState<Record<keyof SocialLinks, string>>({
    facebook: socialLinks.facebook ?? "",
    instagram: socialLinks.instagram ?? "",
    linkedin: socialLinks.linkedin ?? "",
    twitterX: socialLinks.twitterX ?? "",
    youtube: socialLinks.youtube ?? "",
    tiktok: socialLinks.tiktok ?? "",
    snapchat: socialLinks.snapchat ?? "",
  });

  const activeCount = useMemo(
    () => Object.values(values).filter((v) => v.trim().length > 0).length,
    [values],
  );

  function handleSave(): void {
    const el = document.getElementById(SOCIAL_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <span className="text-base" aria-hidden>
            📱
          </span>
          <h2 className="text-sm font-semibold text-foreground">روابط السوشال ميديا</h2>
          <span className="ms-auto text-xs text-muted-foreground">{activeCount}/7 روابط مفعّلة</span>
        </div>

        <form id={SOCIAL_FORM_ID} action={updateSocialLinksFormData} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input type="hidden" name="country" value={country} />
          {redirect ? <input type="hidden" name="redirect" value={redirect} /> : null}

          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <Label htmlFor={`social-${field.key}`} className="text-xs font-medium text-muted-foreground">
                {field.label}
              </Label>
              <Input
                id={`social-${field.key}`}
                name={field.key}
                type="url"
                dir="ltr"
                value={values[field.key] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="font-mono text-xs"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <Button type="button" className="w-full sm:w-auto" onClick={handleSave}>
              حفظ روابط السوشال
            </Button>
          </div>
        </form>
      </div>

      <UnsavedChangesBar
        formId={SOCIAL_FORM_ID}
        message="تغييرات غير محفوظة في روابط السوشال"
        className="bottom-20"
      />
    </>
  );
}
