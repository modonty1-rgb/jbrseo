"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/app/components/ui/button";

export function SubmitButton({
  children,
  loadingLabel = "جاري الحفظ…",
}: {
  children: React.ReactNode;
  loadingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" className="w-fit" disabled={pending}>
      {pending ? loadingLabel : children}
    </Button>
  );
}

/** Matches [Input](@/app/components/ui/input) / [SelectTrigger](@/app/components/ui/select) field chrome */
export const fieldClass =
  "flex h-9 w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

/** @deprecated use fieldClass — kept for existing imports */
export const inputBase = fieldClass;

export const labelClass = "text-xs font-medium text-muted-foreground";
