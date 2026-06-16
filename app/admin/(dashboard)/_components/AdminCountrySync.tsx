"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const ADMIN_COUNTRY_COOKIE = "admin_country";
const COOKIE_MAX_AGE_DAYS = 365;

function getCountryFromCookie(): "SA" | "EG" {
  if (typeof document === "undefined") return "SA";
  const match = document.cookie.match(new RegExp(`(?:^|; )${ADMIN_COUNTRY_COOKIE}=([^;]*)`));
  const v = match?.[1]?.toUpperCase();
  return v === "EG" ? "EG" : "SA";
}

function setCountryCookie(country: "SA" | "EG") {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_COUNTRY_COOKIE}=${country}; path=/admin; max-age=${COOKIE_MAX_AGE_DAYS * 86400}; SameSite=Lax`;
}

export function AdminCountrySync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const didSync = useRef(false);

  useEffect(() => {
    if (!pathname?.startsWith("/admin")) return;
    const country = searchParams.get("country");
    if (country === "SA" || country === "EG") {
      setCountryCookie(country);
      didSync.current = false;
      return;
    }
    if (didSync.current) return;
    didSync.current = true;
    const fallback = getCountryFromCookie();
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("country", fallback);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, searchParams, router]);

  return null;
}
