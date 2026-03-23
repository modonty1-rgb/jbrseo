"use client";

import { useEffect, type ReactElement } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getWhatsAppLink } from "@/lib/site-links";

export default function CountrySignupThankYouPage(): ReactElement | null {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  let raw: string | undefined;
  const countryParam = params.country;
  if (typeof countryParam === "string") {
    raw = countryParam;
  } else if (Array.isArray(countryParam) && countryParam[0] !== undefined) {
    raw = countryParam[0];
  }
  const slug = raw?.toLowerCase();
  const countrySlug = isSupportedCountrySlug(slug) ? slug : null;

  const preview = searchParams.get("country")?.toLowerCase();
  const previewQuery =
    preview === "sa" || preview === "eg" ? `?country=${preview}` : "";
  const homeHref = countrySlug ? `/${countrySlug}${previewQuery}` : "/";
  const waHref = countrySlug
    ? getWhatsAppLink(getCountryCodeFromSlug(countrySlug))
    : "";

  useEffect(() => {
    if (!countrySlug) return;
    const submitted = sessionStorage.getItem("jbrseo_signup_submitted");
    if (!submitted) {
      router.replace(`/${countrySlug}/signup${previewQuery}`);
      return;
    }
    const clearKey = window.setTimeout(() => {
      sessionStorage.removeItem("jbrseo_signup_submitted");
    }, 100);
    return () => {
      window.clearTimeout(clearKey);
    };
  }, [router, countrySlug, previewQuery]);

  if (!countrySlug) {
    return null;
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden px-4 py-20 flex justify-center items-center landing-grain">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 start-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 end-1/4 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-success/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-success/15 border-2 border-success/40 flex items-center justify-center shadow-lg shadow-success/20">
              <svg
                viewBox="0 0 52 52"
                className="h-12 w-12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <circle cx="26" cy="26" r="25" className="stroke-success" strokeWidth="2" fill="none" />
                <path
                  className="stroke-success"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  d="M14 27l9 9 15-16"
                />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full bg-success/10 animate-ping" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">
            تم الاستلام بنجاح
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            وصلنا طلبك — يلا نبدأ
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            استلمنا بياناتك وسيتواصل معك فريقنا خلال ٢٤ ساعة.
          </p>
        </div>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-lg text-start">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">ما الذي يحدث بعد ذلك؟</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {[
              "نراجع طلبك ونطابقه مع الخطة التي اخترتها",
              "سيتواصل معك فريقنا خلال ٢٤ ساعة لتفعيل خطتك",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* TODO: Remove after payment gateway setup */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-6 text-right">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            لتفعيل اشتراكك، أرسل المبلغ المحدد على الحساب التالي:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground font-medium">SA3100000000300001687908</span>
              <span className="text-muted-foreground">رقم IBAN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground font-medium">00300001687908</span>
              <span className="text-muted-foreground">رقم الحساب</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground font-medium">شركة جبر سيو</span>
              <span className="text-muted-foreground">اسم الحساب</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground font-medium">البنك الأهلي السعودي</span>
              <span className="text-muted-foreground">البنك</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            بعد التحويل، أرسل صورة الإيصال على واتساب وسنفعّل حسابك خلال ساعات العمل.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200"
          >
            <Link href={waHref} target="_blank" rel="noopener noreferrer">
              تواصل معنا على واتساب
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-200"
          >
            <Link href={homeHref}>العودة للرئيسية</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
