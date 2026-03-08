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

export const inputBase =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";
export const labelClass = "text-xs font-medium text-muted-foreground";
