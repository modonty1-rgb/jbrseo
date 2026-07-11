"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { PaymentPlaceholder } from "./PaymentPlaceholder";

type Props = {
  country: SupportedCountry;
  planSlug: string;
  planName: string;
  billing: "monthly" | "annual";
  totalDisplay: string;
};

type Errors = Partial<Record<"name" | "email" | "phone", string>>;

export function CheckoutForm({ country, planName, totalDisplay }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstField = Object.keys(next)[0];
      document.getElementById(`checkout-${firstField}`)?.focus();
      return;
    }
    // Stage 3 will attach N-Genius Hosted Session here.
  }

  const canSubmit =
    termsAccepted &&
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0;

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
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
            "h-12 w-full rounded-lg border bg-background px-3.5 text-[14.5px] text-foreground shadow-none outline-none transition placeholder:text-muted-foreground/70",
            errors.name
              ? "border-destructive focus:ring-2 focus:ring-destructive/25"
              : "border-border focus:border-success focus:ring-2 focus:ring-success/15"
          )}
        />
        {errors.name && (
          <p id="err-name" className="mt-1 text-[12px] text-destructive">
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
            "h-12 w-full rounded-lg border bg-background px-3.5 text-[14.5px] text-foreground shadow-none outline-none transition placeholder:text-muted-foreground/70",
            errors.email
              ? "border-destructive focus:ring-2 focus:ring-destructive/25"
              : "border-border focus:border-success focus:ring-2 focus:ring-success/15"
          )}
        />
        {errors.email && (
          <p id="err-email" className="mt-1 text-[12px] text-destructive">
            {errors.email}
          </p>
        )}
        <p className="mt-1.5 text-[11.5px] text-muted-foreground">
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
            className="flex-1 border-0 bg-transparent px-3.5 text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <span
            className="inline-flex items-center border-s border-border bg-muted px-3 font-mono text-[12.5px] font-semibold text-muted-foreground"
            dir="ltr"
          >
            {countryCode}
          </span>
        </div>
        {errors.phone && (
          <p id="err-phone" className="mt-1 text-[12px] text-destructive">
            {errors.phone}
          </p>
        )}
      </div>

      <PaymentPlaceholder />

      <label className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground">
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
            سياسة الاسترداد ١٤ يوم
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
        <span>ادفع الآن</span>
        <span className="font-mono" dir="ltr">
          · {totalDisplay}
        </span>
      </button>

      <div className="flex items-center justify-center gap-2 rounded-lg border border-success/25 bg-success/5 px-3 py-2.5 text-center text-[12px] text-success">
        <span aria-hidden>🛡️</span>
        <span>استرداد ١٤ يوم مضمون — إذا لم نلتزم بإعداد حسابك</span>
      </div>

      <p className="text-center text-[11.5px] text-muted-foreground">
        باقتك <strong className="font-semibold text-foreground">{planName}</strong> · معالجة الدفع بمعيار PCI DSS
      </p>
    </form>
  );
}
