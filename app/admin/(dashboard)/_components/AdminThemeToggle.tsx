"use client";

import { Moon, Sun } from "lucide-react";
import { useAdminTheme } from "./AdminThemeProvider";

export function AdminThemeToggle() {
  const { theme, toggle } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      title={isDark ? "وضع فاتح" : "وضع داكن"}
      className="inline-flex size-8 items-center justify-center rounded-md border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted/70 hover:text-foreground"
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
