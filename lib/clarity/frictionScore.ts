import { FRICTION_WEIGHTS } from "./constants";

type FrictionSignals = {
  sessions: number;
  rageClicks: number;
  deadClicks: number;
  quickBacks: number;
  excessiveScroll: number;
  scriptErrors: number;
};

/**
 * Friction score = Σ ( (signal / sessions) * 1000 * weight ).
 * Normalizing per 1000 sessions keeps a high-traffic page from ranking "worst"
 * purely on volume — it's the RATE of friction that matters. Returns 0 when
 * there are no sessions (nothing to divide by), so empty buckets never poison
 * the ranking with Infinity/NaN.
 */
export function calculateFrictionScore(s: FrictionSignals): number {
  if (!s.sessions || s.sessions <= 0) return 0;
  const per1k = (signal: number) => (signal / s.sessions) * 1000;
  const score =
    per1k(s.rageClicks) * FRICTION_WEIGHTS.rageClicks +
    per1k(s.deadClicks) * FRICTION_WEIGHTS.deadClicks +
    per1k(s.quickBacks) * FRICTION_WEIGHTS.quickBacks +
    per1k(s.excessiveScroll) * FRICTION_WEIGHTS.excessiveScroll +
    per1k(s.scriptErrors) * FRICTION_WEIGHTS.scriptErrors;
  return Math.round(score * 100) / 100;
}
