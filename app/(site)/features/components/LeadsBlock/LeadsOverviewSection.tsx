import type { ReactNode } from "react";

import { LEADS, TAG_ICON, TAG_STYLE, leadsStats } from "./leads-data";

type LeadsOverviewSectionProps = {
  /** When false, omits the bottom border before email/WhatsApp sections (use in tab layout). */
  tailDivider?: boolean;
};

export function LeadsOverviewSection({ tailDivider = true }: LeadsOverviewSectionProps): ReactNode {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-7 py-4">
        <div className="flex items-center gap-3.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[18px]"
            style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)" }}
          >
            🎯
          </div>
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

      <div className="grid grid-cols-2 divide-x divide-border border-b border-border sm:grid-cols-4">
        {leadsStats.map((s) => (
          <div key={s.label} className="px-4 py-4 text-center">
            <div className={`mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-[9px] text-[16px] ${s.bg}`}>{s.icon}</div>
            <p className={`text-[24px] font-black leading-none ${s.color}`}>{s.val}</p>
            <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 px-6 pt-6">
        <span className="mt-0.5 shrink-0 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-red-700">01</span>
        <div>
          <p className="text-[13px] font-bold text-foreground">قائمة الـ Leads</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">مرتّبون تلقائياً من الأشد اهتماماً للأقل</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-4">
        <span className="text-[12px] font-bold text-muted-foreground">٦ leads · اختر لإطلاق حملة</span>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[11px] font-bold text-white" style={{ background: "#6d28d9" }}>
            📧 حملة إيميل
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-[11px] font-bold text-white">💬 واتساب</div>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">
            تحديد الكل
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-muted-foreground">
            📥 تصدير CSV
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-6 pb-6 pt-3">
        {LEADS.map((l) => {
          const s = TAG_STYLE[l.tag];
          return (
            <div key={l.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${s.row}`}>
              <div
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border border-border bg-background text-[9px] ${
                  l.tag !== "cold" ? "border-violet-400 bg-violet-600 text-white" : ""
                }`}
              >
                {l.tag !== "cold" && "✓"}
              </div>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-extrabold text-white ${s.avatar}`}
              >
                {l.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[13px] font-bold text-foreground">{l.name}</span>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.badge}`}>
                    {TAG_ICON[l.tag]} {l.tagLabel}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {l.email} · {l.phone}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  📄 {l.article} · {l.source}
                </p>
              </div>
              <div className="shrink-0 text-end">
                {l.whatsapp ? (
                  <span className="rounded-md border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] font-extrabold text-green-700">WA ✓</span>
                ) : (
                  <span className="text-[9px] text-muted-foreground">لا واتساب</span>
                )}
                <p className="mt-1 text-[10px] text-muted-foreground">{l.date}</p>
              </div>
            </div>
          );
        })}
      </div>

      {tailDivider ? <div className="border-t border-border" /> : null}
    </>
  );
}
