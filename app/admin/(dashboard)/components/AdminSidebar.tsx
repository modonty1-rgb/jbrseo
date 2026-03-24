"use client";

import { useEffect, useState } from "react";
import Link from "@/app/components/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  Eye,
  FileText,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  Link2,
  Megaphone,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_NAV, COUNTRIES, SIDEBAR_GROUPS } from "../_config";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

const LABEL_BY_HREF = Object.fromEntries(ADMIN_NAV.map((n) => [n.href, n.label]));

const HREF_ICON: Partial<Record<string, LucideIcon>> = {
  "/admin": LayoutDashboard,
  "/admin/settings/seo": Search,
  "/admin/settings": Settings,
  "/admin/subscribers": Users,
  "/admin/content/hero": Sparkles,
  "/admin/content/trustbar": Link2,
  "/admin/content/whyNow": Megaphone,
  "/admin/content/howItWorks": LayoutGrid,
  "/admin/content/outcomes": Tag,
  "/admin/content/socialProof": Star,
  "/admin/content/faq": CircleHelp,
  "/admin/content/finalCta": Megaphone,
  "/admin/content/header-footer": Link2,
  "/admin/content/pricing": Tag,
  "/admin/content/privacy": Shield,
  "/admin/content/terms": FileText,
  "/admin/content/about": BookOpen,
  "/admin/content/team": Users,
  "/admin/content/emojis": ImageIcon,
};

function NavIcon({ href, className }: { href: string; className?: string }) {
  const Icon = HREF_ICON[href] ?? FileText;
  return <Icon className={cn("size-4 shrink-0 opacity-80", className)} aria-hidden />;
}

function withCountry(href: string, country: string): string {
  return href + (href.includes("?") ? "&" : "?") + "country=" + country;
}

/** Matches exact path or nested routes; `/admin` never matches `/admin/content/...`. */
function pathMatchesHref(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/admin") return false;
  return pathname.startsWith(`${href}/`);
}

function groupHasActiveLink(pathname: string, hrefs: readonly string[]): boolean {
  return hrefs.some((h) => pathMatchesHref(pathname, h));
}

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const country =
    searchParams.get("country") === "EG"
      ? COUNTRIES[1].value
      : COUNTRIES[0].value;

  const [openByLabel, setOpenByLabel] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    for (const g of SIDEBAR_GROUPS) {
      o[g.label] = true;
    }
    return o;
  });

  useEffect(() => {
    setOpenByLabel((prev) => {
      const next = { ...prev };
      for (const g of SIDEBAR_GROUPS) {
        if (groupHasActiveLink(pathname, g.hrefs)) {
          next[g.label] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  const toggleGroup = (label: string) => {
    setOpenByLabel((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isOpen = (label: string): boolean => openByLabel[label] ?? true;

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden p-4">
      <div className="mb-4 flex shrink-0 items-center gap-2.5 px-1">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
          J
        </div>
        <Link
          href={withCountry("/admin", country)}
          className="truncate text-base font-semibold text-foreground hover:underline"
        >
          JBRSEO Admin
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto overscroll-contain pe-1">
        <Link
          href={withCountry("/admin", country)}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/admin"
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <NavIcon href="/admin" />
          لوحة التحكم
        </Link>

        <div className="my-3 border-t border-border/60 pt-3">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-primary">
            معاينة الموقع
          </p>
          <div className="flex flex-col gap-0.5">
            <Link
              href={withCountry("/admin/preview", country)}
              className={cn(
                "flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/15 transition-colors hover:bg-primary/10",
                pathMatchesHref(pathname, "/admin/preview") &&
                  "ring-2 ring-primary/40",
              )}
            >
              <Eye className="size-4 shrink-0" aria-hidden />
              أداة المعاينة (داخل اللوحة)
            </Link>
            <Link
              href="/sa?country=sa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <Globe className="size-4 shrink-0 opacity-70" aria-hidden />
              عرض — السعودية
            </Link>
            <Link
              href="/eg?country=eg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <Globe className="size-4 shrink-0 opacity-70" aria-hidden />
              عرض — مصر
            </Link>
          </div>
        </div>

        {SIDEBAR_GROUPS.map((group) => {
          const activeInGroup = groupHasActiveLink(pathname, group.hrefs);
          const isGroupOpen = isOpen(group.label);

          return (
            <div key={group.label} className="border-t border-border/60 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "mb-1 h-auto w-full justify-between gap-2 rounded-md px-3 py-1.5 text-start text-xs font-semibold uppercase tracking-wider transition-colors",
                  activeInGroup
                    ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                    : "text-primary hover:bg-primary/10 hover:text-primary",
                )}
                aria-expanded={isGroupOpen}
              >
                <span className="min-w-0 flex-1 truncate">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 opacity-80 transition-transform duration-200",
                    isGroupOpen ? "rotate-0" : "-rotate-90",
                  )}
                  aria-hidden
                />
              </Button>
              {isGroupOpen && (
                <div className="flex flex-col gap-0.5">
                  {group.hrefs.map((href) => {
                    const label = LABEL_BY_HREF[href] ?? href;
                    const hrefWithCountry = withCountry(href, country);
                    const isActive = pathMatchesHref(pathname, href);
                    return (
                      <Link
                        key={href}
                        href={hrefWithCountry}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-muted font-medium text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        <NavIcon href={href} />
                        <span className="min-w-0 flex-1">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
