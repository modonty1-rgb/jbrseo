"use client";

import { useEffect, useState, useTransition, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHeroSection } from "@/app/actions/content-sections";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { autoResize } from "@/lib/autoResize";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";
import { TrustLinesEditor } from "./TrustLinesEditor";

const HERO_FORM_ID = "hero-section-form";

type HeroSectionFormProps = {
  hero: StaticLanding["hero"];
  country: SupportedCountry;
};

export function HeroSectionForm({ hero, country }: HeroSectionFormProps): ReactElement {
  const benefits = hero.benefits ?? [];
  const benefitsCount = benefits.length || 3;

  const getBenefit = (index: number) => benefits[index] ?? { objection: "", answer: "" };

  const trustText = (hero.trust ?? []).join("\n");

  const [isPending, startTransition] = useTransition();
  const [subCharCount, setSubCharCount] = useState(() => (hero.sub ?? "").length);

  useEffect(() => {
    const form = document.getElementById(HERO_FORM_ID);
    if (!form) return;
    const resize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    };
    const sub = form.querySelector<HTMLTextAreaElement>('textarea[name="sub"]');
    if (sub) resize(sub);
    form
      .querySelectorAll<HTMLTextAreaElement>('textarea[name^="benefits_"][name$="_answer"]')
      .forEach(resize);
  }, []);

  function handleSave() {
    const form = document.getElementById(HERO_FORM_ID);
    if (!(form instanceof HTMLFormElement)) return;
    const fd = new FormData(form);
    startTransition(() => {
      void updateHeroSection(fd);
    });
  }

  return (
    <>
      <form id={HERO_FORM_ID} className="space-y-4">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="hero" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/hero?country=${country}`}
        />
        <input type="hidden" name="benefitsCount" value={benefitsCount} />

        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">تعديل قسم الهيرو</h2>
          <a
            href={`/admin/content/hero?country=${country}&useDefault=1`}
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

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="hero-proof">
            شريط الإعلان العلوي
          </label>
          <Input
            id="hero-proof"
            name="proof"
            defaultValue={hero.proof}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            💡 يظهر كشريط ملون في أعلى صفحة الموقع
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            سطر العنوان الأول ← يظهر فوق
            <Input
              name="h1Line1"
              defaultValue={hero.h1Line1}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            سطر العنوان الثاني ← يظهر تحته
            <Input
              name="h1Line2"
              defaultValue={hero.h1Line2}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>
        <p className="text-center text-[10px] text-muted-foreground">
          ↕ السطران يُعرضان فوق بعض في الهيرو
        </p>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="hero-sub">
            نص فرعي
          </label>
          <Textarea
            id="hero-sub"
            name="sub"
            rows={4}
            defaultValue={hero.sub}
            className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-sm"
            onInput={(e) => {
              autoResize(e);
              setSubCharCount(e.currentTarget.value.length);
            }}
          />
          <p className="mt-0.5 text-end text-[10px] text-muted-foreground">
            {subCharCount} حرف
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: benefitsCount }).map((_, i) => {
            const b = getBenefit(i);
            return (
              <div
                key={i}
                className="space-y-3 rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <span className="text-base" aria-hidden>
                    🙋
                  </span>
                  الاعتراض {i + 1}
                </div>
                <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                  السؤال / الاعتراض
                  <Input
                    name={`benefits_${i}_objection`}
                    defaultValue={b.objection}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  />
                </label>
                <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                  الرد
                  <Textarea
                    name={`benefits_${i}_answer`}
                    rows={3}
                    defaultValue={b.answer}
                    className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-xs"
                    onInput={autoResize}
                  />
                </label>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">عناصر الثقة</span>
          <TrustLinesEditor defaultValue={trustText} />
        </div>

        <ConfirmSaveDialog
          onConfirm={handleSave}
          pending={isPending}
          triggerLabel="حفظ قسم الهيرو"
          description="سيتم حفظ التغييرات على قسم الهيرو للبلد المحدد. هل أنت متأكد من المتابعة؟"
        />
      </form>
      <UnsavedChangesBar formId={HERO_FORM_ID} />
    </>
  );
}
