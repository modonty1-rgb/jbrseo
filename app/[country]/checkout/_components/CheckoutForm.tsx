"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Clock } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { cn } from "@/lib/utils";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { FailureReason } from "@/lib/checkout-reasons";
import type { PlanDuration } from "@/lib/pricing-durations";
import { NGeniusMount, type NGeniusHandle } from "./NGeniusMount";

/** Fire-and-forget failure log → /api/checkout/log-failure (stored in DB,
 *  never shown to the customer). `keepalive` so it still sends if the page
 *  navigates immediately after. Never throws. */
function logCheckoutFailure(payload: Record<string, unknown>): void {
  try {
    fetch("/api/checkout/log-failure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => { /* logging must never disrupt checkout */ });
  } catch { /* ignore */ }
}

/** Reject with a sentinel after `ms` so a silently-hung SDK promise (observed
 *  with some foreign/unsupported cards at tokenization) surfaces as an error
 *  instead of an eternal spinner. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("__timeout__")), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
}

type Props = {
  country: SupportedCountry;
  planSlug: string;
  planName: string;
  duration: PlanDuration;
  totalDisplay: string;
  /** Set when redirected back from a failed payment attempt — shows inline banner. */
  paymentError?: FailureReason | null;
  /** 1-indexed attempt number; used in the banner copy ("محاولة #٢"). */
  attemptNumber?: number;
  /** Cloudflare Turnstile site key — public, safe to expose. Passed from server. */
  turnstileSiteKey: string;
  /** N-Genius Hosted Session public key + outlet ref — passed from server. */
  ngeniusHostedSessionKey: string;
  ngeniusOutletRef: string;
};

type Errors = Partial<Record<"name" | "email" | "phone" | "turnstile" | "card" | "submit", string>>;

export function CheckoutForm({
  country, planSlug, planName, duration, totalDisplay,
  paymentError, attemptNumber, turnstileSiteKey,
  ngeniusHostedSessionKey, ngeniusOutletRef,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const ngeniusRef = useRef<NGeniusHandle | null>(null);

  // Fallback: some Cloudflare test keys skip firing onSuccess reliably; poll
  // the hidden input Turnstile injects so we always capture the token that's
  // actually in the DOM. Cheap, safe, no-op once state is set.
  useEffect(() => {
    if (turnstileToken) return;
    const tick = () => {
      const input = document.querySelector<HTMLInputElement>(
        'input[name="cf-turnstile-response"]',
      );
      const v = input?.value;
      if (v && v.length > 5) setTurnstileToken(v);
    };
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [turnstileToken]);

  const countryCode = country === "SA" ? "+966" : "+20";
  const phonePlaceholder = country === "SA" ? "5XXXXXXXX" : "01XXXXXXXXX";

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "يرجى إدخال اسمك";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "يرجى إدخال بريد إلكتروني صالح";
    }
    const local = phone.replace(/[\s-]/g, "");
    const validLocal =
      country === "SA" ? /^5\d{8}$/.test(local) : /^01\d{8,9}$/.test(local);
    if (!local || !validLocal) {
      next.phone =
        country === "SA"
          ? "يرجى إدخال رقم جوال سعودي (مثال: 5XXXXXXXX)"
          : "يرجى إدخال رقم جوال مصري (مثال: 01XXXXXXXXX)";
    }
    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    // Shared context for every failure log this attempt (never shown to user).
    const logCtx = { plan: planSlug, duration: `${duration}m`, country, email: email || undefined };

    const next = validate();
    if (!turnstileToken) next.turnstile = "يرجى إكمال التحقق الأمني قبل الدفع";
    if (!ngeniusRef.current?.isCardValid()) next.card = "أدخل بيانات البطاقة كاملة قبل الدفع";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      // A press that does nothing visible is usually this branch (e.g. card
      // fields incomplete — card validity is NOT part of the enable-gate).
      logCheckoutFailure({ ...logCtx, stage: "validate", outcome: "invalid", code: Object.keys(next).join(",") });
      const firstField = Object.keys(next).find((k) => !["turnstile", "card", "submit"].includes(k));
      if (firstField) document.getElementById(`checkout-${firstField}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // 1. Generate session ID client-side (SDK talks directly to N-Genius).
      //    Wrapped in an 8s timeout: some foreign/unsupported cards make the
      //    SDK hang here with no callback — the timeout turns that silent hang
      //    into a logged failure + a real message instead of a dead button.
      let sessionId: string;
      try {
        sessionId = await withTimeout(ngeniusRef.current!.generateSessionId(), 8000);
      } catch (sErr) {
        const timedOut = sErr instanceof Error && sErr.message === "__timeout__";
        logCheckoutFailure({
          ...logCtx,
          stage: "session",
          outcome: timedOut ? "timeout" : "error",
          code: timedOut ? "session_timeout" : (sErr instanceof Error ? sErr.name : "session_error"),
          message: sErr instanceof Error ? sErr.message.slice(0, 300) : String(sErr),
        });
        setErrors((prev) => ({
          ...prev,
          submit: timedOut
            ? "تعذّر بدء الدفع — قد لا تدعم بطاقتك الدفع الدولي بعملة الموقع. جرّب بطاقة أخرى."
            : "تعذّر بدء الدفع. تأكد من بيانات البطاقة أو جرّب بطاقة أخرى.",
        }));
        return;
      }

      // 2. Ship everything to our backend — server verifies Turnstile,
      //    validates, upserts Subscriber, and calls N-Genius complete-payment.
      const res = await fetch(`/api/checkout/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId, turnstileToken,
          name, email, phone: phone.replace(/[\s-]/g, ""),
          plan: planSlug, duration, country,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const code = (body?.error as string) || `HTTP ${res.status}`;
        logCheckoutFailure({ ...logCtx, stage: "create-payment", outcome: "error", code, message: `create-payment ${res.status}` });
        const reasonSlug =
          code === "bot-check-failed" ? "authentication_failed" :
          code === "rate-limited" ? "timeout" :
          code === "ngenius-failed" ? "system_error" :
          "system_error";
        const nextAttempt = (attemptNumber ?? 0) + 1;
        router.replace(`/${country.toLowerCase()}/checkout?plan=${planSlug}&duration=${duration}&error=${reasonSlug}&attempt=${nextAttempt}`);
        return;
      }

      const paymentResponse = await res.json();
      const subscriberId = paymentResponse.subscriberId as string;

      // 3. Let the SDK handle the payment response (triggers 3DS iframe if needed)
      const result = await ngeniusRef.current!.handlePaymentResponse(paymentResponse);

      // 4. Route based on final SDK status
      if (result.success) {
        router.replace(`/${country.toLowerCase()}/checkout/processing?order=${subscriberId}`);
      } else {
        const reason = result.is3DsFailure ? "authentication_failed" : "card_declined";
        logCheckoutFailure({
          ...logCtx,
          stage: result.is3DsFailure ? "3ds" : "auth",
          outcome: "declined",
          code: result.status || reason,
          state: result.status,
          subscriberId,
        });
        const nextAttempt = (attemptNumber ?? 0) + 1;
        router.replace(`/${country.toLowerCase()}/checkout?plan=${planSlug}&duration=${duration}&error=${reason}&attempt=${nextAttempt}&order=${subscriberId}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "خطأ غير معروف";
      logCheckoutFailure({ ...logCtx, stage: "submit", outcome: "error", code: err instanceof Error ? err.name : "unknown", message: msg.slice(0, 300) });
      setErrors((prev) => ({ ...prev, submit: msg }));
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    !submitting &&
    termsAccepted &&
    !!turnstileToken &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      {paymentError && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border-2 border-destructive/40 bg-destructive/8 px-4 py-3.5"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" strokeWidth={2.5} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-destructive mb-0.5">
              {paymentError.title}
              {attemptNumber && attemptNumber > 1 && (
                <span className="mr-2 rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-mono font-semibold" dir="ltr">
                  محاولة #{attemptNumber}
                </span>
              )}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {paymentError.hint} — <strong className="text-foreground">لم يُخصم أي مبلغ.</strong>
            </p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="checkout-name" className="mb-1.5 block text-[13px] font-semibold text-foreground">
          الاسم
        </label>
        <input
          id="checkout-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
          }}
          placeholder="محمد العمري"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "err-name" : undefined}
          className={cn(
            "h-12 w-full rounded-lg border bg-background px-3.5 text-base text-foreground shadow-none outline-none transition placeholder:text-muted-foreground/70",
            errors.name
              ? "border-destructive focus:ring-2 focus:ring-destructive/25"
              : "border-border focus:border-success focus:ring-2 focus:ring-success/15"
          )}
        />
        {errors.name && (
          <p id="err-name" className="mt-1 text-xs text-destructive">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="checkout-email" className="mb-1.5 block text-[13px] font-semibold text-foreground">
          البريد الإلكتروني
        </label>
        <input
          id="checkout-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="you@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
          className={cn(
            "h-12 w-full rounded-lg border bg-background px-3.5 text-base text-foreground shadow-none outline-none transition placeholder:text-muted-foreground/70",
            errors.email
              ? "border-destructive focus:ring-2 focus:ring-destructive/25"
              : "border-border focus:border-success focus:ring-2 focus:ring-success/15"
          )}
        />
        {errors.email && (
          <p id="err-email" className="mt-1 text-xs text-destructive">
            {errors.email}
          </p>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground">
          هذا البريد يستقبل رابط الدخول وفاتورتك من مدونتي.
        </p>
      </div>

      <div>
        <label htmlFor="checkout-phone" className="mb-1.5 block text-[13px] font-semibold text-foreground">
          رقم الجوال
        </label>
        <div
          className={cn(
            "flex h-12 w-full items-stretch overflow-hidden rounded-lg border bg-background transition",
            errors.phone
              ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/25"
              : "border-border focus-within:border-success focus-within:ring-2 focus-within:ring-success/15"
          )}
        >
          <input
            id="checkout-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            placeholder={phonePlaceholder}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "err-phone" : undefined}
            className="flex-1 border-0 bg-transparent px-3.5 text-base text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <span
            className="inline-flex items-center border-s border-border bg-muted px-3 font-mono text-xs font-semibold text-muted-foreground"
            dir="ltr"
          >
            {countryCode}
          </span>
        </div>
        {errors.phone && (
          <p id="err-phone" className="mt-1 text-xs text-destructive">
            {errors.phone}
          </p>
        )}
      </div>

      <NGeniusMount
        ref={ngeniusRef}
        apiKey={ngeniusHostedSessionKey}
        outletRef={ngeniusOutletRef}
        language="ar"
      />
      {errors.card && (
        <p className="text-xs text-destructive">{errors.card}</p>
      )}

      {/* Cloudflare Turnstile — invisible mode. Runs silently in the background,
          no widget, no branding banner, no user friction. Escalates to a
          challenge only if the request looks bot-like. Token is verified
          server-side in /api/checkout/create-payment via lib/turnstile.ts. */}
      <Turnstile
        ref={turnstileRef}
        siteKey={turnstileSiteKey}
        options={{
          theme: "auto",
          language: "ar",
          size: "invisible",
          action: "checkout",
        }}
        onSuccess={(token) => {
          setTurnstileToken(token);
          setErrors((prev) => ({ ...prev, turnstile: undefined }));
        }}
        onExpire={() => setTurnstileToken(null)}
        onError={() => setTurnstileToken(null)}
      />
      {errors.turnstile && (
        <p className="text-center text-xs text-destructive">{errors.turnstile}</p>
      )}

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-success"
        />
        <span>
          أوافق على{" "}
          <a href="/terms" className="text-foreground underline underline-offset-2">
            الشروط والأحكام
          </a>{" "}
          و{" "}
          <a href="/billing-policy" className="text-foreground underline underline-offset-2">
            سياسة الفوترة
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className={cn(
          "flex h-14 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-black transition-all",
          canSubmit
            ? "bg-foreground text-background shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--foreground)_45%,transparent)] hover:bg-foreground/90"
            : "cursor-not-allowed bg-muted text-muted-foreground"
        )}
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>جاري معالجة الدفع…</span>
          </>
        ) : (
          <>
            <span>ادفع الآن</span>
            <span className="font-mono" dir="ltr">· {totalDisplay}</span>
          </>
        )}
      </button>

      {errors.submit && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2 text-xs text-destructive text-center">
          {errors.submit}
        </p>
      )}

      <div className="flex items-center justify-center gap-2 rounded-lg border border-success/25 bg-success/5 px-3 py-2.5 text-center text-xs text-success">
        <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
        <span>تسليم من ٧٢ ساعة إلى ١٤ يوم — لو تأخّرنا، نمدّد اشتراكك مجاناً</span>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        باقتك <strong className="font-semibold text-foreground">{planName}</strong> · معالجة الدفع بمعيار PCI DSS
      </p>
    </form>
  );
}
