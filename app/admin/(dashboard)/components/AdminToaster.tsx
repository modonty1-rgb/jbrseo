"use client";

import type { ReactElement } from "react";
import { Toaster } from "@/app/components/ui/sonner";

export function AdminToaster(): ReactElement {
  return <Toaster richColors position="top-center" dir="rtl" closeButton />;
}
