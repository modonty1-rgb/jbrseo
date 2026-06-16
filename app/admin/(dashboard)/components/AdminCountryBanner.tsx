"use client";

import { useSearchParams, usePathname } from "next/navigation";

/** البلد بقى يخصّ بس صفحات الأسعار + المشتركون.
 *  أي مسار تاني يعتبر عالمي ولا يحتاج بانر بلد. */
const COUNTRY_AWARE_PREFIXES = ["/admin/pricing", "/admin/content/pricing", "/admin/subscribers"];

function isCountryAwarePath(pathname: string): boolean {
  return COUNTRY_AWARE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function AdminCountryBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const country = searchParams.get("country");

  if (!isCountryAwarePath(pathname)) return null;
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
        أنت الآن تعدّل أسعار {isSA ? "السعودية" : "مصر"} — أي تغيير يؤثر على الموقع {isSA ? "السعودي" : "المصري"} فقط
      </p>
    </div>
  );
}
