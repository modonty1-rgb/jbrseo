/**
 * Ensures Cloudinary URLs use f_auto,q_auto for format and quality optimization (~30–60% payload savings).
 * Idempotent: safe to call on URLs that already include these params.
 */
export function cl(path: string): string {
  if (!path || !path.includes("res.cloudinary.com")) return path;
  if (/\/upload\/[^/]*f_auto[^/]*/.test(path)) return path;
  return path.replace("/upload/", "/upload/f_auto,q_auto/");
}
