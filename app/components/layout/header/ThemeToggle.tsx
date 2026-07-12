"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useThemeOptional } from "@/lib/useTheme";

// Base class stays constant so the button never re-flows on toggle.
const BUTTON_CLS =
  "h-11 w-11 rounded-full border border-border/70 bg-background/80 text-foreground/70 hover:bg-primary/10 hover:text-primary hover:border-primary/40 dark:border-border/60 dark:bg-background/40 dark:hover:bg-primary/20";

export function ThemeToggle() {
  const ctx = useThemeOptional();

  if (!ctx) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={BUTTON_CLS}
        aria-label="تفعيل الوضع الداكن"
      >
        <Moon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </Button>
    );
  }

  const { theme, toggleTheme } = ctx;
  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={BUTTON_CLS}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      {isDark ? (
        <Sun className="h-5 w-5" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="h-5 w-5" strokeWidth={2} aria-hidden />
      )}
    </Button>
  );
}

