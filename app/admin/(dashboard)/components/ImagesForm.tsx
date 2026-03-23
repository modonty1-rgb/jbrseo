"use client";

import Image from "next/image";
import { useState } from "react";
import { updateImagesFormData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ConfirmSaveDialog } from "./ConfirmSaveDialog";

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

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  if (!src?.trim()) return null;
  return (
    <div className="relative mt-2 h-[72px] w-full overflow-hidden rounded-lg border border-border bg-muted/30 p-3">
      {!imageError && (
        <Image
          src={src}
          alt={alt?.trim() || "معاينة الصورة"}
          fill
          className="object-contain"
          sizes="160px"
          unoptimized
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}

export function ImagesForm({
  country,
  images,
  redirect,
}: {
  country: SupportedCountry;
  images: { key: string; url: string; alt: string }[];
  redirect?: string;
}) {
  const [urls, setUrls] = useState<Record<string, string>>(() =>
    Object.fromEntries(images.map((i) => [i.key, i.url ?? ""]))
  );
  const [alts, setAlts] = useState<Record<string, string>>(() =>
    Object.fromEntries(images.map((i) => [i.key, i.alt ?? ""]))
  );

  return (
    <form id="images-form" action={updateImagesFormData} className="flex flex-col gap-6">
      <input type="hidden" name="country" value={country} />
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <input type="hidden" name="keys" value={JSON.stringify(images.map((i) => i.key))} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {images.map(({ key }) => (
          <Card
            key={key}
            className="border-border/60 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">
                {IMAGE_KEY_LABELS[key] ?? key}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              <div>
                <Label htmlFor={`u-${key}`} className="text-xs font-medium text-muted-foreground">
                  رابط الصورة
                </Label>
                <Input
                  id={`u-${key}`}
                  type="url"
                  name={`u_${key}`}
                  value={urls[key] ?? ""}
                  onChange={(e) => setUrls((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder="https://..."
                  dir="ltr"
                  className="mt-1"
                  aria-describedby={urls[key] ? undefined : `preview-${key}`}
                />
              </div>
              <div>
                <Label htmlFor={`a-${key}`} className="text-xs font-medium text-muted-foreground">
                  نص بديل (للوصولية)
                </Label>
                <Input
                  id={`a-${key}`}
                  type="text"
                  name={`a_${key}`}
                  value={alts[key] ?? ""}
                  onChange={(e) => setAlts((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder="وصف مختصر للصورة"
                  dir="rtl"
                  className="mt-1"
                />
              </div>
              <ImagePreview src={urls[key] ?? ""} alt={alts[key] ?? ""} />
            </CardContent>
          </Card>
        ))}
      </div>
      <ConfirmSaveDialog
        formId="images-form"
        triggerLabel="حفظ الصور"
        description="سيتم حفظ روابط الصور والنصوص البديلة الحالية. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
