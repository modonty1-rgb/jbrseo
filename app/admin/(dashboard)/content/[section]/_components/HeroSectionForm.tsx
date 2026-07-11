"use client";

import { useEffect, useState, useTransition, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHeroSection } from "@/app/actions/content-sections";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { autoResize } from "@/lib/autoResize";
import { ConfirmSaveDialog } from "../../../_components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../../../_components/UnsavedChangesBar";
import { TrustLinesEditor } from "./TrustLinesEditor";

const HERO_FORM_ID = "hero-section-form";

type HeroSectionFormProps = {
  hero: StaticLanding["hero"];
  country: SupportedCountry;
  ctaLabel: string;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";
const ROW_2 = "grid gap-4 md:grid-cols-2";

export function HeroSectionForm({ hero, country, ctaLabel }: HeroSectionFormProps): ReactElement {
  const trustText = (hero.trust ?? []).join("\n");

  const [isPending, startTransition] = useTransition();
  const [ctaVal, setCtaVal] = useState(ctaLabel);

  useEffect(() => {
    const form = document.getElementById(HERO_FORM_ID);
    if (!form) return;
    const sub = form.querySelector<HTMLTextAreaElement>('textarea[name="sub"]');
    if (sub) {
      sub.style.height = "auto";
      sub.style.height = `${sub.scrollHeight}px`;
    }
  }, []);

  function handleSave() {
    const form = document.getElementById(HERO_FORM_ID);
    if (!(form instanceof HTMLFormElement)) return;
    const fd = new FormData(form);
    startTransition(() => void updateHeroSection(fd));
  }

  return (
    <>
      <form id={HERO_FORM_ID} className="space-y-6">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="hero" />
        <input type="hidden" name="redirect" value={`/admin/content/hero?country=${country}`} />

        {/* Row 1: announcement (full) */}
        <div className={FIELD}>
          <label className={LABEL} htmlFor="hero-proof">شريط الإعلان العلوي</label>
          <Input id="hero-proof" name="proof" defaultValue={hero.proof} className={INPUT} />
        </div>

        {/* Row 2: h1 line 1 + line 2 — paired */}
        <div className={ROW_2}>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="hero-h1-1">العنوان — السطر الأول</label>
            <Input id="hero-h1-1" name="h1Line1" defaultValue={hero.h1Line1} className={INPUT} />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="hero-h1-2">العنوان — السطر الثاني</label>
            <Input id="hero-h1-2" name="h1Line2" defaultValue={hero.h1Line2} className={INPUT} />
          </div>
        </div>

        {/* Row 3: subtitle (textarea) + CTA label */}
        <div className={ROW_2}>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="hero-sub">النص الفرعي</label>
            <Textarea
              id="hero-sub"
              name="sub"
              rows={4}
              defaultValue={hero.sub}
              className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
              onInput={autoResize}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="hero-ctaLabel">نص زر الدعوة الرئيسي</label>
            <Input
              id="hero-ctaLabel"
              name="ctaLabel"
              value={ctaVal}
              onChange={(e) => setCtaVal(e.target.value)}
              dir="rtl"
              className={INPUT}
            />
          </div>
        </div>

        {/* Row 4: trust lines (list) — full width */}
        <div className={FIELD}>
          <label className={LABEL}>عناصر الثقة (سطر لكل عنصر)</label>
          <TrustLinesEditor defaultValue={trustText} />
        </div>

        <ConfirmSaveDialog
          onConfirm={handleSave}
          pending={isPending}
          triggerLabel="حفظ"
          description="سيتم حفظ التغييرات على قسم الهيرو."
        />
      </form>
      <UnsavedChangesBar formId={HERO_FORM_ID} />
    </>
  );
}
