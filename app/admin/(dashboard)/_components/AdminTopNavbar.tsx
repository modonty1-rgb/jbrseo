"use client";

import { type ReactElement, useRef, useState, useEffect } from "react";
import Link from "@/app/components/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ADMIN_NAV, COUNTRIES, PAGES_NAV_ITEMS, PRICING_NAV_ITEMS, SECTIONS_NAV_ITEMS, SETTINGS_NAV_ITEMS } from "../_config";
import { AdminSubscribersLink } from "./AdminSubscribersLink";
import { RefreshButton } from "./RefreshButton";
import { AdminThemeToggle } from "./AdminThemeToggle";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  if (pathname.startsWith("/admin/settings/images")) return "صور الموقع";
  return "لوحة التحكم";
}

// ─── Generic dropdown used by all three menus ───────────────────────────────

type NavItem = { href: string; label: string; icon: string; disabled?: boolean };

type TopNavDropdownProps = {
  label: string;
  flag: string;
  items: NavItem[];
  pathname: string;
  /** Append ?country=XX to every link when set */
  country?: string;
  /** Highlight button when active */
  activeHrefs?: string[];
  /** If set, button is only active when currentCountry matches this value */
  countryKey?: string;
  /** Current ?country= value from URL */
  currentCountry?: string;
};

function TopNavDropdown({
  label,
  flag,
  items,
  pathname,
  country,
  activeHrefs,
  countryKey,
  currentCountry,
}: TopNavDropdownProps): ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const hrefs = (activeHrefs ?? items.map((i) => i.href)).filter(Boolean);
  const pathMatches = hrefs.some((h) => pathname === h || pathname.startsWith(`${h}/`));
  const isActive = pathMatches && (countryKey === undefined || currentCountry === countryKey);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
          isActive
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:bg-muted/70 hover:text-foreground",
        )}
        aria-expanded={open}
      >
        <span>{flag}</span>
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-1 min-w-[190px] rounded-lg border border-border bg-card shadow-lg">
          <p className="border-b border-border/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {flag} {label}
          </p>
          {items.map((item) => {
            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="flex cursor-not-allowed items-center gap-2 px-3 py-2 text-sm text-muted-foreground/40"
                  title="قريباً"
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </div>
              );
            }
            const href = country ? withCountry(item.href, country) : item.href;
            const isItemActive = (pathname === item.href || pathname.startsWith(`${item.href}/`))
              && (countryKey === undefined || currentCountry === countryKey);
            return (
              <Link
                key={item.href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                  isItemActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export function AdminTopNavbar(): ReactElement {
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw && pathnameRaw.length > 0 ? pathnameRaw : "/admin";
  const searchParams = useSearchParams();
  const country =
    searchParams.get("country") === "EG"
      ? COUNTRIES[1].value
      : COUNTRIES[0].value;

  const pageTitle = resolvePageTitle(pathname);
  const isHome = pathname === "/admin";
  const isAnalytics = pathname === "/admin/analytics";
  const isReview = pathname === "/admin/review";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/95 px-6 py-3 backdrop-blur">
      {/* ── Left: Logo + Breadcrumb ── */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          href={withCountry("/admin", country)}
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
                href={withCountry("/admin", country)}
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
          href={withCountry("/admin/analytics", country)}
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

        {/* 📋 مرجع المحتوى — كل نصوص اللاندنق في صفحة واحدة مرقّمة */}
        <Link
          href={withCountry("/admin/review", country)}
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            isReview
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:bg-muted/70 hover:text-foreground",
          )}
        >
          <span>📋</span>
          <span className="hidden sm:inline">المرجع</span>
        </Link>

        <span className="hidden h-6 w-px bg-border sm:block" aria-hidden />

        {/* ✨ الصفحة الرئيسية للزائر — أقسام /sa و /eg */}
        <TopNavDropdown
          label="الصفحة الرئيسية"
          flag="✨"
          items={SECTIONS_NAV_ITEMS}
          pathname={pathname}
        />

        {/* 📄 صفحات — about, privacy, terms */}
        <TopNavDropdown
          label="الصفحات الثابتة"
          flag="📄"
          items={PAGES_NAV_ITEMS}
          pathname={pathname}
        />

        {/* ⚙️ إعدادات — تطبق على كل الموقع */}
        <TopNavDropdown
          label="الإعدادات"
          flag="⚙️"
          items={SETTINGS_NAV_ITEMS}
          pathname={pathname}
        />

        {/* 💰 الأسعار — السعودية + مصر في دروبداون واحدة */}
        <TopNavDropdown
          label="الأسعار"
          flag="💰"
          items={PRICING_NAV_ITEMS}
          pathname={pathname}
          activeHrefs={["/admin/pricing", "/admin/content/pricing"]}
        />

        <span className="hidden h-6 w-px bg-border sm:block" aria-hidden />

        <AdminSubscribersLink />
        <RefreshButton />
        <AdminThemeToggle />
      </div>
    </header>
  );
}
