"use client";

import { useState } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { updateSection } from "@/app/actions/content-sections";
import { ConfirmSaveDialog } from "../components/ConfirmSaveDialog";

type Props = {
  section: StaticLanding["terms"];
  country: SupportedCountry;
};

export function TermsSectionForm({ section, country }: Props) {
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = e.currentTarget;
    const dataInput = form.querySelector('input[name="data"]') as HTMLInputElement | null;
    if (dataInput) {
      const payload = {
        title: (form.elements.namedItem("title") as HTMLInputElement | null)?.value ?? section.title,
        updatedAt:
          (form.elements.namedItem("updatedAt") as HTMLInputElement | null)?.value ||
          section.updatedAt ||
          "",
        body:
          (form.elements.namedItem("body") as HTMLTextAreaElement | null)?.value ??
          section.body,
      };
      dataInput.value = JSON.stringify(payload);
    }
    const fd = new FormData(form);
    try {
      setPending(true);
      await updateSection(fd);
    } finally {
      setPending(false);
    }
  }

  return (
    <form id="terms-form" onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="section" value="terms" />
      <input
        type="hidden"
        name="redirect"
        value={`/admin/content/terms?country=${country}`}
      />
      <input type="hidden" name="data" value="" />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">
          شروط الاستخدام
        </h2>
        <a
          href={`/admin/content/terms?country=${country}&useDefault=1`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          تحميل القيم الافتراضية
        </a>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        عنوان الصفحة
        <input
          name="title"
          defaultValue={section.title}
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        آخر تحديث (اختياري)
        <input
          name="updatedAt"
          defaultValue={section.updatedAt ?? ""}
          placeholder="2025-01-01"
          className="rounded-md border border-border bg-background px-2 py-1 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
        نص الشروط
        <textarea
          name="body"
          defaultValue={section.body}
          className="min-h-[220px] rounded-md border border-border bg-background px-2 py-1 text-sm leading-relaxed"
        />
      </label>

      <button
        type="submit"
        id="terms-form-submit"
        className="hidden"
        tabIndex={-1}
        aria-hidden
      />
      <ConfirmSaveDialog
        formId="terms-form"
        submitButtonId="terms-form-submit"
        pending={pending}
        triggerLabel="حفظ شروط الاستخدام"
        confirmLabel="تأكيد الحفظ"
        description="سيتم استبدال نص شروط الاستخدام الحالي للبلد المحدد بالمحتوى الجديد. هل أنت متأكد من المتابعة؟"
      />
    </form>
  );
}

