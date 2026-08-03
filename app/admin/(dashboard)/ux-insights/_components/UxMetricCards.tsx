import type { getClaritySummary } from "@/lib/clarity/queries";
import { deltaTone, fmtNumber, fmtPercent, fmtSeconds } from "../_helpers/format";

type Summary = Awaited<ReturnType<typeof getClaritySummary>>;

function Delta({ value, goodWhenUp }: { value: number; goodWhenUp: boolean }) {
  const tone = deltaTone(value, goodWhenUp);
  const cls =
    tone === "flat"
      ? "text-muted-foreground"
      : tone === "up"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-destructive";
  const arrow = value === 0 ? "→" : value > 0 ? "▲" : "▼";
  return (
    <span className={`text-xs font-semibold ${cls}`} dir="ltr">
      {arrow} {Math.abs(value)}%
    </span>
  );
}

function Card({
  label,
  value,
  delta,
  goodWhenUp,
}: {
  label: string;
  value: string;
  delta: number;
  goodWhenUp: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold text-foreground" dir="ltr">
          {value}
        </span>
        <Delta value={delta} goodWhenUp={goodWhenUp} />
      </div>
    </div>
  );
}

export function UxMetricCards({ summary }: { summary: Summary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        label="الجلسات"
        value={fmtNumber(summary.sessions)}
        delta={summary.deltaPercent.sessions}
        goodWhenUp
      />
      <Card
        label="متوسط وقت التفاعل"
        value={fmtSeconds(summary.engagementTime)}
        delta={summary.deltaPercent.engagementTime}
        goodWhenUp
      />
      <Card
        label="عمق التمرير"
        value={fmtPercent(summary.scrollDepth)}
        delta={summary.deltaPercent.scrollDepth}
        goodWhenUp
      />
      <Card
        label="إشارات الإحباط"
        value={fmtNumber(summary.frictionTotal)}
        delta={summary.deltaPercent.frictionTotal}
        goodWhenUp={false}
      />
    </div>
  );
}
