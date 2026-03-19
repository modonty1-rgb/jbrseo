"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateAboutSection } from "@/app/actions/content-sections";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type AboutSectionFormProps = {
  section: StaticLanding["about"];
  country: SupportedCountry;
};

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
    <form
      id="about-form"
      action={onSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="about" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/about?country=${country}`}
      />

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Hero (من نحن)</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground md:col-span-1">
            سطر فوق العنوان (اختياري)
            <input
              name="heroEyebrow"
              defaultValue={hero.eyebrow ?? ""}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground md:col-span-2">
            العنوان الرئيسي
            <input
              name="heroTitle"
              defaultValue={hero.title}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          الوصف المختصر
          <textarea
            name="heroSubtitle"
            defaultValue={hero.subtitle}
            className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">القصة (٣ كروت)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {storyBlocks.map((block, index) => (
            <div key={index} className="space-y-2 rounded-md border border-border/60 bg-card/40 p-3">
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
                التسمية (مثل البداية)
                <input
                  name={`story_${index}_label`}
                  defaultValue={block.label}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
                العنوان
                <input
                  name={`story_${index}_title`}
                  defaultValue={block.title}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
                النص
                <textarea
                  name={`story_${index}_body`}
                  defaultValue={block.body}
                  className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">القيم / ما يميزنا</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((value, index) => (
            <div key={index} className="space-y-2 rounded-md border border-border/60 bg-card/40 p-3">
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
                العنوان
                <input
                  name={`value_${index}_title`}
                  defaultValue={value.title}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted-foreground">
                الوصف
                <textarea
                  name={`value_${index}_body`}
                  defaultValue={value.body}
                  className="min-h-[60px] rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">لمن الخدمة / لمن لا تناسب</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            مناسب لك إذا (سطر لكل نقطة)
            <textarea
              name="fitFor"
              defaultValue={fitFor.join("\n")}
              className="min-h-[80px] rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            قد لا يكون مناسباً إذا (سطر لكل نقطة)
            <textarea
              name="notFitFor"
              defaultValue={notFitFor.join("\n")}
              className="min-h-[80px] rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">معلومات قانونية</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            الاسم القانوني
            <input
              name="legalName"
              defaultValue={legalInfo.legalName}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            بلد / مدينة التسجيل
            <input
              name="registrationCountry"
              defaultValue={legalInfo.registrationCountry}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            رقم السجل التجاري
            <input
              name="crNumber"
              defaultValue={legalInfo.crNumber}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            تاريخ التأسيس
            <input
              name="foundedAt"
              defaultValue={legalInfo.foundedAt}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground md:col-span-2">
            العنوان البريدي
            <input
              name="address"
              defaultValue={legalInfo.address}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            البريد الإلكتروني
            <input
              name="email"
              defaultValue={legalInfo.email}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            رقم الجوال / التواصل
            <input
              name="phone"
              defaultValue={legalInfo.phone}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground md:col-span-2">
            ملاحظة توضيحية (اختيارية)
            <textarea
              name="legalNote"
              defaultValue={legalInfo.note ?? ""}
              className="min-h-[60px] rounded-md border border-border bg-background px-2 py-1 text-[11px]"
            />
          </label>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground">دعوة لاتخاذ خطوة (CTA)</h2>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          العنوان
          <input
            name="ctaTitle"
            defaultValue={cta.title}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          النص
          <textarea
            name="ctaBody"
            defaultValue={cta.body}
            className="min-h-[70px] rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            نص الزر الرئيسي
            <input
              name="ctaPrimaryLabel"
              defaultValue={cta.primaryLabel}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            رابط الزر الرئيسي
            <input
              name="ctaPrimaryHref"
              defaultValue={cta.primaryHref}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            نص الرابط الثانوي
            <input
              name="ctaSecondaryLabel"
              defaultValue={cta.secondaryLabel}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            رابط الزر الثانوي
            <input
              name="ctaSecondaryHref"
              defaultValue={cta.secondaryHref}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        id="about-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="about-form"
        submitButtonId="about-form-submit"
        triggerLabel="حفظ صفحة من نحن"
        description="سيتم حفظ جميع التغييرات على صفحة من نحن (القصة، القيم، الفريق، المعلومات القانونية، و CTA) للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

