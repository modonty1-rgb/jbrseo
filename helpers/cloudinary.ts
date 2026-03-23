const CLOUDINARY_HOST = "res.cloudinary.com";
const IMAGE_UPLOAD = "/image/upload/";

export type OptimizeCloudinaryImageUrlOptions = {
  /**
   * When true (default), append `fl_immutable_cache` to the first transform group
   * if the URL contains a version segment (`/v123/`). Skipped for signed URLs.
   */
  immutableCache?: boolean;
};

function isSignedCloudinaryPath(pathname: string): boolean {
  return /\/s--[^/]+--/.test(pathname);
}

/**
 * Ensures Cloudinary image delivery URLs use `f_auto`, `q_auto` (automatic format + quality).
 * Optionally adds `fl_immutable_cache` for versioned assets (long CDN cache).
 * Idempotent. Leaves signed URLs and non-upload delivery types unchanged.
 */
export function optimizeCloudinaryImageUrl(
  url: string,
  options?: OptimizeCloudinaryImageUrlOptions,
): string {
  const trimmed = url.trim();
  if (!trimmed || !trimmed.includes(CLOUDINARY_HOST) || !trimmed.includes(IMAGE_UPLOAD)) {
    return url;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return url;
  }

  if (parsed.hostname !== CLOUDINARY_HOST && !parsed.hostname.endsWith(`.${CLOUDINARY_HOST}`)) {
    return url;
  }

  const pathname = parsed.pathname;
  if (!pathname.includes(IMAGE_UPLOAD) || isSignedCloudinaryPath(pathname)) {
    return url;
  }

  const uploadIdx = pathname.indexOf(IMAGE_UPLOAD);
  const tail = pathname.slice(uploadIdx + IMAGE_UPLOAD.length);
  const segments = tail.split("/").filter((s) => s.length > 0);
  if (segments.length === 0) {
    return url;
  }

  let out = [...segments];
  const first = out[0];
  if (!(first.includes("f_auto") && first.includes("q_auto"))) {
    out = ["f_auto,q_auto", ...out];
  }

  const hasVersion = out.some((s) => /^v\d+$/.test(s));
  const wantImmutable =
    options?.immutableCache !== false && hasVersion && !isSignedCloudinaryPath(pathname);

  if (wantImmutable && !out[0].includes("fl_immutable_cache")) {
    out[0] = `${out[0]},fl_immutable_cache`;
  }

  const newPathname = `${pathname.slice(0, uploadIdx + IMAGE_UPLOAD.length)}${out.join("/")}`;
  parsed.pathname = newPathname;
  return parsed.toString();
}

function isLikelyCloudinaryImageUploadString(s: string): boolean {
  return s.includes(CLOUDINARY_HOST) && s.includes(IMAGE_UPLOAD);
}

/** Walks JSON-like values and runs {@link optimizeCloudinaryImageUrl} on Cloudinary image upload URLs. */
export function optimizeCloudinaryStringsInJson(value: unknown): unknown {
  if (value === null) {
    return null;
  }
  if (typeof value === "string") {
    return isLikelyCloudinaryImageUploadString(value) ? optimizeCloudinaryImageUrl(value) : value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => optimizeCloudinaryStringsInJson(item));
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      out[key] = optimizeCloudinaryStringsInJson(record[key]);
    }
    return out;
  }
  return value;
}

/** Same as {@link optimizeCloudinaryImageUrl} — short name for call sites. */
export function cl(path: string): string {
  return optimizeCloudinaryImageUrl(path);
}
