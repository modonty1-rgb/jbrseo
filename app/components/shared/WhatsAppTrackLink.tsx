"use client";

import { GTMEvents } from "@/lib/gtm";
import type { ComponentPropsWithoutRef } from "react";

export function WhatsAppTrackLink({
  onClick,
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...props}
      onClick={(e) => {
        GTMEvents.whatsappClick();
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
