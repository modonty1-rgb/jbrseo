"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { CreditCard, AlertCircle, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Accepted payment brands — real logos live in /public/logos.
// Order chosen to lead with locally-familiar Mada for the SA visitor.
const BRANDS = [
  { name: "Mada", src: "/logos/mada.svg" },
  { name: "Visa", src: "/logos/visa.svg" },
  { name: "Mastercard", src: "/logos/mastercard.svg" },
  { name: "Apple Pay", src: "/logos/apple-pay.svg" },
];

/**
 * N-Genius Hosted Session mount — loads the SDK, mounts card input, and
 * exposes an imperative `generateSessionId` handle for the parent form's
 * submit flow. This is intentionally isolated in its own file so the SDK's
 * global-window side-effects don't leak into CheckoutForm.tsx.
 *
 * Docs: https://docs.ngenius-payments.com/docs/web-sdk-integration-guide
 */

type NGeniusSDK = {
  mountCardInput: (mountId: string, opts: {
    apiKey: string;
    outletRef: string;
    language?: string;
    style?: Record<string, unknown>;
    // Undocumented in the public SDK docs but observed to be honored by the
    // SDK at mount time — controls whether floating input labels render.
    showInputsLabel?: boolean;
    firstName?: string;
    lastName?: string;
    onSuccess?: () => void;
    onFail?: (err: unknown) => void;
    onChangeValidStatus?: (v: {
      isCVVValid: boolean;
      isExpiryValid: boolean;
      isNameValid: boolean;
      isPanValid: boolean;
    }) => void;
  }) => void;
  unMountCardInputs: () => void;
  generateSessionId: () => Promise<{ session_id: string }>;
  handlePaymentResponse: (
    response: unknown,
    opts?: { mountId: string; style: { width: number; height: number } },
  ) => Promise<{ status: string; error?: unknown }>;
  paymentStates: {
    AUTHORISED: string;
    CAPTURED: string;
    PURCHASED: string;
    FAILED: string;
    THREE_DS_FAILURE: string;
  };
};

declare global {
  interface Window {
    NI?: NGeniusSDK;
  }
}

const SDK_SRC = process.env.NEXT_PUBLIC_NGENIUS_SDK_URL
  ?? "https://paypage.sandbox.ksa.ngenius-payments.com/hosted-sessions/sdk.js";

const MOUNT_ID = "ngenius-card-mount";
const THREE_DS_MOUNT_ID = "ngenius-3ds-mount";

export type NGeniusHandle = {
  generateSessionId(): Promise<string>;
  handlePaymentResponse(response: unknown): Promise<{ status: string; success: boolean; is3DsFailure: boolean }>;
  isReady(): boolean;
  isCardValid(): boolean;
};

type Props = {
  apiKey: string;
  outletRef: string;
  language?: "ar" | "en";
};

export const NGeniusMount = forwardRef<NGeniusHandle, Props>(function NGeniusMount(
  { apiKey, outletRef, language = "ar" },
  ref,
) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardValid, setCardValid] = useState(false);
  // Toggles when the SDK activates the 3DS challenge iframe. We hide the card
  // fields and swap the header to a "verify with your bank" message so the
  // user isn't shown two payment surfaces at once.
  const [in3DS, setIn3DS] = useState(false);
  const readyRef = useRef(false);
  const cardValidRef = useRef(false);
  // Guards against React Strict Mode's dev double-effect from mounting two
  // iframes into the same container. In dev, the effect runs → cleanup → re-runs
  // synchronously; without this, the SDK stacks a second iframe on top of the first.
  const mountedRef = useRef(false);

  // Keep refs in sync so the imperative handle sees latest values.
  useEffect(() => { readyRef.current = ready; }, [ready]);
  useEffect(() => { cardValidRef.current = cardValid; }, [cardValid]);

  useImperativeHandle(ref, () => ({
    isReady: () => readyRef.current,
    isCardValid: () => cardValidRef.current,
    async generateSessionId() {
      if (!window.NI) throw new Error("N-Genius SDK not loaded");
      const { session_id } = await window.NI.generateSessionId();
      return session_id;
    },
    async handlePaymentResponse(response) {
      if (!window.NI) throw new Error("N-Genius SDK not loaded");
      // Enter 3DS mode — hides the card fields, swaps header to bank-verify.
      setIn3DS(true);
      // Size the 3DS challenge iframe generously — real bank challenge pages
      // vary in height (some show extra branding/text). 620px covers every
      // one I've seen in Sandbox + prod without inner scrollbars.
      const width = Math.min(window.innerWidth - 40, 500);
      let result;
      try {
        result = await window.NI.handlePaymentResponse(response, {
          mountId: THREE_DS_MOUNT_ID,
          style: { width, height: 620 },
        });
      } finally {
        setIn3DS(false);
      }
      const status = String(result.status ?? "");
      const s = window.NI.paymentStates;
      const success = status === s.AUTHORISED || status === s.CAPTURED || status === s.PURCHASED;
      const is3DsFailure = status === s.THREE_DS_FAILURE;
      return { status, success, is3DsFailure };
    },
  }), []);

  useEffect(() => {
    if (!apiKey || !outletRef) {
      setError("مفاتيح N-Genius غير مكتملة");
      return;
    }

    // Load SDK if not already present (survives HMR + strict-mode double mount).
    const existing = document.querySelector(`script[data-ngenius-sdk="1"]`);
    let script: HTMLScriptElement;

    function mount() {
      if (!window.NI?.mountCardInput) {
        setError("SDK loaded but window.NI.mountCardInput missing");
        return;
      }
      // Strict Mode guard — bail if a mount already happened this lifecycle.
      if (mountedRef.current) return;
      // Clear any leftover iframe from the SDK's own internals before mounting
      // (defensive; belt + braces with the ref guard above).
      const container = document.getElementById(MOUNT_ID);
      if (container) container.innerHTML = "";
      mountedRef.current = true;
      try {
        // Intentionally NOT passing `firstName` to the SDK. When we do, the
        // SDK pre-fills the cardholder-name field and locks it (disabled) —
        // fine when the subscriber IS the cardholder, wrong when a common
        // real-world case applies: someone paying with a family member's,
        // spouse's, employer's, or a corporate card. The subscriber's own
        // name still goes to Modonty as the account owner via our form's
        // `name` field; the cardholder name goes ONLY to N-Genius as the
        // person authorising this specific charge. Two different roles.
        window.NI.mountCardInput(MOUNT_ID, {
          apiKey,
          outletRef,
          language,
          // Style keys documented in the N-Genius Web SDK API reference — only
          // `main`, `base`, `input`, `invalid` are honoured. `showInputsLabel`
          // must live outside the `style` object per docs.
          style: {
            main: {
              width: "100%",
              minWidth: "260px",
              minHeight: "520px",
              overflow: "visible",
              boxSizing: "border-box",
            },
            base: {
              fontFamily: "inherit",
              color: "#0a0a0a",
            },
            // 16px prevents iOS Safari auto-zoom on focus. Height sized so
            // each field is easily tappable — SDK's default cramped one row.
            input: {
              padding: "12px 14px",
              fontSize: "16px",
              height: "44px",
              borderRadius: "10px",
              borderColor: "#e5e5e5",
              borderStyle: "solid",
              borderWidth: "1px",
              backgroundColor: "#ffffff",
            },
            invalid: { color: "#ef4444", borderColor: "#ef4444" },
          },
          showInputsLabel: true,
          onSuccess: () => {
            setReady(true);
            // The SDK caps iframe.style.height at 150px regardless of parent
            // size — verified by inspecting its bundle. Its internal doc is
            // taller (measured 209px for the 2-col wide layout, 285px for the
            // narrow stacked one), so at 150px the cardholder-name row lives
            // below the fold and is invisible.
            //
            // We override the SDK on the outer element, which is same-origin
            // and free to style. 220px covers the 2-col layout with zero empty
            // trailing space; the narrow-mobile fallback uses a media query
            // in tandem with the wrapper's own responsive rules.
            const iframe = document.querySelector<HTMLIFrameElement>(
              `#${MOUNT_ID} iframe`,
            );
            if (!iframe) return;
            const isNarrow = window.matchMedia("(max-width: 480px)").matches;
            iframe.style.height = isNarrow ? "320px" : "220px";
          },
          onFail: (err) => {
            setError(String((err as { message?: string })?.message ?? err));
            setReady(false);
          },
          onChangeValidStatus: (v) => {
            setCardValid(v.isCVVValid && v.isExpiryValid && v.isNameValid && v.isPanValid);
          },
        });
      } catch (e) {
        setError(String((e as { message?: string })?.message ?? e));
      }
    }

    if (existing) {
      // SDK already on page — just mount
      if (window.NI) mount();
      else existing.addEventListener("load", mount, { once: true });
    } else {
      script = document.createElement("script");
      script.src = SDK_SRC;
      script.async = true;
      script.dataset.ngeniusSdk = "1";
      script.onload = mount;
      script.onerror = () => setError("فشل تحميل بوابة الدفع");
      document.body.appendChild(script);
    }

    return () => {
      try { window.NI?.unMountCardInputs?.(); } catch { /* ignore */ }
      // Belt-and-braces: purge any residual iframe left behind and reset the guard
      // so a real remount (deps change, not Strict Mode) works cleanly.
      const container = document.getElementById(MOUNT_ID);
      if (container) container.innerHTML = "";
      mountedRef.current = false;
    };
  }, [apiKey, outletRef, language]);

  return (
    // Payment section is intentionally a LIGHT panel embedded in the dark page —
    // the "trust boundary" pattern used by Stripe Elements, Apple Pay Sheet, and
    // Shopify Pay. The N-Genius SDK renders white input fields inside its iframe
    // (unstyleable by us), so we lean into that instead of fighting it: a soft
    // ivory container signals "this is where money changes hands, secured
    // differently" and eliminates the dark-vs-white clash.
    <div className="rounded-2xl bg-neutral-50 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-neutral-200/80">
      {/* Header — dark text on light background, matches Stripe/shadcn look. */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900/5 text-neutral-800">
          <CreditCard className="h-4 w-4" strokeWidth={2.25} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-neutral-900">بيانات البطاقة</p>
          <p className="text-[10.5px] text-neutral-500">مشفّرة عبر بوابة N-Genius</p>
        </div>
        {!ready && !error && (
          <span className="text-[10.5px] font-medium text-neutral-500">جاري التحميل…</span>
        )}
        {ready && (
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" />
            جاهز
          </span>
        )}
      </div>

      {/* SDK mounts its iframe fields inside this div. We control size from the
          parent since the SDK writes `iframe.style="width:100%;height:100%"` —
          confirmed via SDK source. `min-h-80` = 320px = tallest field arrangement. */}
      {/* Wrapper is `relative` so the skeleton can sit absolutely on top of
          the mount slot until the SDK's iframe reports ready. The skeleton
          mirrors the SDK's post-layout shape (PAN full-width row, Expiry+CVV
          side-by-side, Name full-width) so there's no jarring shift when it
          swaps out. */}
      <div className="relative">
        <div
          id={MOUNT_ID}
          dir="ltr"
          className="w-full overflow-hidden rounded-xl bg-white"
          style={{ minHeight: 220 }}
        />

        {!ready && !error && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col gap-3 rounded-xl bg-white p-5"
          >
            <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-300" />
            <div className="flex gap-3">
              <div className="h-11 flex-1 animate-pulse rounded-lg bg-neutral-300" />
              <div className="h-11 flex-1 animate-pulse rounded-lg bg-neutral-300" />
            </div>
            <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-300" />
          </div>
        )}
      </div>

      {/* 3DS challenge — hand-rolled modal styled to match shadcn Dialog
          exactly (bg-card, border-border, backdrop-blur, animations) but
          WITHOUT Radix. Radix's `forceMount` triggers a global body lock
          (`pointer-events: none; overflow: hidden`) that stayed on even
          with `open=false`, freezing every input on the checkout page.
          This custom variant keeps the mount div in the DOM at all times
          (SDK can `getElementById` it) and only visually toggles the modal
          via opacity + pointer-events on the WRAPPER — no body-level lock. */}
      <div
        role="dialog"
        aria-modal={in3DS}
        aria-labelledby="ngenius-3ds-title"
        aria-hidden={!in3DS}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm transition-opacity duration-200",
          in3DS ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className={cn(
            "w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-transform duration-200 sm:max-w-lg",
            in3DS ? "scale-100" : "scale-95",
          )}
        >
          <div className="flex items-center gap-2.5 border-b border-border p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <div className="flex-1 text-start">
              <p id="ngenius-3ds-title" className="text-[14px] font-bold leading-tight text-foreground">
                التحقّق من بنكك
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                أدخل رمز التحقق (OTP) لإتمام الدفع
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600">
              <Loader2 className="h-3 w-3 animate-spin" strokeWidth={3} />
              قيد التحقق
            </span>
          </div>
          {/* SDK's 3DS 2.0 iframe uses width:100%;height:100%, so parent
              sizing decides the visible area. 560px covers every bank
              challenge page I've seen in Sandbox + prod. */}
          <div
            id={THREE_DS_MOUNT_ID}
            style={{ height: 560 }}
            className="w-full overflow-hidden bg-white"
          />
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold mb-0.5">خطأ في بوابة الدفع</p>
            <p className="text-red-600/90">{error}</p>
          </div>
        </div>
      )}

      {/* Trust bar — accepted brands centered as the visual anchor, security
          info below in muted text. Icons only (no text names) — Khalid's call.
          Centering the brand row makes it feel like a proper "accepted here" strip. */}
      <div className="mt-4 flex flex-col items-center gap-2 border-t border-neutral-200 pt-3">
        <div className="inline-flex items-center gap-2">
          {BRANDS.map((brand) => (
            <span
              key={brand.name}
              className="inline-flex items-center justify-center rounded-md border border-neutral-200 bg-white px-2 py-1.5"
              title={brand.name}
              aria-label={brand.name}
            >
              <Image
                src={brand.src}
                alt={brand.name}
                width={32}
                height={20}
                className="h-5 w-auto object-contain"
                unoptimized
              />
            </span>
          ))}
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-neutral-600">
          <Lock className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
          <span>تشفير SSL 256-bit</span>
          <span className="text-neutral-300">·</span>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
          <span>PCI DSS</span>
        </div>
      </div>
    </div>
  );
});
