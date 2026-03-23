import type { ReactNode } from "react";
import { Card } from "@/app/components/ui/card";

export type ExclusiveFeatureId =
  | "audio"
  | "trending"
  | "reviews"
  | "followers"
  | "verified"
  | "reels"
  | "map"
  | "categories";

type Feature = {
  id: ExclusiveFeatureId;
  num: string;
  icon: string;
  label: string;
  sub: string;
  detail: string;
  badge: string;
  color: "violet" | "amber" | "cyan" | "green" | "red" | "sky";
};

const colorMap: Record<Feature["color"], { icon: string; badge: string }> = {
  violet: { icon: "border-violet-200 bg-violet-50", badge: "border-violet-200 bg-violet-50 text-violet-700" },
  amber: { icon: "border-amber-200 bg-amber-50", badge: "border-amber-200 bg-amber-50 text-amber-700" },
  cyan: { icon: "border-cyan-200 bg-cyan-50", badge: "border-cyan-200 bg-cyan-50 text-cyan-700" },
  green: { icon: "border-green-200 bg-green-50", badge: "border-green-200 bg-green-50 text-green-700" },
  red: { icon: "border-red-200 bg-red-50", badge: "border-red-200 bg-red-50 text-red-700" },
  sky: { icon: "border-sky-200 bg-sky-50", badge: "border-sky-200 bg-sky-50 text-sky-700" },
};

export const EXCLUSIVE_FEATURES: Feature[] = [
  {
    id: "audio",
    num: "01",
    icon: "🎧",
    color: "violet",
    label: "نسخة صوتية لكل مقال",
    sub: "يُقرأ مقالك تلقائياً — بدون أي جهد إضافي",
    detail:
      "كل مقال تنشره يتحول تلقائياً لنسخة صوتية جاهزة. الزوار الذين يفضلون الاستماع يستهلكون محتواك — وهذا يرفع وقت الجلسة ويحسن إشارات SEO.",
    badge: "حصري في مدونتي",
  },
  {
    id: "trending",
    num: "02",
    icon: "📊",
    color: "amber",
    label: "ظهور في صفحة الرائجة",
    sub: "مقالاتك تظهر أمام كل زوار مدونتي",
    detail:
      "صفحة الرائجة تعرض أكثر المقالات قراءةً وتفاعلاً خلال 7 أو 14 أو 30 يوماً. مقالاتك القوية تظهر تلقائياً أمام جمهور مدونتي كله.",
    badge: "تصفية: 7 · 14 · 30 يوم",
  },
  {
    id: "reviews",
    num: "03",
    icon: "⭐",
    color: "amber",
    label: "تقييمات الشركة من الزوار",
    sub: "الزوار يقيّمون شركتك مباشرة على صفحتك",
    detail:
      "تبويب التقييمات يتيح للزوار والعملاء تقييم شركتك علناً — وهذا يبني social proof حقيقي يراه كل من يزور صفحتك.",
    badge: "social proof تلقائي",
  },
  {
    id: "followers",
    num: "04",
    icon: "👥",
    color: "cyan",
    label: "متابعون لشركتك",
    sub: "الزوار يتابعون صفحتك ويبقون على تواصل",
    detail:
      "زر المتابعة يبني جمهوراً ثابتاً متصلاً بشركتك. كل مقال جديد تنشره يصل للمتابعين تلقائياً — مثل حساب سوشال داخل مدونتي.",
    badge: "جمهور دائم",
  },
  {
    id: "verified",
    num: "05",
    icon: "✓",
    color: "green",
    label: "شارة موثّق",
    sub: "بادج مصداقية يظهر على صفحتك ومقالاتك",
    detail:
      "الشارة الزرقاء تظهر على اسم شركتك في كل مقال وعلى صفحتك — تزيد الثقة وتميّزك عن الشركات غير الموثّقة.",
    badge: "ثقة فورية",
  },
  {
    id: "reels",
    num: "06",
    icon: "🎬",
    color: "red",
    label: "تبويب ريلز خاص بشركتك",
    sub: "صفحة ريلز مستقلة ضمن صفحة شركتك",
    detail:
      "صفحتك تحتوي تبويب ريلز منفصل — يجمع كل الفيديوهات القصيرة في مكان واحد يمكن للزوار تصفحه بسهولة.",
    badge: "ضمن صفحتك",
  },
  {
    id: "map",
    num: "07",
    icon: "🗺️",
    color: "sky",
    label: "خريطة الموقع الجغرافي",
    sub: "موقع شركتك يظهر على الخريطة في صفحتك",
    detail:
      "الموقع الجغرافي يظهر تلقائياً في صفحتك — يساعد العملاء المحليين على إيجادك ويعزز ظهورك في Local SEO.",
    badge: "Local SEO تلقائي",
  },
  {
    id: "categories",
    num: "08",
    icon: "📂",
    color: "violet",
    label: "تصنيف مقالاتك في الفئات",
    sub: "مقالاتك تظهر في صفحات الفئات المتخصصة",
    detail:
      "مدونتي تصنف مقالاتك تلقائياً في فئات متخصصة — الباحثون عن هذه المواضيع يجدون مقالاتك دون أن تفعل شيئاً.",
    badge: "١٢ فئة متخصصة",
  },
];

function selectFeatures(includeIds: ExclusiveFeatureId[] | undefined): Feature[] {
  if (!includeIds?.length) {
    return EXCLUSIVE_FEATURES;
  }
  const set = new Set(includeIds);
  return EXCLUSIVE_FEATURES.filter((f) => set.has(f.id));
}

function FeatureCells({ items }: { items: Feature[] }): ReactNode {
  return (
    <div
      className="grid border-border bg-border"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: "1px",
      }}
    >
      {items.map((f) => {
        const c = colorMap[f.color];
        return (
          <div key={f.id} className="relative bg-card p-5 transition-colors hover:bg-muted/30">
            <span className="absolute start-4 top-3.5 text-[10px] font-bold tracking-widest text-muted-foreground/40">
              {f.num}
            </span>

            <div className={`mb-3.5 flex h-10 w-10 items-center justify-center rounded-[10px] border text-[17px] ${c.icon}`}>
              {f.icon}
            </div>

            <p className="mb-1.5 text-[13px] font-bold leading-snug text-foreground">{f.label}</p>
            <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">{f.sub}</p>

            <p className="mb-3.5 border-t border-dashed border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
              {f.detail}
            </p>

            <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold ${c.badge}`}>
              {f.badge}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export type ExclusiveFeaturesBlockProps = {
  includeIds?: ExclusiveFeatureId[];
};

export function ExclusiveFeaturesBlock({ includeIds }: ExclusiveFeaturesBlockProps): ReactNode {
  const items = selectFeatures(includeIds);
  const isFull = !includeIds?.length;

  return (
    <div className="mx-auto mb-6 max-w-[960px]" dir="rtl">
      <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-7 py-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[18px]"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}
            >
              🌟
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground">
                {isFull ? "ميزات لا تجدها عند أي موظف" : "ميزات إضافية في التواصل"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {isFull
                  ? "مدونتي بنت لك منظومة كاملة لا يمكن تكرارها بالتوظيف"
                  : "تقييمات الشركة ومتابعون — من صفحة شركتك داخل مدونتي"}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-bold text-amber-800">
              {isFull ? "٨ ميزات مدمجة في اشتراكك" : `${items.length} ميزات`}
            </span>
          </div>
        </div>

        <FeatureCells items={items} />

        {isFull ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 px-7 py-4">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] text-white"
              style={{ background: "linear-gradient(135deg,#6d28d9,#4f46e5)" }}
            >
              ✦
            </div>
            <p className="flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
              هذه الميزات الـ٨ مدمجة في اشتراكك — لا تحتاج أدوات إضافية ولا موظفين إضافيين.
            </p>
            <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">
              ٨ / ٨ مدمجة
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 px-7 py-4">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] text-white"
              style={{ background: "linear-gradient(135deg,#6d28d9,#4f46e5)" }}
            >
              ✦
            </div>
            <p className="flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
              تقييمات حقيقية ومتابعون دائمون — social proof يعمل لصالحك تلقائياً.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
