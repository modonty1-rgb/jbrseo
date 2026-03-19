# Cursor Prompt — WhyNow Hook + Features Page
# مشروع: jbrseo.com | Next.js App Router + TypeScript + Tailwind CSS v4 | RTL Arabic

---

## 🎯 المهمة

عندنا ملف `WhyNowSavings_final.tsx` يحتوي على **كومبوننت ضخم** يعرض كل مزايا مدونتي.
المطلوب:
1. **استخراج الـ Hook** (حاسبة التوفير فقط) وعرضه كـ section في الصفحة الرئيسية
2. **بناء صفحة `/features`** تعرض كل المزايا بتصميم احترافي

---

## 📁 الملفات المطلوبة

```
components/sections/
├── WhyNow.tsx              ← الـ Hook (الحاسبة فقط) — تُنشأ من الكود أدناه
├── WhyNowSavings.tsx       ← rename من WhyNowSavings_final.tsx
└── WhyNowSavings.data.ts   ← ملف البيانات (موجود)

app/[locale]/features/
└── page.tsx                ← صفحة المزايا الكاملة — تُنشأ من الكود أدناه
```

---

## 📋 المهمة ١ — WhyNow.tsx (الـ Hook)

### الوصف:
Section في الصفحة الرئيسية يعرض:
- العنوان: "٦ موظفين أو مدونتي؟"
- ٦ sliders تفاعلية للرواتب
- مقارنة بسيطة (بدون مدونتي vs مع مدونتي)
- أرقام التوفير الشهري والسنوي + نسبة %
- زرّان: "ابدأ الآن" + "شوف كل ما تحصل عليه ←"

### المتطلبات التقنية:
- `"use client"` في أول السطر (يستخدم useState)
- Tailwind CSS v4 tokens فقط: `bg-primary`, `text-accent`, `bg-success`, `border-border`
- RTL كامل — direction: rtl
- Responsive: mobile-first
- لا inline styles إلا للـ gradients الديناميكية (مثل slider track)
- الـ slider track يحتاج inline style لأن اللون يتغير ديناميكياً حسب القيمة
- Props: `featuresLink?: string` (default: "/features")

### الكود المرجعي (WhyNow.tsx):
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const SUB_M = 1299;
const SUB_Y = SUB_M * 12;
function fmt(n: number) { return n.toLocaleString("ar-SA"); }

type SliderRowProps = {
  icon: string;
  label: string;
  iconBg: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
};

function SliderRow({ icon, label, iconBg, value, min, max, step, onChange }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ background: iconBg }}
          >{icon}</span>
          {label}
        </span>
        <span className="text-sm font-black text-accent bg-accent/10 rounded-lg px-3 py-1 min-w-[110px] text-center tabular-nums">
          {fmt(value)} ريال
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-[5px] rounded-full outline-none cursor-pointer"
        style={{
          WebkitAppearance: "none",
          background: `linear-gradient(to left, var(--accent) ${pct}%, var(--border) ${pct}%)`
        }}
      />
    </div>
  );
}

export default function WhyNow({ featuresLink = "/features" }: { featuresLink?: string }) {
  const [writer,   setWriter]   = useState(4500);
  const [designer, setDesigner] = useState(7000);
  const [seo,      setSeo]      = useState(6000);
  const [social,   setSocial]   = useState(5500);
  const [video,    setVideo]    = useState(6000);
  const [dev,      setDev]      = useState(8000);

  const totalM = writer + designer + seo + social + video + dev;
  const totalY = totalM * 12;
  const saveM  = totalM - SUB_M;
  const saveY  = totalY - SUB_Y;
  const pct    = Math.round((saveM / totalM) * 100);

  const badItems = [
    ["كاتب محتوى", fmt(writer)],
    ["مصمم جرافيك", fmt(designer)],
    ["متخصص SEO", fmt(seo)],
    ["مدير سوشال", fmt(social)],
    ["مونتير فيديو", fmt(video)],
    ["مطور مواقع", fmt(dev)],
    ["إدارة وتنسيق", "+ وقتك"],
  ];

  const goodItems = [
    "مقالات SEO احترافية",
    "تصميم وصفحة خاصة",
    "تهيئة محركات البحث",
    "ترويج ٨ منصات اجتماعية",
    "إنتاج ريلز شهرياً",
    "صفحة شركة (بدون مطور)",
    "نشر وإدارة كاملة",
  ];

  return (
    <section
      id="why-now"
      dir="rtl"
      className="relative overflow-hidden bg-muted/40 border-t border-border px-5 pt-20 pb-16 sm:px-8 lg:pt-24 lg:pb-20"
    >
      {/* dot pattern bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <div className="relative mx-auto max-w-[900px]">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-accent/10 border border-accent/20 px-3.5 py-1.5">
            <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[.12em] text-accent">احسب توفيرك الحقيقي</span>
          </div>
          <h2 className="font-black text-foreground mb-3"
            style={{ fontFamily: "var(--font-amiri, serif)", fontSize: "clamp(26px, 4.2vw, 48px)", lineHeight: 1.12 }}>
            ٦ موظفين أو{" "}
            <em className="not-italic text-accent">مدونتي؟</em>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-[460px] mx-auto">
            حرّك الأرقام حسب سوقك — وشوف التوفير الحقيقي بالريال.
          </p>
        </div>

        {/* Sliders Card */}
        <div className="bg-card border border-border rounded-3xl p-8 mb-5 shadow-sm">
          <p className="text-[11px] font-extrabold tracking-[.1em] uppercase text-muted-foreground/60 mb-6">
            اضبط رواتب فريقك الحالي أو المتوقع
          </p>

          <SliderRow icon="✍️" label="كاتب محتوى SEO"     iconBg="#eff6ff" value={writer}   min={2000} max={12000} step={500} onChange={setWriter}   />
          <SliderRow icon="🎨" label="مصمم جرافيك"         iconBg="#fdf4ff" value={designer} min={2000} max={15000} step={500} onChange={setDesigner} />
          <SliderRow icon="📈" label="متخصص SEO"           iconBg="#f0fdf4" value={seo}      min={2000} max={15000} step={500} onChange={setSeo}      />
          <SliderRow icon="📱" label="مدير سوشال ميديا"    iconBg="#fff7ed" value={social}   min={2000} max={12000} step={500} onChange={setSocial}   />
          <SliderRow icon="🎬" label="مونتير / منتج فيديو" iconBg="#fff1f2" value={video}    min={2000} max={15000} step={500} onChange={setVideo}    />
          <SliderRow icon="💻" label="مطور مواقع"          iconBg="#f0f9ff" value={dev}      min={4000} max={20000} step={500} onChange={setDev}      />

          <hr className="border-dashed border-border my-6" />

          {/* Compare columns */}
          <div className="grid grid-cols-[1fr_44px_1fr] items-stretch gap-0">

            {/* Bad */}
            <div className="rounded-2xl p-4 bg-destructive/5 border border-destructive/20">
              <p className="text-[11px] font-extrabold tracking-[.08em] uppercase mb-3 text-destructive">❌ بدون مدونتي</p>
              {badItems.map(([n, v], i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-black/5 last:border-none">
                  <span className="text-xs text-muted-foreground">{n}</span>
                  <span className="text-xs font-extrabold text-destructive tabular-nums">{v}{i < 6 ? " ر.س" : ""}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t-2 border-black/10 grid grid-cols-[1fr_1px_1fr] items-center">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">شهرياً</p>
                  <p className="text-lg font-black text-destructive tabular-nums">{fmt(totalM)} ر.س</p>
                </div>
                <div className="bg-black/8 self-stretch" />
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">سنوياً</p>
                  <p className="text-lg font-black text-destructive tabular-nums">{fmt(totalY)} ر.س</p>
                </div>
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-[10px] font-extrabold text-muted-foreground">
                VS
              </div>
            </div>

            {/* Good */}
            <div className="rounded-2xl p-4 bg-success/5 border border-success/20">
              <p className="text-[11px] font-extrabold tracking-[.08em] uppercase mb-3 text-success">✓ مع مدونتي</p>
              {goodItems.map((n, i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-black/5 last:border-none">
                  <span className="text-xs text-muted-foreground">{n}</span>
                  <span className="text-xs font-extrabold text-success">✓ مشمول</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t-2 border-black/10 grid grid-cols-[1fr_1px_1fr] items-center">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">شهرياً</p>
                  <p className="text-lg font-black text-success">1,299 ر.س</p>
                </div>
                <div className="bg-black/8 self-stretch" />
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">سنوياً</p>
                  <p className="text-lg font-black text-success">15,588 ر.س</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Savings Hero */}
        <div className="rounded-[22px] p-10 text-center relative overflow-hidden mb-5"
          style={{ background: "linear-gradient(145deg,#1e1b4b 0%,#312e81 60%,#1e1b4b 100%)" }}>
          <p className="text-[11px] font-extrabold tracking-[.12em] uppercase text-white/40 mb-4">
            توفيرك الفعلي مع مدونتي
          </p>
          <div className="flex justify-center gap-0 flex-wrap mb-6 items-stretch">
            <div className="text-center px-6">
              <p className="text-[11px] font-bold uppercase tracking-[.09em] text-white/40 mb-1.5">شهرياً</p>
              <p className="font-black leading-none tabular-nums text-[#c4b5fd] transition-all duration-300"
                style={{ fontFamily: "var(--font-amiri, serif)", fontSize: "clamp(28px,5vw,48px)" }}>
                {fmt(saveM)} ريال
              </p>
            </div>
            <div className="w-px bg-white/10 self-stretch mx-2 hidden sm:block" />
            <div className="text-center px-6">
              <p className="text-[11px] font-bold uppercase tracking-[.09em] text-white/40 mb-1.5">سنوياً</p>
              <p className="font-black leading-none tabular-nums text-[#86efac] transition-all duration-300"
                style={{ fontFamily: "var(--font-amiri, serif)", fontSize: "clamp(28px,5vw,48px)" }}>
                {fmt(saveY)} ريال
              </p>
            </div>
          </div>
          <div className="mb-8">
            <p className="text-xs text-white/40 mb-2">نسبة التوفير مقارنةً بتوظيف فريق لنفس المهام</p>
            <div className="w-60 h-2 bg-white/10 rounded-full mx-auto overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(to left,#86efac,#4ade80)" }} />
            </div>
            <p className="text-2xl font-black tabular-nums text-[#86efac]">{pct}%</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup"
              className="inline-flex items-center gap-2.5 rounded-[14px] bg-white text-primary px-8 py-3.5 text-[15px] font-black shadow-lg transition-all hover:-translate-y-0.5">
              وفّر هذا الرقم ابتداءً من اليوم ←
            </Link>
            <Link href={featuresLink}
              className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/8 px-6 py-3.5 text-[14px] font-bold text-white/80 transition-all hover:bg-white/15 hover:text-white">
              شوف كل ما تحصل عليه ←
            </Link>
          </div>
          <p className="text-xs text-white/25 mt-4">أول ١٤ يوم مجاناً · بدون بطاقة بنكية · إلغاء في أي وقت</p>
        </div>

        {/* Trust pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {["🔒 بياناتك ملكك دائماً", "🇸🇦 دعم عربي ١٠٠٪", "↩️ ضمان ١٤ يوم", "⚡ نشر خلال ٧٢ ساعة"].map(p => (
            <span key={p} className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3.5 py-1.5 text-xs font-bold text-muted-foreground">
              {p}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}
```

---

## 📋 المهمة ٢ — Features Page (صفحة المزايا)

### الملف: `app/[locale]/features/page.tsx`

```tsx
// app/[locale]/features/page.tsx
import type { Metadata } from "next";
import WhyNowSavings from "@/components/sections/WhyNowSavings";

export const metadata: Metadata = {
  title: "كل ما تحصل عليه مع مدونتي",
  description: "استكشف كل الميزات: نشر المقالات، صفحة الشركة، قاعدة Leads، حملات الإيميل والواتساب، ولوحة التحكم الكاملة.",
};

export default function FeaturesPage() {
  return (
    <main dir="rtl">
      {/* Hero */}
      <section className="text-center px-5 pt-20 pb-6 border-b border-border bg-background">
        <div className="mx-auto max-w-[640px]">
          <p className="text-[11px] font-black uppercase tracking-[.12em] text-accent mb-3">
            كل ما تحصل عليه
          </p>
          <h1
            className="font-black text-foreground mb-3"
            style={{
              fontFamily: "var(--font-amiri, serif)",
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.1,
            }}
          >
            مدونتي = فريق تسويق كامل
            <br />
            <em className="not-italic text-accent">باشتراك شهري واحد</em>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[480px] mx-auto">
            من الحاسبة وصفحة شركتك — وصولاً لقاعدة Leads والحملات التسويقية.
          </p>
        </div>
      </section>

      {/* All Blocks */}
      <WhyNowSavings />
    </main>
  );
}
```

---

## 📋 المهمة ٣ — WhyNowSavings.tsx

**انسخ الملف** `WhyNowSavings_final.tsx` إلى `components/sections/WhyNowSavings.tsx`

هذا الملف جاهز ويحتوي على جميع الـ blocks:
- DistributionBlock
- CommentsBlock
- DirectInquiryBlock
- ExclusiveFeaturesBlock
- ArticleExtrasBlock
- ClientPageBlock
- LeadsBlock
- ActivityDashboardBlock

---

## 📋 المهمة ٤ — تكامل WhyNow في الصفحة الرئيسية

في ملف `app/[locale]/sa/page.tsx` (أو `page.tsx` الرئيسية):

```tsx
import WhyNow from "@/components/sections/WhyNow";

// داخل الـ JSX — بعد section الأسعار أو قبله:
<WhyNow featuresLink="/sa/features" />

// للموقع المصري:
// <WhyNow featuresLink="/eg/features" />
```

---

## ⚙️ قواعد التنفيذ (مهم جداً)

1. **"use client"** — أي كومبوننت يستخدم `useState` أو event handlers
2. **Tailwind tokens فقط** — استخدم `bg-primary`, `text-accent`, `bg-success`, `text-destructive`, `border-border`, `bg-card`, `text-foreground`, `text-muted-foreground`
3. **لا hardcode للألوان** — ممنوع `#6d28d9` في className، مسموح فقط في inline style للـ gradients الديناميكية
4. **RTL** — كل section يحتاج `dir="rtl"` أو يرثه من parent
5. **الـ slider track** — يحتاج inline style لأن اللون يتغير ديناميكياً بناءً على `pct`
6. **لا تعدّل** `WhyNowSavings_final.tsx` — فقط انسخه كـ `WhyNowSavings.tsx`

---

## ✅ Checklist للتحقق

- [ ] `WhyNow.tsx` موجود في `components/sections/`
- [ ] الـ sliders تعمل وتحدّث الأرقام في real-time
- [ ] زر "شوف كل ما تحصل عليه ←" يودي لـ `/sa/features`
- [ ] `app/[locale]/features/page.tsx` موجود
- [ ] الصفحة تعرض `WhyNowSavings` بشكل كامل
- [ ] `<WhyNow featuresLink="/sa/features" />` مضاف في الصفحة الرئيسية
- [ ] لا errors في TypeScript
- [ ] الموقع يعمل على mobile (responsive)