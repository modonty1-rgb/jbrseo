import type { ReactNode } from "react";

const tags = ["Technical SEO", "النخبة للاستشارات التسويقية", "Core Web Vitals", "جديداً"];

const faqs = [
  "ما الفرق بين SEO العضوي والإعلانات المدفوعة؟",
  "كم يستغرق ظهور النتائج في جوجل؟",
  "هل المحتوى العربي فعّال في محركات البحث؟",
];

const sources = [
  { icon: "🔵", name: "Google Developers", url: "developers.google.com/search/docs" },
  { icon: "🔗", name: "Schema.org Article", url: "schema.org/Article" },
  { icon: "🟢", name: "Web.dev — Core Web Vitals", url: "web.dev/vitals" },
];

const stats = [
  { label: "المقالات", val: "43" },
  { label: "التفاعلات الكلية", val: "٣٦٤" },
  { label: "متوسط لكل مقال", val: "٧" },
];

const related = [
  { icon: "📰", title: "المزيد من MODONTY", sub: "مقالات مدونتي الأكثر قراءة في نفس التخصص", color: "violet" as const },
  { icon: "🏢", title: "المزيد من شركتك", sub: "مقالات العميل الأخرى — يبني ارتباطاً بالعلامة التجارية", color: "cyan" as const },
  { icon: "🔗", title: "مقالات ذات صلة", sub: "مقالات مرتبطة بنفس الموضوع من مصادر متعددة", color: "green" as const },
  { icon: "🤖", title: "مقالات قد تهمك", sub: "توصيات ذكية مخصصة لكل زائر بناءً على سلوكه", color: "amber" as const },
];

const relColor = {
  violet: { icon: "border-violet-200 bg-violet-50", badge: "border-violet-200 bg-violet-50 text-violet-700" },
  cyan:   { icon: "border-cyan-200 bg-cyan-50",     badge: "border-cyan-200 bg-cyan-50 text-cyan-700" },
  green:  { icon: "border-green-200 bg-green-50",   badge: "border-green-200 bg-green-50 text-green-700" },
  amber:  { icon: "border-amber-200 bg-amber-50",   badge: "border-amber-200 bg-amber-50 text-amber-700" },
};

export function ArticleExtrasBlock(): ReactNode {
  return (
    <div className="mx-auto mb-6 max-w-[960px]" dir="rtl">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">

        {/* ── Top Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-7 py-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[18px]"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
            >
              ✨
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground">تجربة المقال — تفاصيل تصنع الفرق</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">كل عنصر في المقال مصمم ليزيد التفاعل ويحسن SEO</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
            <span className="text-[11px] font-bold text-violet-700">٣ طبقات تفاعل</span>
          </div>
        </div>

        {/* ══ SECTION 1 ══ */}
        <div className="flex items-start gap-4 px-7 pt-6">
          <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">01</span>
          <div>
            <p className="text-[14px] font-bold text-foreground">داخل المقال</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">شريط تفاعل كامل + وقت القراءة + أسئلة شائعة تلقائية</p>
          </div>
        </div>

        <div className="px-7 pb-7 pt-5">
          {/* Meta bar */}
          <div className="mb-4 overflow-hidden rounded-[14px] border border-border">
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-5 py-3">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-violet-600 text-[11px] font-extrabold text-white">م</div>
              <span className="text-[12px] font-bold text-violet-700">Modonty</span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] text-muted-foreground">⏱️ 1 دقيقة قراءة</span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] text-muted-foreground">📝 150 كلمة</span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] text-muted-foreground">قبل 73 يوماً</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-5 py-2.5">
              <span className="text-[11px] font-bold text-muted-foreground">التاغات:</span>
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  🏷️ {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1 px-4 py-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-violet-700">👍 47</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-muted-foreground">👎 1</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-amber-600">🔖 محفوظ</span>
              <span className="mx-1 h-5 w-px bg-border" />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] text-muted-foreground">👁 77</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] text-muted-foreground">💬 17</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] text-muted-foreground">❤️ 9</span>
              <span className="mx-1 h-5 w-px bg-border" />
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-green-700">🔗 مشاركة</span>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-4 overflow-hidden rounded-[14px] border border-border">
            <div className="border-b border-border bg-muted/40 px-5 py-3">
              <p className="text-[12px] font-bold text-foreground">الأسئلة الشائعة (9) — تُنشأ تلقائياً من المقال</p>
            </div>
            {faqs.map((q, i) => (
              <div key={q} className={`flex items-center justify-between gap-3 px-5 py-3 ${i < faqs.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-[12px] font-semibold leading-snug text-foreground">{q}</span>
                <span className="shrink-0 text-[11px] font-bold text-violet-700">إجابة ←</span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
            <span className="mt-0.5 text-[15px]">✦</span>
            <p className="text-[12px] font-semibold leading-relaxed text-violet-900">
              وقت القراءة + عداد الكلمات + التاغات + الأسئلة الشائعة = زائر يجلس أطول = SEO أقوى.
            </p>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ SECTION 2 ══ */}
        <div className="flex items-start gap-4 px-7 pt-6">
          <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">02</span>
          <div>
            <p className="text-[14px] font-bold text-foreground">الـ Sidebar</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">نشرة بريدية + مصادر + زر التواصل + إحصائيات</p>
          </div>
        </div>

        <div className="px-7 pb-7 pt-5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">

            {/* Newsletter */}
            <div className="overflow-hidden rounded-[14px] border border-border">
              <div className="p-4 text-white" style={{ background: "linear-gradient(135deg,#1e1b4b,#2d2a6e)" }}>
                <p className="text-[13px] font-bold">📧 اشترك في النشرة الإخبارية</p>
                <p className="mt-1 text-[11px] text-white/50">احصل على أحدث المقالات في بريدك</p>
              </div>
              <div className="bg-muted/20 p-4">
                <div className="mb-2 rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] text-muted-foreground/60">البريد الإلكتروني</div>
                <div className="w-full rounded-lg py-2.5 text-center text-[12px] font-bold text-white" style={{ background: "#6d28d9" }}>✓ تم الاشتراك!</div>
                <p className="mt-2 text-center text-[10px] text-muted-foreground">مشتركون الآن: 1,240+</p>
              </div>
            </div>

            {/* Sources */}
            <div className="overflow-hidden rounded-[14px] border border-border">
              <div className="border-b border-border bg-muted/40 px-4 py-3">
                <p className="text-[12px] font-bold text-foreground">📚 مصادر المقال</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">مراجع موثوقة تبني E-E-A-T</p>
              </div>
              {sources.map((s, i) => (
                <div key={s.name} className={`flex items-center gap-3 px-4 py-2.5 ${i < sources.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-[15px]">{s.icon}</span>
                  <div>
                    <p className="text-[11px] font-bold text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.url}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ask button */}
            <div className="rounded-[14px] border border-green-200 bg-green-50 p-5">
              <p className="mb-1.5 text-[13px] font-bold text-green-800">🎯 زر "اسأل العميل"</p>
              <p className="mb-4 text-[12px] leading-relaxed text-green-800/85">في الـ Sidebar على كل مقال — الزائر يسأل صاحب المقال بنقرة واحدة</p>
              <div className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-[12px] font-bold text-white">
                اسأل العميل ←
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-[14px] border border-border bg-muted/30 p-5">
              <p className="mb-3 text-[12px] font-bold text-foreground">📊 تحليلات مدونتي</p>
              {stats.map((s, i) => (
                <div key={s.label} className={`flex items-center justify-between py-2 ${i < stats.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-[12px] text-muted-foreground">{s.label}</span>
                  <span className="text-[13px] font-extrabold text-foreground">{s.val}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ SECTION 3 ══ */}
        <div className="flex items-start gap-4 px-7 pt-6">
          <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">03</span>
          <div>
            <p className="text-[14px] font-bold text-foreground">ذات صلة — ٤ أقسام تزيد وقت الجلسة</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">كل مقال ينتهي بتوصيات ذكية تبقي الزائر أطول</p>
          </div>
        </div>

        <div className="px-7 pb-7 pt-5">
          {related.map((r, i) => {
            const c = relColor[r.color];
            return (
              <div key={r.title} className={`flex items-center gap-3.5 py-3.5 ${i < related.length - 1 ? "border-b border-border" : ""}`}>
                <div className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border text-[17px] ${c.icon}`}>
                  {r.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-foreground">{r.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{r.sub}</p>
                </div>
                <span className={`shrink-0 rounded-md border px-2.5 py-1 text-[10px] font-bold ${c.badge}`}>تلقائي</span>
              </div>
            );
          })}

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <span className="mt-0.5 text-[15px]">💡</span>
            <p className="text-[12px] font-semibold leading-relaxed text-green-800">
              هذه الأقسام الأربعة تحول كل زيارة لجلسة طويلة — وجوجل يكافئ الموقع الذي يبقي الزوار أطول.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 px-7 py-4">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] text-white"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#6d28d9)" }}
          >
            ✦
          </div>
          <p className="flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
            كل هذه العناصر تعمل معاً تلقائياً — بدون أي ضبط إضافي من طرفك.
          </p>
          <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">
            ٣ طبقات · ١١ عنصر
          </span>
        </div>

      </div>
    </div>
  );
}