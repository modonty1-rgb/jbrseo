"use client";

import type { ReactNode } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: Props): ReactNode {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 py-10 text-center">
          <div className="max-w-xl">
            <h1 className="mb-2 text-2xl font-black">حدث خطأ غير متوقع</h1>
            <p className="text-sm opacity-60">جرّب إعادة المحاولة وسنقوم بتحميل الصفحة مرة أخرى.</p>
          </div>

          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700"
            aria-label="إعادة المحاولة"
          >
            إعادة المحاولة ←
          </button>

          {process.env.NODE_ENV === "development" && (
            <details className="w-full max-w-xl">
              <summary className="cursor-pointer text-xs font-bold opacity-50">تفاصيل الخطأ</summary>
              <div className="mt-2 rounded-lg bg-gray-100 p-3 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200 wrap-break-word">
                {error?.message ?? "Unknown error"}
                {error?.digest && (
                  <p className="mt-1 opacity-60">Digest: {error.digest}</p>
                )}
              </div>
            </details>
          )}
        </main>
      </body>
    </html>
  );
}
