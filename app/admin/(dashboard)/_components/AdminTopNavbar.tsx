"use client";

import type { ReactElement } from "react";
import Link from "@/app/components/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "../_config";
import { AdminSubscribersLink } from "./AdminSubscribersLink";
import { RefreshButton } from "./RefreshButton";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { cn } from "@/lib/utils";

function resolvePageTitle(pathname: string): string {
  const sorted = [...ADMIN_NAV].sort((a, b) => b.href.length - a.href.length);
  for (const n of sorted) {
    if (pathname === n.href || pathname.startsWith(`${n.href}/`)) {
      return n.label;
    }
  }
  if (pathname.startsWith("/admin/settings/images")) return "صور الموقع";
  return "لوحة التحكم";
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export function AdminTopNavbar(): ReactElement {
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw && pathnameRaw.length > 0 ? pathnameRaw : "/admin";

  const pageTitle = resolvePageTitle(pathname);
  const isHome = pathname === "/admin";
  const isAnalytics = pathname === "/admin/analytics";
  const isReview = pathname === "/admin/review";
  const isPricing = pathname.startsWith("/admin/pricing");
  const isFailures = pathname.startsWith("/admin/payment-failures");

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-6 py-3 backdrop-blur">
      {/* ── Left: Logo + Breadcrumb ── */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          href={"/admin"}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="الرئيسية"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            J
          </div>
          <span className="hidden text-sm font-semibold text-foreground sm:inline">
            JBRSEO
          </span>
        </Link>

        <span className="hidden h-6 w-px shrink-0 bg-border sm:block" aria-hidden />

        <div className="min-w-0 flex-1">
          {!isHome ? (
            <nav
              className="mb-0.5 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground"
              aria-label="مسار الصفحة"
            >
              <Link
                href={"/admin"}
                className="shrink-0 hover:text-foreground"
              >
                الرئيسية
              </Link>
              <span className="text-muted-foreground/60" aria-hidden>›</span>
            </nav>
          ) : null}
          <h1 className="truncate text-sm font-semibold leading-tight text-foreground">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* ── Right: Three menus + tools ── */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-2">

        {/* 📊 التحليلات — analytics dashboard (moved off the home route) */}
        <Link
          href="/admin/analytics"
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            isAnalytics
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <span>📊</span>
          <span className="hidden sm:inline">التحليلات</span>
        </Link>

        {/* 📋 إدارة المحتوى — تحرير كل نصوص الموقع من مكان واحد */}
        <Link
          href="/admin/review"
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            isReview
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <span>📋</span>
          <span className="hidden sm:inline">إدارة المحتوى</span>
        </Link>

        <span className="hidden h-6 w-px bg-border sm:block" aria-hidden />

        {/* 💰 الأسعار — صفحة واحدة (السعودية + مصر معاً) */}
        <Link
          href="/admin/pricing"
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            isPricing
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <span>💰</span>
          <span className="hidden sm:inline">الأسعار</span>
        </Link>

        {/* ⚠️ رفوضات الدفع — سبب كل رفض (داخلي) */}
        <Link
          href="/admin/payment-failures"
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            isFailures
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <span>⚠️</span>
          <span className="hidden sm:inline">الرفوضات</span>
        </Link>

        <span className="hidden h-6 w-px bg-border sm:block" aria-hidden />

        <AdminSubscribersLink />
        <RefreshButton />
        <AdminThemeToggle />
      </div>
    </header>
  );
}
