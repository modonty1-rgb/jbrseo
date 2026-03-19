import type { ReactNode } from "react";

export function WhyNowCommentsBlock(): ReactNode {
  return (
    <div className="mx-auto mb-4 max-w-[960px] overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-7 py-5">
        <span className="text-[18px]" aria-hidden="true">💬</span>
        <div>
          <p className="text-[13px] font-extrabold text-foreground">تفاعل حقيقي على مقالاتك</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">زوارك يتفاعلون — وأنت تتحكم من لوحتك</p>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Visitor Section */}
      <div className="px-7 py-6">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-[12px] font-bold text-muted-foreground">
          👁 تجربة الزائر
        </span>

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-muted/40 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-[18px]">📄</div>
          <div>
            <p className="text-[13px] font-bold text-foreground">كيف يرفع المحتوى العضوي مبيعات شركتك بدون إعلانات</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">مقال منشور على موقع عميل مدونتي</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[14px] font-extrabold text-white">أ</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-bold text-foreground">أحمد الرشيدي</span>
              <span className="text-[11px] text-muted-foreground">منذ ٣ ساعات</span>
            </div>
            <div className="mt-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
              <p className="text-[13px] leading-relaxed text-foreground">مقال رائع! هل هذا الأسلوب يناسب الشركات الصغيرة أيضاً؟</p>
            </div>
            <div className="mt-3 flex gap-3">
              <span className="text-[11px] font-bold text-muted-foreground">👍 ٤ إعجاب</span>
              <span className="text-[11px] font-bold text-violet-600">↩ رد</span>
            </div>
            <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-[12px] font-extrabold text-white">س</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[12px] font-bold text-foreground">سارة المطيري</span>
                  <span className="text-[11px] text-muted-foreground">منذ ساعة</span>
                </div>
                <div className="mt-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-[12px] leading-relaxed text-green-800">نعم أحمد! أنا طبّقته على متجري وشفت نتائج خلال شهرين 🎉</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3">
          <span className="text-[14px]" aria-hidden="true">✦</span>
          <p className="text-[12px] font-semibold leading-relaxed text-violet-900">
            كل تعليق = زائر متفاعل أطال وقته على الصفحة — إشارة SEO إيجابية لجوجل.
          </p>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Dashboard Section */}
      <div className="px-7 py-6">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-[12px] font-bold text-muted-foreground">
          ⚙️ لوحة تحكمك
        </span>

        <div className="mb-5 rounded-xl bg-indigo-950 p-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-200/20 text-[16px]">⚙️</div>
              <div>
                <p className="text-[13px] font-extrabold">لوحة تحكم التعليقات</p>
                <p className="mt-0.5 text-[11px] text-white/50">إدارة تعليقات جميع مقالاتك</p>
              </div>
            </div>
            <span className="rounded-lg bg-violet-400 px-4 py-1 text-[12px] font-extrabold text-indigo-950">٢ تنتظر موافقتك</span>
          </div>
        </div>

        <div className="mb-4 overflow-hidden rounded-xl border border-border">
          <div className="flex gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[14px] font-extrabold text-white">م</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] font-bold text-foreground">محمد العنزي</span>
                <span className="inline-flex items-center rounded-md border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[11px] font-bold text-yellow-700">⏳ ينتظر موافقة</span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">"ممتاز! كيف أبدأ مع مدونتي؟ هل هناك تجربة مجانية؟"</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border bg-muted/30 p-4">
            <div className="inline-flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-[12px] font-bold text-green-700">✓ تمت الموافقة</div>
            <div className="inline-flex items-center gap-2 rounded-md border border-violet-400 bg-violet-50 px-4 py-2 text-[12px] font-bold text-violet-700">✓ تم الرد</div>
            <div className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-[12px] font-bold text-red-600">🗑 احذف</div>
          </div>

          <div className="flex gap-3 border-t border-violet-200 bg-violet-50 p-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[12px] font-extrabold text-white">أ</div>
            <div>
              <p className="mb-1 text-[11px] font-bold text-violet-900">ردك كمسؤول:</p>
              <p className="text-[12px] leading-relaxed text-violet-900">نعم محمد! أول ١٤ يوم مجاناً — ابدأ الآن من الرابط في البايو 🎉</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <span className="text-[14px]" aria-hidden="true">💡</span>
          <p className="text-[12px] font-semibold leading-relaxed text-green-800">كل رد منك = فرصة تحويل عميل محتمل مباشرة من لوحتك.</p>
        </div>
      </div>
    </div>
  );
}