"use client";

import { useState } from "react";
import Link from "@/app/components/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ADMIN_NAV, COUNTRIES, SIDEBAR_GROUPS } from "../_config";
import { cn } from "@/lib/utils";

const LABEL_BY_HREF = Object.fromEntries(ADMIN_NAV.map((n) => [n.href, n.label]));
const SETTINGS_GROUP_LABEL = "إعدادات الموقع";
const CONTENT_GROUP_LABEL = "المحتوى الرئيسي";
const PRICING_GROUP_LABEL = "التسعير";
const IMPORTANT_PAGES_GROUP_LABEL = "صفحات جانبية مهمه";
const COLLAPSIBLE_GROUPS = [
  SETTINGS_GROUP_LABEL,
  CONTENT_GROUP_LABEL,
  PRICING_GROUP_LABEL,
  IMPORTANT_PAGES_GROUP_LABEL,
];

function withCountry(href: string, country: string): string {
  return href + (href.includes("?") ? "&" : "?") + "country=" + country;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const country = searchParams.get("country") === "EG" ? "EG" : "SA";
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);
  const [pricingOpen, setPricingOpen] = useState(true);
  const [importantPagesOpen, setImportantPagesOpen] = useState(true);

  return (
    <aside className="flex h-full w-full flex-col p-4">
      <div className="mb-4">
        <Link href={withCountry("/admin", country)} className="text-base font-semibold text-foreground hover:underline">
          JBRSEO Admin
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        <Link
          href={withCountry("/admin", country)}
          className={cn(
            "rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/admin" ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          لوحة التحكم
        </Link>
        <div className="pt-2">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-primary">
            معاينة الموقع
          </p>
          <div className="flex flex-col gap-0.5">
            <Link
              href={withCountry("/admin/preview", country)}
              className="rounded-md px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:text-primary"
            >
              أداة المعاينة (داخل اللوحة)
            </Link>
            <Link
              href="/sa?country=sa"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              عرض — السعودية
            </Link>
            <Link
              href="/eg?country=eg"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              عرض — مصر
            </Link>
          </div>
        </div>
        {SIDEBAR_GROUPS.map((group) => {
          const isCollapsible = COLLAPSIBLE_GROUPS.includes(group.label);
          let isOpen = true;
          let toggleOpen: (() => void) | null = null;

          if (group.label === SETTINGS_GROUP_LABEL) {
            isOpen = settingsOpen;
            toggleOpen = () => setSettingsOpen((o) => !o);
          } else if (group.label === CONTENT_GROUP_LABEL) {
            isOpen = contentOpen;
            toggleOpen = () => setContentOpen((o) => !o);
          } else if (group.label === PRICING_GROUP_LABEL) {
            isOpen = pricingOpen;
            toggleOpen = () => setPricingOpen((o) => !o);
          } else if (group.label === IMPORTANT_PAGES_GROUP_LABEL) {
            isOpen = importantPagesOpen;
            toggleOpen = () => setImportantPagesOpen((o) => !o);
          }

          return (
            <div key={group.label} className="pt-2">
              {isCollapsible && toggleOpen ? (
                <>
                  <button
                    type="button"
                    onClick={toggleOpen}
                    className="mb-1 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 hover:text-primary"
                    aria-expanded={isOpen}
                  >
                    {group.label}
                    <span className="text-[10px]" aria-hidden>
                      {isOpen ? "▼" : "◀"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-0.5">
                      {group.hrefs.map((href) => {
                        const label = LABEL_BY_HREF[href] ?? href;
                        const hrefWithCountry = withCountry(href, country);
                        const isActive = pathname === href || pathname.startsWith(href + "/");
                        return (
                          <Link
                            key={href}
                            href={hrefWithCountry}
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
                  )}
                </>
              ) : (
                <>
                  <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-primary">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.hrefs.map((href) => {
                      const label = LABEL_BY_HREF[href] ?? href;
                      const hrefWithCountry = withCountry(href, country);
                      const isActive = pathname === href || pathname.startsWith(href + "/");
                      return (
                        <Link
                          key={href}
                          href={hrefWithCountry}
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
                </>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
