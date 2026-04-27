"use client";

import Image from "next/image";
import type { StaticLanding, TrustBarClient } from "@/app/content/landing/types";
import { cn } from "@/lib/utils";
import { BankTrustBadge } from "@/app/components/shared/BankTrustBadge";

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

function normalizeTrustBarHref(href: string): string {
  const t = href.trim();
  if (/^http:\/\/jabrco\.com/i.test(t)) {
    return t.replace(/^http:/i, "https:");
  }
  return t;
}

function fill<T>(arr: T[], min = 8): T[] {
  if (arr.length === 0) return arr;
  const result = [...arr];
  while (result.length < min) result.push(...arr);
  return result;
}

function LogoCard({ client }: { client: TrustBarClient }) {
  const unoptimized = isSvgUrl(client.logoUrl);
  const inner = (
    <span className="group flex shrink-0 flex-col items-center gap-2">
      <Image
        src={client.logoUrl}
        alt={`شعار ${client.name}`}
        width={140}
        height={48}
        sizes="140px"
        loading="lazy"
        unoptimized={unoptimized}
        className="h-12 w-auto max-w-36 object-contain grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
      />
      <span className="line-clamp-1 max-w-36 text-center text-[10px] font-medium leading-tight text-muted-foreground/80 transition-colors duration-300 group-hover:text-foreground">
        {client.name}
      </span>
    </span>
  );

  if (client.href) {
    return (
      <a
        href={normalizeTrustBarHref(client.href)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={client.name}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {inner}
      </a>
    );
  }
  return <>{inner}</>;
}

function PillCard({ name }: { name: string }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-border/40 bg-muted/20 px-4 py-1.5 text-[12px] font-semibold text-muted-foreground/65 shadow-sm transition-all duration-200 hover:border-border/60 hover:bg-muted/35 hover:text-muted-foreground/90">
      {name}
    </span>
  );
}

function LogoMarquee({ clients }: { clients: TrustBarClient[] }) {
  return (
    <div className="relative overflow-hidden" dir="ltr">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
      <div className={cn("flex w-max gap-4 animate-marquee will-change-transform hover:[animation-play-state:paused]")}>
        {clients.map((client, i) => (
          <LogoCard key={`a-${i}`} client={client} />
        ))}
        {clients.map((client, i) => (
          <LogoCard key={`b-${i}`} client={client} />
        ))}
      </div>
    </div>
  );
}

function PillMarquee({ names }: { names: string[] }) {
  return (
    <div className="relative overflow-hidden" dir="ltr">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
      <div className={cn("flex w-max gap-3 animate-marquee will-change-transform hover:[animation-play-state:paused]")}>
        {names.map((name, i) => (
          <PillCard key={`a-${i}`} name={name} />
        ))}
        {names.map((name, i) => (
          <PillCard key={`b-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

export function HeroTrustBar({ hero }: HeroTrustBarProps) {
  const headline = hero?.trustBarHeadline || FALLBACK_HEADLINE;
  const clients = hero?.trustBarClients;

  const hasLogos = Array.isArray(clients) && clients.some((c) => c.logoUrl);
  const hasNames = Array.isArray(clients) && clients.length > 0;

  const logoClients = hasLogos ? fill(clients!.filter((c) => c.logoUrl)) : [];
  const nameClients = hasNames ? fill(clients!.map((c) => c.name)) : fill(FALLBACK_CLIENTS);

  return (
    <div className="mt-6 w-full border-t border-border/40 py-4 sm:py-5">
      <BankTrustBadge className="mb-3" />

      <p className="mb-4 px-4 text-center text-xs font-bold leading-relaxed text-muted-foreground/85 sm:text-[11px]">
        {headline}
      </p>

      {hasLogos
        ? <LogoMarquee clients={logoClients} />
        : <PillMarquee names={nameClients} />
      }
    </div>
  );
}
