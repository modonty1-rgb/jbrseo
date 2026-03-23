import type { ReactNode } from "react";

import { emailRecipients } from "./leads-data";

export function LeadsEmailCampaignSection(): ReactNode {
  return (
    <>
      <div className="flex items-start gap-3 px-6 pt-6">
        <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">02</span>
        <div>
          <p className="text-[13px] font-bold text-foreground">حملة الإيميل</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">مخصصة باسم كل شخص تلقائياً — أعلى معدل فتح</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 px-6 pb-6 pt-4 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[12px] font-bold text-foreground">📧 إعداد الحملة</p>
          <div className="mb-3 rounded-xl border border-border bg-muted/20 p-3.5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">المستلمون — ساخنون + مهتمون</p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {emailRecipients.map((r) => (
                <span key={r.id} className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                  {r.name}
                </span>
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
          <div
            className="w-full rounded-[10px] py-3 text-center text-[13px] font-extrabold text-white"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}
          >
            ✓ تم إرسال الحملة!
          </div>
        </div>
        <div>
          <p className="mb-3 text-[12px] font-bold text-foreground">👁 معاينة الإيميل</p>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="p-4" style={{ background: "linear-gradient(135deg,#1e1b4b,#2d2a6e)" }}>
              <p className="text-[10px] text-white/50">من: النخبة للاستشارات التسويقية</p>
              <p className="mt-1 text-[12px] font-bold text-white">عرض خاص لك — جرّب مدونتي مجاناً ١٤ يوم</p>
            </div>
            <div className="bg-background p-4">
              <p className="text-[12px] text-foreground">مرحباً محمد،</p>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                شكراً لتفاعلك مع محتوانا. نود نعرفك على باقاتنا المميزة التي تساعد نشاطك على النمو...
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex rounded-lg px-4 py-2 text-[12px] font-bold text-white" style={{ background: "#6d28d9" }}>
                  ابدأ مجاناً الآن ←
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <span className="mt-0.5 text-[14px]">💡</span>
            <p className="text-[12px] font-semibold leading-relaxed text-green-800">
              الإيميل يُخصَّص تلقائياً باسم كل شخص — أعلى معدل فتح من الرسائل العامة.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border" />
    </>
  );
}
