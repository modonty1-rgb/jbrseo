"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/components/ui/button";

 type Props = {
  error: Error;
  reset: () => void;
 };

export default function ErrorBoundary({ error, reset }: Props): ReactNode {
  return (
    <main
      dir="rtl"
      lang="ar"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 py-10 text-center"
    >
      <div className="max-w-xl">
        <h1 className="mb-2 text-2xl font-black text-foreground">حدث خطأ غير متوقع</h1>
        <p className="text-sm text-muted-foreground">جرّب إعادة المحاولة وسنقوم بتحميل الصفحة مرة أخرى.</p>
      </div>

      <Button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground shadow-sm hover:bg-accent/80"
        aria-label="إعادة المحاولة"
      >
        إعادة المحاولة ←
      </Button>

      {process.env.NODE_ENV === "development" && (
        <details className="w-full max-w-xl">
          <summary className="cursor-pointer text-xs font-bold text-muted-foreground">تفاصيل الخطأ</summary>
          <div className="mt-2 wrap-break-word rounded-lg bg-muted/40 p-3 text-xs text-foreground">
            {formatError(error)}
          </div>
        </details>
      )}
    </main>
  );
}

function formatError(error: Error): ReactNode {
  return error?.message ?? "Unknown error";
}

