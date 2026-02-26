import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import { landing } from "@/app/content/landing";

const LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="مدونتي — الرئيسية">
          <Image
            src={LOGO_URL}
            alt="مدونتي"
            width={110}
            height={34}
            className="h-8 w-auto md:h-9"
          />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            size="default"
            className="rounded-full px-5 shadow-sm"
          >
            <Link href="/pricing">{landing.hero.cta}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
