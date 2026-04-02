"use client";

import { useState, useCallback, type ReactElement } from "react";
import { cn } from "@/lib/utils";
import type { AnalyticsData } from "@/lib/analytics";
import { fetchAnalyticsAction } from "@/app/actions/analytics";
import { DashboardCharts } from "./DashboardCharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type MetricKey = keyof Pick<
  AnalyticsData,
  "pageviews7d" | "activeUsersToday" | "signupStart7d" | "pricingView7d" | "whatsappClick7d"
>;

type AnalyticsPayload = {
  all: AnalyticsData;
  sa: AnalyticsData;
  eg: AnalyticsData;
  countryBreakdown: { country: string; views: number }[];
  topEvents: { event: string; count: number }[];
};

const VALID_DAYS = [7, 14, 30, 60, 90] as const;
type ValidDays = (typeof VALID_DAYS)[number];

const DAY_OPTIONS: { value: ValidDays; label: string }[] = [
  { value: 7, label: "٧ أيام" },
  { value: 14, label: "١٤ يوم" },
  { value: 30, label: "٣٠ يوم" },
  { value: 60, label: "٦٠ يوم" },
  { value: 90, label: "٩٠ يوم" },
];

// ─── Metric config ────────────────────────────────────────────────────────────

const ALL_METRIC_CONFIG: {
  label: string;
  key: MetricKey;
  icon: string;
  stripe: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  detailBorder: string;
  detailNumber: string;
}[] = [
  {
    label: "عدد الزيارات",
    key: "pageviews7d",
    icon: "👁",
    stripe: "bg-blue-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    hoverBorder: "hover:border-blue-500/50",
    detailBorder: "border-r-2 border-r-blue-500",
    detailNumber: "text-blue-400",
  },
  {
    label: "زوار نشطون",
    key: "activeUsersToday",
    icon: "👤",
    stripe: "bg-purple-500",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    hoverBorder: "hover:border-purple-500/50",
    detailBorder: "border-r-2 border-r-purple-500",
    detailNumber: "text-purple-400",
  },
  {
    label: "أبدوا اهتماماً",
    key: "signupStart7d",
    icon: "✍️",
    stripe: "bg-green-500",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    hoverBorder: "hover:border-green-500/50",
    detailBorder: "border-r-2 border-r-green-500",
    detailNumber: "text-green-400",
  },
  {
    label: "تصفّحوا الأسعار",
    key: "pricingView7d",
    icon: "💰",
    stripe: "bg-amber-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    hoverBorder: "hover:border-amber-500/50",
    detailBorder: "border-r-2 border-r-amber-500",
    detailNumber: "text-amber-400",
  },
  {
    label: "واتساب",
    key: "whatsappClick7d",
    icon: "💬",
    stripe: "bg-emerald-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-500/50",
    detailBorder: "border-r-2 border-r-emerald-500",
    detailNumber: "text-emerald-400",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return { start, end };
}

function formatArDate(date: Date): string {
  return date.toLocaleDateString("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isDataEmpty(data: AnalyticsData): boolean {
  return (
    data.pageviews7d === 0 &&
    data.activeUsersToday === 0 &&
    data.signupStart7d === 0 &&
    data.pricingView7d === 0 &&
    data.whatsappClick7d === 0
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function GaMetricCard({
  label,
  value,
  icon,
  stripe,
  iconBg,
  iconColor,
  hoverBorder,
}: {
  label: string;
  value: number;
  icon: string;
  stripe: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
}): ReactElement {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors",
        hoverBorder,
      )}
    >
      <div className={cn("absolute inset-y-0 end-0 w-1 rounded-s", stripe)} aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-black text-foreground">
            {value.toLocaleString("ar-SA")}
          </p>
        </div>
        <div className={cn("rounded-lg p-2 text-xl", iconBg, iconColor)} aria-hidden>
          {icon}
        </div>
      </div>
    </div>
  );
}

function MarketColumn({
  title,
  badge,
  data,
  periodLabel,
}: {
  title: string;
  badge: string;
  data: AnalyticsData;
  periodLabel: string;
}): ReactElement {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
          {badge} · {periodLabel}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ALL_METRIC_CONFIG.map((m) => (
          <div
            key={m.key}
            className={cn(
              "rounded-lg border border-border/80 bg-muted/20 px-3 py-2.5",
              m.detailBorder,
            )}
          >
            <p className="text-[11px] text-muted-foreground">{m.label}</p>
            <p className={cn("text-3xl font-black", m.detailNumber)}>
              {data[m.key].toLocaleString("ar-SA")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status banners ───────────────────────────────────────────────────────────

function ErrorBanner({ onRetry }: { onRetry: () => void }): ReactElement {
  return (
    <div className="mb-5 flex flex-wrap items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3.5">
      <span className="mt-0.5 text-base" aria-hidden>🔄</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">البيانات غير متاحة الآن</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          لم نتمكن من تحميل الإحصائيات — اضغط تحديث للمحاولة مرة أخرى.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
      >
        تحديث
      </button>
    </div>
  );
}

function NoDataBanner({ startDate }: { startDate: Date }): ReactElement {
  return (
    <div className="mb-5 flex flex-wrap items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3.5">
      <span className="mt-0.5 text-base" aria-hidden>📡</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-400">لا توجد بيانات لهذه الفترة</p>
        <p className="mt-0.5 text-xs text-amber-400/70 leading-relaxed">
          GA4 لم يسجّل أي زيارات منذ{" "}
          <span className="font-semibold text-amber-400">{formatArDate(startDate)}</span>.{" "}
          تأكد أن GTM مفعّل ومنشور على الموقع منذ هذا التاريخ — إذا كان ربط GTM حديثاً، جرّب فترة أقصر.
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Props = AnalyticsPayload & {
  saSubscribers: number;
  egSubscribers: number;
  initialError?: boolean;
};

export function AnalyticsSection({
  all: initialAll,
  sa: initialSa,
  eg: initialEg,
  countryBreakdown: initialBreakdown,
  topEvents: initialEvents,
  saSubscribers,
  egSubscribers,
  initialError = false,
}: Props): ReactElement {
  const [days, setDays] = useState<ValidDays>(7);
  const [data, setData] = useState<AnalyticsPayload>({
    all: initialAll,
    sa: initialSa,
    eg: initialEg,
    countryBreakdown: initialBreakdown,
    topEvents: initialEvents,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(initialError);

  const fetchData = useCallback(async (targetDays: ValidDays) => {
    setIsLoading(true);
    setFetchError(false);
    try {
      const json = await fetchAnalyticsAction(targetDays);
      setData(json);
    } catch {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDaysChange = useCallback(
    async (newDays: ValidDays) => {
      if (newDays === days || isLoading) return;
      setDays(newDays);
      await fetchData(newDays);
    },
    [days, isLoading, fetchData],
  );

  const handleRetry = useCallback(() => {
    void fetchData(days);
  }, [days, fetchData]);

  const { all, sa, eg, countryBreakdown, topEvents } = data;
  const { start: rangeStart, end: rangeEnd } = getDateRange(days);
  const periodLabel = `آخر ${days} يوم`;
  const isEmpty = !fetchError && isDataEmpty(all);

  const dotColor = fetchError
    ? "bg-red-500"
    : isLoading
      ? "bg-amber-400 animate-pulse"
      : isEmpty
        ? "bg-amber-400"
        : "animate-pulse bg-green-500";

  return (
    <div className={cn("transition-opacity duration-200", isLoading && "opacity-60 pointer-events-none")}>

      {/* Section header + toggle */}
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <span className={cn("h-2 w-2 shrink-0 rounded-full", dotColor)} aria-hidden />
        <h2 className="text-lg font-bold text-foreground">الزيارات والتفاعل</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          🌍 الكل
        </span>
        <div
          className="ms-auto flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1"
          role="group"
          aria-label="اختر الفترة الزمنية"
        >
          {DAY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => void handleDaysChange(opt.value)}
              disabled={isLoading}
              aria-pressed={days === opt.value}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-bold transition-all duration-150",
                days === opt.value
                  ? "bg-accent text-accent-foreground shadow-sm ring-1 ring-accent/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date range hint — always visible */}
      <p className="mb-4 text-[11px] text-muted-foreground/60" dir="rtl">
        {isLoading ? (
          "جاري التحميل…"
        ) : (
          <>
            <span className="font-medium text-muted-foreground">{formatArDate(rangeStart)}</span>
            {" — "}
            <span className="font-medium text-muted-foreground">{formatArDate(rangeEnd)}</span>
          </>
        )}
      </p>

      {/* Status banners */}
      {fetchError && <ErrorBanner onRetry={handleRetry} />}
      {isEmpty && !isLoading && <NoDataBanner startDate={rangeStart} />}

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ALL_METRIC_CONFIG.map((m) => (
          <GaMetricCard
            key={m.key}
            label={m.label}
            value={all[m.key]}
            icon={m.icon}
            stripe={m.stripe}
            iconBg={m.iconBg}
            iconColor={m.iconColor}
            hoverBorder={m.hoverBorder}
          />
        ))}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-purple-500/50">
          <div className="absolute inset-y-0 end-0 w-1 rounded-s bg-[#8b5cf6]" aria-hidden />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">إجمالي المشتركين</p>
              <p className="mt-1 text-3xl font-black text-foreground">
                {(saSubscribers + egSubscribers).toLocaleString("ar-SA")}
              </p>
            </div>
            <div className="rounded-lg p-2 text-xl text-[#8b5cf6] bg-[#8b5cf6]/20" aria-hidden>
              👥
            </div>
          </div>
        </div>
      </div>

      {/* Charts — only when there's data */}
      {!isEmpty && (
        <div className="mt-8">
          <DashboardCharts
            all={all}
            sa={sa}
            eg={eg}
            saSubscribers={saSubscribers}
            egSubscribers={egSubscribers}
            countryBreakdown={countryBreakdown}
            topEvents={topEvents}
            days={days}
          />
        </div>
      )}

      {/* Per-market breakdown */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <MarketColumn title="🇸🇦 أداء السوق السعودي" badge="SA" data={sa} periodLabel={periodLabel} />
        <MarketColumn title="🇪🇬 أداء السوق المصري" badge="EG" data={eg} periodLabel={periodLabel} />
      </div>
    </div>
  );
}
