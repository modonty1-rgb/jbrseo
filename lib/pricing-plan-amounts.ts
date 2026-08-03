import type { SupportedCountry } from "@/lib/landing-content.types";

export function formatPlanTotalDisplay(amount: number, _country: SupportedCountry): string {
  if (amount === 0) return "مجاناً";
  return amount.toLocaleString("en-US");
}
