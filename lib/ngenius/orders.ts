import { getNGeniusAccessToken } from "./auth";
import type {
  CreateOrderPayload,
  NGeniusHostedSessionPaymentResponse,
} from "./types";

const API_BASE = process.env.NGENIUS_API_BASE
  ?? "https://api-gateway.sandbox.ksa.ngenius-payments.com";
const OUTLET_ID = process.env.NGENIUS_OUTLET_ID ?? "";

const PAYMENT_JSON = "application/vnd.ni-payment.v2+json";

function ensureOutletId(): string {
  if (!OUTLET_ID) throw new Error("NGENIUS_OUTLET_ID is not set");
  return OUTLET_ID;
}

/**
 * Complete a Hosted Session payment on behalf of a validated session.
 * Called after the browser SDK has generated a session_id and posted it here.
 *
 * The response echoes N-Genius' order structure — we forward it to the
 * browser so the SDK's handlePaymentResponse can trigger 3DS if needed.
 *
 * Docs: https://docs.ngenius-payments.com/docs/web-sdk-integration-guide
 */
export async function completeHostedSessionPayment(
  sessionId: string,
  order: CreateOrderPayload,
): Promise<NGeniusHostedSessionPaymentResponse> {
  const token = await getNGeniusAccessToken();
  const url = `${API_BASE}/transactions/outlets/${ensureOutletId()}/payment/hosted-session/${encodeURIComponent(sessionId)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": PAYMENT_JSON,
      Accept: PAYMENT_JSON,
    },
    body: JSON.stringify(order),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "<no body>");
    throw new Error(`N-Genius hosted-session payment failed: ${res.status} ${detail.slice(0, 300)}`);
  }

  return res.json() as Promise<NGeniusHostedSessionPaymentResponse>;
}

/**
 * Build a merchantOrderReference from a MongoDB ObjectId.
 * N-Genius accepts alphanumeric + hyphens, max 40 chars — ObjectIds fit and
 * double as our internal Subscriber.id, so the reference is fully round-trippable.
 */
export function buildMerchantOrderReference(subscriberId: string): string {
  const clean = subscriberId.replace(/[^A-Za-z0-9-]/g, "").slice(0, 40);
  if (!clean) throw new Error("Empty merchantOrderReference after sanitization");
  return clean;
}

/** Halalas for SAR — N-Genius wants MINOR units in `amount.value`. */
export function toMinorUnits(riyals: number): number {
  return Math.round(riyals * 100);
}
