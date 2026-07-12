/**
 * Cloudflare Turnstile — server-side token verification.
 * Called from any API route that accepts human-driven submissions
 * (currently /api/checkout/create-order; wire more as needed).
 */

const VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileVerifyResult = {
  success: boolean;
  errorCodes?: string[];
  hostname?: string;
  challengeTs?: string;
  action?: string;
};

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string | null,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Fail-closed in prod; open in dev without keys (developer bootstrap).
    if (process.env.NODE_ENV === "production") {
      return { success: false, errorCodes: ["missing-server-secret"] };
    }
    return { success: true, errorCodes: ["dev-bypass-no-secret"] };
  }

  if (!token || !token.trim()) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      body,
      cache: "no-store",
    });
    if (!res.ok) {
      return { success: false, errorCodes: [`http-${res.status}`] };
    }
    const data = await res.json() as {
      success: boolean;
      "error-codes"?: string[];
      hostname?: string;
      challenge_ts?: string;
      action?: string;
    };
    return {
      success: !!data.success,
      errorCodes: data["error-codes"],
      hostname: data.hostname,
      challengeTs: data.challenge_ts,
      action: data.action,
    };
  } catch (e) {
    return {
      success: false,
      errorCodes: ["network-error", e instanceof Error ? e.message : "unknown"],
    };
  }
}

/** Get the client site key — safe to expose to browser (public per Cloudflare docs).
 *  Reads NEXT_PUBLIC_TURNSTILE_SITE_KEY first (correct convention), then falls
 *  back to TURNSTILE_SITE_KEY for backward compat with older env setups. */
export function getTurnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    ?? process.env.TURNSTILE_SITE_KEY
    ?? "";
}
