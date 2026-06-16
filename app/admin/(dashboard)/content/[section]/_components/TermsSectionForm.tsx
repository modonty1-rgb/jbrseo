"use client";

import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";

const MarkdownPageForm = dynamic(
  () =>
    import("../../../_components/MarkdownPageForm").then((mod) => ({
      default: mod.MarkdownPageForm,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="py-8 text-center text-sm text-muted-foreground"
        aria-busy="true"
      >
        جاري تحميل المحرّر…
      </div>
    ),
  },
);

type Props = {
  section: StaticLanding["terms"];
};

export function TermsSectionForm({ section }: Props): ReactElement {
  const redirectPath = `/admin/content/terms`;
  return (
    <MarkdownPageForm
      formId="terms-form"
      submitButtonId="terms-form-submit"
      sectionValue="terms"
      defaultTitle={section.title}
      defaultUpdatedAt={section.updatedAt ?? ""}
      defaultBody={section.body}
      redirectPath={redirectPath}
      sectionHeading="شروط الاستخدام"
      bodyLabel="نص الشروط"
      saveLabel="حفظ شروط الاستخدام"
      idPrefix="terms"
    />
  );
}
