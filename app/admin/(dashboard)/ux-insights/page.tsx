import type { ReactElement } from "react";
import {
  getClarityBreakdown,
  getClarityFrictionTrend,
  getClaritySummary,
  getClaritySyncStatus,
  getClarityWorstPages,
} from "@/lib/clarity/queries";
import { buildClarityLink, parseRange } from "./_helpers/format";
import { RangeSwitcher } from "./_components/RangeSwitcher";
import { SyncStatusBanner } from "./_components/SyncStatusBanner";
import { UxMetricCards } from "./_components/UxMetricCards";
import { TrendChart } from "./_components/TrendChart";
import { WorstPagesTable } from "./_components/WorstPagesTable";
import { DeviceBreakdown } from "./_components/DeviceBreakdown";

// Reads ?days + queries the DB — always dynamic. Never calls Clarity live; the
// daily cron is the only thing that talks to Clarity (see /api/cron/clarity).
export const dynamic = "force-dynamic";

export default async function UxInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}): Promise<ReactElement> {
  const days = parseRange((await searchParams).days);

  const [summary, worst, trend, devices, browsers, sync] = await Promise.all([
    getClaritySummary(days),
    getClarityWorstPages(days, 20),
    getClarityFrictionTrend(days),
    getClarityBreakdown(days, "Device"),
    getClarityBreakdown(days, "Browser"),
    getClaritySyncStatus(),
  ]);

  const clarityLink = buildClarityLink();
  const hasData =
    summary.sessions > 0 || worst.ranked.length > 0 || worst.insufficient.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">تحليل تجربة المستخدم</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            إشارات الإحباط ومقاييس التفاعل من Clarity — أسوأ الصفحات تجربةً أولاً.
          </p>
        </div>
        <RangeSwitcher current={days} />
      </div>

      <SyncStatusBanner status={sync} />

      {!hasData ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm font-semibold text-foreground">لا توجد بيانات بعد</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            تتراكم البيانات بعد أن يصبح سكربت Clarity حيّاً على الموقع وتُشغَّل المهمة
            المجدولة اليومية أول مرة. تظهر النتائج خلال يوم من انطلاق الحملة.
          </p>
        </div>
      ) : (
        <>
          <UxMetricCards summary={summary} />

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 text-[11px] font-semibold uppercase text-muted-foreground">
              اتجاه إشارات الإحباط عبر الزمن
            </div>
            <TrendChart data={trend} />
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-foreground">أسوأ الصفحات تجربةً</div>
            <WorstPagesTable data={worst} clarityLink={clarityLink} />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <DeviceBreakdown title="حسب الجهاز" data={devices} />
            <DeviceBreakdown title="حسب المتصفح" data={browsers} />
          </div>
        </>
      )}
    </div>
  );
}
