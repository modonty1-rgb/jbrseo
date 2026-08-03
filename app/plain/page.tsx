import type { Metadata } from "next";

/**
 * TEMP diagnostic page — GPU corruption bisection (2026-07-14).
 * 4 tall zones, each isolating ONE rendering layer. Khalid scrolls through on
 * the affected phone and reports WHICH zones show corruption:
 *   Zone 1 — plain text, SYSTEM font, solid colors  → pure scroll baseline
 *   Zone 2 — plain text, TAJAWAL font               → webfont rasterization
 *   Zone 3 — cards: borders + radius, SOLID colors  → card raster
 *   Zone 4 — cards with color-mix alpha (like /sa)  → alpha/color-mix raster
 * DELETE after diagnosis.
 */

export const metadata: Metadata = {
  title: "تشخيص",
  robots: { index: false, follow: false },
};

const LINES = Array.from({ length: 40 }, (_, i) => i);
const CARDS = Array.from({ length: 24 }, (_, i) => i);

export default function PlainDiagPage() {
  return (
    <main className="bg-background text-foreground">
      {/* ZONE 1 — system font, plain text */}
      <section style={{ fontFamily: "system-ui, sans-serif" }} className="px-6 py-10">
        <h1 className="text-[64px] font-bold text-success mb-6">١</h1>
        <p className="text-xl mb-4">منطقة ١ — خط النظام · نص فقط</p>
        {LINES.map((i) => (
          <p key={i} className="text-base leading-9 mb-4">
            هذا سطر اختبار رقم {i} — نص عادي بدون أي تأثيرات، بدون كروت، بدون ألوان شفافة.
            الهدف قياس التمرير الخام على هذا الجهاز. لو ظهر تشويش هنا فالمشكلة في أساس
            الصفحة وليس في المحتوى إطلاقاً.
          </p>
        ))}
      </section>

      {/* ZONE 2 — Tajawal font (inherited), plain text */}
      <section className="px-6 py-10 border-t-4 border-success">
        <h1 className="text-[64px] font-bold text-success mb-6">٢</h1>
        <p className="text-xl mb-4">منطقة ٢ — خط تجوّل · نص فقط</p>
        {LINES.map((i) => (
          <p key={i} className="text-base leading-9 mb-4">
            هذا سطر اختبار رقم {i} بخط الموقع الفعلي تجوّل — نص عادي بدون كروت وبدون
            ألوان شفافة. لو التشويش يظهر هنا وما ظهر في المنطقة الأولى فالمشكلة في
            رسم الخط نفسه على معالج جهازك.
          </p>
        ))}
      </section>

      {/* ZONE 3 — cards, borders + radius, SOLID colors only */}
      <section className="px-6 py-10 border-t-4 border-success">
        <h1 className="text-[64px] font-bold text-success mb-6">٣</h1>
        <p className="text-xl mb-4">منطقة ٣ — كروت بألوان صلبة</p>
        <div className="flex flex-col gap-4">
          {CARDS.map((i) => (
            <div key={i} className="rounded-2xl border-2 border-border bg-card p-5">
              <div className="text-lg font-bold mb-2">كرت رقم {i}</div>
              <div className="text-sm text-muted-foreground mb-3">
                حدود + زوايا دائرية + خلفية صلبة — بدون شفافية وبدون ظلال.
              </div>
              <span className="inline-flex rounded-full bg-success text-success-foreground px-3 py-1 text-xs font-bold">
                شارة صلبة
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ZONE 4 — cards with alpha / color-mix exactly like the landing */}
      <section className="px-6 py-10 border-t-4 border-success">
        <h1 className="text-[64px] font-bold text-success mb-6">٤</h1>
        <p className="text-xl mb-4">منطقة ٤ — كروت بشفافية مثل صفحة الهبوط</p>
        <div className="flex flex-col gap-4">
          {CARDS.map((i) => (
            <div key={i} className="rounded-2xl border border-success/20 bg-success/10 p-5">
              <div className="text-lg font-bold text-success mb-2">كرت شفاف رقم {i}</div>
              <div className="text-sm text-foreground/75 mb-3">
                خلفية بشفافية ١٠٪ + حدود بشفافية ٢٠٪ — نفس تركيبة العناصر الخضراء في
                صفحة الهبوط اللي ظهر عليها التشويش.
              </div>
              <span className="inline-flex rounded-full bg-card/60 border border-border/60 px-3 py-1 text-xs font-medium">
                شارة شفافة
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="px-6 py-16 text-center text-2xl font-bold text-success">النهاية</div>
    </main>
  );
}
