import type { ClarityDimension } from "./constants";

/** One normalized bucket ready to upsert into ClarityDaily. */
export type NormalizedRow = {
  dimension: ClarityDimension;
  value: string;

  sessions: number;
  botSessions: number;
  distinctUsers: number;
  pagesPerSession: number;
  engagementTime: number;
  scrollDepth: number;

  rageClicks: number;
  deadClicks: number;
  quickBacks: number;
  excessiveScroll: number;
  scriptErrors: number;

  /** Weighted friction score, computed at normalize time (never on render). */
  frictionScore: number;

  /** Untouched Clarity metrics that produced this row — persisted verbatim. */
  raw: unknown;
};

/** Outcome of one dimension's export call within a daily run. */
export type CallResult = {
  key: ClarityDimension;
  ok: boolean;
  rows: NormalizedRow[];
  truncated: boolean;
  error?: string;
};

/** A typed error from the export fetch, carrying the HTTP status Clarity returned. */
export class ClarityApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly retriable: boolean,
  ) {
    super(message);
    this.name = "ClarityApiError";
  }
}
