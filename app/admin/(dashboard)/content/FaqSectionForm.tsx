"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateFaqSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type FaqSectionFormProps = {
  section: StaticLanding["faq"];
  country: SupportedCountry;
};

export function FaqSectionForm({ section, country }: FaqSectionFormProps) {
  const faqs = section.faqs ?? [];
  const faqsCount = faqs.length || 6;

  const getFaq = (i: number) => faqs[i] ?? { q: "", a: "", tag: "" };

  async function onSubmit(formData: FormData) {
    await updateFaqSection(formData);
  }

  return (
    <form id="faq-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="faq" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/faq?country=${country}`}
      />
      <input type="hidden" name="faqsCount" value={faqsCount} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم الأسئلة الشائعة
        </h2>
        <a
          href={`/admin/content/faq?country=${country}&useDefault=1`}
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
        نص زر الدعوة (CTA)
        <Input
          name="ctaLabel"
          defaultValue={section.ctaLabel}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: faqsCount }).map((_, i) => {
          const f = getFaq(i);
          return (
            <div
              key={i}
              className="space-y-2 rounded-md border border-border bg-muted/30 p-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                سؤال {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                السؤال
                <Input
                  name={`faqs_${i}_q`}
                  defaultValue={f.q}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الجواب
                <Textarea
                  name={`faqs_${i}_a`}
                  defaultValue={f.a}
                  className="min-h-[60px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الوسم
                <Input
                  name={`faqs_${i}_tag`}
                  defaultValue={f.tag}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
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
        formId="faq-form"
        submitButtonId="faq-form-submit"
        triggerLabel="حفظ قسم الأسئلة الشائعة"
        description="سيتم حفظ التغييرات على قسم الأسئلة الشائعة للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

