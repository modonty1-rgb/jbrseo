import { NextResponse, type NextRequest } from "next/server";
import { verifyPayload } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
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
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
