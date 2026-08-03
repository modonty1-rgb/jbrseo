import "server-only";
import { prisma } from "@/lib/prisma";
import { riyadhDayStart } from "./date";
import { calculateFrictionScore } from "./frictionScore";
import { MIN_SESSIONS_FOR_RANKING } from "./constants";

// The dashboard is an internal admin page reading a small, daily-updated table,
// so each request queries Mongo directly — no cache layer to invalidate. (Next
// 16 retired the unstable_cache + single-arg revalidateTag pairing this used to
// rely on; direct reads are simpler and always fresh for this traffic profile.)
const DAY_MS = 86_400_000;

export type RangeDays = 7 | 14 | 30 | 90;

type SignalRow = {
  value: string;
  date: Date;
  sessions: number;
  engagementTime: number;
  scrollDepth: number;
  rageClicks: number;
  deadClicks: number;
  quickBacks: number;
  excessiveScroll: number;
  scriptErrors: number;
  frictionScore: number;
};

const SIGNAL_SELECT = {
  value: true,
  date: true,
  sessions: true,
  engagementTime: true,
  scrollDepth: true,
  rageClicks: true,
  deadClicks: true,
  quickBacks: true,
  excessiveScroll: true,
  scriptErrors: true,
  frictionScore: true,
} as const;

/** Inclusive window [start, end) covering the last `days` Riyadh days up to now. */
function windowFor(days: number, now: Date) {
  const todayStart = riyadhDayStart(now);
  const start = new Date(todayStart.getTime() - (days - 1) * DAY_MS);
  const end = new Date(todayStart.getTime() + DAY_MS); // include all of today
  const prevStart = new Date(start.getTime() - days * DAY_MS);
  return { start, end, prevStart };
}

const emptyAgg = () => ({
  sessions: 0,
  engagementTime: 0,
  scrollDepth: 0,
  rageClicks: 0,
  deadClicks: 0,
  quickBacks: 0,
  excessiveScroll: 0,
  scriptErrors: 0,
});
type Agg = ReturnType<typeof emptyAgg>;

function addWeighted(a: Agg, r: SignalRow) {
  a.sessions += r.sessions;
  // engagement + scroll are averages → weight by sessions, divide out later
  a.engagementTime += r.engagementTime * r.sessions;
  a.scrollDepth += r.scrollDepth * r.sessions;
  a.rageClicks += r.rageClicks;
  a.deadClicks += r.deadClicks;
  a.quickBacks += r.quickBacks;
  a.excessiveScroll += r.excessiveScroll;
  a.scriptErrors += r.scriptErrors;
}

const frictionTotal = (a: Agg) =>
  a.rageClicks + a.deadClicks + a.quickBacks + a.excessiveScroll + a.scriptErrors;

const pct = (curr: number, prev: number) =>
  prev === 0 ? (curr === 0 ? 0 : 100) : Math.round(((curr - prev) / prev) * 1000) / 10;

// ── Summary cards (FR-03) ────────────────────────────────────────
async function summaryUncached(days: RangeDays) {
  const now = new Date();
  const { start, end, prevStart } = windowFor(days, now);

  const rows = (await prisma.clarityDaily.findMany({
    where: { dimension: "URL", date: { gte: prevStart, lt: end } },
    select: SIGNAL_SELECT,
  })) as SignalRow[];

  const curr = emptyAgg();
  const prev = emptyAgg();
  for (const r of rows) {
    if (r.date >= start) addWeighted(curr, r);
    else addWeighted(prev, r);
  }

  const engagementTime = curr.sessions ? curr.engagementTime / curr.sessions : 0;
  const scrollDepth = curr.sessions ? curr.scrollDepth / curr.sessions : 0;
  const prevEng = prev.sessions ? prev.engagementTime / prev.sessions : 0;
  const prevScroll = prev.sessions ? prev.scrollDepth / prev.sessions : 0;

  return {
    sessions: curr.sessions,
    engagementTime: Math.round(engagementTime * 10) / 10,
    scrollDepth: Math.round(scrollDepth * 10) / 10,
    frictionTotal: frictionTotal(curr),
    deltaPercent: {
      sessions: pct(curr.sessions, prev.sessions),
      engagementTime: pct(engagementTime, prevEng),
      scrollDepth: pct(scrollDepth, prevScroll),
      frictionTotal: pct(frictionTotal(curr), frictionTotal(prev)),
    },
  };
}

// ── Worst pages table (FR-04) ────────────────────────────────────
async function worstPagesUncached(days: RangeDays, limit: number) {
  const now = new Date();
  const { start, end } = windowFor(days, now);

  const rows = (await prisma.clarityDaily.findMany({
    where: { dimension: "URL", date: { gte: start, lt: end } },
    select: SIGNAL_SELECT,
  })) as SignalRow[];

  const byPage = new Map<string, Agg>();
  for (const r of rows) {
    let a = byPage.get(r.value);
    if (!a) byPage.set(r.value, (a = emptyAgg()));
    addWeighted(a, r);
  }

  const pages = Array.from(byPage.entries()).map(([value, a]) => ({
    value,
    sessions: a.sessions,
    engagementTime: a.sessions ? Math.round((a.engagementTime / a.sessions) * 10) / 10 : 0,
    scrollDepth: a.sessions ? Math.round((a.scrollDepth / a.sessions) * 10) / 10 : 0,
    rageClicks: a.rageClicks,
    deadClicks: a.deadClicks,
    quickBacks: a.quickBacks,
    excessiveScroll: a.excessiveScroll,
    scriptErrors: a.scriptErrors,
    frictionScore: calculateFrictionScore({ ...a }),
  }));

  const ranked = pages
    .filter((p) => p.sessions >= MIN_SESSIONS_FOR_RANKING)
    .sort((x, y) => y.frictionScore - x.frictionScore)
    .slice(0, limit);
  const insufficient = pages
    .filter((p) => p.sessions < MIN_SESSIONS_FOR_RANKING)
    .sort((x, y) => y.sessions - x.sessions);

  return { ranked, insufficient };
}

// ── Friction trend over time (FR-07) ─────────────────────────────
async function frictionTrendUncached(days: RangeDays) {
  const now = new Date();
  const { start, end } = windowFor(days, now);

  const rows = (await prisma.clarityDaily.findMany({
    where: { dimension: "URL", date: { gte: start, lt: end } },
    select: SIGNAL_SELECT,
  })) as SignalRow[];

  const byDay = new Map<string, Agg>();
  for (const r of rows) {
    const key = r.date.toISOString().slice(0, 10);
    let a = byDay.get(key);
    if (!a) byDay.set(key, (a = emptyAgg()));
    addWeighted(a, r);
  }

  return Array.from(byDay.entries())
    .map(([date, a]) => ({
      date,
      rageClicks: a.rageClicks,
      deadClicks: a.deadClicks,
      quickBacks: a.quickBacks,
      excessiveScroll: a.excessiveScroll,
      scriptErrors: a.scriptErrors,
    }))
    .sort((x, y) => x.date.localeCompare(y.date));
}

// ── Device / Browser breakdown (FR-08) ───────────────────────────
async function breakdownUncached(days: RangeDays, dimension: "Device" | "Browser") {
  const now = new Date();
  const { start, end } = windowFor(days, now);

  const rows = (await prisma.clarityDaily.findMany({
    where: { dimension, date: { gte: start, lt: end } },
    select: SIGNAL_SELECT,
  })) as SignalRow[];

  const byValue = new Map<string, Agg>();
  for (const r of rows) {
    let a = byValue.get(r.value);
    if (!a) byValue.set(r.value, (a = emptyAgg()));
    addWeighted(a, r);
  }

  return Array.from(byValue.entries())
    .map(([value, a]) => ({
      value,
      sessions: a.sessions,
      frictionScore: calculateFrictionScore({ ...a }),
    }))
    .sort((x, y) => y.sessions - x.sessions);
}

// ── Sync freshness banner (FR-09) ────────────────────────────────
async function syncStatusUncached() {
  const last = await prisma.claritySyncLog.findFirst({ orderBy: { runAt: "desc" } });
  const lastSyncAt = last?.runAt ?? null;
  const isStale = !lastSyncAt || Date.now() - lastSyncAt.getTime() > 24 * 60 * 60 * 1000;
  return {
    lastSyncAt,
    isStale,
    status: last?.status ?? null,
    truncated: last?.truncated ?? false,
    error: last?.error ?? null,
  };
}

// ── Public entry points (direct reads, always fresh) ─────────────
export const getClaritySummary = (days: RangeDays) => summaryUncached(days);

export const getClarityWorstPages = (days: RangeDays, limit = 20) =>
  worstPagesUncached(days, limit);

export const getClarityFrictionTrend = (days: RangeDays) => frictionTrendUncached(days);

export const getClarityBreakdown = (days: RangeDays, dimension: "Device" | "Browser") =>
  breakdownUncached(days, dimension);

export const getClaritySyncStatus = () => syncStatusUncached();
