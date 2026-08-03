import type { RangeDays } from "@/lib/clarity/queries";

export const RANGE_OPTIONS: RangeDays[] = [7, 14, 30, 90];

/** Coerces a raw ?days search param to a valid RangeDays (defaults to 7). */
export function parseRange(raw: string | string[] | undefined): RangeDays {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return (RANGE_OPTIONS as number[]).includes(n) ? (n as RangeDays) : 7;
}

/** Arabic labels for the friction signals + metric cards (site is Arabic-only). */
export const SIGNAL_LABEL_AR: Record<string, string> = {
  sessions: "الجلسات",
  engagementTime: "متوسط وقت التفاعل",
  scrollDepth: "عمق التمرير",
  frictionTotal: "إشارات الإحباط",
  rageClicks: "نقرات الغضب",
  deadClicks: "نقرات ميتة",
  quickBacks: "رجوع سريع",
  excessiveScroll: "تمرير مفرط",
  scriptErrors: "أخطاء برمجية",
};

/** Colors for the trend chart lines — one per friction signal. */
export const SIGNAL_COLOR: Record<string, string> = {
  rageClicks: "#ef4444",
  deadClicks: "#f59e0b",
  quickBacks: "#8b5cf6",
  excessiveScroll: "#3b82f6",
  scriptErrors: "#ec4899",
};

export function fmtNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtSeconds(s: number): string {
  if (s < 60) return `${Math.round(s)} ث`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}:${String(rem).padStart(2, "0")} د`;
}

export function fmtPercent(n: number): string {
  return `${Math.round(n)}%`;
}

/** Signed delta with an up/down arrow. `goodWhenUp=false` flips the color intent. */
export function deltaTone(delta: number, goodWhenUp: boolean): "up" | "down" | "flat" {
  if (delta === 0) return "flat";
  return delta > 0 === goodWhenUp ? "up" : "down";
}

/** Opens the external Clarity dashboard (FR-05). Deep URL filtering isn't a
 *  documented query param, so we open the project root — the source of truth. */
export function buildClarityLink(): string | null {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  return id ? `https://clarity.microsoft.com/projects/view/${id}/` : null;
}
