"use client";

import Link from "@/app/components/link";
import { useSearchParams } from "next/navigation";

export function AdminSubscribersLink() {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") === "EG" ? "EG" : "SA";
  const href = `/admin/subscribers?country=${country}`;
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-muted/70"
    >
      المشتركون
    </Link>
  );
}
