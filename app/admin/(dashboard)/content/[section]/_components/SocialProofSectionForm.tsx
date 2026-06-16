"use client";

import { useEffect, type ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateSocialProofSection } from "@/app/actions/content-sections";
import { autoResize } from "@/lib/autoResize";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../../../_components/ConfirmSaveDialog";
import { UnsavedChangesBar } from "../../../_components/UnsavedChangesBar";

const SOCIAL_PROOF_FORM_ID = "social-proof-form";

type SocialProofSectionFormProps = {
  section: StaticLanding["socialProof"];
  country: SupportedCountry;
};

const LABEL = "text-sm font-medium text-foreground";
const FIELD = "flex flex-col gap-1.5";
const INPUT = "rounded-md border border-border bg-background px-3 py-2 text-sm";

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
      videoUrl: "",
      mediaImage: "",
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
      <form id={SOCIAL_PROOF_FORM_ID} action={updateSocialProofSection} className="space-y-6">
        <input type="hidden" name="country" value={country} />
        <input type="hidden" name="section" value="socialProof" />
        <input
          type="hidden"
          name="redirect"
          value={`/admin/content/socialProof?country=${country}`}
        />
        <input type="hidden" name="testimonialsCount" value={testimonialsCount} />

        {/* Header — 3 cols: eyebrow + title + subtitle */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${SOCIAL_PROOF_FORM_ID}-eyebrow`}>اسم القسم</label>
            <Input
              id={`${SOCIAL_PROOF_FORM_ID}-eyebrow`}
              name="eyebrow"
              defaultValue={section.eyebrow}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${SOCIAL_PROOF_FORM_ID}-title`}>العنوان الرئيسي</label>
            <Input
              id={`${SOCIAL_PROOF_FORM_ID}-title`}
              name="title"
              defaultValue={section.title}
              className={INPUT}
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL} htmlFor={`${SOCIAL_PROOF_FORM_ID}-subtitle`}>العنوان الفرعي</label>
            <Input
              id={`${SOCIAL_PROOF_FORM_ID}-subtitle`}
              name="subtitle"
              defaultValue={section.subtitle}
              className={INPUT}
            />
          </div>
        </div>

        {/* Testimonials — each testimonial card grouped */}
        <div className="border-t border-border/60 pt-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-base" aria-hidden>⭐</span>
            <h3 className="text-sm font-bold text-foreground">شهادات العملاء ({testimonialsCount})</h3>
          </div>
          <div className="space-y-4">
            {Array.from({ length: testimonialsCount }).map((_, i) => {
              const t = getTestimonial(i);
              return (
                <div key={i} className="space-y-3 rounded-md border border-border bg-card/40 p-4">
                  <div className="text-xs font-semibold text-muted-foreground">الشهادة {i + 1}</div>

                  {/* Row 1: name + role + company (identity) */}
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className={FIELD}>
                      <label className={LABEL}>الاسم</label>
                      <Input name={`testimonials_${i}_name`} defaultValue={t.name} className={INPUT} />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>المنصب</label>
                      <Input name={`testimonials_${i}_role`} defaultValue={t.role} className={INPUT} />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>الشركة</label>
                      <Input name={`testimonials_${i}_company`} defaultValue={t.company} className={INPUT} />
                    </div>
                  </div>

                  {/* Row 2: metric (full — usually short but standalone result line) */}
                  <div className={FIELD}>
                    <label className={LABEL}>مقياس النتيجة</label>
                    <Input name={`testimonials_${i}_metric`} defaultValue={t.metric} className={INPUT} />
                  </div>

                  {/* Row 3: quote (textarea, full width) */}
                  <div className={FIELD}>
                    <label className={LABEL}>نص الاقتباس</label>
                    <Textarea
                      name={`testimonials_${i}_quote`}
                      rows={3}
                      defaultValue={t.quote}
                      className="min-h-0 resize-none overflow-hidden rounded-md border border-border bg-background px-3 py-2 text-sm"
                      onInput={autoResize}
                    />
                  </div>

                  {/* Row 4: media — avatar + videoUrl + mediaImage */}
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className={FIELD}>
                      <label className={LABEL}>صورة الشخص</label>
                      <Input
                        name={`testimonials_${i}_avatarImg`}
                        defaultValue={t.avatarImg}
                        dir="ltr"
                        className={`${INPUT} font-mono text-xs`}
                      />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>رابط فيديو YouTube</label>
                      <Input
                        name={`testimonials_${i}_videoUrl`}
                        defaultValue={t.videoUrl}
                        placeholder="https://www.youtube.com/..."
                        dir="ltr"
                        className={`${INPUT} font-mono text-xs`}
                      />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>صورة بديلة بدون فيديو</label>
                      <Input
                        name={`testimonials_${i}_mediaImage`}
                        defaultValue={t.mediaImage ?? ""}
                        placeholder="https://res.cloudinary.com/..."
                        dir="ltr"
                        className={`${INPUT} font-mono text-xs`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
          triggerLabel="حفظ"
          description="سيتم حفظ التغييرات على قسم الشهادات."
        />
      </form>
      <UnsavedChangesBar formId={SOCIAL_PROOF_FORM_ID} />
    </>
  );
}
