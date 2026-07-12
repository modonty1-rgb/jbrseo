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

// Public browsing — generous (unchanged from old in-memory limiter)
export const landingLimiter  = build("landing",  30, 60);   // 30 req / 60s / IP

// Checkout page submit — stricter (payment page = high-value target)
export const checkoutLimiter = build("checkout", 5,  600);  // 5 req / 10min / IP

// Order creation at N-Genius — strictest (prevents card testing at scale)
export const orderLimiter    = build("order",    3,  60);   // 3 req / 60s / IP
