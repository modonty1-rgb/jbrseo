import { displayMainTotalFromMoYr } from "@/lib/pricing-plan-amounts";

function appendQuery(base: string, query: string): string {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${query}`;
}

export function buildCheckoutHrefWithPlan(
  checkoutHrefBase: string,
  planIndex: number,
  annual: boolean,
  mo: number,
  yr: number
): string {
  const total = displayMainTotalFromMoYr(mo, yr, annual);
  return appendQuery(
    checkoutHrefBase,
    `plan=${planIndex}&billing=${annual ? "annual" : "monthly"}&total=${total}`
  );
}

export function buildCheckoutHrefWithPlanId(
  checkoutHrefBase: string,
  planId: string,
  annual: boolean,
  mo: number,
  yr: number
): string {
  const total = displayMainTotalFromMoYr(mo, yr, annual);
  return appendQuery(
    checkoutHrefBase,
    `plan=${encodeURIComponent(planId)}&billing=${annual ? "annual" : "monthly"}&total=${total}`
  );
}
