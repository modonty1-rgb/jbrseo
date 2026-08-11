import type { ReactElement } from "react";
import { PrismaClient } from "@prisma/client";

// Failure-intelligence dashboard — every declined/failed checkout attempt with
// its literal N-Genius reason (or client-side error). Internal only; the customer
// never sees these codes. Sources: client SDK (stage=session/validate/3ds),
// create-payment (auth), status polling (poll), webhook (webhook — once approved).
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

const STAGE_LABEL: Record<string, string> = {
  validate: "تحقق العميل",
  session: "توليد الجلسة",
  "create-payment": "إنشاء الطلب",
  auth: "التفويض",
  "3ds": "تحقق ثنائي",
  poll: "متابعة",
  webhook: "webhook",
  submit: "إرسال",
};

function fmt(d: Date): string {
  // Stable Riyadh-ish display without locale deps.
  const iso = d.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

export default async function PaymentFailuresPage(): Promise<ReactElement> {
  const [rows, total] = await Promise.all([
    prisma.paymentAttempt.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.paymentAttempt.count(),
  ]);

  // Aggregates
  const byStage = new Map<string, number>();
  const byCode = new Map<string, number>();
  const byCountry = new Map<string, number>();
  for (const r of rows) {
    byStage.set(r.stage, (byStage.get(r.stage) ?? 0) + 1);
    if (r.code) byCode.set(r.code, (byCode.get(r.code) ?? 0) + 1);
    const c = r.country || (r.cardBin ? `BIN ${r.cardBin}` : "—");
    byCountry.set(c, (byCountry.get(c) ?? 0) + 1);
  }
  const topCodes = [...byCode.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground">رفوضات الدفع</h1>
        <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-mono text-muted-foreground">
          الإجمالي {total.toLocaleString("en-US")} · آخر {rows.length}
        </span>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        كل محاولة دفع فشلت — بسببها الحرفي من N-Genius (أو خطأ العميل). داخلي فقط، لا يراه العميل.
        <br />
        بطاقة أجنبية تُرفض عادةً في مرحلة «توليد الجلسة» أو «التفويض» بكود مثل <b className="text-foreground">05</b> أو رفض قاعدة مخاطر.
      </p>

      {/* Summary chips */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">حسب المرحلة</div>
          <div className="flex flex-wrap gap-1.5">
            {[...byStage.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => (
              <span key={s} className="rounded-md bg-muted/50 px-2 py-1 text-xs text-foreground">
                {STAGE_LABEL[s] ?? s} <span className="font-mono text-muted-foreground">{n}</span>
              </span>
            ))}
            {byStage.size === 0 && <span className="text-xs text-muted-foreground">لا يوجد بعد</span>}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">أكثر الأكواد</div>
          <div className="flex flex-wrap gap-1.5">
            {topCodes.map(([c, n]) => (
              <span key={c} className="rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive" dir="ltr">
                {c} <span className="font-mono opacity-70">{n}</span>
              </span>
            ))}
            {topCodes.length === 0 && <span className="text-xs text-muted-foreground">لا يوجد بعد</span>}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">حسب الدولة / البطاقة</div>
          <div className="flex flex-wrap gap-1.5">
            {[...byCountry.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c, n]) => (
              <span key={c} className="rounded-md bg-muted/50 px-2 py-1 text-xs text-foreground" dir="ltr">
                {c} <span className="font-mono text-muted-foreground">{n}</span>
              </span>
            ))}
            {byCountry.size === 0 && <span className="text-xs text-muted-foreground">لا يوجد بعد</span>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-start font-semibold">الوقت</th>
              <th className="px-3 py-2 text-start font-semibold">المرحلة</th>
              <th className="px-3 py-2 text-start font-semibold">الكود</th>
              <th className="px-3 py-2 text-start font-semibold">الرسالة</th>
              <th className="px-3 py-2 text-start font-semibold">الباقة</th>
              <th className="px-3 py-2 text-start font-semibold">الدولة</th>
              <th className="px-3 py-2 text-start font-semibold">البطاقة</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border/60 hover:bg-muted/20">
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-muted-foreground" dir="ltr">{fmt(r.createdAt)}</td>
                <td className="px-3 py-2 text-foreground">{STAGE_LABEL[r.stage] ?? r.stage}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-destructive" dir="ltr">{r.code ?? "—"}</td>
                <td className="max-w-[280px] truncate px-3 py-2 text-[12px] text-muted-foreground" title={r.message ?? undefined}>{r.message ?? "—"}</td>
                <td className="px-3 py-2 text-[12px] text-foreground">{[r.plan, r.duration].filter(Boolean).join(" · ") || "—"}</td>
                <td className="px-3 py-2 text-[12px] text-foreground" dir="ltr">{r.country ?? "—"}</td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-muted-foreground" dir="ltr">
                  {[r.cardScheme, r.cardBin].filter(Boolean).join(" ") || "—"}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  لا توجد رفوضات مسجّلة بعد. أي محاولة فاشلة ستظهر هنا فوراً.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
