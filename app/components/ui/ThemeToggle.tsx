"use client";

import { Moon, Sun } from "lucide-react";
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
        className="h-10 w-10 rounded-full border border-border text-foreground/70"
        aria-label="تفعيل الوضع الداكن"
      >
        <Moon className="h-4 w-4" />
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
      className="h-10 w-10 rounded-full border border-border text-foreground/70 hover:border-primary/30 hover:text-primary dark:border-border dark:hover:border-primary/30"
      aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
