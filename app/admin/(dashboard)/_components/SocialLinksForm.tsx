"use client";

import { useState, type ReactElement } from "react";
import { updateSocialLinksFormData } from "@/app/actions/landing";
import type { SocialLinks } from "@/lib/landing-content.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const SOCIAL_FORM_ID = "social-links-form";

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

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
  socialLinks,
  redirect,
}: {
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

  function handleSave(): void {
    const el = document.getElementById(SOCIAL_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <form id={SOCIAL_FORM_ID} action={updateSocialLinksFormData} className="space-y-5">
        {redirect ? <input type="hidden" name="redirect" value={redirect} /> : null}

        <div className="grid gap-4 md:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.key} className={FIELD}>
              <label htmlFor={`social-${field.key}`} className={LABEL}>{field.label}</label>
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
                className={`${INPUT} font-mono text-xs`}
              />
            </div>
          ))}
        </div>

        <Button type="button" onClick={handleSave}>
          حفظ
        </Button>
      </form>

      <UnsavedChangesBar
        formId={SOCIAL_FORM_ID}
        message="تغييرات غير محفوظة في روابط السوشال"
        className="bottom-20"
      />
    </>
  );
}
