"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  countrySlug: string;
  order: string;
  refShort: string;
};

const POLL_INTERVAL_MS = 2_000;    // check every 2 seconds
// 90s — covers realistic N-Genius webhook delays. Was 60s but that timed out
// too often in sandbox where the webhook isn't whitelisted yet, forcing users
// onto the "check console" fallback prematurely.
const POLL_TIMEOUT_MS  = 90_000;

// Polls /api/checkout/status until the Subscriber transitions out of `pending`,
// then redirects to /success or /failed accordingly. On timeout, shows a hint
// so the user isn't stuck spinning forever — they can check email / console.
export function ProcessingClient({ countrySlug, order, refShort }: Props) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const stopped = useRef(false);

  useEffect(() => {
    async function tick() {
      if (stopped.current) return;

      const elapsed = Date.now() - startedAt.current;
      if (elapsed > POLL_TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }

      try {
        const res = await fetch(`/api/checkout/status?order=${encodeURIComponent(order)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();

        if (data.status === "paid") {
          stopped.current = true;
          router.replace(`/${countrySlug}/checkout/success?order=${encodeURIComponent(order)}`);
          return;
        }
        if (data.status === "failed") {
          stopped.current = true;
          const reason = data.failReason ? `&reason=${encodeURIComponent(data.failReason)}` : "";
          router.replace(`/${countrySlug}/checkout/failed?order=${encodeURIComponent(order)}${reason}`);
          return;
        }
        // Still pending — keep polling.
      } catch {
        // Silently retry — network hiccup shouldn't abort the poll.
      }

      setAttempts((n) => n + 1);
      window.setTimeout(tick, POLL_INTERVAL_MS);
    }

    tick();
    return () => {
      stopped.current = true;
    };
  }, [countrySlug, order, router]);

  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="text-center">
        {/* Spinning icon */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-info/12 border-2 border-info/40 shadow-lg shadow-info/20">
          <Loader2 className="h-11 w-11 text-info animate-spin" strokeWidth={2.5} />
        </div>

        <h1 className="mt-6 text-2xl font-black text-foreground sm:text-3xl">
          {timedOut ? "لا زلنا نتحقق من دفعك" : "لحظات — نُجهّز حسابك"}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-md mx-auto">
          {timedOut
            ? "التأكيد يستغرق وقتاً أطول من المعتاد. سيصلك إيميل من مدونتي فور اكتمال العملية. لا داعي لإعادة الدفع."
            : "تم إرسال طلب الدفع للبنك. ننتظر التأكيد الآن — يستغرق عادة ٥-١٥ ثانية."}
        </p>

        <div className="mt-8 inline-flex items-baseline gap-2 text-xs text-muted-foreground font-mono" dir="ltr">
          <span>Order:</span>
          <span className="text-foreground">{refShort}</span>
        </div>

        {!timedOut && (
          <p className="mt-6 text-xs text-muted-foreground/80">
            لا تُغلق هذه الصفحة — نُحوّلك تلقائياً بمجرد التأكيد.
          </p>
        )}

        {timedOut && (
          <div className="mt-8 space-y-3">
            <p className="text-xs text-muted-foreground">
              يمكنك متابعة حسابك من:
            </p>
            <a
              href="https://console.modonty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-info px-6 py-2.5 text-sm font-semibold text-white hover:bg-info/90 transition-colors no-underline"
            >
              افتح console.modonty.com ↗
            </a>
          </div>
        )}

        <p className="mt-10 text-[11px] text-muted-foreground/60" dir="ltr">
          {timedOut ? `timeout after ${Math.floor(POLL_TIMEOUT_MS / 1000)}s` : `attempt ${attempts + 1}`}
        </p>
      </div>
    </main>
  );
}
