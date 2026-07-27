"use client";

import type { ReactNode } from "react";
import { Button } from "@/app/components/ui/button";

// Checkout-scoped error boundary. A generic "something broke" is alarming on a
// payment page — the visitor's first fear is "did my card get charged?". So we
// lead with the money reassurance, then offer retry + the same sales channels
// shown on the landing. Hardcoded on purpose: must render even if DB/network is
// down. Keep in sync with SiteSettings.whatsappNumber if it changes.
const SUPPORT_WHATSAPP = "966541018020";
const SUPPORT_EMAIL = "support@jbrseo.com";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CheckoutError({ error, reset }: Props): ReactNode {
  return (
    <main
      dir="rtl"
      lang="ar"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-10 text-center"
    >
      <div className="max-w-xl">
        <h1 className="mb-3 text-2xl font-black text-foreground">
          لم يتم خصم أي مبلغ من بطاقتك
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          صار خلل مؤقت أثناء تجهيز الدفع. أعِد المحاولة بأمان — لن يُخصم منك أي مبلغ إلا بعد
          ما تأكّد العملية وتوصلك رسالة نجاح. ولو استمرّ، كلّمنا وبنكمّل معك خطوة بخطوة.
        </p>
      </div>

      <Button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-black text-accent-foreground shadow-sm hover:bg-accent/80"
        aria-label="إعادة المحاولة"
      >
        أعِد المحاولة ←
      </Button>

      <div className="flex flex-col items-center gap-2 text-sm">
        <span className="text-muted-foreground">فريق المبيعات جاهز يساعدك:</span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground underline underline-offset-4 hover:text-accent"
          >
            واتساب المبيعات
          </a>
          <span className="text-muted-foreground/50">·</span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-bold text-foreground underline underline-offset-4 hover:text-accent"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <details className="w-full max-w-xl">
          <summary className="cursor-pointer text-xs font-bold text-muted-foreground">تفاصيل الخطأ</summary>
          <div className="mt-2 wrap-break-word rounded-lg bg-muted/40 p-3 text-xs text-foreground">
            {error?.message ?? "Unknown error"}
            {error?.digest && (
              <p className="mt-1 text-muted-foreground">Digest: {error.digest}</p>
            )}
          </div>
        </details>
      )}
    </main>
  );
}
