import type { ReactElement } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import Link from "@/app/components/link";
import { SITE_LOGO_URL } from "@/lib/constants";

type AuthNavProps = {
  homeHref: string;
  helpHref: string;
};

export function AuthNav({ homeHref, helpHref }: AuthNavProps): ReactElement {
  return (
    <nav
      className="flex items-center gap-4 border-b border-border bg-background/95 px-6 py-4 text-foreground backdrop-blur-sm"
      aria-label="التسجيل"
    >
      <div className="flex shrink-0 items-center gap-2">
        <Link href={homeHref} className="inline-flex shrink-0" aria-label="الرئيسية">
          <Image
            src={SITE_LOGO_URL}
            alt="JBRSEO"
            width={100}
            height={28}
            className="h-7 w-[100px] object-contain"
            priority
          />
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 text-xs text-white/70">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        <span>بياناتك آمنة ومحمية</span>
      </div>

      <Link
        href={helpHref}
        target="_blank"
        className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        تحتاج مساعدة؟
      </Link>
    </nav>
  );
}
