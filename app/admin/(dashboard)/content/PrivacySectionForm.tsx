"use client";

import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import type { StaticLanding } from "@/app/content/landing/types";
import type { SupportedCountry } from "@/lib/landing-content.types";

const MarkdownPageForm = dynamic(
  () =>
    import("../components/MarkdownPageForm").then((mod) => ({
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
  country: SupportedCountry;
};

export function PrivacySectionForm({ section, country }: Props): ReactElement {
  const redirectPath = `/admin/content/privacy?country=${country}`;
  return (
    <MarkdownPageForm
      formId="privacy-form"
      submitButtonId="privacy-form-submit"
      sectionValue="privacy"
      country={country}
      defaultTitle={section.title}
      defaultUpdatedAt={section.updatedAt ?? ""}
      defaultBody={section.body}
      redirectPath={redirectPath}
      defaultsHref={`${redirectPath}&useDefault=1`}
      sectionHeading="سياسة الخصوصية"
      bodyLabel="نص السياسة"
      saveLabel="حفظ سياسة الخصوصية"
      idPrefix="privacy"
      defaultsConfirmMessage="هل تريد استبدال محتوى السياسة بالنص الافتراضي؟ لا يمكن التراجع."
    />
  );
}
