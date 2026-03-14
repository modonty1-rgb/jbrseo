/**
 * Removes dev/test artifacts from user-facing strings (e.g. from DB overrides).
 * Matches whole words: test, TODO, placeholder, lorem, dummy (case-insensitive).
 */
const DEV_ARTIFACTS = /\s*(test|TODO|placeholder|lorem|dummy)\s*/gi;

export function sanitizeUserFacingString(value: string): string {
  if (typeof value !== "string") return value;
  return value.replace(DEV_ARTIFACTS, " ").replace(/\s+/g, " ").trim();
}
