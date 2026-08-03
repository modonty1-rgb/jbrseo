"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SIGNAL_COLOR, SIGNAL_LABEL_AR } from "../_helpers/format";

type Point = {
  date: string;
  rageClicks: number;
  deadClicks: number;
  quickBacks: number;
  excessiveScroll: number;
  scriptErrors: number;
};

const SIGNALS = ["rageClicks", "deadClicks", "quickBacks", "excessiveScroll", "scriptErrors"] as const;

export function TrendChart({ data }: { data: Point[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        لا توجد بيانات كافية لرسم الاتجاه بعد.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickMargin={8} />
        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={36} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--foreground)" }}
          formatter={(value, name) => [value as number, SIGNAL_LABEL_AR[name as string] ?? String(name)]}
        />
        <Legend formatter={(value: string) => SIGNAL_LABEL_AR[value] ?? value} wrapperStyle={{ fontSize: 12 }} />
        {SIGNALS.map((s) => (
          <Line
            key={s}
            type="monotone"
            dataKey={s}
            stroke={SIGNAL_COLOR[s]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
