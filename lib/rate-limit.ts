import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Rate limiters — Upstash Redis, one Redis client shared across three
 * distinct policies. Each limiter uses a namespace prefix so keys never
 * collide (`rl:landing:<ip>`, `rl:checkout:<ip>`, `rl:order:<ip>`).
 *
 * IMPORTANT: falls back to a no-op limiter if env vars are missing (dev
 * bootstrap or preview envs without Upstash). Prod ALWAYS requires them.
 */

function makeRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = makeRedis();

type NoopLimit = { success: true; limit: number; remaining: number; reset: number };
const NOOP_LIMIT: NoopLimit = { success: true, limit: Infinity, remaining: Infinity, reset: 0 };

// Public shape both real + noop limiters expose
export type LimiterResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

function build(prefix: string, limit: number, windowSec: number): {
  limit: (key: string) => Promise<LimiterResult>;
} {
  if (!redis) {
    return { limit: async () => NOOP_LIMIT };
  }
  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    analytics: true,
    prefix: `rl:${prefix}`,
  });
  return {
    limit: async (key: string) => {
      const r = await rl.limit(key);
      return { success: r.success, limit: r.limit, remaining: r.remaining, reset: r.reset };
    },
  };
}

// Public browsing.
//
// Was 30/60s and it fired on ordinary use (2026-08-13): a single visit costs more than one
// request — the proxy redirects `/` → `/sa` and every non-country path too, App Router sends
// a separate RSC request per client navigation, and a shared office or mobile-carrier IP puts
// several people behind one address. Thirty was a scraping limit applied to humans.
//
// 120/60s still stops bulk scraping (a scraper wants thousands of pages, not two per second)
// while leaving normal browsing far below the ceiling. The high-value endpoints keep their own
// strict limits below — those are the ones that actually need to be tight.
export const landingLimiter  = build("landing",  120, 60);  // 120 req / 60s / IP

// Checkout page submit — stricter (payment page = high-value target)
export const checkoutLimiter = build("checkout", 5,  600);  // 5 req / 10min / IP

// Order creation at N-Genius — strictest (prevents card testing at scale)
export const orderLimiter    = build("order",    3,  60);   // 3 req / 60s / IP
