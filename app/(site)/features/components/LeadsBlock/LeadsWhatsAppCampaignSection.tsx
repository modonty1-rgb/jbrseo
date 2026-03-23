import type { ReactNode } from "react";

import { whatsappRecipients } from "./leads-data";

export function LeadsWhatsAppCampaignSection(): ReactNode {
  return (
    <>
      <div className="flex items-start gap-3 px-6 pt-6">
        <span className="mt-0.5 shrink-0 rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-green-700">03</span>
        <div>
          <p className="text-[13px] font-bold text-foreground">حملة واتساب</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">معدل قراءة 98% — جمهورك يرى رسالتك فعلاً</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 px-6 pb-6 pt-4 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[12px] font-bold text-foreground">💬 إعداد الحملة</p>
          <div className="mb-3 rounded-xl border border-border bg-muted/20 p-3.5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">المستلمون — لديهم واتساب</p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {whatsappRecipients.map((r) => (
                <span key={r.id} className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                  {r.name}
                </span>
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
          <div
            className="w-full rounded-[10px] py-3 text-center text-[13px] font-extrabold text-white"
            style={{ background: "linear-gradient(135deg,#16a34a,#15803d)" }}
          >
            ✓ تم الإرسال لكل المختارين
          </div>
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
                <p className="text-[12px] leading-relaxed text-gray-800">
                  السلام عليكم محمد 👋
                  <br />
                  <br />
                  شكراً لتفاعلك مع مقالاتنا! 🎉
                  <br />
                  <br />
                  جرّب مدونتي مجاناً ١٤ يوم ← <span className="font-bold text-[#075e54]">bit.ly/modonty-free</span>
                </p>
                <p className="mt-2 text-end text-[10px] text-gray-400">✓✓ 9:41</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <span className="mt-0.5 text-[14px]">💡</span>
            <p className="text-[12px] font-semibold leading-relaxed text-green-800">
              معدل قراءة رسائل الواتساب 98% مقارنة بـ 20% للإيميل — جمهورك يرى رسالتك فعلاً.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
