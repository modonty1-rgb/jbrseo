"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHeroSection } from "@/app/actions/content-sections";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type HeroSectionFormProps = {
  hero: StaticLanding["hero"];
  country: SupportedCountry;
};

export function HeroSectionForm({ hero, country }: HeroSectionFormProps) {
  const benefits = hero.benefits ?? [];
  const benefitsCount = benefits.length || 3;

  const getBenefit = (index: number) => benefits[index] ?? { objection: "", answer: "" };

  const trustText = (hero.trust ?? []).join("\n");

  async function onSubmit(formData: FormData) {
    await updateHeroSection(formData);
  }

  return (
    <form id="hero-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="hero" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/hero?country=${country}`}
      />
      <input type="hidden" name="benefitsCount" value={benefitsCount} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم الهيرو
        </h2>
        <a
          href={`/admin/content/hero?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        إثبات
        <input
          name="proof"
          defaultValue={hero.proof}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان الرئيسي - السطر ١
          <input
            name="h1Line1"
            defaultValue={hero.h1Line1}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان الرئيسي - السطر ٢
          <input
            name="h1Line2"
            defaultValue={hero.h1Line2}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        نص فرعي
        <textarea
          name="sub"
          defaultValue={hero.sub}
          className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: benefitsCount }).map((_, i) => {
          const b = getBenefit(i);
          return (
            <div
              key={i}
              className="rounded-md border border-border bg-muted/30 p-2 space-y-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                فائدة {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                اعتراض
                <input
                  name={`benefits_${i}_objection`}
                  defaultValue={b.objection}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                إجابة
                <textarea
                  name={`benefits_${i}_answer`}
                  defaultValue={b.answer}
                  className="min-h-[50px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
            </div>
          );
        })}
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        عناصر الثقة (سطر لكل عنصر)
        <textarea
          name="trustLines"
          defaultValue={trustText}
          className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <button
        type="submit"
        id="hero-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="hero-form"
        submitButtonId="hero-form-submit"
        triggerLabel="حفظ قسم الهيرو"
        description="سيتم حفظ التغييرات على قسم الهيرو للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

