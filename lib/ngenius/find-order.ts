import { getNGeniusAccessToken } from "./auth";
import type { NGeniusOrderResponse, NGeniusPaymentState } from "./types";

const API_BASE = process.env.NGENIUS_API_BASE
  ?? "https://api-gateway.sandbox.ksa.ngenius-payments.com";
const OUTLET_ID = process.env.NGENIUS_OUTLET_ID ?? "";

const PAYMENT_JSON = "application/vnd.ni-payment.v2+json";

/**
 * Fetch canonical order state from N-Genius — the source of truth.
 * Used in two places:
 *   1. Polling from /checkout/processing when webhook is late/missing
 *   2. Webhook handler secondary-verify (webhooks aren't cryptographically signed)
 *
 * `orderRef` is N-Genius' own `reference` field (NOT our merchantOrderReference).
 */
export async function findNGeniusOrder(orderRef: string): Promise<NGeniusOrderResponse> {
  if (!OUTLET_ID) throw new Error("NGENIUS_OUTLET_ID is not set");
  const token = await getNGeniusAccessToken();
  const url = `${API_BASE}/transactions/outlets/${OUTLET_ID}/orders/${encodeURIComponent(orderRef)}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6_000);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: PAYMENT_JSON,
      },
      cache: "no-store",
      signal: ctrl.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    const reason = err instanceof Error ? err.name + ": " + err.message : String(err);
    throw new Error(`N-Genius findOrder network error: ${reason}`);
  }
  clearTimeout(timer);

  if (!res.ok) {
    const detail = await res.text().catch(() => "<no body>");
    throw new Error(`N-Genius findOrder failed: ${res.status} ${detail.slice(0, 300)}`);
  }

  return res.json() as Promise<NGeniusOrderResponse>;
}

const SUCCESS_STATES: NGeniusPaymentState[] = ["AUTHORISED", "CAPTURED", "PURCHASED"];
const FAILURE_STATES: NGeniusPaymentState[] = ["DECLINED", "FAILED", "EXPIRED", "CANCELLED"];

export function isPaymentSucceeded(state: string | undefined): boolean {
  return !!state && (SUCCESS_STATES as string[]).includes(state);
}

export function isPaymentFailed(state: string | undefined): boolean {
  return !!state && (FAILURE_STATES as string[]).includes(state);
}

/** Extract the primary payment from an order response (first entry — orders
 *  typically have one payment). Returns null if the shape is unexpected. */
export function primaryPayment(order: NGeniusOrderResponse) {
  return order._embedded?.payment?.[0] ?? null;
}
