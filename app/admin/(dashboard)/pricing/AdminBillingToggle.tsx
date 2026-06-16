"use client";

import { useTransition, type ReactElement } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  annual: boolean;
};

export function AdminBillingToggle({ annual }: Props): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setBilling = (next: "monthly" | "annual") => {
    if ((next === "annual") === annual) return;
    const sp = new URLSearchParams(params.toString());
    if (next === "annual") sp.set("billing", "annual");
    else sp.delete("billing");
    const qs = sp.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname));
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs",
        isPending && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={() => setBilling("monthly")}
        className={cn(
          "rounded-full px-3 py-1 font-semibold transition-colors",
          !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        شهري
      </button>
      <button
        type="button"
        onClick={() => setBilling("annual")}
        className={cn(
          "rounded-full px-3 py-1 font-semibold transition-colors",
          annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        سنوي
      </button>
    </div>
  );
}
