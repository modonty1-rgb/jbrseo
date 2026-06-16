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
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const WHY_NOW_FORM_ID = "why-now-form";

type WhyNowSectionFormProps = {
  section: StaticLanding["whyNow"];
  country: SupportedCountry;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

export function WhyNowSectionForm({ section, country }: WhyNowSectionFormProps): ReactElement {
  const costs = section.costs ?? [];
  const costsCount = costs.length || 3;
  const getCost = (i: number) =>
    costs[i] ?? { month: "", label: "", desc: "", icon: "" };

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
  }, []);

  async function onSubmit(formData: FormData) {
    await updateWhyNowSection(formData);
  }

  return (
    <>
      <form id={WHY_NOW_FORM_ID} action={onSubmit} className="space-y-6">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="whyNow" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/whyNow?country=${country}`}
        />
        <input type="hidden" name="costsCount" value={costsCount} />

        {/* Header row: title1 + subtitle paired */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor="why-now-title1">العنوان الرئيسي</label>
            <Input id="why-now-title1" name="title1" defaultValue={section.title1} className={INPUT} />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="why-now-subtitle">العنوان الفرعي</label>
            <Textarea
              id="why-now-subtitle"
              name="subtitle"
              rows={2}
              defaultValue={section.subtitle}
              className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
              onInput={autoResize}
            />
          </div>
        </div>

        {/* Costs grid — each cost is a card, 3 cards per row on desktop */}
        <div className="border-t border-border/60 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base" aria-hidden>💸</span>
            <h3 className="text-sm font-bold text-foreground">التكاليف الشهرية ({costsCount})</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: costsCount }).map((_, i) => {
              const c = getCost(i);
              return (
                <div key={i} className="space-y-3 rounded-md border border-border bg-card/40 p-3">
                  <div className="text-xs font-semibold text-muted-foreground">التكلفة {i + 1}</div>
                  <div className="grid gap-2 grid-cols-[80px_1fr]">
                    <div className={FIELD}>
                      <label className={LABEL}>الأيقونة</label>
                      <Input name={`costs_${i}_icon`} defaultValue={c.icon} className={`${INPUT} text-center`} />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>الشهر</label>
                      <Input name={`costs_${i}_month`} defaultValue={c.month} className={INPUT} />
                    </div>
                  </div>
                  <div className={FIELD}>
                    <label className={LABEL}>التسمية</label>
                    <Input name={`costs_${i}_label`} defaultValue={c.label} className={INPUT} />
                  </div>
                  <div className={FIELD}>
                    <label className={LABEL}>الوصف</label>
                    <Textarea
                      name={`costs_${i}_desc`}
                      rows={2}
                      defaultValue={c.desc}
                      className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
                      onInput={autoResize}
                    />
                  </div>
                </div>
              );
            })}
          </div>
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
          triggerLabel="حفظ"
          description="سيتم حفظ التغييرات على قسم لماذا الآن."
        />
      </form>
      <UnsavedChangesBar formId={WHY_NOW_FORM_ID} />
    </>
  );
}
