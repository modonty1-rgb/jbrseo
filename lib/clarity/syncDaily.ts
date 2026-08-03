import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DAILY_CALLS, CLARITY_ROW_CAP } from "./constants";
import { fetchClarityData } from "./fetchClarityData";
import { normalizeCall } from "./normalizeResponse";
import { riyadhDayStart } from "./date";
import { ClarityApiError, type NormalizedRow } from "./types";

export type SyncResult = {
  status: "success" | "partial" | "failed";
  targetDate: Date;
  callsUsed: number;
  rowsSaved: number;
  truncated: boolean;
  error?: string;
};

/** Scalar payload shared by the create + update branches of the upsert. */
function scalars(r: NormalizedRow) {
  return {
    sessions: Math.round(r.sessions),
    botSessions: Math.round(r.botSessions),
    distinctUsers: Math.round(r.distinctUsers),
    pagesPerSession: r.pagesPerSession,
    engagementTime: r.engagementTime,
    scrollDepth: r.scrollDepth,
    rageClicks: Math.round(r.rageClicks),
    deadClicks: Math.round(r.deadClicks),
    quickBacks: Math.round(r.quickBacks),
    excessiveScroll: Math.round(r.excessiveScroll),
    scriptErrors: Math.round(r.scriptErrors),
    frictionScore: r.frictionScore,
    raw: (r.raw ?? Prisma.JsonNull) as Prisma.InputJsonValue,
  };
}

/**
 * The daily pipeline: for each planned call, fetch → normalize → upsert. One
 * failing call is logged and skipped — the run keeps going so a single bad
 * dimension never drops the whole day (FR-02). Every run writes exactly one
 * ClaritySyncLog row for the dashboard's freshness/observability banner.
 *
 * `now` is injectable for testing; production passes the real time.
 */
export async function syncClarityDaily(now: Date = new Date()): Promise<SyncResult> {
  const token = process.env.CLARITY_API_TOKEN;
  const targetDate = riyadhDayStart(now);

  if (!token) {
    await prisma.claritySyncLog.create({
      data: {
        targetDate,
        status: "failed",
        callsUsed: 0,
        rowsSaved: 0,
        truncated: false,
        error: "CLARITY_API_TOKEN is not set",
      },
    });
    return {
      status: "failed",
      targetDate,
      callsUsed: 0,
      rowsSaved: 0,
      truncated: false,
      error: "CLARITY_API_TOKEN is not set",
    };
  }

  let callsUsed = 0;
  let rowsSaved = 0;
  let truncated = false;
  const errors: string[] = [];

  for (const call of DAILY_CALLS) {
    callsUsed++;
    try {
      const response = await fetchClarityData(call.dimensions, token);

      const infoCount = response.reduce((n, m) => n + m.information.length, 0);
      if (infoCount >= CLARITY_ROW_CAP) truncated = true;

      const rows = normalizeCall(response, call.key);
      for (const r of rows) {
        await prisma.clarityDaily.upsert({
          where: {
            date_dimension_value: { date: targetDate, dimension: r.dimension, value: r.value },
          },
          create: { date: targetDate, dimension: r.dimension, value: r.value, ...scalars(r) },
          update: scalars(r),
        });
        rowsSaved++;
      }
    } catch (e) {
      const detail =
        e instanceof ClarityApiError ? `${e.status} ${e.message}` : String(e);
      errors.push(`${call.key}: ${detail}`);
    }
  }

  const status: SyncResult["status"] =
    errors.length === 0 ? "success" : rowsSaved > 0 ? "partial" : "failed";

  const result: SyncResult = {
    status,
    targetDate,
    callsUsed,
    rowsSaved,
    truncated,
    error: errors.length ? errors.join(" | ") : undefined,
  };

  await prisma.claritySyncLog.create({
    data: {
      targetDate,
      status,
      callsUsed,
      rowsSaved,
      truncated,
      error: result.error ?? null,
    },
  });

  return result;
}
