"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { COUNTRIES } from "../_config";
import { cn } from "@/lib/utils";

export function AdminCountryToggle() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("country") === "EG" ? "EG" : "SA";

  const isContentPage = pathname?.startsWith("/admin/content");
  const basePath = isContentPage ? pathname : "/admin/content/hero";
  const params = new URLSearchParams(isContentPage ? searchParams?.toString() ?? "" : "");

  return (
    <div className="flex items-center gap-1 rounded-md bg-muted px-1 py-0.5 text-[11px] font-medium text-foreground">
      {COUNTRIES.map(({ value, label }) => {
        params.set("country", value);
        const href = pathname?.startsWith("/admin/content") ? `${pathname}?${params}` : `${basePath}?${params}`;
        const isActive = current === value;
        return (
          <Link
            key={value}
            href={href}
            className={cn(
              "px-2 py-1 rounded-md transition-colors",
              isActive ? "bg-primary/90 text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
