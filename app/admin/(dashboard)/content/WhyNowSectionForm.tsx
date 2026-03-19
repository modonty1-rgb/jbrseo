"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateWhyNowSection } from "@/app/actions/content-sections";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type WhyNowSectionFormProps = {
  section: StaticLanding["whyNow"];
  country: SupportedCountry;
};

export function WhyNowSectionForm({ section, country }: WhyNowSectionFormProps) {
  const costs = section.costs ?? [];
  const reasons = section.reasons ?? [];

  const costsCount = costs.length || 3;
  const reasonsCount = reasons.length || 3;

  const getCost = (i: number) =>
    costs[i] ?? { month: "", label: "", desc: "", value: "", icon: "", severity: 1 };
  const getReason = (i: number) =>
    reasons[i] ?? { icon: "", title: "", body: "" };

  async function onSubmit(formData: FormData) {
    await updateWhyNowSection(formData);
  }

  return (
    <form id="why-now-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="whyNow" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/whyNow?country=${country}`}
      />
      <input type="hidden" name="costsCount" value={costsCount} />
      <input type="hidden" name="reasonsCount" value={reasonsCount} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم لماذا الآن
        </h2>
        <a
          href={`/admin/content/whyNow?country=${country}&useDefault=1`}
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
          العنوان ١
          <input
            name="title1"
            defaultValue={section.title1}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان ٢
          <input
            name="title2"
            defaultValue={section.title2}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        العنوان الفرعي
        <textarea
          name="subtitle"
          defaultValue={section.subtitle}
          className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: costsCount }).map((_, i) => {
          const c = getCost(i);
          return (
            <div
              key={i}
              className="rounded-md border border-border bg-muted/30 p-2 space-y-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                تكلفة {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الشهر
                <input
                  name={`costs_${i}_month`}
                  defaultValue={c.month}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                التسمية
                <input
                  name={`costs_${i}_label`}
                  defaultValue={c.label}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الوصف
                <textarea
                  name={`costs_${i}_desc`}
                  defaultValue={c.desc}
                  className="min-h-[50px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                القيمة
                <input
                  name={`costs_${i}_value`}
                  defaultValue={c.value}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الأيقونة
                <input
                  name={`costs_${i}_icon`}
                  defaultValue={c.icon}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                درجة الشدة (1-3)
                <input
                  name={`costs_${i}_severity`}
                  defaultValue={String(c.severity ?? 1)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: reasonsCount }).map((_, i) => {
          const r = getReason(i);
          return (
            <div
              key={i}
              className="rounded-md border border-border bg-muted/30 p-2 space-y-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                سبب {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الأيقونة
                <input
                  name={`reasons_${i}_icon`}
                  defaultValue={r.icon}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                العنوان
                <input
                  name={`reasons_${i}_title`}
                  defaultValue={r.title}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                المحتوى
                <textarea
                  name={`reasons_${i}_body`}
                  defaultValue={r.body}
                  className="min-h-[50px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          نص زر الدعوة
          <input
            name="ctaText"
            defaultValue={section.ctaText}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          تمييز الدعوة
          <input
            name="ctaHighlight"
            defaultValue={section.ctaHighlight}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        الأيام المستهدفة
        <input
          name="daysTarget"
          defaultValue={String(section.daysTarget ?? 0)}
          className="w-32 rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <button
        type="submit"
        id="why-now-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="why-now-form"
        submitButtonId="why-now-form-submit"
        triggerLabel="حفظ قسم لماذا الآن"
        description="سيتم حفظ التغييرات على قسم لماذا الآن للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

