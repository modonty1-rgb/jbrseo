"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateAboutSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../_components/ConfirmSaveDialog";

type AboutSectionFormProps = {
  section: StaticLanding["about"];
  country: SupportedCountry;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";
const TEXTAREA = "min-h-[70px] rounded-md border border-border bg-background px-3 py-2 text-sm";
const SECTION_LABEL = "mb-3 flex items-center gap-2 text-sm font-bold text-foreground";

export function AboutSectionForm({ section, country }: AboutSectionFormProps) {
  async function onSubmit(formData: FormData) {
    await updateAboutSection(formData);
  }

  const hero = section?.hero ?? { title: "", subtitle: "" };
  const storyBlocks = section?.storyBlocks ?? [];
  const values = section?.values ?? [];
  const fitFor = section?.fitFor ?? [];
  const notFitFor = section?.notFitFor ?? [];
  const legalInfo = section?.legalInfo ?? {
    legalName: "",
    registrationCountry: "",
    crNumber: "",
    foundedAt: "",
    address: "",
    email: "",
    phone: "",
  };
  const cta = section?.cta ?? {
    title: "",
    body: "",
    primaryLabel: "",
    primaryHref: "",
    secondaryLabel: "",
    secondaryHref: "",
  };

  return (
    <form id="about-form" action={onSubmit} className="space-y-8">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="about" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/about?country=${country}`}
      />

      {/* ─── HERO ─── */}
      <section className="rounded-lg border border-border bg-card/40 p-4 space-y-4">
        <h3 className={SECTION_LABEL}>
          <span aria-hidden>✨</span>
          <span>الهيرو</span>
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-heroEyebrow">سطر فوق العنوان</label>
            <Input
              id="about-heroEyebrow"
              name="heroEyebrow"
              defaultValue={hero.eyebrow ?? ""}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-heroTitle">العنوان الرئيسي</label>
            <Input
              id="about-heroTitle"
              name="heroTitle"
              defaultValue={hero.title}
              className={INPUT}
            />
          </div>
        </div>
        <div className={FIELD}>
          <label className={LABEL} htmlFor="about-heroSubtitle">الوصف المختصر</label>
          <Textarea
            id="about-heroSubtitle"
            name="heroSubtitle"
            defaultValue={hero.subtitle}
            className={TEXTAREA}
          />
        </div>
      </section>

      {/* ─── STORY BLOCKS (3 in a row) ─── */}
      <section className="rounded-lg border border-border bg-card/40 p-4 space-y-4">
        <h3 className={SECTION_LABEL}>
          <span aria-hidden>📖</span>
          <span>القصة (3 مراحل)</span>
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((index) => {
            const block = storyBlocks[index] ?? { label: "", title: "", body: "" };
            return (
              <div key={`story-${index}`} className="space-y-2 rounded-md border border-border bg-background p-3">
                <div className="text-xs font-semibold text-muted-foreground">مرحلة {index + 1}</div>
                <div className={FIELD}>
                  <label className={LABEL}>التسمية</label>
                  <Input
                    name={`story_${index}_label`}
                    defaultValue={block.label}
                    className={INPUT}
                  />
                </div>
                <div className={FIELD}>
                  <label className={LABEL}>العنوان</label>
                  <Input
                    name={`story_${index}_title`}
                    defaultValue={block.title}
                    className={INPUT}
                  />
                </div>
                <div className={FIELD}>
                  <label className={LABEL}>النص</label>
                  <Textarea
                    name={`story_${index}_body`}
                    defaultValue={block.body}
                    className={TEXTAREA}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── VALUES (2x2 grid) ─── */}
      <section className="rounded-lg border border-border bg-card/40 p-4 space-y-4">
        <h3 className={SECTION_LABEL}>
          <span aria-hidden>💎</span>
          <span>القيم (4 قيم)</span>
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((index) => {
            const value = values[index] ?? { title: "", body: "" };
            return (
              <div key={`value-${index}`} className="space-y-2 rounded-md border border-border bg-background p-3">
                <div className="text-xs font-semibold text-muted-foreground">قيمة {index + 1}</div>
                <div className={FIELD}>
                  <label className={LABEL}>العنوان</label>
                  <Input
                    name={`value_${index}_title`}
                    defaultValue={value.title}
                    className={INPUT}
                  />
                </div>
                <div className={FIELD}>
                  <label className={LABEL}>الوصف</label>
                  <Textarea
                    name={`value_${index}_body`}
                    defaultValue={value.body}
                    className={TEXTAREA}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── FIT FOR / NOT FIT FOR (paired) ─── */}
      <section className="rounded-lg border border-border bg-card/40 p-4 space-y-4">
        <h3 className={SECTION_LABEL}>
          <span aria-hidden>🎯</span>
          <span>مناسب / غير مناسب</span>
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-fitFor">مناسب لك إذا (سطر لكل نقطة)</label>
            <Textarea
              id="about-fitFor"
              name="fitFor"
              defaultValue={fitFor.join("\n")}
              rows={6}
              className={TEXTAREA}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-notFitFor">قد لا يكون مناسباً إذا (سطر لكل نقطة)</label>
            <Textarea
              id="about-notFitFor"
              name="notFitFor"
              defaultValue={notFitFor.join("\n")}
              rows={6}
              className={TEXTAREA}
            />
          </div>
        </div>
      </section>

      {/* ─── LEGAL INFO (3-col compact grid) ─── */}
      <section className="rounded-lg border border-border bg-card/40 p-4 space-y-4">
        <h3 className={SECTION_LABEL}>
          <span aria-hidden>⚖️</span>
          <span>المعلومات القانونية</span>
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-legalName">الاسم القانوني</label>
            <Input
              id="about-legalName"
              name="legalName"
              defaultValue={legalInfo.legalName}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-registrationCountry">بلد/مدينة التسجيل</label>
            <Input
              id="about-registrationCountry"
              name="registrationCountry"
              defaultValue={legalInfo.registrationCountry}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-crNumber">رقم السجل التجاري</label>
            <Input
              id="about-crNumber"
              name="crNumber"
              defaultValue={legalInfo.crNumber}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-foundedAt">تاريخ التأسيس</label>
            <Input
              id="about-foundedAt"
              name="foundedAt"
              defaultValue={legalInfo.foundedAt}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-email">البريد الإلكتروني</label>
            <Input
              id="about-email"
              name="email"
              defaultValue={legalInfo.email}
              dir="ltr"
              className={`${INPUT} font-mono text-xs`}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-phone">رقم الجوال</label>
            <Input
              id="about-phone"
              name="phone"
              defaultValue={legalInfo.phone}
              dir="ltr"
              className={`${INPUT} font-mono text-xs`}
            />
          </div>
          <div className={`${FIELD} md:col-span-3`}>
            <label className={LABEL} htmlFor="about-address">العنوان البريدي</label>
            <Input
              id="about-address"
              name="address"
              defaultValue={legalInfo.address}
              className={INPUT}
            />
          </div>
          <div className={`${FIELD} md:col-span-3`}>
            <label className={LABEL} htmlFor="about-legalNote">ملاحظة توضيحية</label>
            <Textarea
              id="about-legalNote"
              name="legalNote"
              defaultValue={legalInfo.note ?? ""}
              className={TEXTAREA}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA (2-col grid) ─── */}
      <section className="rounded-lg border border-border bg-card/40 p-4 space-y-4">
        <h3 className={SECTION_LABEL}>
          <span aria-hidden>🚀</span>
          <span>الدعوة للعمل</span>
        </h3>
        <div className={FIELD}>
          <label className={LABEL} htmlFor="about-ctaTitle">عنوان الدعوة</label>
          <Input
            id="about-ctaTitle"
            name="ctaTitle"
            defaultValue={cta.title}
            className={INPUT}
          />
        </div>
        <div className={FIELD}>
          <label className={LABEL} htmlFor="about-ctaBody">نص الدعوة</label>
          <Textarea
            id="about-ctaBody"
            name="ctaBody"
            defaultValue={cta.body}
            className={TEXTAREA}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-ctaPrimaryLabel">نص الزر الرئيسي</label>
            <Input
              id="about-ctaPrimaryLabel"
              name="ctaPrimaryLabel"
              defaultValue={cta.primaryLabel}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-ctaPrimaryHref">رابط الزر الرئيسي</label>
            <Input
              id="about-ctaPrimaryHref"
              name="ctaPrimaryHref"
              defaultValue={cta.primaryHref}
              dir="ltr"
              className={`${INPUT} font-mono text-xs`}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-ctaSecondaryLabel">نص الرابط الثانوي</label>
            <Input
              id="about-ctaSecondaryLabel"
              name="ctaSecondaryLabel"
              defaultValue={cta.secondaryLabel}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor="about-ctaSecondaryHref">رابط الزر الثانوي</label>
            <Input
              id="about-ctaSecondaryHref"
              name="ctaSecondaryHref"
              defaultValue={cta.secondaryHref}
              dir="ltr"
              className={`${INPUT} font-mono text-xs`}
            />
          </div>
        </div>
      </section>

      <Button
        type="submit"
        id="about-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="about-form"
        submitButtonId="about-form-submit"
        triggerLabel="حفظ"
        description="سيتم حفظ التغييرات على صفحة من نحن."
      />
    </form>
  );
}
