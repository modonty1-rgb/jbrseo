import { Suspense, type ReactElement } from "react";
import Link from "next/link";
import { getSubscriberStats } from "@/app/actions/subscribers";
import { getAllAnalyticsData, getCountryBreakdown, getTopEvents } from "@/lib/analytics";
import type { AnalyticsData } from "@/lib/analytics";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { cn } from "@/lib/utils";
import { AdminCountryPill } from "./components/AdminCountryPill";
import { DashboardCharts } from "./components/DashboardCharts";

async function getCountry(
  searchParams: Promise<{ country?: string }>,
): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

type MetricKey = keyof Pick<
  AnalyticsData,
  "pageviews7d" | "activeUsersToday" | "signupStart7d" | "pricingView7d" | "whatsappClick7d"
>;

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
}: {
  title: string;
  badge: string;
  data: AnalyticsData;
}): ReactElement {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
          {badge}
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

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const stats = await getSubscriberStats();

  const emptyMetrics: AnalyticsData = {
    pageviews7d: 0,
    activeUsersToday: 0,
    signupStart7d: 0,
    pricingView7d: 0,
    whatsappClick7d: 0,
    topPages: [],
  };

  let analyticsData: {
    all: AnalyticsData;
    sa: AnalyticsData;
    eg: AnalyticsData;
  } = { all: emptyMetrics, sa: emptyMetrics, eg: emptyMetrics };
  let countryBreakdown: { country: string; views: number }[] = [];
  let topEvents: { event: string; count: number }[] = [];
  let analyticsError = false;

  try {
    const [data, countries, events] = await Promise.all([
      getAllAnalyticsData(),
      getCountryBreakdown(),
      getTopEvents(),
    ]);
    analyticsData = data;
    countryBreakdown = countries;
    topEvents = events;
  } catch {
    analyticsError = true;
  }

  const { all, sa, eg } = analyticsData;

  const totalSubscribers = stats?.total ?? 0;
  const saCount = stats?.byCountry.SA ?? 0;
  const egCount = stats?.byCountry.EG ?? 0;
  const recentCount = stats?.last7Days ?? 0;
  const maxCountry = Math.max(saCount, egCount, 1);

  const pctSaOfTotal =
    totalSubscribers > 0 ? Math.round((saCount / totalSubscribers) * 100) : 0;
  const pctEgOfTotal =
    totalSubscribers > 0 ? Math.round((egCount / totalSubscribers) * 100) : 0;
  const pctSaBar = maxCountry > 0 ? Math.round((saCount / maxCountry) * 100) : 0;
  const pctEgBar = maxCountry > 0 ? Math.round((egCount / maxCountry) * 100) : 0;
  const pctRecentOfTotal =
    totalSubscribers > 0 ? Math.round((recentCount / totalSubscribers) * 100) : 0;

  const statCards: {
    label: string;
    value: number;
    icon: string | null;
    color: string;
    bgIcon: string;
    href: string | null;
  }[] = [
    {
      label: "إجمالي المشتركين",
      value: totalSubscribers,
      icon: "👥",
      color: "text-primary",
      bgIcon: "bg-primary/10",
      href: `/admin/subscribers?country=${country}`,
    },
    {
      label: "السعودية 🇸🇦",
      value: saCount,
      icon: null,
      color: "text-green-500",
      bgIcon: "bg-green-500/10",
      href: "/admin/subscribers?country=SA",
    },
    {
      label: "مصر 🇪🇬",
      value: egCount,
      icon: null,
      color: "text-blue-500",
      bgIcon: "bg-blue-500/10",
      href: "/admin/subscribers?country=EG",
    },
    {
      label: "آخر ٧ أيام",
      value: recentCount,
      icon: "📈",
      color: recentCount > 0 ? "text-green-500" : "text-muted-foreground",
      bgIcon: recentCount > 0 ? "bg-green-500/10" : "bg-muted",
      href: null,
    },
  ];

  const countryRows = [
    {
      label: "السعودية 🇸🇦",
      count: saCount,
      barClass: "bg-primary/80",
      totalPct: pctSaOfTotal,
      barPct: pctSaBar,
    },
    {
      label: "مصر 🇪🇬",
      count: egCount,
      barClass: "bg-blue-500/70",
      totalPct: pctEgOfTotal,
      barPct: pctEgBar,
    },
  ] as const;

  const quickLinks: { label: string; href: string; icon: string }[] = [
    { label: "الهيرو", href: `/admin/content/hero?country=${country}`, icon: "🏠" },
    {
      label: "التسعير",
      href: `/admin/content/pricing?country=${country}`,
      icon: "💰",
    },
    { label: "الأسئلة الشائعة", href: `/admin/content/faq?country=${country}`, icon: "❓" },
    {
      label: "الإثبات الاجتماعي",
      href: `/admin/content/socialProof?country=${country}`,
      icon: "⭐",
    },
    { label: "SEO", href: `/admin/settings/seo?country=${country}`, icon: "🔍" },
    { label: "السوشال ميديا", href: `/admin/settings/social?country=${country}`, icon: "📱" },
    { label: "الإعدادات", href: `/admin/settings?country=${country}`, icon: "⚙️" },
    {
      label: "المشتركون",
      href: `/admin/subscribers?country=${country}`,
      icon: "👥",
    },
    { label: "فريق العمل", href: `/admin/content/team?country=${country}`, icon: "🧑‍💼" },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
            البلد: {country === "SA" ? "السعودية" : "مصر"}
          </span>
          <Suspense fallback={null}>
            <AdminCountryPill />
          </Suspense>
        </div>
        <p className="text-sm text-muted-foreground">أداء موقعك — آخر ٧ أيام</p>
        <p className="mt-2 text-sm text-muted-foreground">
          عندك {totalSubscribers} مشترك — اختر قسماً لتعديله.
          <Link
            href={`/admin/subscribers?country=${country}`}
            className="ms-1 text-primary hover:underline"
          >
            عرض جميع المشتركين ←
          </Link>
        </p>
      </div>

      {analyticsError && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <span>
            تعذّر الاتصال بـ GA4 — البيانات غير متاحة حالياً. اضغط تحديث للمحاولة مرة أخرى.
          </span>
        </div>
      )}

      {totalSubscribers === 0 && (
        <div className="mb-6 rounded-lg border border-dashed border-border bg-muted/10 p-8 text-center">
          <p className="mb-2 text-2xl" aria-hidden>
            📭
          </p>
          <p className="text-sm font-medium text-foreground">لا مشتركين بعد</p>
          <p className="mt-1 text-xs text-muted-foreground">
            سيظهر هنا إحصاء المشتركين بمجرد تسجيل أول شخص
          </p>
        </div>
      )}

      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              analyticsError ? "bg-amber-500" : "animate-pulse bg-green-500",
            )}
            aria-hidden
          />
          <h2 className="text-lg font-bold text-foreground">إحصائيات موقعك — آخر ٧ أيام</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            🌍 الكل
          </span>
        </div>
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
            <div
              className="absolute inset-y-0 end-0 w-1 rounded-s bg-[#8b5cf6]"
              aria-hidden
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">مشتركون مدفوعون</p>
                <p className="mt-1 text-3xl font-black text-foreground">
                  {totalSubscribers.toLocaleString("ar-SA")}
                </p>
              </div>
              <div
                className="rounded-lg p-2 text-xl text-[#8b5cf6] bg-[#8b5cf6]/20"
                aria-hidden
              >
                👥
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">العملاء المشتركون</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <DashboardCharts
          all={all}
          sa={sa}
          eg={eg}
          saSubscribers={saCount}
          egSubscribers={egCount}
          countryBreakdown={countryBreakdown}
          topEvents={topEvents}
        />
      </section>

      <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <MarketColumn title="🇸🇦 أداء السوق السعودي" badge="SA" data={sa} />
        <MarketColumn title="🇪🇬 أداء السوق المصري" badge="EG" data={eg} />
      </section>

      {stats ? (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const body = (
                <>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                    {card.icon ? (
                      <span
                        className={cn("rounded-md p-1 text-base", card.bgIcon)}
                        aria-hidden
                      >
                        {card.icon}
                      </span>
                    ) : null}
                  </div>
                  <p className={cn("text-2xl font-bold", card.color)}>{card.value}</p>
                  {card.href ? (
                    <p className="mt-1 text-[10px] text-muted-foreground">انقر للتفاصيل →</p>
                  ) : null}
                </>
              );

              if (card.href) {
                return (
                  <Link
                    key={card.label}
                    href={card.href}
                    className={cn(
                      "block rounded-lg border border-border bg-card p-4 shadow-sm transition-colors",
                      "hover:border-primary/40",
                    )}
                  >
                    {body}
                  </Link>
                );
              }

              return (
                <div key={card.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  {body}
                </div>
              );
            })}
          </div>

          <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">توزيع المشتركين</h2>
              <Link
                href={`/admin/subscribers?country=${country}`}
                className="text-xs text-primary hover:underline"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-3">
              {countryRows.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">{row.label}</span>
                  <div className="h-5 min-w-0 flex-1 rounded-full bg-muted">
                    <div
                      className={cn("h-5 rounded-full transition-all duration-500", row.barClass)}
                      style={{ width: `${row.barPct}%` }}
                    />
                  </div>
                  <div className="w-20 shrink-0 text-end sm:w-24">
                    <span className="text-sm font-medium text-foreground">{row.count}</span>
                    <span className="ms-1 text-[10px] text-muted-foreground">
                      ({row.totalPct}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-foreground">نشاط آخر ٧ أيام</h2>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  recentCount > 0
                    ? "bg-green-500/10 text-green-500"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {recentCount > 0 ? `+${recentCount} هذا الأسبوع` : "لا اشتراكات هذا الأسبوع"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-5 min-w-0 flex-1 rounded-full bg-muted">
                <div
                  className="h-5 rounded-full bg-green-600/80 transition-all duration-500 dark:bg-green-500/70"
                  style={{ width: `${pctRecentOfTotal}%` }}
                />
              </div>
              <span className="shrink-0 text-sm text-muted-foreground">
                {recentCount} من {totalSubscribers} ({pctRecentOfTotal}% من الإجمالي)
              </span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              من إجمالي {totalSubscribers} مشترك هذا الأسبوع
            </p>
          </div>
        </>
      ) : null}

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">اختصارات سريعة</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50"
            >
              <span aria-hidden>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
