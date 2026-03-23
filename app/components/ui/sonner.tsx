"use client";

import type { ComponentProps, ReactElement } from "react";
import { useThemeOptional } from "@/app/helpers/useTheme";
import { Toaster as SonnerToaster, toast } from "sonner";

type ToasterProps = ComponentProps<typeof SonnerToaster>;

function Toaster(props: ToasterProps): ReactElement {
  const themeCtx = useThemeOptional();
  const theme: ToasterProps["theme"] =
    themeCtx?.theme === "dark" ? "dark" : themeCtx?.theme === "light" ? "light" : "system";

  return (
    <SonnerToaster
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
