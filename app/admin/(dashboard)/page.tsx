import { Suspense } from "react";
import { getSubscriberStats } from "@/app/actions/subscribers";
import { AdminCountryPill } from "./components/AdminCountryPill";

async function getCountry(searchParams: Promise<{ country?: string }>) {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  await getCountry(searchParams);
  const stats = await getSubscriberStats();
  const maxCountry = stats ? Math.max(stats.byCountry.SA, stats.byCountry.EG, 1) : 1;
  const total = stats?.total ?? 0;
  const pct7 = total > 0 ? Math.round((stats!.last7Days / total) * 100) : 0;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">لوحة التحكم</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">نظرة سريعة على المشتركين والنشاط.</p>

      {stats && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">إجمالي المشتركين</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">السعودية</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.byCountry.SA}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">مصر</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.byCountry.EG}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">آخر ٧ أيام</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.last7Days}</p>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-foreground">المشتركين حسب البلد</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">السعودية</span>
                <div className="min-w-0 flex-1 rounded-full bg-muted">
                  <div
                    className="h-6 rounded-full bg-primary/80"
                    style={{ width: `${(stats.byCountry.SA / maxCountry) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-medium text-foreground">{stats.byCountry.SA}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">مصر</span>
                <div className="min-w-0 flex-1 rounded-full bg-muted">
                  <div
                    className="h-6 rounded-full bg-primary/60"
                    style={{ width: `${(stats.byCountry.EG / maxCountry) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-sm font-medium text-foreground">{stats.byCountry.EG}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-foreground">نشاط آخر ٧ أيام</h2>
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1 rounded-full bg-muted">
                <div
                  className="h-6 rounded-full bg-green-600/80 dark:bg-green-500/70"
                  style={{ width: `${pct7}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.last7Days} من {stats.total} ({pct7}%)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
