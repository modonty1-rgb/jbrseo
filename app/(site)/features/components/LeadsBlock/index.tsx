import type { ReactNode } from "react";

type LeadTag = "hot" | "warm" | "cold";

type Lead = {
  id: number; name: string; email: string; phone: string;
  whatsapp: boolean; source: string; article: string;
  date: string; tag: LeadTag; tagLabel: string;
};

const LEADS: Lead[] = [
  { id:1, name:"أحمد العمري",    email:"a.omari@nabdco.com.sa",  phone:"0550123456", whatsapp:true,  source:"تعليق",  article:"كيف يرفع المحتوى مبيعات شركتك",  date:"منذ ١٠ دقائق", tag:"hot",  tagLabel:"عميل محتمل ساخن" },
  { id:2, name:"عبدالله السبيعي", email:"a.subaie@alsubaie.sa",  phone:"0512345678", whatsapp:true,  source:"سؤال",   article:"أفضل استراتيجيات تسويق B2B",       date:"منذ يومين",     tag:"hot",  tagLabel:"عميل محتمل ساخن" },
  { id:3, name:"سارة الدوسري",   email:"s.dosari@visionco.sa",   phone:"0501234567", whatsapp:true,  source:"سؤال",   article:"صفحة الشركة",                       date:"منذ ٣ ساعات",   tag:"warm", tagLabel:"مهتم" },
  { id:4, name:"فهد الحربي",     email:"f.harbi@alharbi-co.com", phone:"0543219876", whatsapp:true,  source:"تعليق",  article:"استراتيجيات تسويق B2B",             date:"أمس",           tag:"warm", tagLabel:"مهتم" },
  { id:5, name:"منى العجمي",     email:"m.ajmi@gulf-retail.com", phone:"0567891234", whatsapp:false, source:"تسجيل", article:"النشرة الإخبارية",                   date:"منذ يومين",     tag:"cold", tagLabel:"مشترك" },
  { id:6, name:"ريم الزهراني",   email:"r.zahrani@maroof-sa.com",phone:"0598765432", whatsapp:true,  source:"تعليق",  article:"كيف يرفع المحتوى مبيعات شركتك",  date:"منذ أسبوع",     tag:"cold", tagLabel:"مشترك" },
];

const TAG_STYLE: Record<LeadTag, { row: string; badge: string; avatar: string }> = {
  hot:  { row:"border-red-200 bg-red-50/50",    badge:"border-red-200 bg-red-50 text-red-700",    avatar:"from-red-600 to-red-800" },
  warm: { row:"border-amber-200 bg-amber-50/50", badge:"border-amber-200 bg-amber-50 text-amber-700", avatar:"from-amber-600 to-amber-800" },
  cold: { row:"border-border bg-background",     badge:"border-sky-200 bg-sky-50 text-sky-700",    avatar:"from-sky-600 to-sky-800" },
};

const TAG_ICON: Record<LeadTag, string> = { hot:"🔥", warm:"⚡", cold:"❄️" };

const stats = [
  { icon:"👥", label:"إجمالي الـ Leads", val: LEADS.length,                          color:"text-foreground",  bg:"bg-muted/40" },
  { icon:"🔥", label:"ساخنون",           val: LEADS.filter(l=>l.tag==="hot").length,  color:"text-red-600",     bg:"bg-red-50" },
  { icon:"⚡", label:"مهتمون",           val: LEADS.filter(l=>l.tag==="warm").length, color:"text-amber-600",   bg:"bg-amber-50" },
  { icon:"💬", label:"لديهم واتساب",     val: LEADS.filter(l=>l.whatsapp).length,     color:"text-green-600",   bg:"bg-green-50" },
];

const emailRecipients   = LEADS.filter(l => l.tag !== "cold");
const whatsappRecipients = LEADS.filter(l => l.whatsapp);

function SectionHead({ num, title, sub, color }: { num:string; title:string; sub:string; color:string }) {
  return (
    <div className="flex items-start gap-3 px-6 pt-6">
      <span className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${color}`}>{num}</span>
      <div>
        <p className="text-[13px] font-bold text-foreground">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

export function LeadsBlock(): ReactNode {
  return (
    <div className="mx-auto mb-6 max-w-[960px]" dir="rtl">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">

        {/* ── Top Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-7 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[18px]"
              style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}>🎯</div>
            <div>
              <p className="text-[13px] font-bold text-foreground">قاعدة بيانات leads تلقائية — من كل تفاعل</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">كل زائر يعلّق أو يسأل = lead حقيقي بإيميله ورقمه في لوحتك</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-[11px] font-bold text-red-700">٦ leads جديدة اليوم</span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-4 py-4 text-center ${i < stats.length - 1 ? "border-l border-border" : ""}`}>
              <div className={`mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-[9px] text-[16px] ${s.bg}`}>{s.icon}</div>
              <p className={`text-[24px] font-black leading-none ${s.color}`}>{s.val}</p>
              <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ══ 01 Leads ══ */}
        <SectionHead num="01" title="قائمة الـ Leads" sub="مرتّبون تلقائياً من الأشد اهتماماً للأقل" color="bg-red-50 text-red-700" />

        <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-4">
          <span className="text-[12px] font-bold text-muted-foreground">٦ leads · اختر لإطلاق حملة</span>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[11px] font-bold text-white" style={{ background:"#6d28d9" }}>📧 حملة إيميل</div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-[11px] font-bold text-white">💬 واتساب</div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">تحديد الكل</div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">📥 تصدير CSV</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-6 pt-3">
          {LEADS.map((l) => {
            const s = TAG_STYLE[l.tag];
            return (
              <div key={l.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${s.row}`}>
                <div className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border border-border bg-background text-[9px] ${l.tag !== "cold" ? "border-violet-400 bg-violet-600 text-white" : ""}`}>
                  {l.tag !== "cold" && "✓"}
                </div>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-extrabold text-white ${s.avatar}`}>{l.name[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-bold text-foreground">{l.name}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.badge}`}>{TAG_ICON[l.tag]} {l.tagLabel}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{l.email} · {l.phone}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">📄 {l.article} · {l.source}</p>
                </div>
                <div className="shrink-0 text-left">
                  {l.whatsapp
                    ? <span className="rounded-md border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] font-extrabold text-green-700">WA ✓</span>
                    : <span className="text-[9px] text-muted-foreground">لا واتساب</span>
                  }
                  <p className="mt-1 text-[10px] text-muted-foreground">{l.date}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border" />

        {/* ══ 02 Email ══ */}
        <SectionHead num="02" title="حملة الإيميل" sub="مخصصة باسم كل شخص تلقائياً — أعلى معدل فتح" color="bg-violet-100 text-violet-700" />
        <div className="grid grid-cols-1 gap-5 px-6 pb-6 pt-4 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-[12px] font-bold text-foreground">📧 إعداد الحملة</p>
            <div className="mb-3 rounded-xl border border-border bg-muted/20 p-3.5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">المستلمون — ساخنون + مهتمون</p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {emailRecipients.map(r => (
                  <span key={r.id} className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">{r.name}</span>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">{emailRecipients.length} leads محددون</p>
            </div>
            <div className="mb-2.5">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">موضوع الإيميل</p>
              <div className="rounded-[9px] border border-border bg-muted/30 px-3 py-2.5 text-[12px] text-foreground">عرض خاص لك — جرّب مدونتي مجاناً ١٤ يوم</div>
            </div>
            <div className="mb-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">نص الرسالة</p>
              <div className="h-[88px] rounded-[9px] border border-border bg-muted/30 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
                مرحباً [الاسم]،{"\n"}شكراً لتفاعلك مع محتوانا. نود نعرفك على باقاتنا المميزة...
              </div>
            </div>
            <div className="w-full rounded-[10px] py-3 text-center text-[13px] font-extrabold text-white"
              style={{ background:"linear-gradient(135deg,#16a34a,#15803d)" }}>✓ تم إرسال الحملة!</div>
          </div>
          <div>
            <p className="mb-3 text-[12px] font-bold text-foreground">👁 معاينة الإيميل</p>
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="p-4" style={{ background:"linear-gradient(135deg,#1e1b4b,#2d2a6e)" }}>
                <p className="text-[10px] text-white/50">من: النخبة للاستشارات التسويقية</p>
                <p className="mt-1 text-[12px] font-bold text-white">عرض خاص لك — جرّب مدونتي مجاناً ١٤ يوم</p>
              </div>
              <div className="bg-background p-4">
                <p className="text-[12px] text-foreground">مرحباً محمد،</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">شكراً لتفاعلك مع محتوانا. نود نعرفك على باقاتنا المميزة التي تساعد نشاطك على النمو...</p>
                <div className="mt-4 text-center">
                  <span className="inline-flex rounded-lg px-4 py-2 text-[12px] font-bold text-white" style={{ background:"#6d28d9" }}>ابدأ مجاناً الآن ←</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <span className="mt-0.5 text-[14px]">💡</span>
              <p className="text-[12px] font-semibold leading-relaxed text-green-800">الإيميل يُخصَّص تلقائياً باسم كل شخص — أعلى معدل فتح من الرسائل العامة.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ 03 WhatsApp ══ */}
        <SectionHead num="03" title="حملة واتساب" sub="معدل قراءة 98% — جمهورك يرى رسالتك فعلاً" color="bg-green-100 text-green-700" />
        <div className="grid grid-cols-1 gap-5 px-6 pb-6 pt-4 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-[12px] font-bold text-foreground">💬 إعداد الحملة</p>
            <div className="mb-3 rounded-xl border border-border bg-muted/20 p-3.5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">المستلمون — لديهم واتساب</p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {whatsappRecipients.map(r => (
                  <span key={r.id} className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">{r.name}</span>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground">{whatsappRecipients.length} أشخاص لديهم واتساب</p>
            </div>
            <div className="mb-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">نص الرسالة</p>
              <div className="h-[110px] rounded-[9px] border border-border bg-muted/30 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
                السلام عليكم [الاسم] 👋{"\n\n"}شكراً لتفاعلك مع مقالاتنا! 🎉{"\n\n"}جرّب مدونتي مجاناً ← bit.ly/modonty-free
              </div>
            </div>
            <div className="w-full rounded-[10px] py-3 text-center text-[13px] font-extrabold text-white"
              style={{ background:"linear-gradient(135deg,#16a34a,#15803d)" }}>✓ تم الإرسال لكل المختارين</div>
          </div>
          <div>
            <p className="mb-3 text-[12px] font-bold text-foreground">👁 معاينة الرسالة</p>
            <div className="overflow-hidden rounded-xl border border-green-200">
              <div className="flex items-center gap-2.5 bg-[#075e54] px-4 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-[11px] font-extrabold text-white">ن</div>
                <div>
                  <p className="text-[12px] font-bold text-white">النخبة للاستشارات</p>
                  <p className="text-[10px] text-white/60">متصل الآن</p>
                </div>
              </div>
              <div className="bg-[#e5ddd5] p-4">
                <div className="max-w-[85%] rounded-tl-none rounded-xl bg-white p-3.5 shadow-sm">
                  <p className="text-[12px] leading-relaxed text-gray-800">السلام عليكم محمد 👋<br /><br />شكراً لتفاعلك مع مقالاتنا! 🎉<br /><br />جرّب مدونتي مجاناً ١٤ يوم ← <span className="font-bold text-[#075e54]">bit.ly/modonty-free</span></p>
                  <p className="mt-2 text-left text-[10px] text-gray-400">✓✓ 9:41</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <span className="mt-0.5 text-[14px]">💡</span>
              <p className="text-[12px] font-semibold leading-relaxed text-green-800">معدل قراءة رسائل الواتساب 98% مقارنة بـ 20% للإيميل — جمهورك يرى رسالتك فعلاً.</p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/40 px-6 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[13px] text-white"
            style={{ background:"linear-gradient(135deg,#dc2626,#b91c1c)" }}>✦</div>
          <p className="flex-1 text-[12px] font-semibold leading-relaxed text-foreground">
            الموظف يكتب المقال فقط — مدونتي تكتب المقال وتبني لك قاعدة leads حقيقية جاهزة للحملات من نفس اللحظة.
          </p>
          <span className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">٣ أدوات · ٦ leads</span>
        </div>

      </div>
    </div>
  );
}