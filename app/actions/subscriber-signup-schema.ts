import { z } from "zod";

function saLocalFromDigits(d: string): string {
  if (d.startsWith("966") && d.length >= 12) return d.slice(3);
  if (d.length === 9 && d.startsWith("5")) return d;
  return d;
}

function egLocalFromDigits(d: string): string {
  if (d.startsWith("20") && d.length >= 12) return d.slice(2);
  return d;
}

const signupBaseSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  plan: z.coerce.number().int().min(0),
  planName: z.string().min(1, "الخطة مطلوبة"),
  country: z.enum(["SA", "EG"]),
  isAnnual: z.boolean(),
});

export const signupSchema = signupBaseSchema.superRefine((data, ctx) => {
  const d = data.phone.replace(/\D/g, "");
  if (data.country === "SA") {
    const local = saLocalFromDigits(d);
    if (!/^5\d{8}$/.test(local)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "رقم الجوال غير صحيح — يجب أن يبدأ بـ 5 ويتكون من 9 أرقام",
        path: ["phone"],
      });
    }
  } else {
    const local = egLocalFromDigits(d);
    if (!/^01\d{8,9}$/.test(local)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "رقم الجوال غير صحيح",
        path: ["phone"],
      });
    }
  }
});

export type SignupSchemaInput = z.input<typeof signupBaseSchema>;

export function parseSignupFormData(formData: FormData): SignupSchemaInput {
  const businessNameRaw = (formData.get("businessName") as string)?.trim();
  const businessTypeRaw = (formData.get("businessType") as string)?.trim();
  const countryRaw = (formData.get("country") as string)?.trim() ?? "SA";
  return {
    name: (formData.get("name") as string)?.trim() ?? "",
    email: (formData.get("email") as string)?.trim() ?? "",
    phone: (formData.get("phone") as string)?.trim() ?? "",
    businessName: businessNameRaw === "" ? undefined : businessNameRaw,
    businessType: businessTypeRaw === "" ? undefined : businessTypeRaw,
    plan: formData.get("planIndex"),
    planName: (formData.get("planName") as string)?.trim() ?? "",
    country: countryRaw === "EG" ? "EG" : "SA",
    isAnnual: formData.get("isAnnual") === "true" || formData.get("isAnnual") === "on",
  };
}
