"use client";

import { useSearchParams } from "next/navigation";
import { COUNTRIES } from "../_config";

export function AdminCountryPill() {
  const searchParams = useSearchParams();
  const country = searchParams.get("country") === "EG" ? "EG" : "SA";
  const label = COUNTRIES.find((c) => c.value === country)?.label ?? country;
  return (
    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
      البلد: {label}
    </span>
  );
}
