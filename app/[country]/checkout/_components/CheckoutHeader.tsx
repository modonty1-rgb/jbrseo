import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SITE_LOGO_URL } from "@/lib/constants";

// Focus-mode header: logo + one back link. Nothing else.
export function CheckoutHeader({ backHref }: { backHref: string }) {
  return (
    <header className="border-b border-border/60 bg-card/50 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href={backHref}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          <span>رجوع للأسعار</span>
        </a>
        <a href="/" aria-label="JBRSEO — الصفحة الرئيسية" className="inline-flex items-center">
          <Image
            src={SITE_LOGO_URL}
            alt="JBRSEO"
            width={72}
            height={22}
            className="h-6 w-auto"
            priority
          />
        </a>
      </div>
    </header>
  );
}
