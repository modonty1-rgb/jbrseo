import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";

function getSecret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD env var is not set");
  return s;
}

export function signPayload(payload: string): string {
  const secret = getSecret();
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex")}`;
}

export function verifyPayload(signed: string): boolean {
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }
  const i = signed.lastIndexOf(".");
  if (i === -1) return false;
  const payload = signed.slice(0, i);
  const sig = signed.slice(i + 1);
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const expected = hmac.digest("hex");
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function createAdminCookieValue(): string {
  const payload = JSON.stringify({ admin: true, t: Date.now() });
  const signed = signPayload(payload);
  return Buffer.from(signed).toString("base64url");
}

export function getAdminCookieFromHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[1], "base64url").toString("utf8");
    return verifyPayload(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
