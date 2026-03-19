import type { ReactNode } from "react";

export function WhyNowDirectInquiryBlock(): ReactNode {
  return (
    <div className="mx-auto mb-6 max-w-[960px]" dir="rtl">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">

        {/* ── Top Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-7 py-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] text-[17px]"
              style={{ background: "linear-gradient(135deg,#6d28d9 0%,#4f46e5 100%)" }}
            >
              📩
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground">تواصل مباشر — بدون واتساب أو إيميل خارجي</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">الزائر يسأل من المقال أو صفحتك — وأنت تستقبل في لوحتك</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
            <span className="text-[11px] font-bold text-violet-700">٣ استفسارات جديدة</span>
          </div>
        </div>

        {/* ══ SECTION 1 ══ */}
        <div className="px-7 py-7">
          <div className="mb-5 flex items-start gap-4">
            <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">01</span>
            <div>
              <p className="text-[14px] font-bold text-foreground">تجربة الزائر — من داخل المقال</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">هل لديك سؤال حول ما قرأته؟ تواصل مع صاحب المقال مباشرةً</p>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">الاسم الكامل</span>
              <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-2.5 text-[13px] text-muted-foreground/60">مثال: محمد العنزي</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                رقم التواصل <span className="font-normal opacity-60">(اختياري)</span>
              </span>
              <div className="rounded-[10px] border border-border bg-muted/30 px-3.5 py-2.5 text-[13px] text-muted-foreground/60">05xxxxxxxx</div>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground">سؤالك أو استفسارك</span>
            <div className="h-[76px] w-full rounded-[10px] border border-border bg-muted/30 px-3.5 py-2.5 text-[13px] text-muted-foreground/60">
              اكتب سؤالك هنا وسيصلك الرد مباشرةً...
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex items-center gap-2 rounded-[10px] px-6 py-2.5 text-[13px] font-bold text-white"
              style={{ background: "#4f46e5" }}
            >
              إرسال السؤال ←
            </div>
            <span className="text-[11px] text-muted-foreground">✓ يصل مباشرةً للوحة تحكم صاحب الصفحة</span>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ SECTION 2 ══ */}
        <div className="px-7 py-7">
          <div className="mb-5 flex items-start gap-4">
            <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">02</span>
            <div>
              <p className="text-[14px] font-bold text-foreground">صفحتك — بطاقة تعريف + نموذج تواصل</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">زوارك يجدون كل ما يحتاجون في مكان واحد</p>
            </div>
          </div>

          <div className="mb-4 overflow-hidden rounded-2xl border border-border">
            <div
              className="flex items-center gap-4 p-6 text-white"
              style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)" }}
            >
              <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[14px] border border-white/15 bg-white/10 text-[22px]">
                🏢
              </div>
              <div>
                <p className="text-[15px] font-bold">شركة النخبة للاستشارات</p>
                <p className="mt-1 text-[12px] text-white/55">📍 الرياض، المملكة العربية السعودية</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <span className="rounded-md border border-violet-300/60 bg-violet-300/15 px-2.5 py-0.5 text-[10px] font-bold text-violet-200">✓ موثّق</span>
                  <span className="rounded-md border border-emerald-300/50 bg-emerald-300/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200">١٢ مقال منشور</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/20 p-6">
              <p className="mb-3.5 text-[12px] font-bold text-muted-foreground">تواصل مع هذه الشركة مباشرةً</p>
              <div className="mb-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[10px] border border-border bg-background px-3 py-2.5 text-[12px] text-muted-foreground/60">اسمك</div>
                <div className="rounded-[10px] border border-border bg-background px-3 py-2.5 text-[12px] text-muted-foreground/60">رقمك</div>
              </div>
              <div className="mb-4 h-14 w-full rounded-[10px] border border-border bg-background px-3 py-2.5 text-[12px] text-muted-foreground/60">
                ما الذي تحتاج مساعدة فيه؟
              </div>
              <div className="flex gap-3">
                <div
                  className="flex flex-1 items-center justify-center rounded-[10px] py-2.5 text-[12px] font-bold text-white"
                  style={{ background: "#4f46e5" }}
                >
                  إرسال الاستفسار ←
                </div>
                <div className="inline-flex items-center gap-2 rounded-[10px] bg-green-600 px-4 py-2.5 text-[12px] font-bold text-white">
                  🟢 واتساب
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
            <span className="mt-0.5 text-[14px]">✦</span>
            <p className="text-[12px] font-semibold leading-relaxed text-violet-900">
              صفحتك في مدونتي = بطاقة تعريف رقمية + نموذج تواصل + واتساب — كل شيء في مكان واحد.
            </p>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ══ SECTION 3 ══ */}
        <div className="px-7 py-7">
          <div className="mb-5 flex items-start gap-4">
            <span className="mt-0.5 shrink-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-700">03</span>
            <div>
              <p className="text-[14px] font-bold text-foreground">صندوق الوارد — كل استفساراتك في مكان واحد</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">من المقالات وصفحتك — مع إمكانية الرد مباشرةً</p>
            </div>
          </div>

          <div
            className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[14px] p-5 text-white"
            style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#2d2a6e 100%)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] text-[16px]"
                style={{ background: "rgba(139,92,246,0.25)" }}
              >
                📬
              </div>
              <div>
                <p className="text-[13px] font-bold">صندوق استفسارات العملاء</p>
                <p className="mt-0.5 text-[11px] text-white/50">كل الاستفسارات من المقالات وصفحتك</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-[11px] font-bold text-white">٣ جديد</span>
              <span className="rounded-lg bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white/60">٢ مقروء</span>
            </div>
          </div>

          {/* Message 1 */}
          <div className="mb-3 overflow-hidden rounded-[14px] border-2 border-violet-600">
            <div className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-violet-700 text-[15px] font-extrabold text-white">م</div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground">محمد السعيد</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">
                        📄 كيف يرفع المحتوى مبيعات شركتك
                      </span>
                      <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">جديد</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">منذ ١٠ دقائق</span>
              </div>

              <div className="mt-3.5 rounded-[10px] border border-border bg-background p-4">
                <p className="text-[13px] leading-relaxed text-foreground">
                  السلام عليكم، أنا صاحب متجر إلكتروني وأريد معرفة كيف تساعدني مدونتي في زيادة المبيعات. هل يمكن التواصل لمعرفة التفاصيل؟
                </p>
                <p className="mt-2 text-[11px] text-muted-foreground">📞 0556789012 · ✉️ mohammed@store.com</p>
              </div>

              <div className="mt-3 rounded-[10px] border border-green-200 bg-green-50 p-4">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-green-700">ردك كمسؤول</p>
                <p className="text-[12px] leading-relaxed text-green-800">
                  أهلاً محمد! سيسعدنا مساعدتك. يمكنك البدء بالتجربة المجانية لـ ١٤ يوم — سأتواصل معك على الواتساب لشرح التفاصيل.
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700">
                  ✓ تم الإرسال
                </span>
              </div>
            </div>
          </div>

          {/* Message 2 */}
          <div className="mb-4 overflow-hidden rounded-[14px] border border-border bg-background">
            <div className="flex items-center gap-3 p-5">
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-amber-600 text-[14px] font-extrabold text-white">ن</div>
              <div>
                <p className="text-[13px] font-bold text-foreground">نورة الشمري</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">✓ تم الرد</span>
                  <span className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">🏠 من صفحة الشركة</span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">"هل تقدمون خدماتكم للشركات المصرية أيضاً؟"</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <span className="mt-0.5 text-[14px]">💡</span>
            <p className="text-[12px] font-semibold leading-relaxed text-green-800">
              كل استفسار = عميل محتمل دخل من محتواك — وأنت تتحكم في الرد من مكان واحد.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}