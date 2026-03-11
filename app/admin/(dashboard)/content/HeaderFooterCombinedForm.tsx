"use client";

import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateHeaderFooterSections } from "@/app/actions/content-sections";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type HeaderFooterCombinedFormProps = {
  header: StaticLanding["header"];
  footer: StaticLanding["footer"];
  country: SupportedCountry;
};

export function HeaderFooterCombinedForm({
  header,
  footer,
  country,
}: HeaderFooterCombinedFormProps) {
  async function onSubmit(formData: FormData) {
    await updateHeaderFooterSections(formData);
  }

  return (
    <form
      id="header-footer-form"
      action={onSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="country" value={country} />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/header-footer?country=${country}`}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          تعديل الهيدر + الشعار
        </h2>
        <a
          href={`/admin/content/header-footer?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      <div className="space-y-4 rounded-md border border-border bg-muted/20 p-4">
        <h3 className="text-xs font-semibold text-muted-foreground">
          قسم الهيدر
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            إجمالي المقاعد
            <input
              name="seatsTotal"
              defaultValue={String(header.seats?.total ?? 0)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
            المقاعد المحجوزة
            <input
              name="seatsTaken"
              defaultValue={String(header.seats?.taken ?? 0)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          بداية الإعلان
          <input
            name="announcementPrefix"
            defaultValue={header.announcementPrefix}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          نهاية الإعلان
          <input
            name="announcementSuffix"
            defaultValue={header.announcementSuffix}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <div className="space-y-4 rounded-md border border-border bg-muted/20 p-4">
        <h3 className="text-xs font-semibold text-muted-foreground">
          قسم الشعار (Footer)
        </h3>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          الشعار (Tagline)
          <input
            name="tagline"
            defaultValue={footer.tagline}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          الوصف
          <input
            name="desc"
            defaultValue={footer.desc}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
          />
        </label>
      </div>

      <ConfirmSaveDialog
        formId="header-footer-form"
        triggerLabel="حفظ الهيدر + الشعار"
        description="سيتم حفظ التغييرات على قسم الهيدر وقسم الشعار (Footer) معاً للبلد المحدد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

