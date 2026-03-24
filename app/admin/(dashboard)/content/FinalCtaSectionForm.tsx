"use client";

import type { ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateFinalCtaSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";
import { TrustLinesEditor } from "./TrustLinesEditor";

const FINAL_CTA_FORM_ID = "final-cta-form";

type FinalCtaSectionFormProps = {
  section: StaticLanding["finalCta"];
  country: SupportedCountry;
};

export function FinalCtaSectionForm({ section, country }: FinalCtaSectionFormProps): ReactElement {
  const benefits = section.benefits ?? [];
  const benefitsText = benefits.join("\n");

  async function onSubmit(formData: FormData) {
    await updateFinalCtaSection(formData);
  }

  return (
    <>
      <form id={FINAL_CTA_FORM_ID} action={onSubmit} className="space-y-4">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="finalCta" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/finalCta?country=${country}`}
        />

        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">تعديل قسم الدعوة النهائية</h2>
          <a
            href={`/admin/content/finalCta?country=${country}&useDefault=1`}
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
            عناوين القسم
          </p>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${FINAL_CTA_FORM_ID}-eyebrow`}>
            اسم القسم (Eyebrow)
            <Input
              id={`${FINAL_CTA_FORM_ID}-eyebrow`}
              name="eyebrow"
              defaultValue={section.eyebrow}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>

          <div className="grid grid-cols-1 gap-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${FINAL_CTA_FORM_ID}-t1`}>
              السطر الأول من العنوان
              <Input
                id={`${FINAL_CTA_FORM_ID}-t1`}
                name="title1"
                defaultValue={section.title1}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <p className="text-center text-[10px] text-muted-foreground">↕ السطران يظهران فوق بعض</p>
            <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${FINAL_CTA_FORM_ID}-t2`}>
              السطر الثاني من العنوان
              <Input
                id={`${FINAL_CTA_FORM_ID}-t2`}
                name="title2"
                defaultValue={section.title2}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${FINAL_CTA_FORM_ID}-sub`}>
            العنوان الفرعي
            <Input
              id={`${FINAL_CTA_FORM_ID}-sub`}
              name="subtitle"
              defaultValue={section.subtitle}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>

        <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            عداد المقاعد
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${FINAL_CTA_FORM_ID}-total`}>
                إجمالي المقاعد
              </label>
              <p className="mt-0.5 text-[10px] text-muted-foreground">يُعرض كحد أعلى في شريط التقدم</p>
              <Input
                id={`${FINAL_CTA_FORM_ID}-total`}
                name="seatsTotal"
                defaultValue={String(section.seats?.total ?? 0)}
                className="mt-1 rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${FINAL_CTA_FORM_ID}-taken`}>
                المقاعد المحجوزة
              </label>
              <p className="mt-0.5 text-[10px] text-muted-foreground">القيمة الحالية المعروضة للزائر</p>
              <Input
                id={`${FINAL_CTA_FORM_ID}-taken`}
                name="seatsTaken"
                defaultValue={String(section.seats?.taken ?? 0)}
                className="mt-1 rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            نقاط الثقة تحت الدعوة
          </p>
          <p className="text-[10px] text-muted-foreground">سطر لكل نقطة — نفس تنسيق الموقع (فصل بسطر جديد)</p>
          <TrustLinesEditor defaultValue={benefitsText} fieldName="benefitsLines" />
        </div>

        <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${FINAL_CTA_FORM_ID}-wa`}>
            <span className="inline-flex flex-wrap items-center gap-1">
              نص زر واتساب / الدعوة
              <span className="text-[10px] font-normal text-muted-foreground">(النص الظاهر على الزر)</span>
            </span>
            <Input
              id={`${FINAL_CTA_FORM_ID}-wa`}
              name="wa"
              defaultValue={section.wa}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>

        <Button
          type="submit"
          id="final-cta-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <ConfirmSaveDialog
          formId={FINAL_CTA_FORM_ID}
          submitButtonId="final-cta-form-submit"
          triggerLabel="حفظ قسم الدعوة النهائية"
          description="سيتم حفظ التغييرات على قسم الدعوة النهائية للبلد المحدد. هل أنت متأكد من المتابعة؟"
        />
      </form>
      <UnsavedChangesBar formId={FINAL_CTA_FORM_ID} />
    </>
  );
}
