import Link from "next/link";
import Image from "next/image";
import { footerTexts } from "@/app/components/texts";

const LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card" role="contentinfo">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${footerTexts.brandName} — الرئيسية`}>
          <Image
            src={LOGO_URL}
            alt={footerTexts.brandName}
            width={100}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <p className="text-xs text-muted-foreground">{footerTexts.copyright}</p>
      </div>
    </footer>
  );
}
