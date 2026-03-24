"use client";

import type { ReactElement } from "react";
import Link from "@/app/components/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ADMIN_NAV, COUNTRIES } from "../_config";
import { AdminCountryToggle } from "./AdminCountryToggle";
import { AdminSubscribersLink } from "./AdminSubscribersLink";

function withCountry(href: string, country: string): string {
  return href + (href.includes("?") ? "&" : "?") + "country=" + country;
}

function resolvePageTitle(pathname: string): string {
  const sorted = [...ADMIN_NAV].sort((a, b) => b.href.length - a.href.length);
  for (const n of sorted) {
    if (pathname === n.href || pathname.startsWith(`${n.href}/`)) {
      return n.label;
    }
  }
  if (pathname.startsWith("/admin/preview")) return "معاينة الموقع";
  if (pathname.startsWith("/admin/settings/images")) return "صور الموقع";
  return "لوحة التحكم";
}

export function AdminTopNavbar(): ReactElement {
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw && pathnameRaw.length > 0 ? pathnameRaw : "/admin";
  const searchParams = useSearchParams();
  const country =
    searchParams.get("country") === "EG"
      ? COUNTRIES[1].value
      : COUNTRIES[0].value;

  const pageTitle = resolvePageTitle(pathname);
  const isDashboard = pathname === "/admin";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-6 py-3 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          href={withCountry("/admin", country)}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="لوحة التحكم"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            J
          </div>
          <span className="hidden text-sm font-semibold text-foreground sm:inline">
            JBRSEO
          </span>
        </Link>

        <span
          className="hidden h-6 w-px shrink-0 bg-border sm:block"
          aria-hidden
        />

        <div className="min-w-0 flex-1">
          {!isDashboard ? (
            <nav
              className="mb-0.5 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground"
              aria-label="مسار الصفحة"
            >
              <Link
                href={withCountry("/admin", country)}
                className="shrink-0 hover:text-foreground"
              >
                لوحة التحكم
              </Link>
              <span className="text-muted-foreground/60" aria-hidden>
                ›
              </span>
            </nav>
          ) : null}
          <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
        <span
          className="hidden items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-flex"
          title="اختصار الإشعارات"
        >
          <kbd className="rounded border border-border bg-background px-1 font-mono text-[9px]">
            Alt
          </kbd>
          <span className="text-muted-foreground/80">+</span>
          <kbd className="rounded border border-border bg-background px-1 font-mono text-[9px]">
            T
          </kbd>
        </span>

        <span className="hidden h-6 w-px bg-border sm:block" aria-hidden />

        <AdminSubscribersLink />

        <AdminCountryToggle />
      </div>
    </header>
  );
}
