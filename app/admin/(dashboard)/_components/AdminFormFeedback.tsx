"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "@/app/components/ui/sonner";

export function AdminFormFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handledQuery = useRef<string | null>(null);

  useEffect(() => {
    const saved = searchParams.get("saved");
    const error = searchParams.get("error");
    const full = `${pathname}?${searchParams.toString()}`;

    const reason = searchParams.get("reason");

    if (saved !== "1" && error !== "1") {
      handledQuery.current = null;
      return;
    }

    if (handledQuery.current === full) return;
    handledQuery.current = full;

    if (saved === "1") {
      toast.success("تم الحفظ بنجاح");
      const u = new URL(pathname, window.location.origin);
      searchParams.forEach((v, k) => {
        if (k !== "saved") u.searchParams.set(k, v);
      });
      router.replace(u.pathname + (u.searchParams.toString() ? "?" + u.searchParams.toString() : ""));
    } else if (error === "1") {
      if (reason === "seo_description_max") {
        toast.error("الوصف طويل جداً — الحد الأقصى 160 حرفاً (مقطع غوغل).");
      } else {
        toast.error("حدث خطأ، يرجى المحاولة لاحقاً");
      }
      const u = new URL(pathname, window.location.origin);
      searchParams.forEach((v, k) => {
        if (k !== "error" && k !== "reason") u.searchParams.set(k, v);
      });
      router.replace(u.pathname + (u.searchParams.toString() ? "?" + u.searchParams.toString() : ""));
    }
  }, [pathname, searchParams, router]);

  return null;
}
