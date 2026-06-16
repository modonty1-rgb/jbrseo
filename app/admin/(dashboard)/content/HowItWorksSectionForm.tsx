"use client";

import { useEffect, useState, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHowItWorksSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const HOW_IT_WORKS_FORM_ID = "how-it-works-form";

type Step = { title: string; line: string };

type HowItWorksSectionFormProps = {
  section: StaticLanding["howItWorks"];
  country: SupportedCountry;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

export function HowItWorksSectionForm({ section, country }: HowItWorksSectionFormProps): ReactElement {
  const initial: Step[] = (section.steps ?? []).map((s) => ({
    title: s.title ?? "",
    line: s.line ?? "",
  }));

  const [steps, setSteps] = useState<Step[]>(initial.length > 0 ? initial : [{ title: "", line: "" }]);

  useEffect(() => {
    const form = document.getElementById(HOW_IT_WORKS_FORM_ID);
    if (!form) return;
    form
      .querySelectorAll<HTMLTextAreaElement>('textarea[name^="steps_"][name$="_line"]')
      .forEach((ta) => {
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
      });
  }, [steps.length]);

  function addStep() {
    setSteps((prev) => [...prev, { title: "", line: "" }]);
  }

  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateStep(idx: number, key: keyof Step, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  }

  return (
    <>
      <form id={HOW_IT_WORKS_FORM_ID} action={updateHowItWorksSection} className="space-y-5">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="howItWorks" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/howItWorks?country=${country}`}
        />
        <input type="hidden" name="stepsCount" value={steps.length} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-md border border-border bg-card/40 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  الخطوة {i + 1}
                </span>
                {steps.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => removeStep(i)}
                  >
                    حذف
                  </Button>
                )}
              </div>
              <div className={FIELD}>
                <label className={LABEL}>العنوان</label>
                <Input
                  name={`steps_${i}_title`}
                  value={s.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                  className={INPUT}
                />
              </div>
              <div className={FIELD}>
                <label className={LABEL}>الوصف</label>
                <Textarea
                  name={`steps_${i}_line`}
                  rows={3}
                  value={s.line}
                  onChange={(e) => updateStep(i, "line", e.target.value)}
                  className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
                  onInput={autoResize}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={addStep}
        >
          + إضافة خطوة
        </Button>

        <Button
          type="submit"
          id="how-it-works-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <ConfirmSaveDialog
          formId={HOW_IT_WORKS_FORM_ID}
          submitButtonId="how-it-works-form-submit"
          triggerLabel="حفظ"
          description="سيتم حفظ التغييرات على قسم كيف يعمل."
        />
      </form>
      <UnsavedChangesBar formId={HOW_IT_WORKS_FORM_ID} />
    </>
  );
}
