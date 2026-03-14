import Link from "@/app/components/link";
import { Button } from "@/app/components/ui/button";
import type { Metadata } from "next";
import {
  isSupportedCountrySlug,
} from "@/lib/country-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return { title: "شكراً — JBRSEO" };
  }
  return {
    title: "شكراً لتسجيلك",
    description: "استلمنا بياناتك وسنتواصل معك قريباً.",
    robots: { index: false, follow: false },
  };
}

export default async function CountrySignupThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ country?: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return null;
  }
  const countrySlug = slug as "sa" | "eg";
  const sp = await searchParams;
  const preview = sp?.country?.toLowerCase();
  const previewQuery = preview === "sa" || preview === "eg" ? `?country=${preview}` : "";
  const homeHref = `/${countrySlug}${previewQuery}`;

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
            شكراً لتسجيلك!
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            استلمنا بياناتك وسنتواصل معك قريباً عند تفعيل التسجيل الكامل.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 text-start space-y-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">ما الذي يحدث بعد ذلك؟</p>
          <ul className="space-y-2.5">
            {[
              "ستصلك رسالة تأكيد على بريدك الإلكتروني",
              "سيتواصل معك فريقنا خلال 24 ساعة",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[11px] font-bold text-accent">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center">
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
