import { Suspense } from "react";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { DEFAULT_SITE_SETTINGS_JSON } from "@/lib/site-settings.types";
import { SeoForm } from "../../components/SeoForm";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";

export default async function AdminSettingsSeoPage() {
  const override = await getLandingSectionOverride("seo");
  const seo =
    override && typeof override === "object" && !Array.isArray(override)
      ? { ...DEFAULT_SITE_SETTINGS_JSON.seo, ...(override as Record<string, string>) }
      : DEFAULT_SITE_SETTINGS_JSON.seo;
  return (
    <div className="p-6">
      <div className="mb-4 flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">الظهور في البحث وبطاقات المشاركة</h1>
          <p className="text-sm text-muted-foreground">
            تعديل عنوان ووصف الموقع لنتائج غوغل، والرابط الرسمي، وصورة الرابط عند المشاركة في واتساب
            وفيسبوك وX.
          </p>
        </div>
      </div>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <SeoForm seo={seo} redirect="/admin/settings/seo" />
    </div>
  );
}
