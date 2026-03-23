"use client";

import Image from "next/image";
import Link from "@/app/components/link";
import { HorizontalScrollArea } from "@/app/components/ui/scroll-area";
import type { StaticLanding, TrustBarClient } from "@/app/content/landing/types";
import { cn } from "@/lib/utils";

const FALLBACK_CLIENTS = [
  "آفاق للاستشارات",
  "زوايا العقارية",
  "عيادات النور",
  "منصة إدراك",
  "رحلاتي للسياحة",
  "نخبة المحاسبين",
];

const FALLBACK_HEADLINE = "يثق بنا +١٢٠ نشاط تجاري في السعودية ومصر";

type HeroTrustBarProps = {
  hero?: StaticLanding["hero"];
};

function isSvgUrl(url: string): boolean {
  return /\.svg(\?|#|$)/i.test(url);
}

function LogoItem({ client }: { client: TrustBarClient }) {
  const unoptimized = isSvgUrl(client.logoUrl);
  const inner = (
    <span className="flex flex-col items-center gap-1.5">
      <span className="relative flex h-7 w-[104px] items-center justify-center rounded-md bg-muted/15 sm:h-8 sm:w-[120px]">
        <Image
          src={client.logoUrl}
          alt="شريك موثوق"
          fill
          sizes="(max-width: 640px) 104px, 120px"
          loading="lazy"
          unoptimized={unoptimized}
          className="object-contain object-center opacity-60 transition-opacity hover:opacity-90"
        />
      </span>
      <span className="line-clamp-1 min-h-4.5 max-w-[120px] text-center text-[10px] font-medium leading-tight text-muted-foreground/65">
        {client.name}
      </span>
    </span>
  );

  if (client.href) {
    return (
      <Link
        href={client.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={client.name}
        className={cn(
          "flex min-h-12 min-w-22 shrink-0 items-center justify-center rounded-lg py-1",
          "touch-manipulation transition-colors hover:bg-muted/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      className="flex min-h-12 min-w-22 shrink-0 items-center justify-center py-1"
      role="group"
      aria-label={client.name}
    >
      {inner}
    </div>
  );
}

function PillItem({ name }: { name: string }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-border/50 bg-background px-4 py-2 text-[12px] font-semibold text-muted-foreground/80 shadow-sm sm:py-1.5">
      {name}
    </span>
  );
}

export function HeroTrustBar({ hero }: HeroTrustBarProps) {
  const headline = hero?.trustBarHeadline || FALLBACK_HEADLINE;
  const clients = hero?.trustBarClients;

  const hasLogos = Array.isArray(clients) && clients.some((c) => c.logoUrl);
  const hasNames = Array.isArray(clients) && clients.length > 0;

  const logoClients = hasLogos ? clients!.filter((c) => c.logoUrl) : [];

  const scrollShell = "rounded-2xl border border-border/50 bg-muted/20 p-2";

  return (
    <div className="mt-6 w-full border-t border-border/40 py-4 sm:py-5">
      <p className="mb-3 px-4 text-center text-xs font-bold leading-relaxed text-muted-foreground/70 sm:mb-4 sm:text-[11px]">
        {headline}
      </p>

      {hasLogos ? (
        <>
          <div className="mx-3 sm:hidden">
            <HorizontalScrollArea className={scrollShell}>
              <ul className="flex w-max gap-4 pb-1" role="list" aria-label={headline}>
                {logoClients.map((client, i) => (
                  <li key={`m-logo-${client.logoUrl}-${i}`} className="shrink-0">
                    <LogoItem client={client} />
                  </li>
                ))}
              </ul>
            </HorizontalScrollArea>
          </div>
          <div className="mx-auto hidden max-w-4xl px-8 sm:block">
            <ul className="flex flex-wrap items-center justify-center gap-3" role="list" aria-label={headline}>
              {logoClients.map((client, i) => (
                <li key={`d-logo-${client.logoUrl}-${i}`} className="shrink-0">
                  <LogoItem client={client} />
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="mx-3 sm:hidden">
            <HorizontalScrollArea className={scrollShell}>
              <ul className="flex w-max gap-2.5 pb-1" role="list" aria-label={headline}>
                {hasNames
                  ? clients!.map((c, i) => (
                      <li key={`m-pill-${c.name}-${i}`} className="shrink-0">
                        <PillItem name={c.name} />
                      </li>
                    ))
                  : FALLBACK_CLIENTS.map((name, i) => (
                      <li key={`m-pill-${name}-${i}`} className="shrink-0">
                        <PillItem name={name} />
                      </li>
                    ))}
              </ul>
            </HorizontalScrollArea>
          </div>
          <div className="mx-auto hidden max-w-4xl px-8 sm:block">
            <ul className="flex flex-wrap items-center justify-center gap-3" role="list" aria-label={headline}>
              {hasNames
                ? clients!.map((c, i) => (
                    <li key={`d-pill-${c.name}-${i}`} className="shrink-0">
                      <PillItem name={c.name} />
                    </li>
                  ))
                : FALLBACK_CLIENTS.map((name, i) => (
                    <li key={`d-pill-${name}-${i}`} className="shrink-0">
                      <PillItem name={name} />
                    </li>
                  ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
