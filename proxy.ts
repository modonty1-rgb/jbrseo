import { NextResponse, type NextRequest } from "next/server";
import { verifyPayload } from "@/lib/admin-auth";
import {
  RESERVED_FIRST_SEGMENTS,
  SUPPORTED_COUNTRY_SLUGS,
} from "@/lib/country-config";

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

function copySearchParams(from: URL, to: URL) {
  from.searchParams.forEach((v, k) => to.searchParams.set(k, v));
}

export function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  if (
    request.nextUrl.pathname.includes("/signup") &&
    !["GET", "POST", "HEAD"].includes(request.method)
  ) {
    return new NextResponse(null, {
      status: 405,
      headers: { Allow: "GET, POST, HEAD" },
    });
  }

  const requestHeaders = new Headers(request.headers);
  const countryParam = request.nextUrl.searchParams.get("country")?.toUpperCase()?.slice(0, 2);
  if (countryParam === "SA" || countryParam === "EG") {
    requestHeaders.set("x-country-code", countryParam);
  }
  const previewCountry = request.nextUrl.searchParams.get("country")?.toLowerCase();
  if (previewCountry === "sa" || previewCountry === "eg") {
    requestHeaders.set("x-preview-country", previewCountry);
  }

  const pathname = request.nextUrl.pathname;

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  const geoCode = request.headers.get("x-vercel-ip-country")?.toUpperCase()?.slice(0, 2) ?? "";
  const geoSlug = geoCode === "EG" ? "eg" : "sa";
  const previewSlug = request.nextUrl.searchParams.get("country")?.toLowerCase();
  const effectiveGeoSlug =
    previewSlug && SUPPORTED_COUNTRY_SLUGS.includes(previewSlug as "sa" | "eg")
      ? previewSlug
      : geoSlug;

  if (pathname === "/") {
    const dest = new URL(`/${effectiveGeoSlug}`, request.url);
    copySearchParams(request.nextUrl, dest);
    return NextResponse.redirect(dest);
  }

  const firstSegment = pathname.split("/")[1]?.toLowerCase() ?? "";
  const rest = pathname.slice(1 + firstSegment.length);

  if (RESERVED_FIRST_SEGMENTS.includes(firstSegment as (typeof RESERVED_FIRST_SEGMENTS)[number])) {
    // continue to admin check and next()
  } else if (SUPPORTED_COUNTRY_SLUGS.includes(firstSegment as "sa" | "eg")) {
    if (firstSegment !== effectiveGeoSlug) {
      const dest = new URL(`/${effectiveGeoSlug}${rest}`, request.url);
      copySearchParams(request.nextUrl, dest);
      return NextResponse.redirect(dest);
    }
  } else {
    const dest = new URL(`/${effectiveGeoSlug}${rest}`, request.url);
    copySearchParams(request.nextUrl, dest);
    return NextResponse.redirect(dest);
  }

  const isAdmin = pathname.startsWith("/admin");
  const isAdminLogin = pathname.startsWith("/admin/login");
  if (isAdmin && !isAdminLogin) {
    const raw = request.cookies.get("admin_session")?.value ?? null;
    let verified = false;
    if (raw) {
      try {
        const decoded = Buffer.from(raw, "base64url").toString("utf8");
        verified = verifyPayload(decoded);
      } catch {
        verified = false;
      }
    }
    if (!verified) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos|icons|images|fonts).*)"],
};
