"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHowItWorksSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type HowItWorksSectionFormProps = {
  section: StaticLanding["howItWorks"];
  country: SupportedCountry;
};

export function HowItWorksSectionForm({ section, country }: HowItWorksSectionFormProps) {
  const steps = section.steps ?? [];
  const stepsCount = steps.length || 4;

  const getStep = (i: number) =>
    steps[i] ?? { num: "", icon: "", title: "", line: "", tag: "" };

  async function onSubmit(formData: FormData) {
    await updateHowItWorksSection(formData);
  }

  return (
    <form id="how-it-works-form" action={onSubmit} className="space-y-4">
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
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
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

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان
          <Input
            name="title"
            defaultValue={section.title}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان الفرعي
          <Input
            name="subtitle"
            defaultValue={section.subtitle}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        نص الضمان
        <Textarea
          name="guarantee"
          defaultValue={section.guarantee}
          className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: stepsCount }).map((_, i) => {
          const s = getStep(i);
          return (
            <div
              key={i}
              className="space-y-2 rounded-md border border-border bg-muted/30 p-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                خطوة {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                رقم الخطوة
                <Input
                  name={`steps_${i}_num`}
                  defaultValue={s.num}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الأيقونة
                <Input
                  name={`steps_${i}_icon`}
                  defaultValue={s.icon}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                العنوان
                <Input
                  name={`steps_${i}_title`}
                  defaultValue={s.title}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                السطر
                <Textarea
                  name={`steps_${i}_line`}
                  defaultValue={s.line}
                  className="min-h-[40px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الوسم
                <Input
                  name={`steps_${i}_tag`}
                  defaultValue={s.tag}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
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
        formId="how-it-works-form"
        submitButtonId="how-it-works-form-submit"
        triggerLabel="حفظ قسم كيف يعمل"
        description="سيتم حفظ التغييرات على قسم كيف يعمل للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

