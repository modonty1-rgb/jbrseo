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
import { Textarea } from "@/app/components/ui/textarea";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const FORM_ID = "header-footer-form";

type HeaderFooterFormProps = {
  header: StaticLanding["header"];
  footer: StaticLanding["footer"];
  country: SupportedCountry;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

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

  return (
    <>
      <form id={FORM_ID} action={onSubmit} className="space-y-5">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="redirect" value={redirect} />

        <div className={FIELD}>
          <label className={LABEL} htmlFor="bannerText">سطر الهيدر (اختياري)</label>
          <Input
            id="bannerText"
            name="bannerText"
            type="text"
            value={bannerVal}
            onChange={(e) => setBannerVal(e.target.value)}
            className={INPUT}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor="tagline">الشعار</label>
            <Textarea
              ref={taglineRef}
              id="tagline"
              name="tagline"
              rows={2}
              value={taglineVal}
              onChange={(e) => setTaglineVal(e.target.value)}
              onInput={handleTaglineInput}
              className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="desc">الوصف</label>
            <Textarea
              ref={descRef}
              id="desc"
              name="desc"
              rows={2}
              value={descVal}
              onChange={(e) => setDescVal(e.target.value)}
              onInput={handleDescInput}
              className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
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
          حفظ
        </Button>
      </form>

      <UnsavedChangesBar
        formId={FORM_ID}
        message="تغييرات غير محفوظة في الهيدر والشعار"
      />
    </>
  );
}
