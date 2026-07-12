import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * HMAC-SHA256 helpers for signing outbound calls to Modonty and verifying
 * inbound signatures. Not used for N-Genius webhooks (they use a shared-secret
 * header, no cryptographic signature).
 */

export function signPayload(payload: string | object, secret: string): string {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return createHmac("sha256", secret).update(body).digest("hex");
}

/**
 * Constant-time comparison of an incoming signature against the expected one.
 * Rejects mismatched-length inputs without leaking length info.
 */
export function verifySignature(
  payload: string | object,
  signature: string,
  secret: string,
): boolean {
  if (!signature) return false;
  const expected = signPayload(payload, secret);
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}
