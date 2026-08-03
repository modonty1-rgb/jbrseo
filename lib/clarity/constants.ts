// ─────────────────────────────────────────────────────────────────
// Microsoft Clarity — Data Export API constants.
// Official reference: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api
// ─────────────────────────────────────────────────────────────────

export const CLARITY_EXPORT_URL =
  "https://www.clarity.ms/export-data/api/v1/project-live-insights";

/** Dimensions the export API accepts (up to 3 per call). */
export const CLARITY_DIMENSIONS = [
  "URL",
  "Device",
  "Browser",
  "OS",
  "Country",
  "Source",
  "Medium",
  "Campaign",
  "Channel",
] as const;
export type ClarityDimension = (typeof CLARITY_DIMENSIONS)[number];

/**
 * The 3 calls we spend per daily run (the API caps at 3 dimensions per call and
 * a small number of calls per project per day). Each call pulls the last 24h.
 * `key` is the primary dimension we persist rows under; extra dimensions ride
 * along in `raw` for future use.
 */
export const DAILY_CALLS: { key: ClarityDimension; dimensions: ClarityDimension[] }[] = [
  { key: "URL", dimensions: ["URL"] }, // page-level friction ranking — the core
  { key: "Device", dimensions: ["Device", "Browser"] }, // device/browser breakdown
  { key: "Source", dimensions: ["Source", "Country"] }, // acquisition quality
];

/** numOfDays is required and capped at 3 by the API (last 24/48/72h). */
export const CLARITY_NUM_OF_DAYS = 1 as const;

/** Retry policy for the export call (FR-02). */
export const CLARITY_MAX_RETRIES = 3;
export const CLARITY_BACKOFF_MS = [1000, 3000, 8000] as const;

/** Clarity truncates the export at this row count — surfaced as `truncated`. */
export const CLARITY_ROW_CAP = 1000;

/**
 * Friction score weights (FR-04 / §11). A page's score is the weighted sum of
 * each negative signal per 1000 sessions, so heavy-traffic pages don't dominate
 * purely by volume.
 *
 *   frictionScore = Σ ( (signal / sessions) * 1000 * weight )
 */
export const FRICTION_WEIGHTS = {
  rageClicks: 3.0,
  deadClicks: 2.5,
  quickBacks: 2.0,
  excessiveScroll: 1.0,
  scriptErrors: 3.0,
} as const;

/** Pages below this session count are excluded from ranking (low signal). */
export const MIN_SESSIONS_FOR_RANKING = 50;

// ─────────────────────────────────────────────────────────────────
// Metric adapters — maps a Clarity `metricName` to the normalized field it
// feeds. The ENVELOPE ([{metricName, information[]}]) and the "Traffic" fields
// are CONFIRMED against the official docs. The friction metricName strings and
// their inner count fields are NOT fully documented — Clarity names them
// loosely ("Rage Click Count", "Script Error Count", ...).
//
// ⚠️ LOCK THIS after the first real API pull: save docs/clarity-sample-response.json,
// read the exact `metricName` + inner numeric key for each friction metric, and
// fill `field` below. Until locked, unknown metrics degrade gracefully — they are
// preserved verbatim in ClarityDaily.raw and simply leave their typed column at 0
// (never a fabricated number, never a crash).
// ─────────────────────────────────────────────────────────────────

/** Confirmed by official docs — Traffic metric information[] fields. */
export const TRAFFIC_FIELDS = {
  sessions: "totalSessionCount",
  botSessions: "totalBotSessionCount",
  distinctUsers: "distantUserCount",
  pagesPerSession: "PagesPerSessionPercentage",
} as const;

/**
 * Best-known metricName → normalized column. VERIFY the left-hand strings
 * against a real payload before trusting the numbers (see warning above).
 */
export const METRIC_NAME_MAP: Record<string, keyof MetricCountable> = {
  ScrollDepth: "scrollDepth",
  EngagementTime: "engagementTime",
  DeadClickCount: "deadClicks",
  RageClickCount: "rageClicks",
  ExcessiveScroll: "excessiveScroll",
  QuickbackClick: "quickBacks",
  ScriptErrorCount: "scriptErrors",
};

/** The numeric columns a metric can populate (besides Traffic). */
export type MetricCountable = {
  scrollDepth: number;
  engagementTime: number;
  deadClicks: number;
  rageClicks: number;
  excessiveScroll: number;
  quickBacks: number;
  scriptErrors: number;
};
