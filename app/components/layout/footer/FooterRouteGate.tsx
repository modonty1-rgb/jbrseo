"use client";

import type { ComponentProps, ReactElement } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/app/components/layout/footer/Footer";

type FooterRouteGateProps = ComponentProps<typeof Footer>;

export function FooterRouteGate(props: FooterRouteGateProps): ReactElement | null {
  const pathname = usePathname();
  const base = props.basePath ?? "";
  if (
    base &&
    (pathname === `${base}/signup` || pathname.startsWith(`${base}/signup/`))
  ) {
    return null;
  }
  return <Footer {...props} />;
}
