"use client";

import { useEffect, useState, type ReactElement } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { updateSeoFormData } from "@/app/actions/landing";
import { META_DESCRIPTION_MAX_CHARS } from "@/lib/seo-meta";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { SiteSettingsJson } from "@/lib/site-settings.types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UnsavedChangesBar } from "./UnsavedChangesBar";

const SEO_FORM_ID = "seo-form";

function isValidHttpUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function serpDisplayUrl(canonical: string): string {
  if (!isValidHttpUrl(canonical)) return "example.com › …";
  try {
    const u = new URL(canonical.trim());
    const path = u.pathname + u.search;
    const tail = path.length > 48 ? `${path.slice(0, 48)}…` : path;
    return `${u.hostname}${tail || ""}`;
  } catch {
    return "example.com › …";
  }
}

export function SeoForm({
  country,
  seo,
  redirect,
}: {
  country: SupportedCountry;
  seo: SiteSettingsJson["seo"];
  redirect?: string;
}): ReactElement {
  const [titleVal, setTitleVal] = useState(seo.title);
  const [descVal, setDescVal] = useState(seo.description);
  const [canonicalVal, setCanonicalVal] = useState(seo.canonical);
  const [ogImageVal, setOgImageVal] = useState(seo.ogImage);
  const [ogImageError, setOgImageError] = useState(false);

  useEffect(() => {
    setOgImageError(false);
  }, [ogImageVal]);

  const titleLen = titleVal.length;
  const titleColor =
    titleLen === 0
      ? "text-muted-foreground"
      : titleLen < 30
        ? "text-yellow-500"
        : titleLen <= 60
          ? "text-green-500"
          : "text-destructive";

  const descLen = descVal.length;
  const descColor =
    descLen === 0
      ? "text-muted-foreground"
      : descLen <= 120
        ? "text-yellow-500"
        : descLen <= META_DESCRIPTION_MAX_CHARS
          ? "text-green-500"
          : "text-destructive";

  const canonicalOk = canonicalVal.trim() === "" || isValidHttpUrl(canonicalVal);
  const ogUrlOk = ogImageVal.trim() === "" || isValidHttpUrl(ogImageVal);
  const showOgPreview = isValidHttpUrl(ogImageVal) && !ogImageError;

  function handleSaveClick(): void {
    const el = document.getElementById(SEO_FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  return (
    <>
      <form id={SEO_FORM_ID} action={updateSeoFormData} className="flex flex-col gap-4">
        <input type="hidden" name="country" value={country} />
        {redirect && <input type="hidden" name="redirect" value={redirect} />}

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-base" aria-hidden>
              🔍
            </span>
            <h2 className="text-sm font-semibold text-foreground">محركات البحث</h2>
            <span className="text-xs text-muted-foreground">Google — نتائج البحث</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seo-title" className="text-sm font-medium text-foreground">
                عنوان الصفحة (Title)
              </Label>
              <Input
                id="seo-title"
                type="text"
                name="title"
                value={titleVal}
                onChange={(e) => setTitleVal(e.target.value)}
                dir="ltr"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              />
              <p className={cn("text-xs", titleColor)}>
                {titleLen}/60 حرف
                {titleLen > 0 &&
                  titleLen < 30 &&
                  " — قصير جداً"}
                {titleLen >= 30 && titleLen <= 60 && " ✓ مثالي"}
                {titleLen > 60 && " — طويل جداً"}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Label htmlFor="seo-canonical" className="text-sm font-medium text-foreground">
                  الرابط الرسمي (Canonical)
                </Label>
                <span
                  className="cursor-help text-[10px] text-muted-foreground"
                  title="يُفضّل رابط الصفحة الرئيسية الكامل بـ https. اتركه فارغاً إن لم تحتج توحيداً."
                >
                  (اختياري — للخبراء)
                </span>
              </div>
              <div className="relative">
                <Input
                  id="seo-canonical"
                  type="url"
                  name="canonical"
                  value={canonicalVal}
                  onChange={(e) => setCanonicalVal(e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="pe-9"
                />
                <span className="pointer-events-none absolute end-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center">
                  {canonicalVal.trim() === "" ? null : canonicalOk ? (
                    <Check className="size-4 text-emerald-500" aria-hidden />
                  ) : (
                    <X className="size-4 text-destructive" aria-hidden />
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seo-description" className="text-sm font-medium text-foreground">
                الوصف (Meta Description)
              </Label>
              <Textarea
                id="seo-description"
                name="description"
                value={descVal}
                onChange={(e) => setDescVal(e.target.value)}
                maxLength={META_DESCRIPTION_MAX_CHARS}
                rows={3}
                dir="ltr"
                className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                aria-describedby="seo-description-hint"
              />
              <p id="seo-description-hint" className={cn("text-xs text-end", descColor)}>
                {descLen}/{META_DESCRIPTION_MAX_CHARS} حرف
              </p>
            </div>

            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="mb-2 text-[10px] font-semibold text-muted-foreground">معاينة نتيجة البحث</p>
              <div
                className="rounded-md border border-border bg-white p-3 text-start shadow-sm dark:bg-zinc-950"
                dir="ltr"
              >
                <p className="line-clamp-2 text-base leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
                  {titleVal.trim() || "عنوان الصفحة في غوغل"}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#006621] dark:text-emerald-600/90">
                  {serpDisplayUrl(canonicalVal)}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-[#4d5156] dark:text-zinc-400">
                  {descVal.trim() || "وصف الصفحة كما يظهر تحت العنوان في نتائج البحث."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-base" aria-hidden>
              🔗
            </span>
            <h2 className="text-sm font-semibold text-foreground">بطاقات التواصل</h2>
            <span className="text-xs text-muted-foreground">واتساب — تويتر — فيسبوك</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seo-ogImage" className="text-sm font-medium text-foreground">
                صورة المشاركة (OG)
              </Label>
              <p className="text-[10px] text-muted-foreground">
                تظهر عند مشاركة الرابط — يُفضّل رابط Cloudinary بصيغة https
              </p>
              <div className="relative">
                <Input
                  id="seo-ogImage"
                  type="url"
                  name="ogImage"
                  value={ogImageVal}
                  onChange={(e) => setOgImageVal(e.target.value)}
                  placeholder="https://..."
                  dir="ltr"
                  className="pe-9 font-mono text-xs"
                />
                <span className="pointer-events-none absolute end-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center">
                  {ogImageVal.trim() === "" ? null : ogUrlOk ? (
                    <Check className="size-4 text-emerald-500" aria-hidden />
                  ) : (
                    <X className="size-4 text-destructive" aria-hidden />
                  )}
                </span>
              </div>
            </div>

            {showOgPreview ? (
              <div className="relative aspect-1200/630 w-full max-w-md overflow-hidden rounded-md border border-border bg-muted">
                <Image
                  src={ogImageVal.trim()}
                  alt=""
                  fill
                  className="object-contain"
                  onError={() => setOgImageError(true)}
                  sizes="(max-width: 28rem) 100vw, 28rem"
                />
              </div>
            ) : ogImageVal.trim() !== "" && ogUrlOk ? (
              <p className="text-[10px] text-muted-foreground">تعذّر تحميل المعاينة — تحقق من الرابط.</p>
            ) : null}
          </div>
        </div>

        <Button type="button" className="w-full sm:w-auto" onClick={handleSaveClick}>
          حفظ SEO وبطاقات التواصل
        </Button>
      </form>
      <UnsavedChangesBar formId={SEO_FORM_ID} />
    </>
  );
}
