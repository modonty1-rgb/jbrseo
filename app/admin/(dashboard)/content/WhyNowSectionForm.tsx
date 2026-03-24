"use client";

import { useEffect, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateWhyNowSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { SeverityToggle } from "../components/SeverityToggle";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const WHY_NOW_FORM_ID = "why-now-form";

type WhyNowSectionFormProps = {
  section: StaticLanding["whyNow"];
  country: SupportedCountry;
};

export function WhyNowSectionForm({ section, country }: WhyNowSectionFormProps): ReactElement {
  const costs = section.costs ?? [];
  const reasons = section.reasons ?? [];

  const costsCount = costs.length || 3;
  const reasonsCount = reasons.length || 3;

  const getCost = (i: number) =>
    costs[i] ?? { month: "", label: "", desc: "", value: "", icon: "", severity: 1 };
  const getReason = (i: number) => reasons[i] ?? { icon: "", title: "", body: "" };

  useEffect(() => {
    const form = document.getElementById(WHY_NOW_FORM_ID);
    if (!form) return;
    const resize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    };
    const subtitle = form.querySelector<HTMLTextAreaElement>('textarea[name="subtitle"]');
    if (subtitle) resize(subtitle);
    form.querySelectorAll<HTMLTextAreaElement>('textarea[name^="costs_"][name$="_desc"]').forEach(resize);
    form.querySelectorAll<HTMLTextAreaElement>('textarea[name^="reasons_"][name$="_body"]').forEach(resize);
  }, []);

  async function onSubmit(formData: FormData) {
    await updateWhyNowSection(formData);
  }

  return (
    <>
      <form id={WHY_NOW_FORM_ID} action={onSubmit} className="space-y-4">
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
          <h2 className="text-sm font-semibold text-muted-foreground">تعديل قسم لماذا الآن</h2>
          <a
            href={`/admin/content/whyNow?country=${country}&useDefault=1`}
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
            السطر الأول من العنوان
            <Input
              name="title1"
              defaultValue={section.title1}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <p className="text-center text-[10px] text-muted-foreground">↕ السطران يظهران فوق بعض</p>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            السطر الثاني من العنوان
            <Input
              name="title2"
              defaultValue={section.title2}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor="why-now-subtitle">
          العنوان الفرعي
        </label>
        <Textarea
          id="why-now-subtitle"
          name="subtitle"
          rows={3}
          defaultValue={section.subtitle}
          className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-sm"
          onInput={autoResize}
        />

        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: costsCount }).map((_, i) => {
            const c = getCost(i);
            return (
              <div
                key={i}
                className="space-y-3 rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    name={`costs_${i}_icon`}
                    defaultValue={c.icon}
                    className="h-10 w-10 shrink-0 border-0 bg-transparent p-0 text-center text-lg shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label="أيقونة البطاقة"
                  />
                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground">الشهر</div>
                      <Input
                        name={`costs_${i}_month`}
                        defaultValue={c.month}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground">التسمية</div>
                      <Input
                        name={`costs_${i}_label`}
                        defaultValue={c.label}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground">الوصف</div>
                  <Textarea
                    name={`costs_${i}_desc`}
                    rows={2}
                    defaultValue={c.desc}
                    className="min-h-0 w-full resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-xs"
                    onInput={autoResize}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-[10px] text-muted-foreground">القيمة المعروضة</div>
                    <Input
                      name={`costs_${i}_value`}
                      defaultValue={c.value}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="shrink-0 space-y-1">
                    <div className="mb-1 block text-[10px] text-muted-foreground">درجة الشدة</div>
                    <SeverityToggle name={`costs_${i}_severity`} defaultValue={c.severity} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: reasonsCount }).map((_, i) => {
            const r = getReason(i);
            return (
              <div
                key={i}
                className="space-y-2 rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    name={`reasons_${i}_icon`}
                    defaultValue={r.icon}
                    className="h-10 w-10 shrink-0 rounded-md border border-border bg-muted p-0 text-center text-2xl shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label="أيقونة السبب"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-[10px] text-muted-foreground">العنوان</div>
                    <Input
                      name={`reasons_${i}_title`}
                      defaultValue={r.title}
                      className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground">المحتوى</div>
                  <Textarea
                    name={`reasons_${i}_body`}
                    rows={2}
                    defaultValue={r.body}
                    className="min-h-0 w-full resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-xs"
                    onInput={autoResize}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
          <div className="text-xs font-semibold text-muted-foreground">
            🎯 قسم الدعوة للعمل (CTA)
          </div>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            نص الزر الرئيسي
            <Input
              name="ctaText"
              defaultValue={section.ctaText}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            النص التمييزي تحت الزر
            <Input
              name="ctaHighlight"
              defaultValue={section.ctaHighlight}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex flex-wrap items-center gap-1">
              الأيام المستهدفة
              <span className="text-[10px] font-normal text-muted-foreground">
                (يُستخدم في العداد التنازلي)
              </span>
            </span>
            <Input
              name="daysTarget"
              type="number"
              min={1}
              defaultValue={String(section.daysTarget ?? 1)}
              className="max-w-xs rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>

        <Button
          type="submit"
          id="why-now-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <ConfirmSaveDialog
          formId={WHY_NOW_FORM_ID}
          submitButtonId="why-now-form-submit"
          triggerLabel="حفظ قسم لماذا الآن"
          description="سيتم حفظ التغييرات على قسم لماذا الآن للبلد المحدد. هل أنت متأكد من المتابعة؟"
        />
      </form>
      <UnsavedChangesBar formId={WHY_NOW_FORM_ID} />
    </>
  );
}
