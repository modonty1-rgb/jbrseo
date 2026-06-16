import type { ReactElement } from "react";
import Image from "next/image";
import Link from "@/app/components/link";
import { SITE_LOGO_URL } from "@/lib/constants";

type AuthNavProps = {
  homeHref: string;
  helpHref: string;
};

export function AuthNav({ homeHref, helpHref }: AuthNavProps): ReactElement {
  return (
    <nav
      className="flex items-center gap-4 px-7 py-[14px] bg-[color-mix(in_oklch,var(--background)_92%,transparent)] backdrop-blur-md border-b border-b-border sticky top-0 z-50"
      aria-label="التسجيل"
    >
      <Link href={homeHref} className="inline-flex shrink-0 no-underline" aria-label="الرئيسية">
        <Image
          src={SITE_LOGO_URL}
          alt="JBRSEO"
          width={120}
          height={32}
          className="h-7 w-auto object-contain"
          priority
        />
      </Link>

      <div className="inline-flex items-center gap-[7px] mx-auto font-['IBM_Plex_Mono',monospace] text-[11px] text-muted-foreground px-3 py-[5px] rounded-full border border-border bg-card">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>بياناتك آمنة ومحمية</span>
      </div>

      <Link
        href={helpHref}
        target="_blank"
        className="shrink-0 text-[13px] font-medium text-muted-foreground no-underline px-3 py-1.5 rounded-lg transition-all duration-150"
      >
        تحتاج مساعدة؟
      </Link>
    </nav>
  );
}
