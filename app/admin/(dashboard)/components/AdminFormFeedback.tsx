"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminFormFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<"saved" | "error" | null>(null);

  useEffect(() => {
    const saved = searchParams.get("saved");
    const error = searchParams.get("error");
    if (saved === "1") {
      setMessage("saved");
      const u = new URL(pathname, window.location.origin);
      searchParams.forEach((v, k) => { if (k !== "saved") u.searchParams.set(k, v); });
      router.replace(u.pathname + (u.searchParams.toString() ? "?" + u.searchParams.toString() : ""));
    } else if (error === "1") {
      setMessage("error");
      const u = new URL(pathname, window.location.origin);
      searchParams.forEach((v, k) => { if (k !== "error") u.searchParams.set(k, v); });
      router.replace(u.pathname + (u.searchParams.toString() ? "?" + u.searchParams.toString() : ""));
    }
  }, [pathname, searchParams, router]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <div
      role="alert"
      className={
        message === "saved"
          ? "mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200"
          : "mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200"
      }
    >
      {message === "saved" ? "تم الحفظ بنجاح" : "حدث خطأ، يرجى المحاولة لاحقاً"}
    </div>
  );
}
