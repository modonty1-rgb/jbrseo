"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateFooterSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type FooterSectionFormProps = {
  section: StaticLanding["footer"];
  country: SupportedCountry;
};

export function FooterSectionForm({ section, country }: FooterSectionFormProps) {
  async function onSubmit(formData: FormData) {
    await updateFooterSection(formData);
  }

  return (
    <form id="footer-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="footer" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/footer?country=${country}`}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل الشعار (Footer)
        </h2>
        <a
          href={`/admin/content/footer?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        الشعار (Tagline)
        <Textarea
          name="tagline"
          defaultValue={section.tagline}
          rows={3}
          className="min-h-18 rounded-md border border-border bg-background px-2 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        الوصف
        <Input
          name="desc"
          defaultValue={section.desc}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <Button
        type="submit"
        id="footer-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="footer-form"
        submitButtonId="footer-form-submit"
        triggerLabel="حفظ الشعار"
        description="سيتم حفظ التغييرات على الشعار (Footer) للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
