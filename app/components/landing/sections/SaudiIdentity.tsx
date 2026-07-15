import Image from "next/image";
import { COMPANY } from "@/lib/company";

/** Saudi identity / CR card. Static. No state, server-ready. */
export function SaudiIdentity() {
  return (
    <section
        className="bg-background"
      >
        <div className="max-w-230 mx-auto px-7 py-8 md:py-14">
          {/* Section title */}
          <div className="text-center mb-5 md:mb-8">
            <div className="inline-flex flex-wrap justify-center text-center items-center gap-2 font-mono text-[11px] text-success tracking-[1px] mb-3 bg-success/10 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              من نحن — بشفافية كاملة
            </div>
            <h2 className="text-balance text-[clamp(20px,5.8vw,38px)] font-semibold tracking-[-1px]">
              شركة سعودية <span className="text-success">مسجّلة رسمياً</span>
            </h2>
            {/* Mobile brevity: eyebrow + H2 carry it; details read on desktop. */}
            <p className="hidden md:block text-[14px] text-muted-foreground max-w-140 mx-auto mt-2 leading-[1.7]">
              كل تفاصيلنا القانونية معلنة — تقدر تتحقّق منها بجوالك في ٣٠ ثانية عبر بوّابة وزارة التجارة السعودية.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header — brand relationship + verified badge (single row) */}
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-b-border bg-gradient-to-l from-transparent to-success/5">
              <span className="text-[13px] font-medium text-muted-foreground truncate">المشغّل الرسمي لمنصة مدونتي</span>
              <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l5 5L20 7" />
                </svg>
                موثّق
              </div>
            </div>

            {/* Body — flex-col so we can reorder on mobile (address above cert) vs desktop (cert first) */}
            <div className="p-5 md:p-7 flex flex-col">
              {/* Legal entity + compact badges */}
              <div className="order-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10.5px] font-mono text-muted-foreground tracking-wide">الكيان القانوني</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/25 px-2 py-0.5 text-[10px] font-semibold text-success">
                    <span className="w-1 h-1 rounded-full bg-success" />
                    نشط
                  </span>
                </div>
                <div className="text-[17px] md:text-[20px] font-semibold text-foreground leading-[1.25] tracking-[-.2px]">
                  {COMPANY.legalName}
                </div>
                {/* Compact 3-cell key/value grid — same width on mobile & desktop */}
                <dl className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-border bg-background/40 px-1.5 py-2 text-center overflow-hidden">
                    <dt className="text-[9.5px] font-mono text-muted-foreground tracking-wide leading-none">الرقم الموحّد</dt>
                    <dd className="text-[11px] md:text-[12.5px] font-mono font-semibold text-foreground mt-1.5 leading-none whitespace-nowrap">
                      <bdi dir="ltr">{COMPANY.unifiedNumber}</bdi>
                    </dd>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 px-1.5 py-2 text-center overflow-hidden">
                    <dt className="text-[9.5px] font-mono text-muted-foreground tracking-wide leading-none">رأس المال</dt>
                    <dd className="text-[11px] md:text-[12.5px] font-semibold text-foreground mt-1.5 leading-none whitespace-nowrap">
                      {COMPANY.capital} ﷼
                    </dd>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 px-1.5 py-2 text-center overflow-hidden">
                    <dt className="text-[9.5px] font-mono text-muted-foreground tracking-wide leading-none">تأسست</dt>
                    <dd className="text-[11px] md:text-[12.5px] font-mono font-semibold text-foreground mt-1.5 leading-none whitespace-nowrap">
                      {COMPANY.foundedGregorian}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Google Maps address — mobile: one-line "جدة، السعودية" with the
                  official multicolor Maps pin; desktop: full street address. */}
              <a
                href="https://www.google.com/maps?q=21.502370834350586,39.1859245300293"
                target="_blank"
                rel="noopener noreferrer"
                className="group order-2 md:order-4 mt-4 md:mt-6 flex items-center md:items-start gap-2.5 md:gap-3 pt-4 md:pt-5 border-t border-t-border/60 hover:opacity-90 transition-opacity"
                aria-label="افتح موقع الشركة على خرائط جوجل"
              >
                <span className="shrink-0 inline-flex items-center justify-center md:mt-0.5 md:w-9 md:h-9 md:rounded-lg md:bg-white md:shadow-sm">
                  {/* Official Google Maps pin (brand colors, original geometry) */}
                  <svg width="16" height="22" viewBox="0 0 92.3 132.3" xmlns="http://www.w3.org/2000/svg" aria-hidden className="md:w-[15px] md:h-[21px]">
                    <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"/>
                    <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-33.3-21.8-18.3z"/>
                    <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.6 27.5-32.7-5.6-10.8-15.3-19-27-22.7L32.6 34.8c3.3-3.8 8.1-6.3 13.6-6.3"/>
                    <path fill="#fbbc04 " d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 33.3c4.8 10.6 12.8 19.2 21 29.9l34.1-40.5c-3.3 3.9-8.1 6.3-13.5 6.3"/>
                    <path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L25.6 98c2.6 3.4 5.3 7.3 7.9 11.3 9.4 14.5 6.8 23.1 12.8 23.1s3.4-8.7 12.8-23.2"/>
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <div className="hidden md:block text-[10.5px] text-muted-foreground font-mono tracking-wide leading-none mb-1">العنوان — اضغط للفتح في خرائط جوجل</div>
                  <div className="text-[13px] font-medium text-foreground leading-[1.6] group-hover:text-success transition-colors truncate md:whitespace-normal">
                    <span className="md:hidden">جدة، المملكة العربية السعودية</span>
                    <span className="hidden md:inline">شارع أبو بكر الصديق · حي الشرفية · جدة · المملكة العربية السعودية</span>
                  </div>
                </div>
                <span className="shrink-0 text-muted-foreground group-hover:text-success transition-colors md:mt-1.5">↗</span>
              </a>

              {/* Certificate image — DESKTOP ONLY (2026-07-15 decision): even a
                  1290px JPEG corrupted GPU raster tiles on older Android phones.
                  Mobile identity is conveyed by the legal info + verifiable CR
                  number; desktop gets the visual certificate. */}
              <div className="hidden md:block order-3 md:order-2 mt-6 bg-white rounded-xl p-3 sm:p-4 shadow-sm ring-1 ring-border/50">
                <Image
                  src={COMPANY.crCertificatePath}
                  alt={`شهادة السجل التجاري الرسمية من وزارة التجارة السعودية · الرقم الموحّد ${COMPANY.unifiedNumber} · تاريخ الإصدار ${COMPANY.certificateIssuedAt}`}
                  width={1290}
                  height={911}
                  className="block w-full h-auto rounded-lg"
                  sizes="860px"
                  priority={false}
                />
              </div>
              <p className="hidden md:block order-4 md:order-3 mt-2.5 text-center text-[12px] text-muted-foreground leading-[1.6]">
                شهادة السجل التجاري الرسمية · <span className="text-foreground font-semibold">امسح الـ QR بجوالك</span> للتحقّق المباشر من وزارة التجارة السعودية
              </p>
            </div>

          </div>
        </div>
      </section>
  );
}
