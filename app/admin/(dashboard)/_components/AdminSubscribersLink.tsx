"use client";

import Link from "@/app/components/link";
import { useSearchParams } from "next/navigation";

export function AdminSubscribersLink() {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") === "EG" ? "EG" : "SA";
  // Subscribers now live at the admin home (/admin).
  const href = `/admin?country=${country}`;
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
    >
      المشتركون
    </Link>
  );
}
