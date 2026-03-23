"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateFinalCtaSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type FinalCtaSectionFormProps = {
  section: StaticLanding["finalCta"];
  country: SupportedCountry;
};

export function FinalCtaSectionForm({ section, country }: FinalCtaSectionFormProps) {
  const benefits = section.benefits ?? [];
  const benefitsText = benefits.join("\n");

  async function onSubmit(formData: FormData) {
    await updateFinalCtaSection(formData);
  }

  return (
    <form id="final-cta-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="finalCta" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/finalCta?country=${country}`}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم الدعوة النهائية
        </h2>
        <a
          href={`/admin/content/finalCta?country=${country}&useDefault=1`}
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
          العنوان ١
          <Input
            name="title1"
            defaultValue={section.title1}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان ٢
          <Input
            name="title2"
            defaultValue={section.title2}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        العنوان الفرعي
        <Input
          name="subtitle"
          defaultValue={section.subtitle}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          إجمالي المقاعد
          <Input
            name="seatsTotal"
            defaultValue={String(section.seats?.total ?? 0)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          المقاعد المحجوزة
          <Input
            name="seatsTaken"
            defaultValue={String(section.seats?.taken ?? 0)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        الفوائد (سطر لكل فائدة)
        <Textarea
          name="benefitsLines"
          defaultValue={benefitsText}
          className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        نص زر واتساب / الدعوة
        <Input
          name="wa"
          defaultValue={section.wa}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <Button
        type="submit"
        id="final-cta-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="final-cta-form"
        submitButtonId="final-cta-form-submit"
        triggerLabel="حفظ قسم الدعوة النهائية"
        description="سيتم حفظ التغييرات على قسم الدعوة النهائية للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

