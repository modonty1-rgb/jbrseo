/** Landing + signup: annual unless explicitly ?billing=monthly */
export function isAnnualFromBillingParam(billing: string | null | undefined): boolean {
  const p = (billing ?? "").toLowerCase().trim();
  return p !== "monthly";
}
