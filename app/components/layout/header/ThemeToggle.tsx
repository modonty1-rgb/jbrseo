"use client";

import { Button } from "@/app/components/ui/button";
import { useThemeOptional } from "@/app/helpers/useTheme";

export function ThemeToggle() {
  const ctx = useThemeOptional();

  if (!ctx) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full border border-border/70 bg-background/80 text-foreground/70 hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:border-border/60 dark:bg-background/40 dark:hover:bg-primary/20"
        aria-label="تفعيل الوضع الداكن"
      >
        <span className="text-xl" aria-hidden>
          🌙
        </span>
      </Button>
    );
  }

  const { theme, toggleTheme } = ctx;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full border border-border/70 bg-background/80 text-foreground/70 hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:border-border/60 dark:bg-background/40 dark:hover:bg-primary/20"
      aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      <span className="text-xl" aria-hidden>
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </Button>
  );
}

