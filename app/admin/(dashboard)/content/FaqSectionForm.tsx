"use client";

import { useEffect, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateFaqSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../_components/ConfirmSaveDialog";
import { FaqTagSelector } from "../_components/FaqTagSelector";
import { UnsavedChangesBar } from "../_components/UnsavedChangesBar";

const FAQ_FORM_ID = "faq-form";

type FaqSectionFormProps = {
  section: StaticLanding["faq"];
  country: SupportedCountry;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

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
      <form id={FAQ_FORM_ID} action={onSubmit} className="space-y-6">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="faq" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/faq?country=${country}`}
        />
        <input type="hidden" name="faqsCount" value={faqsCount} />

        {/* Header row: title + ctaLabel paired */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${FAQ_FORM_ID}-title`}>العنوان الرئيسي</label>
            <Input
              id={`${FAQ_FORM_ID}-title`}
              name="title"
              defaultValue={section.title}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${FAQ_FORM_ID}-cta`}>نص زر الدعوة</label>
            <Input
              id={`${FAQ_FORM_ID}-cta`}
              name="ctaLabel"
              defaultValue={section.ctaLabel}
              className={INPUT}
            />
          </div>
        </div>

        {/* FAQ list — each row: question + tag side by side, answer below */}
        <div className="border-t border-border/60 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base" aria-hidden>❓</span>
            <h3 className="text-sm font-bold text-foreground">قائمة الأسئلة ({faqsCount})</h3>
          </div>
          <div className="space-y-3">
            {Array.from({ length: faqsCount }).map((_, i) => {
              const f = getFaq(i);
              return (
                <div key={i} className="space-y-2 rounded-md border border-border bg-card/40 p-3">
                  <div className="text-xs font-semibold text-muted-foreground">السؤال {i + 1}</div>
                  <div className="grid gap-3 grid-cols-[1fr_180px]">
                    <div className={FIELD}>
                      <label className={LABEL} htmlFor={`${FAQ_FORM_ID}-q-${i}`}>السؤال</label>
                      <Input
                        id={`${FAQ_FORM_ID}-q-${i}`}
                        name={`faqs_${i}_q`}
                        defaultValue={f.q}
                        className={INPUT}
                      />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>الوسم</label>
                      <FaqTagSelector name={`faqs_${i}_tag`} defaultValue={f.tag} />
                    </div>
                  </div>
                  <div className={FIELD}>
                    <label className={LABEL} htmlFor={`${FAQ_FORM_ID}-a-${i}`}>الجواب</label>
                    <Textarea
                      id={`${FAQ_FORM_ID}-a-${i}`}
                      name={`faqs_${i}_a`}
                      rows={3}
                      defaultValue={f.a}
                      className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
                      onInput={autoResize}
                    />
                  </div>
                </div>
              );
            })}
          </div>
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
          triggerLabel="حفظ"
          description="سيتم حفظ التغييرات على قسم الأسئلة الشائعة."
        />
      </form>
      <UnsavedChangesBar formId={FAQ_FORM_ID} />
    </>
  );
}
