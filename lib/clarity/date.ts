/**
 * Riyadh is UTC+3 all year (no daylight saving), so day boundaries are a fixed
 * offset — no timezone library needed. Returns the UTC instant that corresponds
 * to the start (00:00) of the Riyadh day containing `now`. Normalizing the date
 * ONCE here (not on render) keeps every ClarityDaily row bucketed on the same
 * Riyadh calendar day and makes the daily cron idempotent.
 */
const RIYADH_OFFSET_MS = 3 * 60 * 60 * 1000;

export function riyadhDayStart(now: Date): Date {
  const shifted = new Date(now.getTime() + RIYADH_OFFSET_MS);
  const y = shifted.getUTCFullYear();
  const m = shifted.getUTCMonth();
  const d = shifted.getUTCDate();
  return new Date(Date.UTC(y, m, d, 0, 0, 0) - RIYADH_OFFSET_MS);
}
