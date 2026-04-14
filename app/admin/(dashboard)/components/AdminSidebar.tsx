"use client";

import { useEffect, useState } from "react";
import Link from "@/app/components/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  ImageIcon,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import { COUNTRIES } from "../_config";
import { cn } from "@/lib/utils";

const HREF_ICON: Partial<Record<string, LucideIcon>> = {
  "/admin": LayoutDashboard,
  "/admin/content/emojis": ImageIcon,
  "/admin/marketing/jbrseo-plan": BookOpen,
  "/admin/marketing/modony-plan": BookOpen,
};

function NavIcon({ href, className }: { href: string; className?: string }) {
  const Icon = HREF_ICON[href] ?? BookOpen;
  return <Icon className={cn("size-4 shrink-0 opacity-80", className)} aria-hidden />;
}

function withCountry(href: string, country: string): string {
  return href + (href.includes("?") ? "&" : "?") + "country=" + country;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const country =
    searchParams.get("country") === "EG"
      ? COUNTRIES[1].value
      : COUNTRIES[0].value;

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
      pathname === href || pathname.startsWith(`${href}/`)
        ? "bg-muted font-medium text-foreground"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    );

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

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain pe-1">
        {/* Tools */}
        <div className="border-t border-border/60 pt-3 mt-2">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-primary">
            أدوات
          </p>
          <Link href="/admin/content/emojis" className={linkClass("/admin/content/emojis")}>
            <NavIcon href="/admin/content/emojis" />
            مرجع الرموز
          </Link>
        </div>
      </nav>
    </aside>
  );
}
