"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
} from "react";
import { updateHeaderFooterSections } from "@/app/actions/content-sections";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { cn } from "@/lib/utils";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const FORM_ID = "header-footer-form";

type HeaderFooterFormProps = {
  header: StaticLanding["header"];
  footer: StaticLanding["footer"];
  country: SupportedCountry;
};

function resizeTextareaElement(el: HTMLTextAreaElement): void {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export function HeaderFooterForm({
  header,
  footer,
  country,
}: HeaderFooterFormProps): ReactElement {
  const [bannerVal, setBannerVal] = useState(header.bannerText ?? "");
  const [taglineVal, setTaglineVal] = useState(footer.tagline);
  const [descVal, setDescVal] = useState(footer.desc);

  const taglineRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (taglineRef.current) resizeTextareaElement(taglineRef.current);
    if (descRef.current) resizeTextareaElement(descRef.current);
  }, []);

  async function onSubmit(formData: FormData): Promise<void> {
    await updateHeaderFooterSections(formData);
  }

  function handleSave(): void {
    const el = document.getElementById(FORM_ID);
    if (el instanceof HTMLFormElement) el.requestSubmit();
  }

  function handleTaglineInput(e: FormEvent<HTMLTextAreaElement>): void {
    autoResize(e);
  }

  function handleDescInput(e: FormEvent<HTMLTextAreaElement>): void {
    autoResize(e);
  }

  const redirect = `/admin/content/header-footer?country=${country}`;
  const defaultHref = `${redirect}&useDefault=1`;

  return (
    <>
      <form id={FORM_ID} action={onSubmit} className="space-y-6">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="redirect" value={redirect} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            تعديل الهيدر + الشعار
          </h2>
          <a
            href={defaultHref}
            className="text-xs font-semibold text-primary hover:underline"
            onClick={(e) => {
              if (
                !confirm(
                  "هل تريد استبدال القيم الحالية بالقيم الافتراضية؟ لا يمكن التراجع.",
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            تحميل القيم الافتراضية
          </a>
        </div>

        <div className="space-y-4 rounded-md border border-border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold text-muted-foreground">
              قسم الهيدر
            </h3>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
              أعلى الصفحة ↑
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="bannerText"
              className="text-xs font-semibold text-muted-foreground"
            >
              سطر الهيدر (اختياري)
            </Label>
            <Input
              id="bannerText"
              name="bannerText"
              type="text"
              value={bannerVal}
              onChange={(e) => setBannerVal(e.target.value)}
              placeholder="فارغ = إخفاء الشريط في الموقع العام"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground text-end">
              {bannerVal.length} حرف
            </p>
            {bannerVal.trim() ? (
              <div className="mt-1 rounded-md border border-primary/20 bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary">
                <span className="me-2 text-xs text-muted-foreground">
                  معاينة الشريط:
                </span>
                {bannerVal}
              </div>
            ) : (
              <p className="mt-1 text-xs italic text-muted-foreground">
                الشريط مخفي حالياً — أضف نصاً لإظهاره في الموقع
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-md border border-border bg-muted/20 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold text-muted-foreground">
              قسم الشعار (Footer)
            </h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              أسفل الصفحة ↓
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="tagline"
              className="text-xs font-semibold text-muted-foreground"
            >
              الشعار (Tagline)
            </Label>
            <Textarea
              ref={taglineRef}
              id="tagline"
              name="tagline"
              rows={2}
              value={taglineVal}
              onChange={(e) => setTaglineVal(e.target.value)}
              onInput={handleTaglineInput}
              className={cn("min-h-0 resize-none px-3 py-2")}
            />
            <p className="text-xs text-muted-foreground text-end">
              {taglineVal.length} حرف
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="desc" className="text-xs font-semibold text-muted-foreground">
              الوصف
            </Label>
            <Textarea
              ref={descRef}
              id="desc"
              name="desc"
              rows={2}
              value={descVal}
              onChange={(e) => setDescVal(e.target.value)}
              onInput={handleDescInput}
              className={cn("min-h-0 resize-none px-3 py-2")}
            />
            <p className="text-xs text-muted-foreground text-end">
              {descVal.length} حرف
            </p>
          </div>
        </div>

        <button
          type="submit"
          id="header-footer-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <Button type="button" className="w-full sm:w-auto" onClick={handleSave}>
          حفظ الهيدر + الشعار
        </Button>
      </form>

      <UnsavedChangesBar
        formId={FORM_ID}
        message="تغييرات غير محفوظة في الهيدر والشعار"
      />
    </>
  );
}
