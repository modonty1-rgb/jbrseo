"use client";

import type { ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateFinalCtaSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const FINAL_CTA_FORM_ID = "final-cta-form";

type FinalCtaSectionFormProps = {
  section: StaticLanding["finalCta"];
  country: SupportedCountry;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

export function FinalCtaSectionForm({ section, country }: FinalCtaSectionFormProps): ReactElement {
  async function onSubmit(formData: FormData) {
    await updateFinalCtaSection(formData);
  }

  return (
    <>
      <form id={FINAL_CTA_FORM_ID} action={onSubmit} className="space-y-6">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="finalCta" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/finalCta?country=${country}`}
        />

        {/* Title — two lines side by side */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${FINAL_CTA_FORM_ID}-t1`}>العنوان — السطر الأول</label>
            <Input
              id={`${FINAL_CTA_FORM_ID}-t1`}
              name="title1"
              defaultValue={section.title1}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${FINAL_CTA_FORM_ID}-t2`}>العنوان — السطر الثاني</label>
            <Input
              id={`${FINAL_CTA_FORM_ID}-t2`}
              name="title2"
              defaultValue={section.title2}
              className={INPUT}
            />
          </div>
        </div>

        {/* Subtitle + WhatsApp CTA paired */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${FINAL_CTA_FORM_ID}-sub`}>العنوان الفرعي</label>
            <Input
              id={`${FINAL_CTA_FORM_ID}-sub`}
              name="subtitle"
              defaultValue={section.subtitle}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${FINAL_CTA_FORM_ID}-wa`}>نص زر واتساب</label>
            <Input
              id={`${FINAL_CTA_FORM_ID}-wa`}
              name="wa"
              defaultValue={section.wa}
              className={INPUT}
            />
          </div>
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
          triggerLabel="حفظ"
          description="سيتم حفظ التغييرات على قسم الدعوة النهائية."
        />
      </form>
      <UnsavedChangesBar formId={FINAL_CTA_FORM_ID} />
    </>
  );
}
