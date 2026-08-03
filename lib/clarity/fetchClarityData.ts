import {
  CLARITY_EXPORT_URL,
  CLARITY_NUM_OF_DAYS,
  CLARITY_MAX_RETRIES,
  CLARITY_BACKOFF_MS,
  type ClarityDimension,
} from "./constants";
import { clarityExportResponse, type ClarityExportResponse } from "./schema";
import { ClarityApiError } from "./types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Maps a Clarity HTTP status to whether a retry can help.
 * 401 expired token / 403 unauthorized / 400 bad params are permanent — retrying
 * wastes one of the day's few calls. 429 (daily limit) and 5xx/network are the
 * only retriable cases. (Official error table.)
 */
function classify(status: number): { retriable: boolean; label: string } {
  if (status === 401) return { retriable: false, label: "auth failed — token missing/expired" };
  if (status === 403) return { retriable: false, label: "token not authorized for this project" };
  if (status === 400) return { retriable: false, label: "invalid request parameters" };
  if (status === 429) return { retriable: true, label: "daily request limit exceeded" };
  if (status >= 500) return { retriable: true, label: `Clarity server error ${status}` };
  return { retriable: false, label: `unexpected status ${status}` };
}

function buildUrl(dimensions: ClarityDimension[]): string {
  const params = new URLSearchParams({ numOfDays: String(CLARITY_NUM_OF_DAYS) });
  dimensions.slice(0, 3).forEach((d, i) => params.set(`dimension${i + 1}`, d));
  return `${CLARITY_EXPORT_URL}?${params.toString()}`;
}

/**
 * Fetches one dimension slice from the Clarity export API with an exponential
 * backoff retry (FR-02). Throws ClarityApiError on a permanent failure or after
 * exhausting retries — the caller records the reason in ClaritySyncLog and keeps
 * going with the remaining calls (never aborts the whole run).
 */
export async function fetchClarityData(
  dimensions: ClarityDimension[],
  token: string,
): Promise<ClarityExportResponse> {
  const url = buildUrl(dimensions);
  let lastError: ClarityApiError | null = null;

  for (let attempt = 0; attempt <= CLARITY_MAX_RETRIES; attempt++) {
    if (attempt > 0) await sleep(CLARITY_BACKOFF_MS[attempt - 1] ?? 8000);

    let res: Response;
    try {
      res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    } catch (e) {
      // Network-level failure — retriable.
      lastError = new ClarityApiError(
        `network error: ${e instanceof Error ? e.message : String(e)}`,
        0,
        true,
      );
      continue;
    }

    if (res.ok) {
      const json = await res.json();
      return clarityExportResponse.parse(json);
    }

    const { retriable, label } = classify(res.status);
    lastError = new ClarityApiError(label, res.status, retriable);
    if (!retriable) throw lastError;
  }

  throw lastError ?? new ClarityApiError("exhausted retries", 0, true);
}
