"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHeaderSection } from "@/app/actions/content-sections";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type HeaderSectionFormProps = {
  section: StaticLanding["header"];
  country: SupportedCountry;
};

export function HeaderSectionForm({ section, country }: HeaderSectionFormProps) {
  async function onSubmit(formData: FormData) {
    await updateHeaderSection(formData);
  }

  return (
    <form id="header-form" action={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="header" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/header?country=${country}`}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل قسم الهيدر
        </h2>
        <a
          href={`/admin/content/header?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          إجمالي المقاعد
          <Input
            name="seatsTotal"
            defaultValue={String(section.seats?.total ?? 0)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          المقاعد المحجوزة
          <Input
            name="seatsTaken"
            defaultValue={String(section.seats?.taken ?? 0)}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        بداية الإعلان
        <Input
          name="announcementPrefix"
          defaultValue={section.announcementPrefix}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        نهاية الإعلان
        <Input
          name="announcementSuffix"
          defaultValue={section.announcementSuffix}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <Button
        type="submit"
        id="header-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="header-form"
        submitButtonId="header-form-submit"
        triggerLabel="حفظ قسم الهيدر"
        description="سيتم حفظ التغييرات على قسم الهيدر (شريط المقاعد ونص الإعلان) للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}
