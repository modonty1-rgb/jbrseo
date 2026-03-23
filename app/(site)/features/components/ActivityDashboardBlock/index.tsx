import type { ReactNode } from "react";
import { Card } from "@/app/components/ui/card";

type ActivityType = "view" | "question" | "comment" | "share" | "like";

type Activity = {
  id: number; type: ActivityType; icon: string; label: string;
  source: string; meta: string; time: string;
  badge?: "live" | "new";
  reply?: boolean;
};

const ACTIVITIES: Activity[] = [
  { id:1, type:"view",     icon:"👁",  label:"مشاهدة جديدة",           source:"مقال: كيف يرفع المحتوى مبيعات شركتك",             meta:"من الرياض · جوجل",                        time:"الآن",          badge:"live" },
  { id:2, type:"question", icon:"📩",  label:"سؤال جديد",               source:"مقال: أفضل استراتيجيات تسويق B2B في السعودية",    meta:"أحمد العمري · 0550123456",                time:"منذ ٥ دقائق",   badge:"new", reply:true },
  { id:3, type:"comment",  icon:"💬",  label:"تعليق جديد",              source:"مقال: كيف يرفع المحتوى مبيعات شركتك",             meta:"فهد الحربي: محتوى ممتاز ومفيد!",          time:"منذ ٣ ساعات" },
  { id:4, type:"share",    icon:"🔗",  label:"مشاركة المقال",           source:"مقال: دليل تحسين SEO للشركات السعودية",           meta:"عبر واتساب",                               time:"منذ ٤ ساعات" },
  { id:5, type:"view",     icon:"👁",  label:"٣ مشاهدات جديدة",         source:"صفحة شركتك في مدونتي",                            meta:"من جدة، الرياض، الدمام",                   time:"منذ ٦ ساعات" },
  { id:6, type:"question", icon:"📩",  label:"استفسار من الصفحة",       source:"صفحة شركتك في مدونتي",                            meta:"عبدالله السبيعي: هل تخدمون الخليج؟",      time:"أمس",           reply:true },
  { id:7, type:"like",     icon:"👍",  label:"٧ إعجابات على تعليق",     source:"مقال: كيف يرفع المحتوى مبيعات شركتك",             meta:"تعليق فهد الحربي",                        time:"أمس" },
  { id:8, type:"comment",  icon:"💬",  label:"رد على تعليق",            source:"مقال: أفضل استراتيجيات تسويق B2B في السعودية",   meta:"منى العجمي ردّت على أحمد",                time:"أمس" },
];

const ICON_STYLE: Record<ActivityType, string> = {
  view:     "border-sky-200 bg-sky-50",
  question: "border-violet-200 bg-violet-50",
  comment:  "border-cyan-200 bg-cyan-50",
  share:    "border-green-200 bg-green-50",
  like:     "border-amber-200 bg-amber-50",
};

const stats = [
  { icon:"👁",  val:"١٢٤", label:"مشاهدات اليوم", trend:"+١٨٪",  trendColor:"text-green-700",  trendBg:"border-green-200 bg-green-50" },
  { icon:"📩",  val:"٣",   label:"استفسارات",      trend:"جديد",  trendColor:"text-violet-700", trendBg:"border-violet-200 bg-violet-50" },
  { icon:"💬",  val:"٩",   label:"تعليقات",         trend:"+٥",    trendColor:"text-cyan-700",   trendBg:"border-cyan-200 bg-cyan-50" },
  { icon:"🔗",  val:"٦",   label:"مشاركات",         trend:"+٢",    trendColor:"text-green-700",  trendBg:"border-green-200 bg-green-50" },
];

const statIconBg = ["bg-sky-50 border-sky-200","bg-violet-50 border-violet-200","bg-cyan-50 border-cyan-200","bg-green-50 border-green-200"];
const statValColor = ["text-blue-700","text-violet-700","text-cyan-700","text-green-700"];

const filters = [
  { label:"الكل", count:8 }, { label:"مشاهدات", count:2 },
  { label:"استفسارات", count:2 }, { label:"تعليقات", count:2 }, { label:"مشاركات", count:1 },
];

export function ActivityDashboardBlock(): ReactNode {
  return (
    <div className="mx-auto mb-6 max-w-[960px]" dir="rtl">
      <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm">

        {/* ── Top Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-7 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[17px]"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}>📊</div>
            <div>
              <p className="text-[13px] font-bold text-foreground">لوحة تحكمك — كل شيء أمامك</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">كل تفاعل على مقالاتك وصفحتك يصلك هنا فوراً</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            <span className="text-[11px] font-bold text-green-700">مباشر الآن</span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-4 py-4 text-center ${i < stats.length - 1 ? "border-l border-border" : ""}`}>
              <div className={`mx-auto mb-2.5 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border text-[15px] ${statIconBg[i]}`}>{s.icon}</div>
              <p className={`text-[22px] font-black leading-none ${statValColor[i]}`}>{s.val}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.label}</p>
              <span className={`mt-1.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.trendBg} ${s.trendColor}`}>{s.trend}</span>
            </div>
          ))}
        </div>

        {/* ── Filter Strip ── */}
        <div className="flex flex-wrap gap-1.5 border-b border-border px-5 py-3">
          {filters.map((f, i) => (
            <span key={f.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
              i === 0
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-border bg-background text-muted-foreground"
            }`}>
              {f.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                i === 0 ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
              }`}>{f.count}</span>
            </span>
          ))}
        </div>

        {/* ── Timeline Feed ── */}
        <div className="px-5 py-2">
          {ACTIVITIES.map((a, i) => (
            <div key={a.id} className="flex items-stretch gap-0">
              {/* gutter: icon + line */}
              <div className="flex w-11 shrink-0 flex-col items-center">
                <div className={`mt-3.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border text-[13px] ${ICON_STYLE[a.type]}`}>{a.icon}</div>
                {i < ACTIVITIES.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>
              {/* content */}
              <div className={`flex-1 min-w-0 pb-4 pl-3 pt-3.5 ${i < ACTIVITIES.length - 1 ? "border-b border-border" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {a.badge === "live" && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">● مباشر</span>
                    )}
                    {a.badge === "new" && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">★ جديد</span>
                    )}
                    <span className="text-[13px] font-bold text-foreground">{a.label}</span>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">{a.source}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground/80">{a.meta}</p>
                {a.reply && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-[7px] border border-border bg-background px-3 py-1.5 text-[11px] font-bold text-foreground">↩ رد الآن</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 px-6 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] text-white"
            style={{ background:"linear-gradient(135deg,#1d4ed8,#2563eb)" }}>✦</div>
          <p className="flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
            لوحتك تجمع كل شيء في مكان واحد — مشاهدات، أسئلة، تعليقات، مشاركات — بدون ما تحتاج أدوات تحليل منفصلة.
          </p>
          <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">٨ أحداث · اليوم</span>
        </div>

      </Card>
    </div>
  );
}