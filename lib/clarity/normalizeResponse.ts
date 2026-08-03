import {
  CLARITY_DIMENSIONS,
  TRAFFIC_FIELDS,
  type ClarityDimension,
  type MetricCountable,
} from "./constants";
import type { ClarityExportResponse, ClarityInformationRow } from "./schema";
import type { NormalizedRow } from "./types";
import { calculateFrictionScore } from "./frictionScore";

const DIMENSION_KEYS = new Set<string>(CLARITY_DIMENSIONS);

/** "Rage Click Count" / "RageClickCount" / "rage-click" → "rageclickcount". */
const canon = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

/** string | number | null → number (0 when absent / non-numeric). */
function toNum(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/**
 * Resolves a Clarity metricName to the column it feeds. Substring matching on a
 * canonicalized name tolerates Clarity's inconsistent spacing/suffixes ("Rage
 * Click Count" vs "RageClickCount"). "traffic" is handled with its own confirmed
 * fields. An unrecognized metric returns null → it is preserved in `raw` and
 * leaves its column at 0 rather than inventing a value.
 */
function signalColumn(metricName: string): keyof MetricCountable | "traffic" | null {
  const c = canon(metricName);
  if (c === "traffic") return "traffic";
  if (c.includes("scrolldepth")) return "scrollDepth";
  if (c.includes("engagementtime")) return "engagementTime";
  if (c.includes("rageclick")) return "rageClicks";
  if (c.includes("deadclick")) return "deadClicks";
  if (c.includes("quickback")) return "quickBacks";
  if (c.includes("excessivescroll")) return "excessiveScroll";
  if (c.includes("scripterror")) return "scriptErrors";
  return null;
}

/**
 * For a non-Traffic metric row, the signal is the numeric field(s) that aren't a
 * dimension label. Deriving the count from structure (not a hard-coded key name)
 * keeps us correct even though the docs don't publish each metric's inner field.
 */
function nonDimensionNumericSum(row: ClarityInformationRow): number {
  let sum = 0;
  for (const [k, v] of Object.entries(row)) {
    if (DIMENSION_KEYS.has(k)) continue;
    sum += toNum(v);
  }
  return sum;
}

function emptyRow(dimension: ClarityDimension, value: string): NormalizedRow {
  return {
    dimension,
    value,
    sessions: 0,
    botSessions: 0,
    distinctUsers: 0,
    pagesPerSession: 0,
    engagementTime: 0,
    scrollDepth: 0,
    rageClicks: 0,
    deadClicks: 0,
    quickBacks: 0,
    excessiveScroll: 0,
    scriptErrors: 0,
    frictionScore: 0,
    raw: null,
  };
}

/**
 * Folds one export call's metrics into per-value normalized rows, bucketed by
 * the call's primary dimension `key` (e.g. one row per URL). The full set of
 * metric rows that produced each bucket is kept in `raw` so a metric we don't
 * map today can still be surfaced later without re-fetching.
 */
export function normalizeCall(
  response: ClarityExportResponse,
  key: ClarityDimension,
): NormalizedRow[] {
  const rows = new Map<string, NormalizedRow>();
  const raw = new Map<string, { metricName: string; row: ClarityInformationRow }[]>();

  for (const metric of response) {
    const col = signalColumn(metric.metricName);
    for (const info of metric.information) {
      const rawValue = info[key];
      if (rawValue == null || rawValue === "") continue;
      const value = String(rawValue);

      let target = rows.get(value);
      if (!target) {
        target = emptyRow(key, value);
        rows.set(value, target);
        raw.set(value, []);
      }
      raw.get(value)!.push({ metricName: metric.metricName, row: info });

      if (col === "traffic") {
        target.sessions += toNum(info[TRAFFIC_FIELDS.sessions]);
        target.botSessions += toNum(info[TRAFFIC_FIELDS.botSessions]);
        target.distinctUsers += toNum(info[TRAFFIC_FIELDS.distinctUsers]);
        target.pagesPerSession = toNum(info[TRAFFIC_FIELDS.pagesPerSession]);
      } else if (col) {
        target[col] += nonDimensionNumericSum(info);
      }
    }
  }

  return Array.from(rows.values()).map((r) => ({
    ...r,
    raw: raw.get(r.value) ?? null,
    frictionScore: calculateFrictionScore(r),
  })) as NormalizedRow[];
}
