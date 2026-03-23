import type { SupportedCountry } from "@/lib/landing-content.types";

/** Matches landing `PlanCard` / `TierCard`: monthly = `mo`; annual = yearly total `yr * 12`. */
export function displayMainTotalFromMoYr(mo: number, yr: number, isAnnual: boolean): number {
  if (mo === 0) return 0;
  if (isAnnual) return yr > 0 ? yr * 12 : 0;
  return mo;
}

export function formatPlanTotalDisplay(amount: number, country: SupportedCountry): string {
  if (amount === 0) return "مجاناً";
  const n = amount.toLocaleString("ar-SA");
  return country === "SA" ? `${n} ر.س` : `${n} ج.م`;
}
