import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4" dir="rtl" lang="ar">
      <main id="main-content" className="text-center max-w-md">
        <p className="text-8xl font-black text-muted-foreground/30 tabular-nums" aria-hidden>
          404
        </p>
        <h1 className="mt-4 text-xl font-bold text-foreground">
          الصفحة غير موجودة
        </h1>
        <p className="mt-2 text-muted-foreground text-[15px]">
          لم نتمكن من العثور على الصفحة التي تبحث عنها.
        </p>
        <Button asChild className="mt-8 rounded-full font-semibold px-6">
          <Link href="/sa">العودة للرئيسية</Link>
        </Button>
      </main>
    </div>
  );
}
