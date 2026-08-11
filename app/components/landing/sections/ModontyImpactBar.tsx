import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { ModontyImpactStats } from "@/lib/analytics/ga4";
import { GAMark } from "@/app/components/icons/GAMark";

type Props = { impact: ModontyImpactStats; bare?: boolean };

/** Platform-wide GA4 impact numbers for Modonty. Static content, server-ready. */
export function ModontyImpactBar({ impact, bare = false }: Props) {
  /**
   * `bare` drops this component's own section chrome — its wrapper, its padding and its
   * heading — so it can sit inside a shared proof section.
   *
   * It carried the eyebrow "لايف من Google Analytics" directly below a section whose
   * eyebrow read "أرقام حقيقية من Google Analytics": the same sentence twice, 127px of
   * heading and 112px of padding spent saying it again. Both blocks are the same claim
   * measured two ways, and one heading is enough for both.
   */
  const Wrapper = bare ? "div" : "section";
  return (
    <Wrapper className={bare ? undefined : "bg-background"}>
          <div className={bare ? "" : "max-w-270 mx-auto px-5 md:px-7 py-6 md:py-10"}>
            {!bare && (
            <div className="text-center mb-5 md:mb-8">
              <div className="inline-flex flex-wrap justify-center text-center items-center gap-2 text-[11px] text-success mb-3 bg-success/10 px-3 py-1.5 rounded-full">
                <GAMark className="w-3.5 h-3.5 shrink-0" />
                لايف من Google Analytics<span className="hidden md:inline"> · يتحدّث كل ٥ دقائق</span>
              </div>
              <h2 className="text-balance text-[clamp(20px,5.8vw,38px)] font-semibold">
                مدونتي بالأرقام — <span className="text-success">لايف الآن</span>
              </h2>
              <p className="hidden md:block text-[14px] text-muted-foreground mt-2">
                هذي كل الأثر الرقمي عبر منصة مدونتي — تراكمياً منذ الإطلاق. تقدر تتحقّق من الأرقام مباشرة على الموقع.
              </p>
            </div>
            )}

            <div className="rounded-2xl border border-border bg-gradient-to-br from-foreground to-[color-mix(in_oklch,var(--foreground)_88%,var(--success))] text-background overflow-hidden md:shadow-[0_30px_60px_-30px_color-mix(in_oklch,var(--foreground)_60%,transparent)]">
              <div className="grid grid-cols-1 md:grid-cols-[1.4fr_2fr_auto] divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-background/10">

                {/* Grand total hero */}
                <div className="flex flex-col items-center justify-center px-6 py-8">
                  <div className="font-mono text-[clamp(32px,10.0vw,52px)] md:text-[64px] font-black leading-none text-background">
                    {impact.grandTotal.toLocaleString("en-US")}
                  </div>
                  {/* Mono is for the figure above it, not for the Arabic under it. */}
                  <div className="mt-2 text-[11.5px] text-background/60">الأثر الرقمي</div>
                </div>

                {/* Secondary stats — folded on phones.
                    This bar measured 730px at 390×844, half again the height of the client
                    story it sits under, and it is the least decision-relevant block in the
                    section: these are the platform's totals, not this customer's results.
                    The grand total above carries the claim on its own; the breakdown is
                    what a sceptic opens, not what a browser needs. `sm:contents` drops the
                    wrapper from the layout above 640px so the original grid is untouched
                    on desktop, and native <details> keeps every figure in the server HTML
                    open or shut — the content parity Google asks for when you move things
                    into an accordion on mobile. */}
                <details className="group sm:contents">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-1.5 border-t border-t-background/10 text-[12.5px] font-semibold text-background/80 sm:hidden [&::-webkit-details-marker]:hidden">
                    تفاصيل الأرقام
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" strokeWidth={2.5} aria-hidden />
                  </summary>
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-x-reverse divide-background/10">
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{impact.users.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[11.5px] text-background/70">مستخدم</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{impact.sessions.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[11.5px] text-background/70">جلسة</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{impact.pageViews.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[11.5px] text-background/70">مشاهدة</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 px-2">
                    <div className="font-mono text-[20px] md:text-[22px] font-bold text-background">{impact.interactions.toLocaleString("en-US")}</div>
                    <div className="mt-1 text-[11.5px] text-background/70">تفاعل حقيقي</div>
                  </div>
                </div>
                </details>

                {/* Google trust anchor */}
                <div className="flex flex-col items-center justify-center gap-2 bg-background/[0.04] px-6 py-5 min-w-35">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <p className="text-center text-[11.5px] leading-[1.5] text-background/70">
                    موثّق من<br />
                    <span className="font-semibold text-background/80">Google Analytics</span>
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/15 px-2 py-0.5 text-[11.5px] font-bold text-success">
                    ✓ بيانات حقيقية
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-[12px] text-muted-foreground mb-4">
                <span>معرّف الحساب: <span className="font-mono" dir="ltr">538167732</span></span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>تحقّق بنفسك من مصدرين مستقلّين ↓</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-180 mx-auto items-stretch">
                <a
                  href="https://datastudio.google.com/s/nBnyGkiUdGw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group h-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-success/40 transition-all px-5 py-4 text-foreground"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8 shrink-0" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {/* `text-start`, not `text-right`, and the Latin name moved out of the
                      Arabic line. "تقرير Google" switched script mid-line; the product
                      names now sit together on the second line, which is where Latin
                      belongs on an Arabic page. */}
                  <div className="text-start">
                    <div className="text-[14px] font-semibold leading-[1.4]">التقرير المباشر</div>
                    <div className="mt-0.5 text-[11px] leading-[1.5] text-muted-foreground">Google Looker Studio</div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-success transition-colors">↗</span>
                </a>
                <a
                  href="https://www.modonty.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group h-full flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-muted hover:border-success/40 transition-all px-5 py-4 text-foreground"
                >
                  <span
                    className="relative shrink-0 inline-flex items-center justify-center bg-white rounded-lg w-28 h-8 px-2 py-1"
                  >
                    <Image
                      src="https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto,w_240/v1769683590/modontyLogo_ftf4yf.png"
                      alt="Modonty"
                      fill
                      sizes="112px"
                      className="object-contain p-1"
                    />
                  </span>
                  {/* `text-start` — the sibling card above already uses it; this one was
                      left on the physical property. */}
                  <div className="text-start">
                    <div className="text-[14px] font-semibold leading-tight">منصة مدونتي</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">الموقع الرسمي</div>
                  </div>
                  <span className="text-muted-foreground group-hover:text-success transition-colors">↗</span>
                </a>
              </div>
            </div>
          </div>
        </Wrapper>
  );
}
