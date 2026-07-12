import type { ReactElement } from "react";
import Image from "next/image";
import Link from "@/app/components/link";
import { SITE_LOGO_URL } from "@/lib/constants";

type HeaderLogoProps = { logoHref?: string };

export function HeaderLogo({ logoHref = "/#hero" }: HeaderLogoProps): ReactElement {
  return (
    <div className="flex shrink-0 flex-col items-start gap-0.5">
      <Link
        href={logoHref}
        aria-label="الرئيسية"
        className="inline-flex min-h-11 items-center"
      >
        <Image
          src={SITE_LOGO_URL}
          alt="شعار JBRSEO — منصة مدونتي"
          width={110}
          height={34}
          className="h-7 w-[104px] object-contain md:h-8 md:w-[116px]"
        />
      </Link>
      <Link
        href="https://modonty.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden text-[11px] text-foreground/55 transition-colors hover:text-foreground sm:inline-block"
      >
        مدعوم بـ modonty
      </Link>
    </div>
  );
}
