"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { AlertCircle, Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { cn } from "@/lib/utils";
import type { PlanDuration } from "@/lib/pricing-durations";

/**
 * The Tamara half of checkout.
 *
 * It is a separate form from the card one on purpose. Tamara never sees a card number
 * here — the customer is handed to Tamara's own pages and comes back — so this file has
 * no payment SDK, no 3DS, no session handshake and none of the timeouts those need. That
 * absence is the reason it exists rather than a branch inside `CheckoutForm.tsx`, which
 * is the single file every riyal on this site passes through.
 *
 * The contact fields are duplicated rather than shared. That is a real cost and worth
 * naming: a change to validation has to be made twice. It buys the card flow staying
 * untouched, which was the point — and the two forms collect the same four things, so
 * the day either grows a fifth, extracting a shared field set becomes the cheaper move.
 */

type Props = {
  planSlug: string;
  planName: string;
  duration: PlanDuration;
  totalDisplay: string;
  countrySlug: string;
  turnstileSiteKey: string;
};

type Errors = Partial<Record<"name" | "email" | "phone" | "terms" | "turnstile" | "submit", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TamaraForm({
  planSlug,
  planName,
  duration,
  totalDisplay,
  countrySlug,
  turnstileSiteKey,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "اكتب اسمك";
    if (!email.trim()) next.email = "اكتب بريدك";
    else if (!EMAIL_RE.test(email.trim())) next.email = "البريد مو مضبوط";
    if (!phone.trim()) next.phone = "اكتب رقم جوالك";
    else if (phone.replace(/\D/g, "").length < 9) next.phone = "الرقم ناقص";
    if (!termsAccepted) next.terms = "لازم توافق على الشروط";
    if (!turnstileToken) next.turnstile = "أكمل التحقق الأمني";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = Object.keys(next).find((k) => !["terms", "turnstile", "submit"].includes(k));
      if (first) document.getElementById(`tamara-${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/tamara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          name: name.trim(),
          email: email.trim(),
          phone: phone.replace(/[\s-]/g, ""),
          plan: planSlug,
          duration,
          country: countrySlug.toUpperCase(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Tamara's own wording is written for a developer; the customer gets the one
        // thing they can act on. The specific code is already in our failure log.
        setErrors({
          submit:
            body?.error === "rate-limited"
              ? "محاولات كثيرة بسرعة. انتظر دقيقة وجرّب."
              : body?.error === "bot-check-failed"
                ? "التحقق الأمني ما نجح. حدّث الصفحة وجرّب."
                : // Tamara refused this customer before we created anything. The wording
                  // says whose decision it was and points at the door that is still open,
                  // because the alternative — a vague failure — reads as our system
                  // breaking and sends the customer away instead of to the card form.
                  body?.error === "tamara-not-eligible"
                  ? "تمارا ما وافقت على التقسيط لهذا الطلب. تقدر تكمّل بالبطاقة من الرابط تحت."
                  : "تعذّر فتح تمارا الآن. جرّب بعد شوي أو ادفع بالبطاقة.",
        });
        setSubmitting(false);
        return;
      }

      const { checkoutUrl } = (await res.json()) as { checkoutUrl?: string };
      if (!checkoutUrl) {
        setErrors({ submit: "تعذّر فتح تمارا الآن. جرّب بعد شوي أو ادفع بالبطاقة." });
        setSubmitting(false);
        return;
      }

      // Full navigation, not a router push: the destination is Tamara's domain.
      // `submitting` stays true so the button cannot be pressed twice while the
      // browser is on its way out.
      window.location.href = checkoutUrl;
    } catch {
      setErrors({ submit: "فيه مشكلة في الاتصال. تأكد من الشبكة وجرّب." });
      setSubmitting(false);
    }
  }

  const field = (hasError: boolean) =>
    cn(
      "h-12 w-full rounded-lg border bg-background px-3.5 text-base text-foreground outline-none transition",
      "placeholder:text-muted-foreground/70",
      hasError
        ? "border-destructive focus:ring-2 focus:ring-destructive/25"
        : "border-border focus:border-success focus:ring-2 focus:ring-success/15",
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <label htmlFor="tamara-name" className="mb-1.5 block text-sm font-semibold">
          الاسم
        </label>
        <input
          id="tamara-name"
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
          }}
          placeholder="اسمك الكامل"
          aria-invalid={!!errors.name}
          className={field(!!errors.name)}
        />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="tamara-email" className="mb-1.5 block text-sm font-semibold">
          البريد الإلكتروني
        </label>
        <input
          id="tamara-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          dir="ltr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          className={cn(field(!!errors.email), "text-start")}
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="tamara-phone" className="mb-1.5 block text-sm font-semibold">
          الجوال
        </label>
        <input
          id="tamara-phone"
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
          placeholder="05xxxxxxxx"
          aria-invalid={!!errors.phone}
          className={field(!!errors.phone)}
        />
        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
        {/* Tamara sends the verification code here, so a wrong number is a dead end
            rather than a fixable mistake later in their flow. */}
        <p className="mt-1 text-xs text-muted-foreground">تمارا بترسل لك رمز تحقق على هذا الرقم.</p>
      </div>

      <div className="flex justify-center">
        <Turnstile
          siteKey={turnstileSiteKey}
          options={{ theme: "auto", language: "ar", size: "flexible", action: "checkout-tamara" }}
          onSuccess={(token) => {
            setTurnstileToken(token);
            setErrors((p) => ({ ...p, turnstile: undefined }));
          }}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
        />
      </div>
      {errors.turnstile && <p className="text-center text-xs text-destructive">{errors.turnstile}</p>}

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => {
            setTermsAccepted(e.target.checked);
            if (errors.terms) setErrors((p) => ({ ...p, terms: undefined }));
          }}
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
          ، وعلى شروط تمارا لخطة التقسيط.
        </span>
      </label>
      {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

      {errors.submit && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Clickable even when incomplete — a silently disabled button leaves the customer
          with no way to learn what is missing. A press always runs validation and points
          at the specific field. */}
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "flex h-14 w-full items-center justify-center gap-2.5 rounded-xl text-[15px] font-black transition-all",
          submitting
            ? "cursor-wait bg-muted text-muted-foreground"
            : "bg-foreground text-background hover:opacity-90",
        )}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span>جاري التحويل لتمارا…</span>
          </>
        ) : (
          <>
            <span>أكمل مع</span>
            <span className="flex h-8 items-center justify-center rounded-md bg-white px-2 ring-1 ring-black/5">
              <Image
                src="/logos/tamara.svg"
                alt="تمارا"
                width={97}
                height={29}
                unoptimized
                style={{ height: 22, width: "auto" }}
              />
            </span>
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-muted-foreground">
        بتكمّل الدفع على صفحة تمارا، وترجع هنا بعد التأكيد. إجمالي {totalDisplay} لباقة {planName}.
      </p>
    </form>
  );
}
