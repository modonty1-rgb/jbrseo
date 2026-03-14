"use client";

import { useSearchParams } from "next/navigation";
import Link from "@/app/components/link";
import type { ComponentProps } from "react";

export function appendPreviewQuery(href: string, preview: string): string {
  if (!preview) return href;
  const [path, hash] = href.split("#");
  const sep = path.includes("?") ? "&" : "?";
  const withQuery = path + sep + "country=" + encodeURIComponent(preview);
  return hash ? withQuery + "#" + hash : withQuery;
}

export function PreviewLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const searchParams = useSearchParams();
  const preview = searchParams.get("country")?.toLowerCase();
  const isPreview = preview === "sa" || preview === "eg";
  const finalHref = isPreview ? appendPreviewQuery(href, preview) : href;
  return <Link href={finalHref} {...rest} />;
}

export function usePreviewHref(href: string): string {
  const searchParams = useSearchParams();
  const preview = searchParams.get("country")?.toLowerCase();
  const isPreview = preview === "sa" || preview === "eg";
  return isPreview ? appendPreviewQuery(href, preview) : href;
}
