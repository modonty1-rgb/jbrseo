import { displayMainTotalFromMoYr } from "@/lib/pricing-plan-amounts";

function appendQuery(signupHrefBase: string, query: string): string {
  const sep = signupHrefBase.includes("?") ? "&" : "?";
  return `${signupHrefBase}${sep}${query}`;
}

export function buildSignupHrefWithPlan(
  signupHrefBase: string,
  planIndex: number,
  annual: boolean,
  mo: number,
  yr: number
): string {
  const total = displayMainTotalFromMoYr(mo, yr, annual);
  return appendQuery(
    signupHrefBase,
    `plan=${planIndex}&billing=${annual ? "annual" : "monthly"}&total=${total}`
  );
}

export function buildSignupHrefWithPlanId(
  signupHrefBase: string,
  planId: string,
  annual: boolean,
  mo: number,
  yr: number
): string {
  const total = displayMainTotalFromMoYr(mo, yr, annual);
  return appendQuery(
    signupHrefBase,
    `plan=${encodeURIComponent(planId)}&billing=${annual ? "annual" : "monthly"}&total=${total}`
  );
}
