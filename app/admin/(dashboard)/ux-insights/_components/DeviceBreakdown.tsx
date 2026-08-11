import type { getClarityBreakdown } from "@/lib/clarity/queries";
import { fmtNumber } from "../_helpers/format";

type Breakdown = Awaited<ReturnType<typeof getClarityBreakdown>>;

/** Device/browser split (FR-08) — isolates whether friction is device-specific. */
export function DeviceBreakdown({ title, data }: { title: string; data: Breakdown }) {
  const totalSessions = data.reduce((n, d) => n + d.sessions, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 text-[11px] font-semibold uppercase text-muted-foreground">
        {title}
      </div>
      {data.length === 0 ? (
        <p className="text-xs text-muted-foreground">لا توجد بيانات بعد.</p>
      ) : (
        <div className="space-y-2">
          {data.slice(0, 6).map((d) => {
            const share = totalSessions ? Math.round((d.sessions / totalSessions) * 100) : 0;
            return (
              <div key={d.value} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-xs text-foreground" dir="ltr" title={d.value}>
                  {d.value}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-primary" style={{ width: `${share}%` }} />
                </span>
                <span className="w-14 text-end font-mono text-[11px] text-muted-foreground" dir="ltr">
                  {fmtNumber(d.sessions)}
                </span>
                <span className="w-16 text-end font-mono text-[11px] text-destructive" dir="ltr" title="مؤشر الإحباط">
                  {Math.round(d.frictionScore)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
