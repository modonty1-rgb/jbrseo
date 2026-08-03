"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Check } from "lucide-react";
import { updatePlan, togglePlanVisibility } from "@/app/actions/pricing";
import { allDurationPrices, FREE_MONTHS } from "@/lib/pricing-durations";
import { cn } from "@/lib/utils";

export type PricingRow = {
  slug: string;
  name: string;
  articles: string;
  badge: string | null;
  order: number;
  sa: { monthly: number; visible: boolean };
  eg: { monthly: number; visible: boolean };
};

const ar = (n: number) => Math.round(n).toLocaleString("ar-EG");

export function PricingDurationsAdmin({ rows }: { rows: PricingRow[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" dir="rtl">
      {rows.map((row) => (
        <PlanPriceCard key={row.slug} row={row} />
      ))}
    </div>
  );
}

function PlanPriceCard({ row }: { row: PricingRow }) {
  const router = useRouter();
  const [sa, setSa] = useState(row.sa.monthly);
  const [eg, setEg] = useState(row.eg.monthly);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  const dirty = sa !== row.sa.monthly || eg !== row.eg.monthly;

  const save = () =>
    start(async () => {
      await Promise.all([
        updatePlan("SA", row.slug, { priceMonthly: Math.max(0, Math.floor(sa)) }),
        updatePlan("EG", row.slug, { priceMonthly: Math.max(0, Math.floor(eg)) }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      router.refresh();
    });

  const toggleVis = (country: "SA" | "EG") =>
    start(async () => {
      await togglePlanVisibility(country, row.slug);
      router.refresh();
    });

  const saDur = allDurationPrices(sa);
  const egDur = allDurationPrices(eg);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* header */}
      <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-4 py-2.5">
        <span className="cursor-grab text-xs text-muted-foreground/60" title="الترتيب">
          ⋮⋮ #{row.order}
        </span>
        <h3 className="flex-1 truncate text-base font-bold text-foreground">{row.name}</h3>
        {row.badge ? (
          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10.5px] font-bold text-green-500">
            {row.badge}
          </span>
        ) : null}
      </div>

      <div className="p-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          {row.articles}
          <Lock className="size-3 text-muted-foreground/60" aria-hidden />
          <span className="text-muted-foreground/60">الاسم والمميزات تُعدّل من إدارة المحتوى</span>
        </p>

        {/* base monthly — the only editable prices */}
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
          <span className="whitespace-nowrap text-[11px] text-muted-foreground">🌍 السعر الشهري</span>
          <label className="flex flex-1 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5">
            <span className="text-sm">🇸🇦</span>
            <input
              type="number"
              value={sa}
              onChange={(e) => setSa(Number(e.target.value) || 0)}
              className="w-full min-w-0 bg-transparent text-center text-base font-extrabold text-foreground outline-none"
            />
            <span className="text-[11px] text-muted-foreground">﷼</span>
          </label>
          <label className="flex flex-1 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5">
            <span className="text-sm">🇪🇬</span>
            <input
              type="number"
              value={eg}
              onChange={(e) => setEg(Number(e.target.value) || 0)}
              className="w-full min-w-0 bg-transparent text-center text-base font-extrabold text-foreground outline-none"
            />
            <span className="text-[11px] text-muted-foreground">ج.م</span>
          </label>
        </div>

        {/* the three durations — always visible */}
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="text-[10.5px] text-muted-foreground/70">
              <th className="pb-1.5 text-start font-medium">المدة</th>
              <th className="pb-1.5 font-medium">السعودية</th>
              <th className="pb-1.5 font-medium">مصر</th>
              <th className="pb-1.5 font-medium">الخدمة</th>
            </tr>
          </thead>
          <tbody>
            {saDur.map((d, i) => {
              const free = FREE_MONTHS[d.duration];
              const isBest = d.duration === 12;
              return (
                <tr key={d.duration} className={cn("border-t border-border", isBest && "bg-amber-500/6")}>
                  <td className="py-2 text-start text-[12.5px] font-bold text-foreground">
                    {d.duration === 12 ? "١٢ شهر" : d.duration === 6 ? "٦ شهور" : "٣ شهور"}
                    {isBest ? <span className="text-amber-500"> ★</span> : null}
                    <span className="block text-[10px] font-medium text-muted-foreground/70">تدفع {ar(d.duration)} شهر</span>
                  </td>
                  <td className="py-2">
                    <span className="text-[14px] font-extrabold text-foreground">{ar(d.total)}</span>
                    <span className="text-[9.5px] text-muted-foreground/70"> ﷼</span>
                  </td>
                  <td className="py-2">
                    <span className="text-[14px] font-extrabold text-foreground">{ar(egDur[i].total)}</span>
                    <span className="text-[9.5px] text-muted-foreground/70"> ج.م</span>
                  </td>
                  <td className="py-2 text-[11px] text-muted-foreground">
                    {free > 0 ? (
                      <>
                        <b className="text-green-500">{d.serviceMonths} شهر</b> ·{" "}
                        <span className="font-bold text-amber-500">{ar(free)} {free >= 3 ? "شهور" : "شهر"} هدية</span>
                      </>
                    ) : (
                      <>{d.serviceMonths} شهور</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* footer: visibility per country + save */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <div className="flex items-center gap-3">
            <VisToggle label="🇸🇦" on={row.sa.visible} onClick={() => toggleVis("SA")} disabled={pending} />
            <VisToggle label="🇪🇬" on={row.eg.visible} onClick={() => toggleVis("EG")} disabled={pending} />
          </div>
          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold transition-colors",
              dirty
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "cursor-default bg-muted text-muted-foreground",
            )}
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : saved ? <Check className="size-3.5" aria-hidden /> : null}
            {saved ? "تم الحفظ" : "حفظ الأسعار"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VisToggle({ label, on, onClick, disabled }: { label: string; on: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground disabled:opacity-50"
      title={on ? "ظاهرة — اضغط للإخفاء" : "مخفية — اضغط للإظهار"}
    >
      <span>{label}</span>
      <span className={cn("relative h-4.5 w-8 rounded-full transition-colors", on ? "bg-green-500" : "bg-border")}>
        <span className={cn("absolute top-0.5 size-3.5 rounded-full bg-white transition-all", on ? "left-0.5" : "right-0.5")} />
      </span>
      <span>{on ? "ظاهرة" : "مخفية"}</span>
    </button>
  );
}
