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
  section: StaticLanding["terms"];
  country: SupportedCountry;
};

export function TermsSectionForm({ section, country }: Props): ReactElement {
  const redirectPath = `/admin/content/terms?country=${country}`;
  return (
    <MarkdownPageForm
      formId="terms-form"
      submitButtonId="terms-form-submit"
      sectionValue="terms"
      country={country}
      defaultTitle={section.title}
      defaultUpdatedAt={section.updatedAt ?? ""}
      defaultBody={section.body}
      redirectPath={redirectPath}
      defaultsHref={`${redirectPath}&useDefault=1`}
      sectionHeading="شروط الاستخدام"
      bodyLabel="نص الشروط"
      saveLabel="حفظ شروط الاستخدام"
      idPrefix="terms"
      defaultsConfirmMessage="هل تريد استبدال نص الشروط بالنص الافتراضي؟ لا يمكن التراجع."
    />
  );
}
