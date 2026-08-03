import type { getClaritySyncStatus } from "@/lib/clarity/queries";

type SyncStatus = Awaited<ReturnType<typeof getClaritySyncStatus>>;

function fmt(d: Date): string {
  const iso = d.toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

/** Freshness / observability banner (FR-09). Only renders when there's
 *  something worth flagging — a healthy fresh sync shows nothing. */
export function SyncStatusBanner({ status }: { status: SyncStatus }) {
  if (!status.lastSyncAt) {
    return (
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
        لم تُشغَّل أي مزامنة بعد. البيانات تبدأ بالظهور بعد أول تشغيل يومي للمهمة المجدولة.
      </div>
    );
  }

  const problem = status.isStale || status.status === "failed" || status.status === "partial";
  if (!problem && !status.truncated) return null;

  const tone =
    status.status === "failed" || status.isStale
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : "border-amber-400/40 bg-amber-400/10 text-amber-700 dark:text-amber-400";

  return (
    <div className={`rounded-lg border px-4 py-2.5 text-sm ${tone}`}>
      {status.isStale && (
        <span>لم تُحدَّث البيانات منذ أكثر من ٢٤ ساعة — آخر مزامنة {fmt(status.lastSyncAt)}. </span>
      )}
      {status.status === "failed" && <span>فشلت آخر مزامنة. </span>}
      {status.status === "partial" && <span>اكتملت آخر مزامنة جزئياً. </span>}
      {status.truncated && <span>بلغت الاستجابة سقف Clarity (١٠٠٠ صف) — قد تكون البيانات ناقصة. </span>}
      {status.error && (
        <span className="font-mono text-xs opacity-80" dir="ltr">
          {status.error}
        </span>
      )}
    </div>
  );
}
