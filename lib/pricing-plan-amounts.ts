import type { SupportedCountry } from "@/lib/landing-content.types";

const EASTERN_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/**
 * A price as the customer reads it — Eastern Arabic numerals, grouped in thousands.
 *
 * Display only. Every caller is a checkout page rendering the amount for a human; the
 * figure sent to the payment gateway is the raw number and never passes through here, so
 * changing the digits cannot change what is charged.
 *
 * The plan cards moved to Eastern numerals with the rest of the landing, and this stayed
 * Western — so a buyer met ١٧,٩٩٤ on the card, clicked, and found 17,994 on the page
 * asking for their card. The same price in two scripts on two consecutive screens reads
 * as a different site.
 *
 * Grouped first, transliterated second: `toLocaleString` puts the separators in the right
 * places and swapping the digits does not move them. Always render inside `dir="ltr"` — a
 * number never mirrors, in either script.
 */
export function formatPlanTotalDisplay(amount: number, _country: SupportedCountry): string {
  if (amount === 0) return "مجاناً";
  return amount.toLocaleString("en-US").replace(/[0-9]/g, (d) => EASTERN_DIGITS[Number(d)]);
}
