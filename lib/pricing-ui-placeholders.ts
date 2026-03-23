/** Replace `{n}`, `{c}`, `{total}` in pricing UI strings (static or CMS). */
export function applyPricingUiPlaceholders(
  template: string,
  values: { n: string; c: string; total?: string },
): string {
  let result = template.replaceAll("{n}", values.n).replaceAll("{c}", values.c);
  if (values.total !== undefined) {
    result = result.replaceAll("{total}", values.total);
  }
  return result;
}
