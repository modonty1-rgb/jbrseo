"use client";

import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";

const MarkdownPageForm = dynamic(
  () =>
    import("../_components/MarkdownPageForm").then((mod) => ({
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
  section: StaticLanding["privacy"];
};

export function PrivacySectionForm({ section }: Props): ReactElement {
  const redirectPath = `/admin/content/privacy`;
  return (
    <MarkdownPageForm
      formId="privacy-form"
      submitButtonId="privacy-form-submit"
      sectionValue="privacy"
      defaultTitle={section.title}
      defaultUpdatedAt={section.updatedAt ?? ""}
      defaultBody={section.body}
      redirectPath={redirectPath}
      sectionHeading="سياسة الخصوصية"
      bodyLabel="نص السياسة"
      saveLabel="حفظ سياسة الخصوصية"
      idPrefix="privacy"
    />
  );
}
