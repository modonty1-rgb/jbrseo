"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminCookieValue, getAdminCookieFromHeader } from "@/lib/admin-auth";
import { timingSafeEqual } from "crypto";

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { error: "Admin not configured" };
  }
  if (typeof password !== "string" || !constantTimeCompare(password, expected)) {
    return { error: "Invalid password" };
  }
  const value = createAdminCookieValue();
  const cookieStore = await cookies();
  cookieStore.set("admin_session", value, {
    httpOnly: true,
    path: "/admin",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/admin");
}

export async function isAdmin(): Promise<boolean> {
  const { headers } = await import("next/headers");
  const h = await headers();
  const cookie = getAdminCookieFromHeader(h.get("cookie") ?? null);
  return !!cookie;
}
