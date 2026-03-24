"use client";

import { useEffect, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateOutcomesSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { TokenSelector } from "../components/TokenSelector";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const OUTCOMES_FORM_ID = "outcomes-form";

type OutcomesSectionFormProps = {
  section: StaticLanding["outcomes"];
  country: SupportedCountry;
};

export function OutcomesSectionForm({ section, country }: OutcomesSectionFormProps): ReactElement {
  const items = section.outcomes ?? [];
  const outcomesCount = items.length || 4;

  const getOutcome = (i: number) =>
    items[i] ?? { icon: "", metric: "", title: "", line: "", token: "accent" };

  useEffect(() => {
    const form = document.getElementById(OUTCOMES_FORM_ID);
    if (!form) return;
    const resize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    };
    form
      .querySelectorAll<HTMLTextAreaElement>('textarea[name^="outcomes_"][name$="_line"]')
      .forEach(resize);
  }, []);

  async function onSubmit(formData: FormData) {
    await updateOutcomesSection(formData);
  }

  return (
    <>
      <form id={OUTCOMES_FORM_ID} action={onSubmit} className="space-y-4">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="outcomes" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/outcomes?country=${country}`}
        />
        <input type="hidden" name="outcomesCount" value={outcomesCount} />

        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">تعديل قسم النتائج</h2>
          <a
            href={`/admin/content/outcomes?country=${country}&useDefault=1`}
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

        <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            عناوين القسم
          </p>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            اسم القسم (Eyebrow)
            <Input
              name="eyebrow"
              defaultValue={section.eyebrow}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            العنوان الرئيسي
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

        <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            شريط الرسالة والدعوة
          </p>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex flex-wrap items-center gap-1">
              نص الشارة
              <span className="text-[10px] font-normal text-muted-foreground">
                (badge ملون فوق القسم)
              </span>
            </span>
            <Input
              name="badgeText"
              defaultValue={section.badgeText}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            بداية جملة الرسالة
            <Input
              name="message"
              defaultValue={section.message}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex flex-wrap items-center gap-1">
              تمييز الرسالة
              <span className="text-[10px] font-normal text-muted-foreground">
                (الجزء المميز باللون — يكمل الجملة)
              </span>
            </span>
            <Input
              name="messageHighlight"
              defaultValue={section.messageHighlight}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: outcomesCount }).map((_, i) => {
            const o = getOutcome(i);
            return (
              <div
                key={i}
                className="space-y-3 rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex shrink-0 flex-col items-center gap-0.5">
                    <Input
                      name={`outcomes_${i}_icon`}
                      defaultValue={o.icon}
                      className="h-10 w-12 rounded-md border border-border bg-muted p-0 text-center text-2xl"
                      aria-label="أيقونة النتيجة"
                    />
                    <span className="text-[9px] text-muted-foreground">أيقونة</span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div>
                      <div className="text-[10px] text-muted-foreground">المقياس (الرقم البارز)</div>
                      <Input
                        name={`outcomes_${i}_metric`}
                        defaultValue={o.metric}
                        className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-lg font-bold"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground">العنوان</div>
                      <Input
                        name={`outcomes_${i}_title`}
                        defaultValue={o.title}
                        className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    الوصف
                    <Textarea
                      name={`outcomes_${i}_line`}
                      rows={2}
                      defaultValue={o.line}
                      className="min-h-[40px] w-full resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-xs"
                      onInput={autoResize}
                    />
                  </label>
                </div>

                <div>
                  <div className="mb-1 block text-[10px] text-muted-foreground">لون الوسم</div>
                  <TokenSelector name={`outcomes_${i}_token`} defaultValue={o.token} />
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="submit"
          id="outcomes-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <ConfirmSaveDialog
          formId={OUTCOMES_FORM_ID}
          submitButtonId="outcomes-form-submit"
          triggerLabel="حفظ قسم النتائج"
          description="سيتم حفظ التغييرات على قسم النتائج للبلد المحدد. هل أنت متأكد من المتابعة؟"
        />
      </form>
      <UnsavedChangesBar formId={OUTCOMES_FORM_ID} />
    </>
  );
}
