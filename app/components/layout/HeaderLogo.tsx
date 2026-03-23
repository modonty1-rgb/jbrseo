import type { ReactElement } from "react";
import Image from "next/image";
import Link from "@/app/components/link";
import { SITE_LOGO_URL } from "@/lib/constants";

type HeaderLogoProps = { logoHref?: string };

export function HeaderLogo({ logoHref = "/#hero" }: HeaderLogoProps): ReactElement {
  return (
    <div className="flex shrink-0 flex-col items-start gap-0.5">
      <Link href={logoHref} aria-label="الرئيسية">
        <Image
          src={SITE_LOGO_URL}
          alt="JBRSEO"
          width={110}
          height={34}
          className="h-8 w-[104px] object-contain md:h-9 md:w-[116px]"
          preload
        />
      </Link>
      <Link
        href="https://modonty.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden text-[10px] text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
      >
        مدعوم بـ modonty
      </Link>
    </div>
  );
}
