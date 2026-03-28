"use client";

import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface MarketData {
  pageviews7d: number;
  activeUsersToday: number;
  signupStart7d: number;
  pricingView7d: number;
  whatsappClick7d: number;
  topPages: { page: string; views: number }[];
}

interface DashboardChartsProps {
  all: MarketData;
  sa: MarketData;
  eg: MarketData;
  saSubscribers: number;
  egSubscribers: number;
  countryBreakdown: { country: string; views: number }[];
}

const COLORS = {
  blue: "#3b82f6",
  purple: "#8b5cf6",
  green: "#10b981",
  amber: "#f59e0b",
  emerald: "#059669",
  grid: "#1f2937",
  text: "#6b7280",
};

const tooltipStyle = {
  contentStyle: {
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: "12px",
    color: "#f1f5f9",
    fontSize: 13,
    padding: "10px 14px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  cursor: { fill: "rgba(255,255,255,0.04)" },
  itemStyle: { color: "#94a3b8" },
};

type PieEntry = { name: string; value: number; color: string };

const COUNTRY_NAMES: Record<string, string> = {
  "Saudi Arabia": "السعودية",
  Egypt: "مصر",
  "United Arab Emirates": "الإمارات",
  Kuwait: "الكويت",
  Qatar: "قطر",
  Bahrain: "البحرين",
  Jordan: "الأردن",
  Oman: "عُمان",
  Iraq: "العراق",
  "United States": "أمريكا",
  "United Kingdom": "بريطانيا",
  Germany: "ألمانيا",
  France: "فرنسا",
  Turkey: "تركيا",
  "(not set)": "غير محدد",
};

const PIE_COLORS = [
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#f43f5e",
  "#06b6d4",
  "#84cc16",
  "#f97316",
];

export function DashboardCharts({
  all,
  sa,
  eg,
  saSubscribers,
  egSubscribers,
  countryBreakdown,
}: DashboardChartsProps): ReactElement {
  const conversionRate =
    all.pageviews7d > 0 ? ((all.signupStart7d / all.pageviews7d) * 100).toFixed(1) : "0";

  const funnelData = [
    { name: "زيارات", value: all.pageviews7d, fill: COLORS.blue },
    { name: "نشطون", value: all.activeUsersToday, fill: COLORS.purple },
    { name: "بدأوا التسجيل", value: all.signupStart7d, fill: COLORS.green },
    { name: "شاهدوا الأسعار", value: all.pricingView7d, fill: COLORS.amber },
    { name: "تواصل واتساب", value: all.whatsappClick7d, fill: COLORS.emerald },
  ];

  const countryData = [
    {
      name: "🇸🇦 السعودية",
      زيارات: sa.pageviews7d,
      "بدأ التسجيل": sa.signupStart7d,
      نشطون: sa.activeUsersToday,
    },
    {
      name: "🇪🇬 مصر",
      زيارات: eg.pageviews7d,
      "بدأ التسجيل": eg.signupStart7d,
      نشطون: eg.activeUsersToday,
    },
  ];

  const pieData: PieEntry[] =
    countryBreakdown.length > 0
      ? countryBreakdown.slice(0, 7).map((c, i) => ({
          name: COUNTRY_NAMES[c.country] ?? c.country,
          value: c.views,
          color: PIE_COLORS[i] ?? "#6b7280",
        }))
      : [
          { name: "السعودية", value: sa.pageviews7d, color: "#10b981" },
          { name: "مصر", value: eg.pageviews7d, color: "#f59e0b" },
        ];

  const topPagesData = all.topPages.slice(0, 6).map((p) => ({
    name: p.page.length > 22 ? `${p.page.slice(0, 22)}…` : p.page,
    زيارات: p.views,
  }));

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            {
              label: "معدل التحويل",
              value: `${conversionRate}%`,
              color: "text-green-400",
              sub: "من زيارة إلى تسجيل",
              topBorder: "border-t-2 border-t-green-500",
            },
            {
              label: "متوسط زيارة/يوم",
              value: Math.round(all.pageviews7d / 7).toString(),
              color: "text-blue-400",
              sub: "آخر ٧ أيام",
              topBorder: "border-t-2 border-t-blue-500",
            },
            {
              label: "المشتركون",
              value: (saSubscribers + egSubscribers).toString(),
              color: "text-purple-400",
              sub: "إجمالي",
              topBorder: "border-t-2 border-t-purple-500",
            },
            {
              label: "واتساب",
              value: all.whatsappClick7d.toString(),
              color: "text-emerald-400",
              sub: "نقرة هذا الأسبوع",
              topBorder: "border-t-2 border-t-emerald-500",
            },
          ] as const
        ).map((kpi) => (
          <div
            key={kpi.label}
            className={cn(
              "rounded-xl border border-border bg-card p-4 text-center",
              kpi.topBorder,
            )}
          >
            <p className="mb-1 text-xs text-muted-foreground">{kpi.label}</p>
            <p className={`text-4xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              آخر ٧ أيام
            </span>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              قمع التحويل — الكل
              <span className="h-2 w-2 rounded-full bg-blue-500 opacity-80" aria-hidden />
            </h3>
          </div>
          <div className="mt-2 space-y-2">
            {funnelData.map((item, i) => {
              const maxVal = funnelData[0].value;
              const pct = maxVal > 0 ? Math.round((item.value / maxVal) * 100) : 0;
              const barWidth = Math.max(pct, 8);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-32 shrink-0 text-right text-xs text-muted-foreground">
                    {item.name}
                  </div>
                  <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-muted/30">
                    <div
                      className="flex h-full items-center justify-end rounded-full pr-3 transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: item.fill,
                        minWidth: "2.5rem",
                      }}
                    >
                      <span className="text-xs font-bold text-white">{item.value}</span>
                    </div>
                  </div>
                  <div className="w-10 shrink-0 text-left text-xs text-muted-foreground">
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              SA vs EG
            </span>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              مقارنة السوقين
              <span className="h-2 w-2 rounded-full bg-green-500 opacity-80" aria-hidden />
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={countryData} margin={{ top: 4, right: 10, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: COLORS.text, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: COLORS.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: COLORS.text, fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="زيارات" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
              <Bar dataKey="بدأ التسجيل" fill={COLORS.green} radius={[6, 6, 0, 0]} />
              <Bar dataKey="نشطون" fill={COLORS.purple} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              الكل
            </span>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              أكثر الصفحات زيارة
              <span className="h-2 w-2 rounded-full bg-purple-500 opacity-80" aria-hidden />
            </h3>
          </div>
          <div className="mt-2 space-y-2">
            {topPagesData.map((item, i) => {
              const maxVal = topPagesData[0]?.زيارات ?? 1;
              const pct = maxVal > 0 ? Math.round((item.زيارات / maxVal) * 100) : 0;
              const barWidth = Math.max(pct, 6);
              const rankColors = [
                "#8b5cf6",
                "#7c3aed",
                "#6d28d9",
                "#5b21b6",
                "#4c1d95",
                "#3b0764",
              ];
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: rankColors[i] ?? "#6b7280" }}
                  >
                    {i + 1}
                  </div>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-muted/30">
                    <div
                      className="flex h-full items-center rounded-full px-3 transition-all duration-700"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: rankColors[i] ?? "#6b7280",
                        minWidth: "3rem",
                      }}
                    >
                      <span className="whitespace-nowrap text-xs font-bold text-white">
                        {item.زيارات}
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-36 shrink-0 truncate text-right font-mono text-xs text-muted-foreground"
                    dir="ltr"
                  >
                    {item.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
              آخر ٧ أيام
            </span>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              الزوار حسب الدولة
              <span className="h-2 w-2 rounded-full bg-amber-500 opacity-80" aria-hidden />
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(value) => [`${value} زيارة`, ""]} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ color: "#9ca3af", fontSize: 13, lineHeight: "28px" }}
                formatter={(
                  value: string,
                  entry: { payload?: { value?: number } },
                ) => {
                  const v =
                    typeof entry?.payload?.value === "number" ? entry.payload.value : 0;
                  const pct =
                    all.pageviews7d > 0
                      ? Math.round((v / all.pageviews7d) * 100)
                      : 0;
                  return `${value}: ${v} (${pct}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
