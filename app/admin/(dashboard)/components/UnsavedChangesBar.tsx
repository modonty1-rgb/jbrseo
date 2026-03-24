"use client";

import { useEffect, useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type UnsavedChangesBarProps = {
  formId: string;
  /** Custom message (default: generic unsaved hint). */
  message?: string;
  /** Extra classes for position, e.g. `bottom-20` to stack two bars. */
  className?: string;
};

export function UnsavedChangesBar({
  formId,
  message = "يوجد تغييرات غير محفوظة",
  className,
}: UnsavedChangesBarProps): ReactElement | null {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const form = document.getElementById(formId);
    const handler = () => setDirty(true);
    form?.addEventListener("input", handler);
    form?.addEventListener("change", handler);
    return () => {
      form?.removeEventListener("input", handler);
      form?.removeEventListener("change", handler);
    };
  }, [formId]);

  if (!dirty) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-50 mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border border-border bg-card px-4 py-2 text-sm shadow-lg bottom-4",
        className,
      )}
      role="status"
    >
      <span className="size-2 shrink-0 animate-pulse rounded-full bg-amber-400" aria-hidden />
      <span className="text-xs text-foreground">{message}</span>
    </div>
  );
}
