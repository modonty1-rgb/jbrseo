import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import {
  LayoutDashboard,
  AlertTriangle,
  TrendingUp,
  FileText,
  Users,
  ShieldCheck,
  BadgeCheck,
  Palette,
  Megaphone,
  Grid3x3,
  Search,
  BarChart3,
  Image as ImageIcon,
  MessagesSquare,
  Handshake,
  Rocket,
  Stethoscope,
  Scale,
  Wallet,
  CreditCard,
  Bell,
  Flame,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { getAllPlans } from "@/app/actions/pricing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { featuresCatalog } from "@/lib/features-catalog.mjs";
import { getWhatsAppLink } from "@/lib/site-links";
import { siteOgImages } from "@/lib/getGlobalSeo";
import {
  buildPageJsonLd,
  DEFAULT_PUBLIC_SITE_ORIGIN,
  PUBLIC_INDEX_FOLLOW_ROBOTS,
  sharedLanguages,
} from "@/lib/seo-meta";
import { DEFAULT_CTA_LABEL } from "@/lib/site-settings.types";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";

// No "| JBRSEO" here — the root layout's title template appends it, and writing it twice
// pushes the useful words past Google's cut-off.
const TITLE = "مزايا اشتراك جبر سيو — منظومة كاملة";
const DESCRIPTION =
  "لوحة تحكم كاملة · صفحة عميل احترافية · مقالات تبيع · حماية YMYL · تنبيهات فورية. كل شي في اشتراك واحد مع جبر سيو.";

// Async so the share image comes from the same admin field the country pages read —
// one image edited in one place, every page follows.
export async function generateMetadata(): Promise<Metadata> {
  const images = await siteOgImages();
  return {
    title: TITLE,
    description: DESCRIPTION,
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    // Both entries point here, not at /sa and /eg. This page is not a language variant
    // of the country landings: they never point back, and Google drops a cluster whose
    // members don't reference each other — and may read the page as their duplicate.
    alternates: {
      canonical: `${DEFAULT_PUBLIC_SITE_ORIGIN}/features`,
      languages: sharedLanguages(`${DEFAULT_PUBLIC_SITE_ORIGIN}/features`),
    },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${DEFAULT_PUBLIC_SITE_ORIGIN}/features`,
      siteName: "JBRSEO",
      locale: "ar_SA",
      type: "website",
      images,
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images },
  };
}

export default async function FeaturesPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const [content, plans] = await Promise.all([
    getLandingContent(country),
    getAllPlans(country),
  ]);
  const whatsappLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);
  const ctaLabel = content.siteSettings?.ctaLabel?.trim() || DEFAULT_CTA_LABEL;
  const countrySlug = country === "EG" ? "eg" : "sa";
  const pricingHref = `/${countrySlug}#pricing`;
  const currency = country === "EG" ? "ج.م" : "ر.س";

  const displayPlans = plans.slice(0, 4);
  const visibleCount = plans.length;
  const arNum = (n: number) => n.toLocaleString("ar-EG");
  const recommendedIndex = displayPlans.findIndex((p) => Boolean(p.featuredBadge));
  const recIdx = recommendedIndex >= 0 ? recommendedIndex : 1;

  const rows = featuresCatalog.rows as Array<{
    label?: string;
    values?: string[];
    category?: string;
  }>;

  return (
    <div className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPageJsonLd({
              url: `${DEFAULT_PUBLIC_SITE_ORIGIN}/features`,
              name: TITLE,
              description: DESCRIPTION,
              breadcrumbName: "المزايا",
            }),
          ),
        }}
      />
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border py-14 sm:py-20 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--success)_18%,transparent),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
            اشتراك واحد <span className="text-success">—</span> منظومة كاملة
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            لوحة تحكّم · صفحة عميل احترافية · مقالات تبيع · حماية YMYL · تنبيهات تيليجرام. كل شي في مدونتي.
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={arNum(visibleCount)} label="باقات" />
            <HeroStat value="٢٩" label="ميزة رئيسية" />
            <HeroStat value="٢٣" label="تنبيه فوري" />
            <HeroStat value="٤" label="قطاعات YMYL" />
          </div>
        </div>
      </section>

      {/* SECTION 1 — CONSOLE */}
      <FeatureSection eyebrow="٠١ · لوحة التحكم" title="لوحة تحكّمك — كل شي أمام عينك">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          تفتح لوحتك، تلقى شغلك مباشر: أرقامك من جوجل، محتواك الجاي، عملاءك، فوترتك.
        </p>
        <Screenshot
          badge="من لوحتك"
          caption="لوحة تحكّم سمايل تاون — ٥ مقالات · ١٦٦ مشاهدة · ٤١ ظهور (+٨٪) · تحويلات ١"
          note="صورة من لوحة عميل فعلي"
          src="/features/console-dashboard.png"
          alt="لوحة تحكم مدونتي - سمايل تاون"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={LayoutDashboard} title="نظرة عامة سريعة" desc="مقال منشور · مشاهدات · مشتركين — كل شي في السطر الأول." bullets={["هذا الشهر: ٥ مقال · ١٦٦ مشاهدة", "الإحصائيات (٤١ ظهور +٨٪)", "معدل الارتداد (٧.٩٪)"]} />
          <FeatureCard icon={AlertTriangle} title="يحتاج انتباهك" desc="يلفت انتباهك للأمور المنتظرة قرارك — بلا فوت." bullets={["المقالات (موافقات)", "التعليقات (مراجعة)", "الدعم (رسائل)"]} />
          <FeatureCard icon={TrendingUp} title="الأداء الأسبوعي" desc="٤ مؤشرات موثّقة قدامك مباشرة." bullets={["الإحصائيات (Impressions)", "درجة التفاعل (٣٣/١٠٠)", "التحويلات (١، ٠.٦٪)", "نسبة الارتداد"]} />
          <FeatureCard icon={FileText} title="محتواك" desc="كل حاجة تخص محتوى صفحتك — منظّمة." bullets={["بيانات نشاطك (+YMYL)", "معلومات · محتوى الصفحة", "معرض الصور · الملفات", "المقالات · أسئلة الصفحة"]} />
          <FeatureCard icon={Users} title="عملاءك" desc="كل تفاعل عميل في مكان واحد." bullets={["مشتركو النشرة", "العملاء المحتملون (Leads)", "الحجوزات", "الأسئلة · الآراء · التقييمات"]} />
          <FeatureCard icon={ShieldCheck} title="الموثوقية والصحة" desc="مدى جاهزية موقعك." bullets={["صحة موقعك", "الحملات (قريباً)", "YMYL badge"]} />
        </div>
      </FeatureSection>

      {/* SECTION 2 — PUBLIC PAGE */}
      <FeatureSection eyebrow="٠٢ · صفحتك" title="صفحتك العامة — بديل موقعك الإلكتروني">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          ما عندك موقع؟ ما مشكلة. مدونتي تعطيك صفحة كاملة تشوفها عملاءك: هويّتك، خدماتك، حجزك، تقييماتك.
        </p>
        <Screenshot
          badge="صفحة حقيقية"
          caption="عيادات سمايل تاون — أعلى أثر رقمي على مدونتي (١٠,٦٨٤ من جوجل)"
          externalHref="https://www.modonty.com/clients/عيادات-سمايل-تاون-لطب-الفم-و-الأسنان"
          externalLabel="شوف الصفحة الحقيقية"
          src="/features/client-page.png"
          alt="صفحة عميل حقيقية - سمايل تاون"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={BadgeCheck} title="هوية كاملة + شارة موثّق" desc="لوگو · اسم · تخصص · موقع · شارة موثّق · سنة التأسيس." />
          <FeatureCard icon={Palette} title="Hero banner برندي" desc="صورة رئيسية احترافية بتصميم يعبّر عن هويّتك." />
          <FeatureCard icon={Megaphone} title="أزرار CTA بارزة" desc="احجز الآن · متابعة · مشاركة · واتساب عائم." />
          <FeatureCard icon={BarChart3} title="الأثر الرقمي من Google" desc="كارت ١٠,٦٨٤ الأثر الرقمي مع شعار G — دليل مصداقية فوري." />
          <FeatureCard icon={Grid3x3} title="٩ أقسام غنية" desc="نظرة عامة · آراء · مقالات · عن الشركة · FAQ · تواصل · ساعات · موثوقية · نشرة." />
          <FeatureCard icon={Search} title="SEO/AEO مدمج" desc="JSON-LD · Sitemap · Open Graph · Structured Data — لِلظهور في جوجل و ChatGPT." />
        </div>
      </FeatureSection>

      {/* SECTION 3 — ARTICLES */}
      <FeatureSection eyebrow="٠٣ · المقالات" title="مقالاتك — محتوى يبيع فعلاً">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          مقال احترافي مع صور high-res، إحصائيات قراءة، أزرار تفاعل، وشارة العميل الموثّقة — كل شي مصمّم يخلي القارئ ينحوّل لعميل.
        </p>
        <Screenshot
          badge="مقال حقيقي"
          caption="ابتسامة هوليود قبل وبعد (سمايل تاون) — 1189 كلمة · 6 دقائق قراءة"
          externalHref="https://www.modonty.com/articles/ابتسامة-هوليود-قبل-وبعد"
          externalLabel="شوف المقال الحقيقي"
          src="/features/article.png"
          alt="مقال حقيقي على مدونتي"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={FileText} title="Header احترافي" desc="عنوان بارز · وصف SEO · تاريخ · اسم المنصة." />
          <FeatureCard icon={TrendingUp} title="إحصائيات كاملة" desc="عدد الكلمات · وقت القراءة · مشاهدات · تعليقات." />
          <FeatureCard icon={ImageIcon} title="صور + معرض" desc="Hero image high-quality · صور داخلية · Open Graph لِلمشاركة." />
          <FeatureCard icon={MessagesSquare} title="Sidebar تفاعل" desc="اشترك · مشاركة · تعليق · حفظ · إعجاب." />
          <FeatureCard icon={Handshake} title="شارة العميل الموثّقة" desc="بطاقة العميل مع صورة، تخصص، وموقع — رابط لِصفحته." />
          <FeatureCard icon={Rocket} title="SEO + AEO كامل" desc="JSON-LD · Meta tags · ٢٨ فحص جودة · طلب فهرسة Google." />
        </div>
      </FeatureSection>

      {/* SECTION 4 — YMYL */}
      <FeatureSection eyebrow="٠٤ · الثقة" title="مصداقيتك محميّة">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          القطاعات الحساسة (طبية · مالية · قانونية) تحتاج معايير أعلى. إحنا نطبّقها — عشان جوجل يثق فيك، وعميلك يشتري منك.
        </p>
        <div className="rounded-2xl border border-success/30 bg-success/[0.04] p-6 sm:p-8">
          <h3 className="mb-2 text-lg font-black text-success sm:text-xl">
            YMYL — المحتوى الحساس (Your Money or Your Life)
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            أي محتوى يمس <strong className="text-foreground">صحة</strong> أو <strong className="text-foreground">مال</strong> أو <strong className="text-foreground">حقوق</strong> العميل — جوجل يطبّق عليه معايير أعلى (E-E-A-T). إحنا نحمي مصداقيتك.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <SectorCard icon={Stethoscope} title="القطاع الطبي" desc="عيادات · مستشفيات · أطباء — توثيق كامل + التزام أخلاقيات." />
            <SectorCard icon={Scale} title="القطاع القانوني" desc="محامون · مكاتب قانونية — توثيق التخصص + المرجعية." />
            <SectorCard icon={Wallet} title="القطاع المالي" desc="استشارات مالية · محاسبة · تأمين — معايير SAMA/ZATCA." />
          </div>
        </div>
      </FeatureSection>

      {/* SECTION 5 — TELEGRAM */}
      <FeatureSection eyebrow="٠٥ · التنبيهات" title="٢٣ تنبيه فوري على تيليجرام">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          لا تفوت شي. أي حدث مهم — يوصلك على تيليجرام في ثوان.
        </p>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <AlertCard icon={TrendingUp} title="SEO" desc="ترتيب · impressions · clicks · errors" />
          <AlertCard icon={FileText} title="المحتوى" desc="مقال جاهز · نشر · تحديث" />
          <AlertCard icon={Users} title="العملاء" desc="Lead جديد · حجز · تقييم" />
          <AlertCard icon={CreditCard} title="الفوترة" desc="فاتورة · تجديد · ترقية" />
          <AlertCard icon={Bell} title="الأمان" desc="دخول · تغيير · موقع مكسور" />
        </div>
      </FeatureSection>

      {/* SECTION 6 — PRICING + COMPARE + FINAL CTA */}
      <FeatureSection eyebrow="٠٦ · اختر" title="اختر ما يناسب نموّك">
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {arNum(visibleCount)} باقات لمراحل نمو مختلفة. الاشتراك السنوي = ٦ شهور هدية.
        </p>

        {displayPlans.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[600px] border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="border-b border-border bg-muted/40 p-3 text-start font-extrabold text-success">الميزة</th>
                  {displayPlans.map((p, i) => (
                    <th
                      key={p.id}
                      className={`border-b border-border p-3 text-center font-extrabold text-success ${i === recIdx ? "bg-success/12" : "bg-muted/40"}`}
                    >
                      <div className="inline-flex flex-wrap items-center justify-center gap-2">
                        {i === recIdx && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-[11px] font-black text-success-foreground shadow-lg shadow-success/25">
                            <Flame className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                            الأكثر شيوعاً
                          </span>
                        )}
                        <span>{p.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-border p-3 text-start">السعر الشهري</td>
                  {displayPlans.map((p, i) => (
                    <td key={p.id} className={`border-b border-border p-3 text-center ${i === recIdx ? "bg-success/[0.06]" : ""}`}>
                      <span className="font-black text-success text-[17px]">{p.priceMonthly} {currency}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border-b border-border p-3 text-start">المقالات</td>
                  {displayPlans.map((p, i) => (
                    <td key={p.id} className={`border-b border-border p-3 text-center ${i === recIdx ? "bg-success/[0.06]" : ""}`}>
                      {p.articlesLabel || "—"}
                    </td>
                  ))}
                </tr>
                {rows.map((row, ridx) =>
                  row.category ? (
                    <tr key={ridx}>
                      <td colSpan={displayPlans.length + 1} className="bg-success/[0.06] p-2.5 text-start text-xs font-extrabold tracking-wide text-success">
                        {row.category}
                      </td>
                    </tr>
                  ) : (
                    <tr key={ridx}>
                      <td className="border-b border-border p-3 text-start">{row.label}</td>
                      {displayPlans.map((p, i) => {
                        const SLUG_ORDER = ["presence", "starter", "growth", "scale"];
                        const dataIdx = SLUG_ORDER.indexOf(p.slug);
                        return (
                          <td key={p.id} className={`border-b border-border p-3 text-center ${i === recIdx ? "bg-success/[0.06]" : ""}`}>
                            {row.values?.[dataIdx] ?? "—"}
                          </td>
                        );
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            لا توجد باقات متاحة حالياً — تواصل معنا للتفاصيل.
          </p>
        )}

        <p className="mt-2 text-xs text-muted-foreground/80">
          الأسعار المعروضة شاملة ضريبة القيمة المضافة ١٥٪
        </p>

        <h3 className="mt-11 mb-2 text-center text-xl font-black sm:text-2xl">إيش الفرق فعلاً؟</h3>
        <p className="mb-5 text-center text-sm text-muted-foreground">
          قارن بين توظيف فريق داخلي vs اشتراك مدونتي.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <CompareCard tone="bad" title="توظّف فريق محتوى داخلي" bullets={["راتب كاتب: ٦-١٠ آلاف ريال/شهر", "راتب مصمم: ٥-٨ آلاف ريال/شهر", "راتب متخصص SEO: ٨-١٥ ألف/شهر", "تجهيزات · تدريب · إدارة", "مسؤولية العمل · الإجازات", "= ٢٠-٣٥ ألف ريال/شهر"]} />
          <CompareCard tone="good" title="اشتراك واحد — نظام كامل" bullets={["اشتراك سنوي: ٦ أشهر مجاناً", "فريق كامل جاهز", "لوحة تحكم شفافة ٢٤/٧", "تنبيهات فورية · دعم مباشر", "بلا مسؤوليات موظفين", "= توفير ٩٥٪+ من التكلفة"]} />
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-br from-success/25 to-success/70 p-8 text-center sm:p-14">
          <h2 className="mb-3 text-2xl font-black text-white sm:text-3xl">جاهز ترى ترتيبك يتحرّك؟</h2>
          <p className="mx-auto mb-6 max-w-xl text-sm text-white/85 sm:text-[15px]">
            اشترك سنوياً واكسب ٦ أشهر مجاناً — أو تكلّم معنا عن باقة مخصصة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={pricingHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-background px-7 text-sm font-black text-success shadow-lg no-underline transition-colors hover:bg-background/90"
            >
              <span>{ctaLabel}</span>
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-transparent px-6 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>تكلّم معنا على واتساب</span>
            </a>
          </div>
        </div>
      </FeatureSection>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Local presentational primitives — keep the page body scannable.
// ─────────────────────────────────────────────────────────────────

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4">
      <div className="mb-0.5 text-2xl font-black text-success sm:text-[26px]">{value}</div>
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

function FeatureSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-2 font-mono text-xs font-extrabold uppercase tracking-[2px] text-success">
          {eyebrow}
        </div>
        <h2 className="mb-3 text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-[34px]">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

function Screenshot({
  badge,
  caption,
  note,
  externalHref,
  externalLabel,
  src,
  alt,
}: {
  badge: string;
  caption: string;
  note?: string;
  externalHref?: string;
  externalLabel?: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="rounded-2xl border border-success/20 bg-gradient-to-br from-success/[0.04] to-info/[0.04] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-md bg-success px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-success-foreground">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            {badge}
          </span>
          <h4 className="text-sm font-black text-success">{caption}</h4>
        </div>
        {externalHref ? (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center text-xs text-muted-foreground hover:text-foreground no-underline"
          >
            {externalLabel} ←
          </a>
        ) : note ? (
          <small className="text-[11px] text-muted-foreground">{note}</small>
        ) : null}
      </div>
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={950}
        className="block h-auto w-full rounded-lg border border-border"
      />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  bullets,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  bullets?: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-success/12 text-success">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>
      <h3 className="mb-1.5 text-[15px] font-extrabold text-foreground">{title}</h3>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
      {bullets && bullets.length > 0 && (
        <ul className="mt-2 list-disc space-y-0.5 ps-5 text-xs text-muted-foreground/85">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SectorCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-success/20 bg-background/60 p-4 text-center">
      <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-success/12 text-success">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>
      <h4 className="mb-1 text-sm font-black text-success">{title}</h4>
      <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function AlertCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-info/25 bg-info/[0.06] p-4 text-center">
      <div className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-info/15 text-info">
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
      </div>
      <h4 className="mb-1 text-[13px] font-extrabold text-foreground">{title}</h4>
      <p className="text-[11px] leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function CompareCard({
  tone,
  title,
  bullets,
}: {
  tone: "bad" | "good";
  title: string;
  bullets: string[];
}) {
  const isBad = tone === "bad";
  const containerCls = isBad
    ? "border-destructive/25 bg-destructive/[0.05]"
    : "border-success/35 bg-success/10";
  const iconCls = isBad ? "text-destructive" : "text-success";
  const Icon = isBad ? XCircle : CheckCircle2;
  return (
    <div className={`rounded-2xl border p-6 ${containerCls}`}>
      <h3 className="mb-4 flex items-center gap-2 text-base font-black">
        <Icon className={`h-5 w-5 shrink-0 ${iconCls}`} strokeWidth={2.5} aria-hidden />
        <span>{title}</span>
      </h3>
      <ul className="space-y-1.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 border-b border-border/60 py-1.5 text-[13px] last:border-b-0">
            <span className={`mt-0.5 font-black ${iconCls}`} aria-hidden>
              {isBad ? "✗" : "✓"}
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
