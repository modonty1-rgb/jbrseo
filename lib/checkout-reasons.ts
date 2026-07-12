// Payment failure reason → friendly Arabic explanation.
// Shared between /checkout (inline banner) and /checkout/failed (full page).
// Aligned with N-Genius normalized response codes + Stripe-style patterns.

export type FailureReason = {
  title: string;
  hint: string;
  /** If true → recoverable in-place; show inline banner and let user retry.
   *  If false → serious; redirect to /failed page (fraud, technical, permanent). */
  recoverable: boolean;
};

export const CHECKOUT_REASONS: Record<string, FailureReason> = {
  card_declined:         { title: "البطاقة مرفوضة من البنك",       hint: "جرّب بطاقة أخرى أو تواصل مع بنكك للتحقق من التصريح",                recoverable: true  },
  insufficient_funds:    { title: "الرصيد غير كافٍ",                hint: "تحقق من رصيد البطاقة أو جرّب بطاقة ثانية",                        recoverable: true  },
  card_expired:          { title: "البطاقة منتهية الصلاحية",         hint: "استخدم بطاقة سارية",                                              recoverable: true  },
  authentication_failed: { title: "فشل التحقق (OTP / 3D Secure)",    hint: "تأكد من إدخال رمز التحقق الصحيح · قد يكون الرمز انتهت صلاحيته",   recoverable: true  },
  invalid_card:          { title: "بيانات البطاقة غير صحيحة",        hint: "تأكد من رقم البطاقة، تاريخ الانتهاء، ورمز CVV",                   recoverable: true  },
  cancelled_by_user:     { title: "أُلغيت العملية",                  hint: "لم يُخصم أي مبلغ. يمكنك المحاولة مرة أخرى",                       recoverable: true  },
  timeout:               { title: "انتهت مهلة الدفع",                hint: "لم يكتمل التحقق في الوقت المطلوب. أعد المحاولة",                  recoverable: true  },
  // Serious — go to /failed
  fraud_suspected:       { title: "تم إيقاف العملية لأسباب أمنية",   hint: "لحمايتك، البنك أوقف هذه العملية. تواصل مع بنكك أو معنا",         recoverable: false },
  network_error:         { title: "خطأ في الاتصال",                 hint: "أعد المحاولة بعد التأكد من اتصالك بالإنترنت",                    recoverable: false },
  system_error:          { title: "خطأ تقني عندنا",                 hint: "المشكلة من عندنا، مو منك. تواصل مع الدعم — سنساعدك فوراً",        recoverable: false },
};

export const DEFAULT_REASON: FailureReason = {
  title: "لم يكتمل الدفع",
  hint: "لم يُخصم أي مبلغ من بطاقتك. يمكنك إعادة المحاولة",
  recoverable: true,
};

export function resolveReason(code: string | null | undefined): FailureReason {
  if (!code) return DEFAULT_REASON;
  return CHECKOUT_REASONS[code.trim().toLowerCase()] ?? DEFAULT_REASON;
}

// After this many failed attempts on the same plan, force the user to /failed
// with an escape valve (WhatsApp support) — prevents infinite retry loops.
export const MAX_INLINE_RETRIES = 3;
