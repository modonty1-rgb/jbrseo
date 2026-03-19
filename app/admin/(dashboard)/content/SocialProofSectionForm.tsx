"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateSocialProofSection } from "@/app/actions/content-sections";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type SocialProofSectionFormProps = {
  section: StaticLanding["socialProof"];
  country: SupportedCountry;
};

export function SocialProofSectionForm({ section, country }: SocialProofSectionFormProps) {
  const testimonials = section.testimonials ?? [];
  const testimonialsCount = testimonials.length || 3;

  const getTestimonial = (i: number) =>
    testimonials[i] ?? {
      name: "",
      role: "",
      company: "",
      quote: "",
      metric: "",
      avatarImg: "",
      stars: 5,
      tag: "",
      videoUrl: "",
      videoLabel: "",
      siteLink: "",
    };

  return (
    <form id="social-proof-form" action={updateSocialProofSection} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="socialProof" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/socialProof?country=${country}`}
      />
      <input type="hidden" name="testimonialsCount" value={testimonialsCount} />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم الشهادات
        </h2>
        <a
          href={`/admin/content/socialProof?country=${country}&useDefault=1`}
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

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        نص التأسيس
        <input
          name="founding"
          defaultValue={section.founding}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <div className="grid grid-cols-1 gap-2">
        {Array.from({ length: testimonialsCount }).map((_, i) => {
          const t = getTestimonial(i);
          return (
            <div
              key={i}
              className="space-y-1.5 rounded border border-border bg-muted/20 px-2 py-1.5"
            >
              <div className="text-[10px] font-medium text-muted-foreground">
                شهادة {i + 1}
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-3">
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                  الاسم
                  <input
                    name={`testimonials_${i}_name`}
                    defaultValue={t.name}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                  الدور
                  <input
                    name={`testimonials_${i}_role`}
                    defaultValue={t.role}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                  الشركة
                  <input
                    name={`testimonials_${i}_company`}
                    defaultValue={t.company}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground sm:col-span-2">
                  المقياس
                  <input
                    name={`testimonials_${i}_metric`}
                    defaultValue={t.metric}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                  النجوم
                  <input
                    name={`testimonials_${i}_stars`}
                    defaultValue={String(t.stars ?? 5)}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground sm:col-span-3">
                  الوسم
                  <input
                    name={`testimonials_${i}_tag`}
                    defaultValue={t.tag}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                الاقتباس
                <textarea
                  name={`testimonials_${i}_quote`}
                  defaultValue={t.quote}
                  className="min-h-[44px] rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                />
              </label>
              <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-2">
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                  صورة
                  <input
                    name={`testimonials_${i}_avatarImg`}
                    defaultValue={t.avatarImg}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground">
                  رابط الموقع
                  <input
                    name={`testimonials_${i}_siteLink`}
                    type="text"
                    defaultValue={t.siteLink ?? ""}
                    placeholder="https://..."
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground sm:col-span-2">
                  فيديو
                  <input
                    name={`testimonials_${i}_videoUrl`}
                    defaultValue={t.videoUrl}
                    placeholder="رابط الفيديو"
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
                <label className="flex flex-col gap-0.5 text-[10px] text-muted-foreground sm:col-span-2">
                  نص زر الفيديو
                  <input
                    name={`testimonials_${i}_videoLabel`}
                    defaultValue={t.videoLabel}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px]"
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        id="social-proof-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="social-proof-form"
        submitButtonId="social-proof-form-submit"
        triggerLabel="حفظ قسم الشهادات"
        description="سيتم حفظ التغييرات على قسم الشهادات للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

