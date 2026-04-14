"use client";

import { useSearchParams, usePathname } from "next/navigation";

/** مسارات عالمية — تطابق تام فقط */
const GLOBAL_EXACT = new Set([
  "/admin",
  "/admin/settings",
  "/admin/content/socialProof",
  "/admin/content/trustbar",
  "/admin/content/about",
  "/admin/content/team",
  "/admin/content/privacy",
  "/admin/content/terms",
  "/admin/content/emojis",
  "/admin/subscribers",
]);

/** مسارات عالمية — prefix (كل ما يبدأ بها) */
const GLOBAL_PREFIXES = ["/admin/marketing"];

function isGlobalPath(pathname: string): boolean {
  if (GLOBAL_EXACT.has(pathname)) return true;
  return GLOBAL_PREFIXES.some((p) => pathname.startsWith(p + "/") || pathname === p);
}

export function AdminCountryBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const country = searchParams.get("country");

  if (isGlobalPath(pathname)) return null;
  if (country !== "SA" && country !== "EG") return null;

  const isSA = country === "SA";

  return (
    <div
      className={`flex items-center gap-3 border-b px-6 py-3 ${
        isSA
          ? "border-green-500/30 bg-green-500/10"
          : "border-red-500/30 bg-red-500/10"
      }`}
    >
      <span className="text-2xl">{isSA ? "🇸🇦" : "🇪🇬"}</span>
      <p className={`text-sm font-bold ${isSA ? "text-green-400" : "text-red-400"}`}>
        أنت الآن تعدّل إعدادات {isSA ? "السعودية" : "مصر"} — أي تغيير يؤثر على الموقع السعودي{isSA ? "" : " المصري"} فقط
      </p>
    </div>
  );
}
