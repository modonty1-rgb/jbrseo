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
    };

  async function onSubmit(formData: FormData) {
    await updateSocialProofSection(formData);
  }

  return (
    <form id="social-proof-form" action={onSubmit} className="space-y-4">
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

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: testimonialsCount }).map((_, i) => {
          const t = getTestimonial(i);
          return (
            <div
              key={i}
              className="space-y-2 rounded-md border border-border bg-muted/30 p-2"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                شهادة {i + 1}
              </div>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الاسم
                <input
                  name={`testimonials_${i}_name`}
                  defaultValue={t.name}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الدور
                <input
                  name={`testimonials_${i}_role`}
                  defaultValue={t.role}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الشركة
                <input
                  name={`testimonials_${i}_company`}
                  defaultValue={t.company}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الاقتباس
                <textarea
                  name={`testimonials_${i}_quote`}
                  defaultValue={t.quote}
                  className="min-h-[60px] rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                المقياس
                <input
                  name={`testimonials_${i}_metric`}
                  defaultValue={t.metric}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                رابط الصورة (avatar)
                <input
                  name={`testimonials_${i}_avatarImg`}
                  defaultValue={t.avatarImg}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                عدد النجوم (1-5)
                <input
                  name={`testimonials_${i}_stars`}
                  defaultValue={String(t.stars ?? 5)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                الوسم
                <input
                  name={`testimonials_${i}_tag`}
                  defaultValue={t.tag}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </label>
            </div>
          );
        })}
      </div>

      <ConfirmSaveDialog
        formId="social-proof-form"
        triggerLabel="حفظ قسم الشهادات"
        description="سيتم حفظ التغييرات على قسم الشهادات للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

