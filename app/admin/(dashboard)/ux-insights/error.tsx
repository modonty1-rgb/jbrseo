"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-6">
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-8 text-center">
        <p className="text-sm font-semibold text-destructive">تعذّر تحميل تحليل تجربة المستخدم</p>
        <p className="mt-2 text-sm text-muted-foreground">
          حدث خطأ أثناء قراءة البيانات. جرّب التحديث — لن يتأثر جمع بيانات Clarity.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
