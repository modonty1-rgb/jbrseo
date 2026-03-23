import type { ReactNode } from "react";
import { Card } from "@/app/components/ui/card";

const articles = [
  { title: "كيف يرفع المحتوى العضوي مبيعات شركتك بدون إعلانات", time: "قبل 73 يوماً", views: 77, comments: 17, likes: 46, audio: true },
  { title: "أفضل استراتيجيات تسويق B2B في السعودية لعام 2025",    time: "قبل 74 يوماً", views: 40, comments: 5,  likes: 1,  audio: true },
];

const companyInfo = [
  ["الاسم القانوني", "النخبة للاستشارات ش.م.م"],
  ["الصناعة",        "استشارات تسويقية"],
  ["تاريخ التأسيس",  "١٥ مارس ٢٠١٧"],
  ["حجم الشركة",     "10-25 موظف"],
];

const officialData = [
  ["رقم السجل",   "4030287651"],
  ["النوع القانوني", "ذات مسؤولية محدودة"],
  ["العنوان",     "طريق التحلية، جدة"],
];

const contactInfo = [
  ["🌐", "الموقع الإلكتروني"],
  ["✉️", "البريد الإلكتروني"],
  ["📞", "رقم الهاتف"],
  ["💬", "واتساب"],
];

const followers = [
  { name: "اليمامة للعقارات", sub: "عميل منذ ٢٠٢٣" },
  { name: "متجر أصيل",        sub: "تجارة إلكترونية" },
];

const reviews = [
  { name: "خالد الغامدي",   article: "كيف تبني حضوراً رقمياً قوياً",          text: "المقالات دقيقة ومفيدة جداً، لاحظنا ارتفاعاً في الزيارات خلال أسبوعين!", stars: 5 },
  { name: "نورة القحطاني", article: "أفضل استراتيجيات تسويق B2B في السعودية", text: "محتوى متخصص ومحترف، يعكس فهماً عميقاً للسوق المحلي.", stars: 5 },
];

const likeMetrics = [
  { icon: "📄", val: "٧", label: "إعجابات المقالات",  sub: "إجمالي الإعجابات على مقالات العميل" },
  { icon: "❤️", val: "—", label: "المفضّلة",           sub: "عدد من أضافوا الشركة للمفضّلة" },
  { icon: "👥", val: "٢", label: "متابعو الصفحة",      sub: "عدد المتابعين الفعليين للشركة" },
];

const photoEmojis = ["🏙️", "🌿", "⭐", "🎯", "🚀", "📊"];
const similarClients = ["مجموعة البيان للإعلام", "دار الخليج للتدريب"];
const tabs = [
  { icon: "📋", label: "الكل" }, { icon: "🏢", label: "حول" },
  { icon: "🖼️", label: "الصور" }, { icon: "👥", label: "المتابعون" },
  { icon: "⭐", label: "التقييمات" }, { icon: "🎬", label: "الريلز" }, { icon: "❤️", label: "الإعجابات" },
];

const reelGradients = [
  "linear-gradient(160deg,#1e1b4b,#4f46e5,#7c3aed)",
  "linear-gradient(160deg,#312e81,#7c3aed,#db2777)",
  "linear-gradient(160deg,#065f46,#059669,#6d28d9)",
];

function SectionHead({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 px-6 pt-6">
      <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">{num}</span>
      <div>
        <p className="text-[13px] font-bold text-foreground">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value, action }: { label: string; value?: string; action?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-1.5 text-[12px] last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      {value  && <span className="max-w-[55%] text-start text-[11px] font-semibold text-foreground">{value}</span>}
      {action && <span className="text-[11px] font-bold text-violet-700">{action}</span>}
    </div>
  );
}

export function ClientPageBlock(): ReactNode {
  return (
    <div className="mx-auto mb-6 max-w-[960px]" dir="rtl">
      <Card className="overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm">

        {/* ── Top Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-7 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[18px]"
              style={{ background: "linear-gradient(135deg,#1e1b4b,#4f46e5)" }}>
              🏢
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground">صفحة شركتك في مدونتي — هوية رقمية كاملة</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">٧ تبويبات تجعل شركتك موجودة وموثوقة ومتاحة للجميع</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
            <span className="text-[11px] font-bold text-violet-700">٧ تبويبات</span>
          </div>
        </div>

        {/* ── Cover ── */}
        <div className="relative h-[120px] overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle,rgba(167,139,250,0.3) 1px,transparent 1px)", backgroundSize: "22px 22px" }} />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(circle at 70% -20%,rgba(139,92,246,0.4),transparent 60%)" }} />
          <div className="absolute bottom-2.5 left-4 flex gap-1.5">
            {["f", "𝕏", "in"].map((s) => (
              <span key={s} className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-white/25 bg-white/10 text-[10px] font-extrabold text-white">{s}</span>
            ))}
          </div>
        </div>

        {/* ── Profile Row ── */}
        <div className="flex flex-wrap items-end justify-between gap-3 px-6 pb-5">
          <div className="flex items-end gap-3.5">
            <div className="-mt-7 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-4 border-card text-[26px] font-extrabold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              ب
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-[16px] font-extrabold text-foreground">النخبة للاستشارات التسويقية</p>
                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-extrabold text-green-700">✓ موثّق</span>
              </div>
              <p className="text-[12px] text-muted-foreground">٢ متابع · ٤ مقال · ٤٠ مشاهدة</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/70">رقم السجل التجاري: 4030287651</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <div className="inline-flex items-center gap-1.5 rounded-[9px] border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-muted-foreground">📤 مشاركة</div>
            <div className="inline-flex items-center gap-1.5 rounded-[9px] border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-muted-foreground">🌐 زيارة الموقع</div>
            <div className="inline-flex items-center gap-2 rounded-[9px] px-4 py-2 text-[12px] font-extrabold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>👥 متابعة</div>
          </div>
        </div>

        {/* ── Tabs Strip ── */}
        <div className="flex flex-wrap gap-1.5 border-b border-border px-5 pb-3 pt-1">
          {tabs.map((t, i) => (
            <span key={t.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
              i === 0
                ? "border-violet-600 bg-violet-50 text-violet-700"
                : "border-border bg-background text-muted-foreground"
            }`}>
              <span className="text-[12px]">{t.icon}</span>{t.label}
            </span>
          ))}
        </div>

        {/* ══ 01 المقالات ══ */}
        <SectionHead num="01" title="المقالات المنشورة" sub="كل مقال تنشره يصل للمتابعين تلقائياً" />
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              {articles.map((a) => (
                <article key={a.title} className="mb-3 rounded-[14px] border border-border bg-muted/20 p-4">
                  {a.audio && (
                    <span className="mb-2.5 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold text-violet-700">🎧 نسخة صوتية</span>
                  )}
                  <p className="mb-1.5 text-[13px] font-bold leading-snug text-foreground">{a.title}</p>
                  <p className="mb-3 text-[11px] text-muted-foreground">{a.time} · ⏱️ 1 دقيقة</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span>👁 {a.views}</span><span>💬 {a.comments}</span><span>👍 {a.likes}</span>
                    <span className="mr-auto text-[11px] font-bold text-green-700">📤 مشاركة</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="mb-2 text-[12px] font-bold text-foreground">🏢 ملخص الأعمال</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground">شركة متخصصة في الاستشارات التسويقية وبناء الحضور الرقمي للشركات في السوق السعودي والخليجي.</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="mb-2 text-[12px] font-bold text-foreground">📞 معلومات الاتصال</p>
                {contactInfo.map(([ic, lb]) => (
                  <InfoRow key={lb} label={`${ic} ${lb}`} action="عرض" />
                ))}
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="mb-2 text-[12px] font-bold text-foreground">👥 عملاء مشابهون</p>
                {similarClients.map((c) => (
                  <div key={c} className="flex items-center gap-2 border-b border-border/40 py-1.5 last:border-b-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-[11px] font-extrabold text-violet-700">{c[0]}</div>
                    <span className="text-[11px] font-semibold text-muted-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ 02 حول ══ */}
        <SectionHead num="02" title="حول الشركة" sub="معلومات رسمية + خريطة الموقع" />
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="mb-2.5 text-[12px] font-bold text-foreground">📋 معلومات الشركة</p>
              {companyInfo.map(([k, v]) => <InfoRow key={k} label={k} value={v} />)}
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="mb-2.5 text-[12px] font-bold text-foreground">📜 البيانات الرسمية</p>
              {officialData.map(([k, v]) => <InfoRow key={k} label={k} value={v} />)}
            </div>
            <div className="overflow-hidden rounded-xl border border-border sm:col-span-2">
              <p className="border-b border-border px-4 py-2.5 text-[12px] font-bold text-foreground">🗺️ خريطة الموقع</p>
              <div className="relative flex h-[130px] items-center justify-center"
                style={{ background: "linear-gradient(135deg,#e0f2fe,#bae6fd)" }}>
                <div className="text-center">
                  <div className="mb-1 text-[26px]">📍</div>
                  <p className="text-[11px] font-bold text-sky-700">جدة، المملكة العربية السعودية</p>
                  <p className="mt-1 text-[10px] text-sky-900/70">طريق الملك عبدالعزيز، الرمز 23442</p>
                </div>
                <span className="absolute bottom-2 right-2 rounded-md border border-sky-200 bg-white px-2 py-0.5 text-[10px] font-bold text-sky-700">Google Maps</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ 03 الصور ══ */}
        <SectionHead num="03" title="الصور" sub="صور المقالات تُجمع تلقائياً في جاليري واحد" />
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-3 gap-2">
            {photoEmojis.map((em, i) => (
              <div key={i} className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted/30 text-[22px]">{em}</div>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ 04 المتابعون ══ */}
        <SectionHead num="04" title="المتابعون" sub="يصلهم كل مقال جديد تنشره تلقائياً" />
        <div className="px-6 pb-6 pt-4">
          {followers.map((u, i) => (
            <div key={u.name} className={`flex items-center justify-between py-2.5 ${i < followers.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>{u.name[0]}</div>
                <div>
                  <p className="text-[13px] font-bold text-foreground">{u.name}</p>
                  <p className="text-[11px] text-muted-foreground">{u.sub}</p>
                </div>
              </div>
              <span className="rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700">✓ يتابعك</span>
            </div>
          ))}
          <div className="mt-3.5 flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
            <span className="mt-0.5 text-[14px]">✦</span>
            <p className="text-[12px] font-semibold leading-relaxed text-violet-900">كل متابع جديد = جمهور دائم يستقبل مقالاتك القادمة بدون أي تكلفة إعلانية.</p>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ 05 التقييمات ══ */}
        <SectionHead num="05" title="التقييمات" sub="social proof حقيقي من الزوار مرتبط بالمقالات" />
        <div className="px-6 pb-6 pt-4">
          {reviews.map((r, i) => (
            <div key={r.name} className={`rounded-[14px] border border-border bg-muted/20 p-4 ${i < reviews.length - 1 ? "mb-3" : ""}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>{r.name[0]}</div>
                  <div>
                    <p className="text-[12px] font-bold text-foreground">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">على مقال: {r.article}</p>
                  </div>
                </div>
                <span className="text-[13px] text-amber-500">{"★".repeat(r.stars)}</span>
              </div>
              <p className="border-r-2 border-violet-200 pr-2.5 text-[12px] leading-relaxed text-foreground">"{r.text}"</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border" />

        {/* ══ 06 الريلز ══ */}
        <SectionHead num="06" title="الريلز" sub="جاليري فيديو مستقل لشركتك — يُضاف تلقائياً" />
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-3 gap-2">
            {reelGradients.map((bg, i) => (
              <div key={i} className="relative flex max-h-[200px] min-h-[120px] items-center justify-center overflow-hidden rounded-[14px] border border-violet-300/30"
                style={{ aspectRatio: "9/16", background: bg }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-white/15 text-[14px] text-white">▶</div>
                <span className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">ريل {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ 07 الإعجابات ══ */}
        <SectionHead num="07" title="الإعجابات والتفاعل" sub="إحصائيات تفاعل جمهورك مع شركتك" />
        <div className="px-6 pb-6 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {likeMetrics.map((m) => (
              <div key={m.label} className="rounded-[14px] border border-border bg-muted/20 p-5 text-center">
                <div className="mb-2.5 text-[24px]">{m.icon}</div>
                <p className="mb-1 text-[28px] font-black leading-none text-foreground">{m.val}</p>
                <p className="mb-1 text-[12px] font-bold text-foreground">{m.label}</p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 px-6 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] text-white"
            style={{ background: "linear-gradient(135deg,#1e1b4b,#4f46e5)" }}>✦</div>
          <p className="flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
            صفحتك في مدونتي = LinkedIn + موقع شركة + جاليري + خريطة + تقييمات — كل شيء في رابط واحد مع شارة موثّق.
          </p>
          <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">٧ تبويبات</span>
        </div>

      </Card>
    </div>
  );
}