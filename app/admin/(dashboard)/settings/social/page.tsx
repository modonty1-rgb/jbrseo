import { Suspense } from "react";
import { getSocialLinksSettings } from "@/app/actions/landing";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";
import { SocialLinksForm } from "../../components/SocialLinksForm";

export default async function AdminSettingsSocialPage() {
  const socialLinks = await getSocialLinksSettings();
  const redirect = `/admin/settings/social`;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">السوشال ميديا</h1>
      </div>

      <p className="mb-5 text-sm text-muted-foreground">
        أدخل روابط منصات التواصل. أي حقل فارغ لن يظهر كأيقونة في الموقع العام.
      </p>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>

      <SocialLinksForm socialLinks={socialLinks} redirect={redirect} />
    </div>
  );
}
