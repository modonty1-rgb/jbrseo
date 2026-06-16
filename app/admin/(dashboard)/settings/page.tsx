import { Suspense } from "react";
import Link from "next/link";
import { getGlobalSiteSettings } from "@/app/actions/landing";
import { GeneralSettingsForm } from "../components/GeneralSettingsForm";
import { TrackingForm } from "../components/TrackingForm";
import { AdminFormFeedback } from "../components/AdminFormFeedback";

export default async function AdminSettingsPage() {
  const globalRow = await getGlobalSiteSettings();
  const redirect = `/admin/settings`;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">الإعدادات</h1>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        إعدادات عامة للموقع مثل نص زر الدعوة ورقم التواصل، بالإضافة لرموز التتبع والتحليلات.
      </p>
      <Link
        href="/admin/settings/social"
        className="mb-5 block rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
      >
        <div className="mb-1 flex items-center gap-2">
          <span aria-hidden>📱</span>
          <h2 className="text-sm font-semibold text-foreground">قسم السوشال ميديا</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          إدارة روابط الشبكات الاجتماعية، الإثبات الاجتماعي، وبطاقات المشاركة من مكان واحد.
        </p>
      </Link>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>

      <div className="space-y-6">
        <GeneralSettingsForm
          site={{ showSectionCounter: false, whatsappNumber: globalRow?.whatsappNumber ?? "" }}
          redirect={redirect}
        />
        <TrackingForm
          tracking={{
            gtmId: globalRow?.gtmId ?? "",
          }}
          redirect={redirect}
        />
      </div>
    </div>
  );
}
