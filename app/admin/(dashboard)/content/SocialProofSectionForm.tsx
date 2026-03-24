"use client";

import { useEffect, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateSocialProofSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../components/UnsavedChangesBar";

const SOCIAL_PROOF_FORM_ID = "social-proof-form";

type SocialProofSectionFormProps = {
  section: StaticLanding["socialProof"];
  country: SupportedCountry;
};

export function SocialProofSectionForm({ section, country }: SocialProofSectionFormProps): ReactElement {
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
      mediaImage: "",
      siteLink: "",
    };

  useEffect(() => {
    const form = document.getElementById(SOCIAL_PROOF_FORM_ID);
    if (!form) return;
    const resize = (ta: HTMLTextAreaElement) => {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    };
    form
      .querySelectorAll<HTMLTextAreaElement>('textarea[name^="testimonials_"][name$="_quote"]')
      .forEach(resize);
  }, []);

  return (
    <>
      <form id={SOCIAL_PROOF_FORM_ID} action={updateSocialProofSection} className="space-y-4">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="socialProof" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/socialProof?country=${country}`}
        />
        <input type="hidden" name="testimonialsCount" value={testimonialsCount} />

        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">تعديل قسم الشهادات</h2>
          <a
            href={`/admin/content/socialProof?country=${country}&useDefault=1`}
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
            إعدادات القسم
          </p>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${SOCIAL_PROOF_FORM_ID}-eyebrow`}>
            اسم القسم (Eyebrow)
            <Input
              id={`${SOCIAL_PROOF_FORM_ID}-eyebrow`}
              name="eyebrow"
              defaultValue={section.eyebrow}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${SOCIAL_PROOF_FORM_ID}-title`}>
              العنوان الرئيسي
              <Input
                id={`${SOCIAL_PROOF_FORM_ID}-title`}
                name="title"
                defaultValue={section.title}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${SOCIAL_PROOF_FORM_ID}-subtitle`}>
              العنوان الفرعي
              <Input
                id={`${SOCIAL_PROOF_FORM_ID}-subtitle`}
                name="subtitle"
                defaultValue={section.subtitle}
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground" htmlFor={`${SOCIAL_PROOF_FORM_ID}-founding`}>
            <span className="inline-flex flex-wrap items-center gap-1">
              نص التأسيس
              <span className="text-[10px] font-normal text-muted-foreground">(شريط أو جملة تحت العنوان)</span>
            </span>
            <Input
              id={`${SOCIAL_PROOF_FORM_ID}-founding`}
              name="founding"
              defaultValue={section.founding}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>

        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-muted-foreground">الشهادات ({testimonialsCount})</span>
          <span className="text-[10px] text-muted-foreground">الحد الأقصى: {testimonialsCount} شهادة</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: testimonialsCount }).map((_, i) => {
            const t = getTestimonial(i);
            return (
              <div
                key={i}
                className="space-y-3 rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <span className="text-xs font-bold text-primary">شهادة {i + 1}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    الاسم
                    <Input
                      name={`testimonials_${i}_name`}
                      defaultValue={t.name}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    المنصب / الدور
                    <Input
                      name={`testimonials_${i}_role`}
                      defaultValue={t.role}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    الشركة
                    <Input
                      name={`testimonials_${i}_company`}
                      defaultValue={t.company}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    مقياس النتيجة
                    <Input
                      name={`testimonials_${i}_metric`}
                      defaultValue={t.metric}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    عدد النجوم
                    <Input
                      name={`testimonials_${i}_stars`}
                      defaultValue={String(t.stars ?? 5)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    الوسم / القطاع
                    <Input
                      name={`testimonials_${i}_tag`}
                      defaultValue={t.tag}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                  نص الاقتباس
                  <Textarea
                    name={`testimonials_${i}_quote`}
                    rows={3}
                    defaultValue={t.quote}
                    className="min-h-0 w-full resize-none overflow-hidden rounded-md border border-border bg-background px-2 py-1 text-xs"
                    onInput={autoResize}
                  />
                </label>

                <div className="space-y-2 rounded-md border border-border/80 bg-background/40 p-2">
                  <p className="text-[10px] font-semibold text-muted-foreground">الوسائط والروابط</p>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    رابط صورة الشخص (Cloudinary)
                    <Input
                      name={`testimonials_${i}_avatarImg`}
                      defaultValue={t.avatarImg}
                      dir="ltr"
                      className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    رابط موقع الشركة
                    <Input
                      name={`testimonials_${i}_siteLink`}
                      type="text"
                      defaultValue={t.siteLink ?? ""}
                      placeholder="https://..."
                      dir="ltr"
                      className="rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    <span className="inline-flex flex-wrap items-center gap-1">
                      رابط فيديو YouTube
                      <span className="text-[9px] font-normal opacity-80">(اختياري)</span>
                    </span>
                    <Input
                      name={`testimonials_${i}_videoUrl`}
                      defaultValue={t.videoUrl}
                      placeholder="https://www.youtube.com/..."
                      dir="ltr"
                      className="rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    <span className="inline-flex flex-wrap items-center gap-1">
                      نص زر الفيديو
                      <span className="text-[9px] font-normal opacity-80">(اختياري)</span>
                    </span>
                    <Input
                      name={`testimonials_${i}_videoLabel`}
                      defaultValue={t.videoLabel}
                      className="rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                    <span className="inline-flex flex-wrap items-center gap-1">
                      صورة بديلة بدون فيديو
                      <span className="text-[9px] font-normal opacity-80">(Cloudinary — اختياري)</span>
                    </span>
                    <Input
                      name={`testimonials_${i}_mediaImage`}
                      defaultValue={t.mediaImage ?? ""}
                      placeholder="https://res.cloudinary.com/..."
                      dir="ltr"
                      className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px]"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="submit"
          id="social-proof-form-submit"
          className="hidden"
          tabIndex={-1}
          aria-hidden
        />
        <ConfirmSaveDialog
          formId={SOCIAL_PROOF_FORM_ID}
          submitButtonId="social-proof-form-submit"
          triggerLabel="حفظ قسم الشهادات"
          description="سيتم حفظ التغييرات على قسم الشهادات للسعودية ومصر معًا. هل أنت متأكد من المتابعة؟"
        />
      </form>
      <UnsavedChangesBar formId={SOCIAL_PROOF_FORM_ID} />
    </>
  );
}
