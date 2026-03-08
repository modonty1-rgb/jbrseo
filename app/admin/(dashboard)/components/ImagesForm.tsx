"use client";

import { useState } from "react";
import { updateImagesFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { SubmitButton, inputBase, labelClass } from "./AdminFormShared";

const IMAGE_KEY_LABELS: Record<string, string> = {
  contactAvatar: "صورة الهيرو",
  sectionHero: "صورة قسم الهيرو",
  sectionWhyNow: "صورة قسم لماذا الآن",
  sectionHowItWorks: "صورة قسم كيف نعمل",
  sectionOutcomes: "صورة قسم النتائج",
  sectionSocialProof: "صورة قسم الشهادات",
  sectionFaq: "صورة قسم الأسئلة",
  sectionFinalCta: "صورة قسم الدعوة النهائية",
};

function ImagePreview({ src }: { src: string }) {
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

export function ImagesForm({
  country,
  images,
  redirect,
}: {
  country: SupportedCountry;
  images: { key: string; url: string }[];
  redirect?: string;
}) {
  const [urls, setUrls] = useState<Record<string, string>>(() =>
    Object.fromEntries(images.map((i) => [i.key, i.url ?? ""]))
  );

  return (
    <form action={updateImagesFormData} className="flex flex-col gap-3">
      <input type="hidden" name="country" value={country} />
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <input type="hidden" name="keys" value={JSON.stringify(images.map((i) => i.key))} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map(({ key }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor={`img-${key}`}>
              {IMAGE_KEY_LABELS[key] ?? key}
            </label>
            <input
              id={`img-${key}`}
              type="url"
              name={`u_${key}`}
              value={urls[key] ?? ""}
              onChange={(e) => setUrls((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder="https://..."
              className={inputBase}
              dir="ltr"
            />
            <ImagePreview src={urls[key] ?? ""} />
          </div>
        ))}
      </div>
      <SubmitButton>حفظ الصور</SubmitButton>
    </form>
  );
}
