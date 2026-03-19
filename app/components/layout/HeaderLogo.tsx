import Image from "next/image";
import Link from "@/app/components/link";
import { SITE_LOGO_URL } from "@/lib/constants";

type HeaderLogoProps = { logoHref?: string };

export function HeaderLogo({ logoHref = "/#hero" }: HeaderLogoProps) {
  return (
    <Link
      href={logoHref}
      className="flex shrink-0 items-center gap-2"
      aria-label="مدونتي — الرئيسية"
    >
      <Image
        src={SITE_LOGO_URL}
        alt="مدونتي"
        width={110}
        height={34}
        className="h-8 w-auto md:h-9"
        priority
      />
    </Link>
  );
}
