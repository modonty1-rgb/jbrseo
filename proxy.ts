import { NextResponse, type NextRequest } from "next/server";
import { verifyPayload } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const countryParam = request.nextUrl.searchParams.get("country")?.toUpperCase()?.slice(0, 2);
  if (countryParam === "SA" || countryParam === "EG") {
    requestHeaders.set("x-country-code", countryParam);
  }

  const pathname = request.nextUrl.pathname;
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
