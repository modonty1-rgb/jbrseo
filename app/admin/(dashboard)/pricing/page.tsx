import { getAllPlansIncludingHidden } from "@/app/actions/pricing";
import { PricingDurationsAdmin, type PricingRow } from "./PricingDurationsAdmin";

// Price-focused admin: one card per plan showing BOTH countries and ALL three
// durations at once (no toggle — clarity first). Edits only the monthly base
// per country; durations + free months are derived (lib/pricing-durations).
// Plan content (name · articles · highlights) is edited from إدارة المحتوى.
export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const [sa, eg] = await Promise.all([
    getAllPlansIncludingHidden("SA"),
    getAllPlansIncludingHidden("EG"),
  ]);
  const egBySlug = new Map(eg.map((p) => [p.slug, p]));

  const rows: PricingRow[] = [...sa]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((p) => {
      const e = egBySlug.get(p.slug);
      return {
        slug: p.slug,
        name: p.name,
        articles: p.articlesLabel,
        badge: p.badge,
        order: p.displayOrder,
        sa: { monthly: p.priceMonthly, visible: p.visible },
        eg: { monthly: e?.priceMonthly ?? 0, visible: e?.visible ?? false },
      };
    });

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">إدارة الأسعار</h1>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        تعدّل <b className="text-foreground">السعر الشهري فقط</b> لكل دولة — والمدد الثلاث (٣/٦/١٢) وشهور الهدية تُحسب تلقائياً.
        <br />
        سياسة الهدية: ٣ شهور = بلا هدية · ٦ شهور = +شهر · ١٢ شهر = +٦ شهور (⭐ الموصى به). الأسعار شاملة ضريبة ١٥٪.
      </p>

      <PricingDurationsAdmin rows={rows} />
    </div>
  );
}
