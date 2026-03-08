"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ADMIN_NAV, COUNTRIES, SIDEBAR_GROUPS } from "../_config";
import { cn } from "@/lib/utils";

const LABEL_BY_HREF = Object.fromEntries(ADMIN_NAV.map((n) => [n.href, n.label]));

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const country = searchParams.get("country") === "EG" ? "EG" : "SA";

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-e border-border bg-muted/30 p-4">
      <div className="mb-4">
        <Link href="/admin" className="text-base font-semibold text-foreground hover:underline">
          JBRSEO Admin
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        <Link
          href="/admin"
          className={cn(
            "rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/admin" ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          لوحة التحكم
        </Link>
        {SIDEBAR_GROUPS.map((group) => (
          <div key={group.label} className="pt-2">
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.hrefs.map((href) => {
                const label = LABEL_BY_HREF[href] ?? href;
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href + `?country=${country}`}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm transition-colors",
                      isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">البلد</p>
        <div className="flex flex-col gap-1">
          {COUNTRIES.map((c) => (
            <Link
              key={c.value}
              href={pathname + (pathname.includes("?") ? "&" : "?") + `country=${c.value}`}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                country === c.value ? "bg-primary/10 font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60"
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
