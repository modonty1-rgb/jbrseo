"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateOutcomesSection } from "@/app/actions/content-sections";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type OutcomesSectionFormProps = {
  section: StaticLanding["outcomes"];
  country: SupportedCountry;
};

export function OutcomesSectionForm({ section, country }: OutcomesSectionFormProps) {
  const items = section.outcomes ?? [];
  const outcomesCount = items.length || 4;

  const getOutcome = (i: number) =>
    items[i] ?? { icon: "", metric: "", title: "", line: "", token: "accent" };

  async function onSubmit(formData: FormData) {
    await updateOutcomesSection(formData);
  }

  return (
    <form id="outcomes-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="outcomes" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/outcomes?country=${country}`}
      />
      <input type="hidden" name="outcomesCount" value={outcomesCount} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم النتائج
        </h2>
        <a
          href={`/admin/content/outcomes?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        اسم القسم
        <input
          name="eyebrow"
          defaultValue={section.eyebrow}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان
          <input
            name="title"
            defaultValue={section.title}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان الفرعي
          <input
            name="subtitle"
            defaultValue={section.subtitle}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          نص الشارة
          <input
            name="badgeText"
            defaultValue={section.badgeText}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          الرسالة
          <input
            name="message"
            defaultValue={section.message}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        تمييز الرسالة
        <input
          name="messageHighlight"
          defaultValue={section.messageHighlight}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: outcomesCount }).map((_, i) => {
          const o = getOutcome(i);
          return (
            <div
              key={i}
              className="space-y-2 rounded-md border border-border bg-muted/30 p-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                نتيجة {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الأيقونة
                <input
                  name={`outcomes_${i}_icon`}
                  defaultValue={o.icon}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                المقياس
                <input
                  name={`outcomes_${i}_metric`}
                  defaultValue={o.metric}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                العنوان
                <input
                  name={`outcomes_${i}_title`}
                  defaultValue={o.title}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                السطر
                <textarea
                  name={`outcomes_${i}_line`}
                  defaultValue={o.line}
                  className="min-h-[40px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                نوع الوسم (accent/success/destructive)
                <input
                  name={`outcomes_${i}_token`}
                  defaultValue={o.token}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        id="outcomes-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="outcomes-form"
        submitButtonId="outcomes-form-submit"
        triggerLabel="حفظ قسم النتائج"
        description="سيتم حفظ التغييرات على قسم النتائج للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

