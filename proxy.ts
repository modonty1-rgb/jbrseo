import { NextResponse, type NextRequest } from "next/server";
import { verifyPayload } from "@/lib/admin-auth";
import {
  RESERVED_FIRST_SEGMENTS,
  SUPPORTED_COUNTRY_SLUGS,
} from "@/lib/country-config";
import { landingLimiter } from "@/lib/rate-limit";

function copySearchParams(from: URL, to: URL) {
  from.searchParams.forEach((v, k) => to.searchParams.set(k, v));
}

// Skip rate-limiting for static assets + framework internals to avoid
// wasting Upstash quota on non-user-driven requests (chunks, images, RSC).
// Search-engine crawlers. A 429 to Googlebot is not a defended site — it is a page dropped
// from the index, on a site whose entire purpose is ranking. Crawlers are not the abuse vector
// the landing limiter exists for; checkout and order creation keep their own strict limits,
// and those are never crawled. A spoofed user-agent gains only public marketing pages.
const CRAWLER_UA = /(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|applebot|petalbot|ahrefsbot|semrushbot|gptbot|oai-searchbot|perplexitybot|claudebot)/i;

function shouldSkipRateLimit(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/") ||
    // Admin is cookie-authenticated and request-heavy (dashboards, charts, RSC
    // navigations, inline edits) — the public 30/60s landing limiter throttles
    // legitimate admin work. Exempt it, but keep /admin/login rate-limited so
    // the password stays protected against brute-force.
    (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/logos/") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  );
}

export async function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  // Landing-tier rate limit (Upstash Redis, shared across serverless instances so it actually
  // works). Stricter tiers for /checkout submit + N-Genius order creation live inside their
  // respective API routes — those are the ones that must stay tight.
  const userAgent = request.headers.get("user-agent") ?? "";
  // An RSC payload is the second half of a navigation the visitor already paid for, and a
  // prefetch is a request they never consciously made — charging for either is what made an
  // ordinary browse hit the ceiling.
  //
  // `RSC` and `Next-Router-Prefetch` are the headers Next.js itself keys on: it lists both in
  // the Vary header it sets for App Router responses (next/src/server/base-server.ts). The
  // `_rsc` query parameter is only a cache-buster, so it is checked last, not first.
  const isRscRequest =
    request.headers.get("rsc") === "1" ||
    request.headers.get("next-router-prefetch") === "1" ||
    request.nextUrl.searchParams.has("_rsc");

  if (
    !shouldSkipRateLimit(request.nextUrl.pathname) &&
    !isRscRequest &&
    !CRAWLER_UA.test(userAgent)
  ) {
    const { success, reset } = await landingLimiter.limit(ip);
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      const headers = { "Retry-After": String(retryAfter) };

      // A visitor must never meet a raw JSON error. Serve a readable page to browsers and
      // keep the JSON body for fetch/API callers, which read the field.
      if (request.headers.get("accept")?.includes("text/html")) {
        return new NextResponse(
          `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>لحظة من فضلك</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1220;color:#e8eefc;font-family:system-ui,"Segoe UI",Tahoma,sans-serif;text-align:center;padding:24px}
h1{font-size:20px;margin:0 0 8px}p{margin:0;color:#a9b6d1;line-height:1.9;font-size:14px}</style></head>
<body><main><h1>لحظة من فضلك</h1>
<p>وصلتنا طلبات كثيرة من اتّصالك خلال وقت قصير.<br>انتظر ${retryAfter} ثانية ثم حدّث الصفحة.</p></main>
<script>setTimeout(function(){location.reload()},${retryAfter * 1000});</script></body></html>`,
          { status: 429, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } },
        );
      }

      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers },
      );
    }
  }

  if (
    request.nextUrl.pathname.includes("/checkout") &&
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
    // User explicitly visited /sa or /eg — serve as-is (no geo-redirect).
    // Geo-redirect applies only to / (root) above to preserve indexability.
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos|icons|images|fonts|trust).*)"],
};
