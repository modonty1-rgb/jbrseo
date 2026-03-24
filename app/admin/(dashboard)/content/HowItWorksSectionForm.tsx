"use client";

import { useEffect, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHowItWorksSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { autoResize } from "@/lib/autoResize";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const HOW_IT_WORKS_FORM_ID = "how-it-works-form";

type HowItWorksSectionFormProps = {
  section: StaticLanding["howItWorks"];
  country: SupportedCountry;
};

export function HowItWorksSectionForm({ section, country }: HowItWorksSectionFormProps): ReactElement {
  const steps = section.steps ?? [];
  const stepsCount = steps.length || 3;

  const getStep = (i: number) =>
    steps[i] ?? { num: "", icon: "", title: "", line: "", tag: "" };

  useEffect(() => {
    const form = document.getElementById(HOW_IT_WORKS_FORM_ID);
    if (!form) return;
    const resize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    };
    const guarantee = form.querySelector<HTMLTextAreaElement>('textarea[name="guarantee"]');
    if (guarantee) resize(guarantee);
    form.querySelectorAll<HTMLTextAreaElement>('textarea[name^="steps_"][name$="_line"]').forEach(resize);
  }, []);

  async function onSubmit(formData: FormData) {
    await updateHowItWorksSection(formData);
  }

  return (
    <>
    <form id={HOW_IT_WORKS_FORM_ID} action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="howItWorks" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/howItWorks?country=${country}`}
      />
      <input type="hidden" name="stepsCount" value={stepsCount} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم كيف يعمل
        </h2>
        <a
          href={`/admin/content/howItWorks?country=${country}&useDefault=1`}
          onClick={(e) => {
            if (!window.confirm("هل تريد استعادة القيم الافتراضية؟ ستُفقد كل التعديلات الحالية.")) {
              e.preventDefault();
            }
          }}
          className="text-xs text-destructive hover:underline"
        >
          ↺ استعادة القيم الافتراضية
        </a>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        اسم القسم
        <Input
          name="eyebrow"
          defaultValue={section.eyebrow}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid grid-cols-1 gap-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان الرئيسي
          <Input
            name="title"
            defaultValue={section.title}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          <span className="inline-flex flex-wrap items-center gap-1">
            العنوان الفرعي
            <span className="text-[10px] font-normal text-muted-foreground">
              (جملة توضيحية تظهر تحت العنوان)
            </span>
          </span>
          <Input
            name="subtitle"
            defaultValue={section.subtitle}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        <span className="inline-flex flex-wrap items-center gap-1">
          نص الضمان
          <span className="text-[10px] font-normal text-muted-foreground">
            (يظهر تحت زر الاشتراك · افصل بين العناصر بـ · )
          </span>
        </span>
        <Textarea
          name="guarantee"
          rows={2}
          defaultValue={section.guarantee}
          className="min-h-[70px] resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-sm"
          onInput={autoResize}
        />
      </label>

      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: stepsCount }).map((_, i) => {
          const s = getStep(i);
          return (
            <div key={i} className="space-y-2">
              <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <input
                    type="hidden"
                    name={`steps_${i}_num`}
                    value={s.num || `0${i + 1}`}
                  />
                  <div className="flex flex-col items-center gap-0.5">
                    <Input
                      name={`steps_${i}_icon`}
                      defaultValue={s.icon}
                      className="h-10 w-12 rounded-md border border-border bg-muted p-0 text-center text-2xl"
                    />
                    <span className="text-[9px] text-muted-foreground">أيقونة</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                      عنوان الخطوة
                      <Input
                        name={`steps_${i}_title`}
                        defaultValue={s.title}
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm font-semibold"
                      />
                    </label>
                  </div>
                </div>
                <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                  الوصف
                  <Textarea
                    name={`steps_${i}_line`}
                    rows={2}
                    defaultValue={s.line}
                    className="min-h-[40px] w-full resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-xs"
                    onInput={autoResize}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    الوسم الزمني
                    <span className="text-[9px] opacity-60">(يظهر كـ badge ملون على الكارد)</span>
                  </span>
                  <Input
                    name={`steps_${i}_tag`}
                    defaultValue={s.tag}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  />
                </label>
              </div>
              {i < stepsCount - 1 && (
                <div className="select-none text-center text-lg text-muted-foreground/40">↓</div>
              )}
            </div>
          );
        })}
      </div>

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
        triggerLabel="حفظ قسم كيف يعمل"
        description="سيتم حفظ التغييرات على قسم كيف يعمل للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
    <UnsavedChangesBar formId={HOW_IT_WORKS_FORM_ID} />
    </>
  );
}

