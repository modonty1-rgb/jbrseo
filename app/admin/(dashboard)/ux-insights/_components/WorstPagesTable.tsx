import type { getClarityWorstPages } from "@/lib/clarity/queries";
import { MIN_SESSIONS_FOR_RANKING } from "@/lib/clarity/constants";
import { fmtNumber, fmtPercent, fmtSeconds } from "../_helpers/format";

type WorstPages = Awaited<ReturnType<typeof getClarityWorstPages>>;
type Page = WorstPages["ranked"][number];

function ScoreBadge({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (score / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-end font-mono text-[12px] font-bold text-foreground" dir="ltr">
        {Math.round(score)}
      </span>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <span className="block h-full rounded-full bg-destructive" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

export function WorstPagesTable({
  data,
  clarityLink,
}: {
  data: WorstPages;
  clarityLink: string | null;
}) {
  const { ranked, insufficient } = data;
  const max = ranked.length ? ranked[0].frictionScore : 0;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-start font-semibold">الصفحة</th>
              <th className="px-3 py-2 text-start font-semibold">مؤشر الإحباط</th>
              <th className="px-3 py-2 text-start font-semibold">الجلسات</th>
              <th className="px-3 py-2 text-start font-semibold">التفاعل</th>
              <th className="px-3 py-2 text-start font-semibold">التمرير</th>
              <th className="px-3 py-2 text-start font-semibold">غضب</th>
              <th className="px-3 py-2 text-start font-semibold">ميتة</th>
              <th className="px-3 py-2 text-start font-semibold">رجوع</th>
              <th className="px-3 py-2 text-start font-semibold">أخطاء</th>
              {clarityLink && <th className="px-3 py-2 text-start font-semibold">Clarity</th>}
            </tr>
          </thead>
          <tbody>
            {ranked.map((p: Page) => (
              <tr key={p.value} className="border-t border-border/60 hover:bg-muted/20">
                <td className="max-w-[240px] truncate px-3 py-2 font-mono text-[12px] text-foreground" dir="ltr" title={p.value}>
                  {p.value}
                </td>
                <td className="px-3 py-2">
                  <ScoreBadge score={p.frictionScore} max={max} />
                </td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground" dir="ltr">{fmtNumber(p.sessions)}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground" dir="ltr">{fmtSeconds(p.engagementTime)}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground" dir="ltr">{fmtPercent(p.scrollDepth)}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-foreground" dir="ltr">{fmtNumber(p.rageClicks)}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-foreground" dir="ltr">{fmtNumber(p.deadClicks)}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-foreground" dir="ltr">{fmtNumber(p.quickBacks)}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-foreground" dir="ltr">{fmtNumber(p.scriptErrors)}</td>
                {clarityLink && (
                  <td className="px-3 py-2">
                    <a href={clarityLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-primary hover:underline">
                      فتح ↗
                    </a>
                  </td>
                )}
              </tr>
            ))}
            {ranked.length === 0 && (
              <tr>
                <td colSpan={clarityLink ? 10 : 9} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  لا توجد صفحات بعدد جلسات كافٍ للترتيب بعد (الحد الأدنى {MIN_SESSIONS_FOR_RANKING} جلسة).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {insufficient.length > 0 && (
        <details className="rounded-xl border border-border bg-card px-4 py-3">
          <summary className="cursor-pointer text-xs font-semibold text-muted-foreground">
            بيانات غير كافية — {insufficient.length} صفحة تحت {MIN_SESSIONS_FOR_RANKING} جلسة (مستبعدة من الترتيب)
          </summary>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {insufficient.slice(0, 40).map((p) => (
              <span key={p.value} className="rounded-md bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground" dir="ltr">
                {p.value} · {fmtNumber(p.sessions)}
              </span>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
