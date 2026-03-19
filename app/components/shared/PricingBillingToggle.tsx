"use client";

import Image from "next/image";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { EgyptianPoundIcon } from "@/app/components/icons/egyptian-pound-icon";

export function CurrencyIcon({ country }: { country: SupportedCountry }) {
  if (country === "SA") {
    return (
      <span className="me-1 inline-flex items-center align-middle">
        <Image
          src="/curncy/Saudi_Riyal_Symbol-2.svg"
          alt="Saudi Riyal"
          width={20}
          height={20}
          className="h-5 w-5 filter dark:invert"
        />
      </span>
    );
  }
  if (country === "EG") {
    return (
      <span className="me-1 inline-flex items-center align-middle">
        <EgyptianPoundIcon className="h-5 w-5" />
      </span>
    );
  }
  return null;
}
