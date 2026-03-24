"use client";

import { useEffect, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateFaqSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { FaqTagSelector } from "../components/FaqTagSelector";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const FAQ_FORM_ID = "faq-form";

type FaqSectionFormProps = {
  section: StaticLanding["faq"];
  country: SupportedCountry;
};

export function FaqSectionForm({ section, country }: FaqSectionFormProps): ReactElement {
  const faqs = section.faqs ?? [];
  const faqsCount = faqs.length || 10;

  const getFaq = (i: number) => faqs[i] ?? { q: "", a: "", tag: "" };

  useEffect(() => {
    const form = document.getElementById(FAQ_FORM_ID);
    if (!form) return;
    const resize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    };
    form.querySelectorAll<HTMLTextAreaElement>('textarea[name^="faqs_"][name$="_a"]').forEach(resize);
  }, []);

  async function onSubmit(formData: FormData) {
    await updateFaqSection(formData);
  }

  return (
    <>
      <form id={FAQ_FORM_ID} action={onSubmit} className="space-y-4">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="faq" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/faq?country=${country}`}
        />
        <input type="hidden" name="faqsCount" value={faqsCount} />

        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">تعديل قسم الأسئلة الشائعة</h2>
          <a
            href={`/admin/content/faq?country=${country}&useDefault=1`}
            onClick={(e) => {
              if (
                !window.confirm(
                  "هل تريد استعادة القيم الافتراضية؟ ستُفقد كل التعديلات الحالية.",
                )
              ) {
                e.preventDefault();
              }
            }}
            className="text-xs text-destructive hover:underline"
          >
            ↺ استعادة القيم الافتراضية
          </a>
        </div>

        <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            إعدادات القسم
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${FAQ_FORM_ID}-eyebrow`}>
                اسم القسم (Eyebrow)
              </label>
              <Input
                id={`${FAQ_FORM_ID}-eyebrow`}
                name="eyebrow"
                defaultValue={section.eyebrow}
                className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${FAQ_FORM_ID}-cta`}>
                <span className="inline-flex flex-wrap items-center gap-1">
                  نص زر الدعوة
                  <span className="text-[10px] font-normal text-muted-foreground">(يظهر أسفل الأسئلة)</span>
                </span>
              </label>
              <Input
                id={`${FAQ_FORM_ID}-cta`}
                name="ctaLabel"
                defaultValue={section.ctaLabel}
                className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${FAQ_FORM_ID}-title`}>
              العنوان الرئيسي
            </label>
            <Input
              id={`${FAQ_FORM_ID}-title`}
              name="title"
              defaultValue={section.title}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${FAQ_FORM_ID}-subtitle`}>
              العنوان الفرعي
            </label>
            <Input
              id={`${FAQ_FORM_ID}-subtitle`}
              name="subtitle"
              defaultValue={section.subtitle}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground">الأسئلة ({faqsCount})</span>
          <span className="text-[10px] text-muted-foreground">الحد الأقصى: {faqsCount} سؤال</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: faqsCount }).map((_, i) => {
            const f = getFaq(i);
            return (
              <div
                key={i}
                className="space-y-2 rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-primary">س {i + 1}</span>
                  <FaqTagSelector name={`faqs_${i}_tag`} defaultValue={f.tag} />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground" htmlFor={`${FAQ_FORM_ID}-q-${i}`}>
                    السؤال
                  </label>
                  <Input
                    id={`${FAQ_FORM_ID}-q-${i}`}
                    name={`faqs_${i}_q`}
                    defaultValue={f.q}
                    className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground" htmlFor={`${FAQ_FORM_ID}-a-${i}`}>
                    الجواب
                  </label>
                  <Textarea
                    id={`${FAQ_FORM_ID}-a-${i}`}
                    name={`faqs_${i}_a`}
                    rows={3}
                    defaultValue={f.a}
                    className="mt-0.5 min-h-0 w-full resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-xs"
                    onInput={autoResize}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="submit"
          id="faq-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <ConfirmSaveDialog
          formId={FAQ_FORM_ID}
          submitButtonId="faq-form-submit"
          triggerLabel="حفظ قسم الأسئلة الشائعة"
          description="سيتم حفظ التغييرات على قسم الأسئلة الشائعة للبلد المحدد. هل أنت متأكد من المتابعة؟"
        />
      </form>
      <UnsavedChangesBar formId={FAQ_FORM_ID} />
    </>
  );
}
